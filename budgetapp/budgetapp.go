package budgetapp

import (
	"html/template"
	"io"
	"log"
	"net/http"

	"appengine"
	"appengine/blobstore"
	"appengine/datastore"

	"myapp/record"
)

func serveError(c appengine.Context, w http.ResponseWriter, err error) {
	w.WriteHeader(http.StatusInternalServerError)
	w.Header().Set("Content-Type", "text/plain")
	io.WriteString(w, "Internal Server Error")
	c.Errorf("%v", err)
}

var rootTemplate = template.Must(template.New("root").Parse(rootTemplateHTML))

const rootTemplateHTML = `
<html><body>
<form action="{{.}}" method="POST" enctype="multipart/form-data">
Upload File: <input type="file" name="file"><br>
<input type="submit" name="submit" value="Submit">
</form></body></html>
`

func handleRoot(w http.ResponseWriter, r *http.Request) {
	c := appengine.NewContext(r)
	uploadURL, err := blobstore.UploadURL(c, "/upload", nil)
	if err != nil {
		serveError(c, w, err)
		return
	}
	w.Header().Set("Content-Type", "text/html")
	err = rootTemplate.Execute(w, uploadURL)
	if err != nil {
		c.Errorf("%v", err)
	}
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
	reader := blobstore.NewReader(c, file[0].BlobKey)
	records, err := record.Parse_file(reader)

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

func recordDoesNotExist(r record.Record, c appengine.Context) bool {
	q := datastore.NewQuery("Record").
		Filter("Date =", r.Date).
		Filter("Description =", r.Description).
		Filter("Amount =", r.Amount).
		Filter("Balance =", r.Balance).
		Filter("Account_number =", r.Account_number).
		Filter("Transaction_type =", r.Transaction_type)
	records := make([]record.Record, 0, 10)
	_, err := q.GetAll(c, &records)
	if err != nil {
		log.Printf(err.Error())
	}
	return len(records) == 0
}

func storeRecord(r record.Record, c appengine.Context) error {
	log.Printf(r.Description)
	key := datastore.NewIncompleteKey(c, "Record", recordKey(c))
	log.Printf(key.String())
	_, err := datastore.Put(c, key, &r)
	return err
}

func recordKey(c appengine.Context) *datastore.Key {
	return datastore.NewKey(c, "Record", "default_record", 0, nil)
}

func init() {
	http.HandleFunc("/", handleRoot)
	http.HandleFunc("/upload", handleUpload)
}
