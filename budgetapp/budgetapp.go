package budgetapp

import (
	"encoding/json"
	"fmt"
	"html/template"
	"io"
	"log"
	"net/http"

	"appengine"
	"appengine/blobstore"
	"appengine/datastore"

	"budgetapp/record"
	"errors"
	"time"
)

func serveError(c appengine.Context, w http.ResponseWriter, err error) {
	w.WriteHeader(http.StatusInternalServerError)
	w.Header().Set("Content-Type", "text/plain")
	io.WriteString(w, "Internal Server Error")
	c.Errorf("%v", err)
}

func parseDateParam(params []string) (time.Time, error) {
	if len(params) == 0 {
		return time.Time{}, errors.New("No date parameter provided")
	}
	time, err := time.Parse("02/01/2006", params[0])
	if err != nil {
		log.Print(err.Error())
	}
	return time, nil
}

var inputTemplate = template.Must(template.New("root").Parse(inputTemplateHTML))

const inputTemplateHTML = `
<html><body>
<form action="{{.}}" method="POST" enctype="multipart/form-data">
Upload File: <input type="file" name="file"><br>
<input type="submit" name="submit" value="Submit">
</form></body></html>
`

func handleInput(w http.ResponseWriter, r *http.Request) {
	c := appengine.NewContext(r)
	uploadURL, err := blobstore.UploadURL(c, "/upload", nil)
	if err != nil {
		serveError(c, w, err)
		return
	}
	w.Header().Set("Content-Type", "text/html")
	err = inputTemplate.Execute(w, uploadURL)
	if err != nil {
		c.Errorf("%v", err)
	}
}

func handleJson(w http.ResponseWriter, r *http.Request) {
	log.Printf("LOG!!!!!!!!!!!!!!!!!")
	c := appengine.NewContext(r)
	q := datastore.NewQuery("Record")

	start_date, err := parseDateParam(r.URL.Query()["start_date"])
	var end_date time.Time
	end_date, err = parseDateParam(r.URL.Query()["end_date"])
	if err == nil {
		q = q.
			Filter("Date >=", start_date).
			Filter("Date <=", end_date)
	} else {
		log.Print(err.Error())
	}

	records := make([]record.Record, 0, 10)
	_, err = q.GetAll(c, &records)
	if err != nil {
		log.Printf(err.Error())
	}

	res1B, _ := json.Marshal(records)

	w.Header().Set("Content-Type", "application/json")
	fmt.Fprint(w, string(res1B))
	return
}

func decodeRecord(r io.ReadCloser) (*record.Record, error) {
	defer r.Close()
	var record record.Record
	err := json.NewDecoder(r).Decode(&record)
	return &record, err
}

func handleRecordJson(w http.ResponseWriter, r *http.Request) {
	c := appengine.NewContext(r)

	record, err := decodeRecord(r.Body)
	if err != nil {
		log.Printf(err.Error())
	}

	k := datastore.NewKey(c, "Record", "", record.Id, recordKey(c))
	_, err = datastore.Put(c, k, record)
	if err != nil {
		log.Printf(err.Error())
	}

	record.Description = "Test Description"

	resultsJson, _ := json.Marshal(record)

	w.Header().Set("Content-Type", "application/json")
	fmt.Fprint(w, string(resultsJson))
	return
}

func handleUpload(w http.ResponseWriter, r *http.Request) {
	c := appengine.NewContext(r)

	blobs, _, err := blobstore.ParseUpload(r)
	if err != nil {
		serveError(c, w, err)
		return
	}
	file := blobs["file"]
	if len(file) == 0 {
		c.Errorf("no file uploaded")
		http.Redirect(w, r, "/", http.StatusFound)
		return
	}
	blobkey := file[0].BlobKey
	reader := blobstore.NewReader(c, blobkey)
	stat, _ := blobstore.Stat(c, blobkey)
	filename := stat.Filename
	records, err := record.Parse_file(reader, filename)

	for i := 0; i < len(records); i++ {
		r := records[i]
		r.AddTags()
		if r.DoesNotExist(c) {
			_, err := r.Save(c)
			if err != nil {
				http.Error(w, err.Error(), http.StatusInternalServerError)
				return
			}
		}
	}
	http.Redirect(w, r, "/", http.StatusFound)
}

func recordKey(c appengine.Context) *datastore.Key {
	return datastore.NewKey(c, "Record", "default_record", 0, nil)
}

func serveSingle(pattern string, filename string) {
	http.HandleFunc(pattern, func(w http.ResponseWriter, r *http.Request) {
		http.ServeFile(w, r, filename)
	})
}

type EditPage struct {
	RecordsJSON string
}

func editHandler(w http.ResponseWriter, r *http.Request) {
	c := appengine.NewContext(r)
	q := datastore.NewQuery("Record")

	start_date, err := parseDateParam(r.URL.Query()["start_date"])
	var end_date time.Time
	end_date, err = parseDateParam(r.URL.Query()["end_date"])
	if err == nil {
		q = q.
			Filter("Date >=", start_date).
			Filter("Date <=", end_date)
	} else {
		log.Print(err.Error())
	}

	var queryCount int
	queryCount, err = q.Count(c)
	log.Printf("%d", queryCount)
	if err != nil {
		log.Printf(err.Error())
	}

	records := []record.Record{}
	ks, err := q.GetAll(c, &records)
	if err != nil {
	 	log.Printf(err.Error())
	}
	for i := 0; i < len(records); i++ {
		records[i].Id = ks[i].IntID()
	}

	recordsJSON, _ := json.Marshal(records)

	jsonString := string(recordsJSON)
	p := &EditPage{RecordsJSON: jsonString}
	t, _ := template.ParseFiles("edit.html")
	t.Execute(w, p)
}

func init() {
	http.Handle("/javascripts/", http.FileServer(http.Dir("public/")))
	http.Handle("/stylesheets/", http.FileServer(http.Dir("public/")))
	http.HandleFunc("/records/", handleRecordJson)
	http.HandleFunc("/", editHandler)
	http.HandleFunc("/input", handleInput)
	http.HandleFunc("/upload", handleUpload)
	serveSingle("/favicon.ico", "./favicon.ico")
}
