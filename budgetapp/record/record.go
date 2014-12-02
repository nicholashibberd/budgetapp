package record

import (
	"appengine"
	"appengine/datastore"
	"time"
	"log"
)

type Record struct {
	Id   int64  `json:"id" datastore:"-"`
	Date             time.Time `json:"date"`
	Description      string    `json:"description"`
	Amount           string    `json:"amount"`
	Balance          string    `json:"balance"`
	Account_number   string    `json:"account_number"`
	Transaction_type string    `json:"transaction_type"`
	Tags             []Tag     `json:"tags"`
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

func (r *Record) AddTags() {
	switch r.Account_number {
	case "012372210678637":
		parser := ANZParser{}
		parser.AddTags(r)
	case "010492-43188249":
		parser := NatwestParser{}
		parser.AddTags(r)
	}

}

func (r *Record) AddTag(t string) {
	r.Tags = append(r.Tags, NewTag(t))
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

type Tag struct {
	Name string
}

func NewTag(name string) Tag {
	return Tag{
		Name: name,
	}
}
