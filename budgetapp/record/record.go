package record

import (
	"encoding/json"
	"io"
	"log"
	"strings"
	"time"

	"appengine"
	"appengine/datastore"
)

type Record struct {
	Id               int64     `json:"id" datastore:"-"`
	Date             time.Time `json:"date"`
	Description      string    `json:"description"`
	Amount           string    `json:"amount"`
	Balance          string    `json:"balance"`
	Account_number   string    `json:"account_number"`
	Transaction_type string    `json:"transaction_type"`
	Tags             []Tag     `json:"tags"`
	TagIds           []int64   `json:"tag_ids"`
}

func defaultRecordList(c appengine.Context) *datastore.Key {
	return datastore.NewKey(c, "RecordList", "default", 0, nil)
}

func (r *Record) Save(c appengine.Context) (*Record, error) {
	k, err := datastore.Put(c, r.key(c), r)
	if err != nil {
		return nil, err
	}
	r.Id = k.IntID()
	return r, nil
}

func (r *Record) key(c appengine.Context) *datastore.Key {
	if r.Id == 0 {
		return datastore.NewIncompleteKey(c, "Record", defaultRecordList(c))
	}
	return datastore.NewKey(c, "Record", "", r.Id, defaultRecordList(c))
}

func (r *Record) DoesNotExist(c appengine.Context) bool {
	q := datastore.NewQuery("Record").
		Filter("Date =", r.Date).
		Filter("Description =", r.Description).
		Filter("Amount =", r.Amount).
		Filter("Balance =", r.Balance).
		Filter("Account_number =", r.Account_number).
		Filter("Transaction_type =", r.Transaction_type)
	records := make([]Record, 0, 10)
	_, err := q.GetAll(c, &records)
	if err != nil {
		log.Printf(err.Error())
	}
	return len(records) == 0
}

func (r *Record) AddTags(rs []Rule) {
	for i := 0; i < len(rs); i++ {
		ru := rs[i]
		if strings.Contains(r.Description, ru.MatchText) {
			log.Print("!!!!!!!!!!!!!!!!!!!!!!!!")
			log.Print(ru.MatchText)
			r.AddTag(ru.TagId)
		}
	}
}

func DecodeRecord(r io.ReadCloser) (*Record, error) {
	defer r.Close()
	var record Record
	err := json.NewDecoder(r).Decode(&record)
	return &record, err
}

func RecordKey(c appengine.Context) *datastore.Key {
	return datastore.NewKey(c, "RecordList", "default", 0, nil)
}

func (r *Record) AddTag(i int64) {
	r.TagIds = append(r.TagIds, i)
}

func NewRecord(de string, ac string, am string, da time.Time, b string, t string) Record {
	return Record{
		Description:      de,
		Account_number:   ac,
		Amount:           am,
		Date:             da,
		Balance:          b,
		Transaction_type: t,
	}
}
