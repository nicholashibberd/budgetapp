package budgetapp

import (
	"encoding/csv"
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
	"bytes"
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

func handleTags(w http.ResponseWriter, r *http.Request) {
	c := appengine.NewContext(r)
	w.Header().Set("Content-Type", "text/html")

	q := datastore.NewQuery("Tag")

	tags := []record.Tag{}
	ks, err := q.GetAll(c, &tags)
	if err != nil {
		log.Printf(err.Error())
	}
	for i := 0; i < len(tags); i++ {
		tags[i].Id = ks[i].IntID()
	}

	tagsJSON, _ := json.Marshal(tags)
	tagsJSONString := string(tagsJSON)

	q = datastore.NewQuery("Rule")

	rules := []record.Rule{}
	ks, err = q.GetAll(c, &rules)
	if err != nil {
		log.Printf(err.Error())
	}
	for i := 0; i < len(rules); i++ {
		rules[i].Id = ks[i].IntID()
	}
	rulesJSON, _ := json.Marshal(rules)
	rulesJSONString := string(rulesJSON)

	q = datastore.NewQuery("Account")

	accounts := []record.Account{}
	ks, err = q.GetAll(c, &accounts)
	if err != nil {
		log.Printf(err.Error())
	}
	for i := 0; i < len(accounts); i++ {
		accounts[i].Id = ks[i].IntID()
	}
	accountsJSON, _ := json.Marshal(accounts)
	accountsJSONString := string(accountsJSON)

	p := &JSONData{
		Tags:     tagsJSONString,
		Rules:    rulesJSONString,
		Accounts: accountsJSONString,
	}
	t, _ := template.ParseFiles("tags.html")
	t.Execute(w, p)
}

func handleBudget(w http.ResponseWriter, r *http.Request) {
	c := appengine.NewContext(r)
	w.Header().Set("Content-Type", "text/html")

	startDateParam := r.URL.Query()["start_date"]

	var err error
	var start_date time.Time
	var end_date time.Time
	if len(startDateParam) == 0 {
		t := time.Now()
		start_date = time.Date(t.Year(), t.Month(), 1, 0, 0, 0, 0, time.UTC)
		next_month := time.Date(t.Year(), t.Month(), 32, 0, 0, 0, 0, time.UTC)
		end_date = time.Date(t.Year(), t.Month(), 32-next_month.Day(), 0, 0, 0, 0, time.UTC)
	} else {
		endDateParam := r.URL.Query()["end_date"]
		start_date, err = parseDateParam(startDateParam)
		end_date, err = parseDateParam(endDateParam)
	}

	var datesJSONString string
	q := datastore.NewQuery("BudgetLine")
	dates := map[string]string{}
	if err == nil {
		q = q.
			Filter("Start_date =", start_date).
			Filter("End_date =", end_date)
		dates["start_date"] = start_date.Format("02/01/2006")
		dates["end_date"] = end_date.Format("02/01/2006")
	} else {
		log.Print(err.Error())
	}

	datesJSON, _ := json.Marshal(dates)
	datesJSONString = string(datesJSON)

	budgetLines := []record.BudgetLine{}
	ks, err := q.GetAll(c, &budgetLines)
	if err != nil {
		log.Printf(err.Error())
	}
	for i := 0; i < len(budgetLines); i++ {
		budgetLines[i].Id = ks[i].IntID()
	}

	budgetLinesJSON, _ := json.Marshal(budgetLines)
	budgetLinesJSONString := string(budgetLinesJSON)

	q = datastore.NewQuery("Tag")
	tags := []record.Tag{}
	ks, err = q.GetAll(c, &tags)
	if err != nil {
		log.Printf(err.Error())
	}
	for i := 0; i < len(tags); i++ {
		tags[i].Id = ks[i].IntID()
	}

	tagsJSON, _ := json.Marshal(tags)
	tagsJSONString := string(tagsJSON)

	q = datastore.NewQuery("Account")
	accounts := []record.Account{}
	ks, err = q.GetAll(c, &accounts)
	if err != nil {
		log.Printf(err.Error())
	}
	for i := 0; i < len(accounts); i++ {
		accounts[i].Id = ks[i].IntID()
	}

	accountsJSON, _ := json.Marshal(accounts)
	accountsJSONString := string(accountsJSON)

	q = datastore.NewQuery("Record").
		Filter("Date >=", start_date).
		Filter("Date <=", end_date)
	records := []record.Record{}
	ks, err = q.GetAll(c, &records)
	if err != nil {
		log.Printf(err.Error())
	}
	for i := 0; i < len(records); i++ {
		records[i].Id = ks[i].IntID()
	}

	recordsJSON, _ := json.Marshal(records)
	recordsJSONString := string(recordsJSON)

	p := &JSONData{
		BudgetLines: budgetLinesJSONString,
		Tags:        tagsJSONString,
		Dates:       datesJSONString,
		Records:     recordsJSONString,
		Accounts:    accountsJSONString,
	}
	t, _ := template.ParseFiles("budget.html")
	t.Execute(w, p)
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

func handleRecordJson(w http.ResponseWriter, r *http.Request) {
	c := appengine.NewContext(r)

	re, err := record.DecodeRecord(r.Body)
	if err != nil {
		log.Printf(err.Error())
	}

	k := datastore.NewKey(c, "Record", "", re.Id, record.RecordKey(c))
	_, err = datastore.Put(c, k, re)
	if err != nil {
		log.Printf(err.Error())
	}

	resultsJson, _ := json.Marshal(re)

	w.Header().Set("Content-Type", "application/json")
	fmt.Fprint(w, string(resultsJson))
	return
}

func handleTagsJson(w http.ResponseWriter, r *http.Request) {
	if r.Method == "POST" {
		c := appengine.NewContext(r)

		tag, err := record.DecodeTag(r.Body)
		if err != nil {
			log.Printf(err.Error())
		}

		k := datastore.NewKey(c, "Tag", "", tag.Id, record.TagKey(c))
		_, err = datastore.Put(c, k, tag)
		if err != nil {
			log.Printf(err.Error())
		}

		resultsJson, _ := json.Marshal(tag)

		w.Header().Set("Content-Type", "application/json")
		fmt.Fprint(w, string(resultsJson))
		return
	}
}

func handleRulesJson(w http.ResponseWriter, r *http.Request) {
	if r.Method == "POST" {
		c := appengine.NewContext(r)

		rule, err := record.DecodeRule(r.Body)
		if err != nil {
			log.Printf(err.Error())
		}

		k := datastore.NewKey(c, "Rule", "", rule.Id, record.RuleKey(c))
		_, err = datastore.Put(c, k, rule)
		if err != nil {
			log.Printf(err.Error())
		}

		resultsJson, _ := json.Marshal(rule)

		w.Header().Set("Content-Type", "application/json")
		fmt.Fprint(w, string(resultsJson))
		return
	}
}

func handleAccountsJson(w http.ResponseWriter, r *http.Request) {
	if r.Method == "POST" {
		c := appengine.NewContext(r)

		account, err := record.DecodeAccount(r.Body)
		if err != nil {
			log.Printf(err.Error())
		}

		k := datastore.NewKey(c, "Account", "", account.Id, record.AccountKey(c))
		_, err = datastore.Put(c, k, account)
		if err != nil {
			log.Printf(err.Error())
		}

		resultsJson, _ := json.Marshal(account)

		w.Header().Set("Content-Type", "application/json")
		fmt.Fprint(w, string(resultsJson))
		return
	}
}

func handleBudgetsJson(w http.ResponseWriter, r *http.Request) {
	if r.Method == "POST" {
		c := appengine.NewContext(r)

		budgetLines, err := record.DecodeBudgetLines(r.Body)
		if err != nil {
			log.Printf(err.Error())
		}

		for i := 0; i < len(budgetLines); i++ {
			k := datastore.NewKey(c, "BudgetLine", "", budgetLines[i].Id, record.BudgetLineKey(c))
			_, err = datastore.Put(c, k, &budgetLines[i])
			if err != nil {
				log.Printf(err.Error())
			}
		}

		budgetLinesJson, _ := json.Marshal(budgetLines)

		w.Header().Set("Content-Type", "application/json")
		fmt.Fprint(w, string(budgetLinesJson))
		return
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
	blobkey := file[0].BlobKey
	reader := blobstore.NewReader(c, blobkey)
	stat, _ := blobstore.Stat(c, blobkey)
	filename := stat.Filename
	records, err := record.ParseFile(reader, filename)

	q := datastore.NewQuery("Rule")

	rules := []record.Rule{}
	ks, err := q.GetAll(c, &rules)
	if err != nil {
		log.Printf(err.Error())
	}
	for i := 0; i < len(rules); i++ {
		rules[i].Id = ks[i].IntID()
	}

	for i := 0; i < len(records); i++ {
		r := records[i]
		r.AddTags(rules)
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

func serveSingle(pattern string, filename string) {
	http.HandleFunc(pattern, func(w http.ResponseWriter, r *http.Request) {
		http.ServeFile(w, r, filename)
	})
}

func handleReprocessRules(w http.ResponseWriter, r *http.Request) {
	c := appengine.NewContext(r)

	q := datastore.NewQuery("Record")
	records := []record.Record{}
	ks, err := q.GetAll(c, &records)
	// _, err := q.GetAll(c, &records)
	if err != nil {
		log.Printf(err.Error())
	}
	for i := 0; i < len(records); i++ {
		records[i].Id = ks[i].IntID()
	}

	q = datastore.NewQuery("Rule")

	rules := []record.Rule{}
	ks, err = q.GetAll(c, &rules)
	// _, err = q.GetAll(c, &rules)
	if err != nil {
		log.Printf(err.Error())
	}
	for i := 0; i < len(rules); i++ {
		rules[i].Id = ks[i].IntID()
	}

	for i := 0; i < len(records); i++ {
		r := records[i]
		r.AddTags(rules)
		_, err := r.Save(c)
		if err != nil {
			log.Printf(err.Error())
			return
		}
	}
	http.Redirect(w, r, "/", http.StatusFound)
}

func handleExportRecords(w http.ResponseWriter, r *http.Request) {
	c := appengine.NewContext(r)

	startDateParam := r.URL.Query()["start_date"]

	var err error
	var start_date time.Time
	var end_date time.Time
	if len(startDateParam) == 0 {
		start_date = time.Date(2014, 9, 1, 0, 0, 0, 0, time.UTC)
		end_date = time.Now()
	} else {
		endDateParam := r.URL.Query()["end_date"]
		start_date, err = parseDateParam(startDateParam)
		end_date, err = parseDateParam(endDateParam)
	}

	q := datastore.NewQuery("Record").
		Filter("Date >=", start_date).
		Filter("Date <=", end_date)
	records := []record.Record{}
	ks, err := q.GetAll(c, &records)
	if err != nil {
		log.Printf(err.Error())
	}

	b := &bytes.Buffer{}

	for i := 0; i < len(records); i++ {
		records[i].Id = ks[i].IntID()
	}

	writer := csv.NewWriter(b)
	row := []string{"Account Number", "Date", "Description", "Amount", "Balance", "Tag Ids"}
	err = writer.Write(row)
	if err != nil {
		fmt.Println("Error:", err)
		return
	}
	for _, record := range records {
		tagIds := []string{}
		for _, tagId := range record.TagIds {
			tagIds = append(tagIds, strconv.FormatInt(tagId, 10))
		}

		row := []string{
			record.Account_number,
			record.Date.Format("2006-01-02"),
			record.Description,
			record.Amount,
			record.Balance,
			strings.Join(tagIds, ","),
		}
		err := writer.Write(row)
		if err != nil {
			fmt.Println("Error:", err)
			return
		}
	}
	writer.Flush()
	w.Header().Set("Content-Type", "text/csv")
	filename := "budget-records_" + start_date.Format("2006-01-02") + "_" + end_date.Format("2006-01-02") + ".csv"
	w.Header().Set("Content-Disposition", "attachment;filename="+filename)
	w.Write(b.Bytes())
}

type JSONData struct {
	Tags        string
	Records     string
	Rules       string
	Accounts    string
	BudgetLines string
	Dates       string
}

func init() {
	http.Handle("/javascripts/", http.FileServer(http.Dir("public/")))
	http.Handle("/stylesheets/", http.FileServer(http.Dir("public/")))
	http.Handle("/images/", http.FileServer(http.Dir("public/")))
	http.HandleFunc("/records/", handleRecordJson)
	http.HandleFunc("/tags", handleTagsJson)
	http.HandleFunc("/rules", handleRulesJson)
	http.HandleFunc("/accounts", handleAccountsJson)
	http.HandleFunc("/budgets", handleBudgetsJson)
	http.HandleFunc("/", handleBudget)
	http.HandleFunc("/input", handleInput)
	http.HandleFunc("/upload", handleUpload)
	http.HandleFunc("/tag", handleTags)
	http.HandleFunc("/reprocess-rules", handleReprocessRules)
	http.HandleFunc("/export-records", handleExportRecords)
	serveSingle("/favicon.ico", "./favicon.ico")
}
