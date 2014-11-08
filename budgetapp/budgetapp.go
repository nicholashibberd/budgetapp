package budgetapp

import (
	"encoding/json"
	"fmt"
	"html/template"
	"io"
	"log"
	"net/http"
	"strconv"
	"strings"

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

	records := make([]record.DatastoreRecord, 0, 10)
	_, err = q.GetAll(c, &records)
	if err != nil {
		log.Printf(err.Error())
	}

	res1B, _ := json.Marshal(records)

	w.Header().Set("Content-Type", "application/json")
	fmt.Fprint(w, string(res1B))
	return
}

func handleRecordJson(w http.ResponseWriter, r *http.Request) {
	c := appengine.NewContext(r)
	recordId := strings.Split(r.URL.Path, "/")[2]
	numericId, err := strconv.ParseInt(recordId, 10, 64)
	if err != nil {
		log.Printf(err.Error())
	}

	var record record.Record
	k := datastore.NewKey(c, "Record", "", numericId, recordKey(c))
	err = datastore.Get(c, k, &record)
	if err != nil {
		log.Printf(err.Error())
	}

	// q := datastore.NewQuery("Record").Filter("__key__ =", k)
	// log.Print("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!")
	// log.Print(q.Count(c))

	// records := make([]record.DatastoreRecord, 0, 10)
	// _, err := q.GetAll(c, &records)
	// if err != nil {
	// 	log.Printf(err.Error())
	// }

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
		if recordDoesNotExist(r, c) {
			err := storeRecord(r, c)
			if err != nil {
				http.Error(w, err.Error(), http.StatusInternalServerError)
				return
			}
		}
	}
	http.Redirect(w, r, "/", http.StatusFound)
}

func recordDoesNotExist(r record.DatastoreRecord, c appengine.Context) bool {
	q := datastore.NewQuery("Record").
		Filter("Date =", r.Date).
		Filter("Description =", r.Description).
		Filter("Amount =", r.Amount).
		Filter("Balance =", r.Balance).
		Filter("Account_number =", r.Account_number).
		Filter("Transaction_type =", r.Transaction_type)
	records := make([]record.DatastoreRecord, 0, 10)
	_, err := q.GetAll(c, &records)
	if err != nil {
		log.Printf(err.Error())
	}
	return len(records) == 0
}

func storeRecord(r record.DatastoreRecord, c appengine.Context) error {
	key := datastore.NewIncompleteKey(c, "Record", recordKey(c))
	_, err := datastore.Put(c, key, &r)
	return err
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
	if err != nil {
		log.Printf(err.Error())
	}
	datastoreRecords := make([]record.DatastoreRecord, 0, queryCount)
	var keys []*datastore.Key
	keys, err = q.GetAll(c, &datastoreRecords)
	if err != nil {
		log.Printf(err.Error())
	}

	records := make([]record.Record, len(datastoreRecords))

	for i := 0; i < queryCount; i++ {
		records[i] = record.NewRecord(datastoreRecords[i], keys[i].IntID())
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
	// serveSingle("/", "index.html")
	http.HandleFunc("/records/", handleRecordJson)
	http.HandleFunc("/", editHandler)
	http.HandleFunc("/input", handleInput)
	http.HandleFunc("/upload", handleUpload)
	serveSingle("/favicon.ico", "./favicon.ico")
}
