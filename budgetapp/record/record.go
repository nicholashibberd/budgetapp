package record

import (
	"time"
)

type Record struct {
	Id               int64     `json:"id"`
	Date             time.Time `json:"date"`
	Description      string    `json:"description"`
	Amount           string    `json:"amount"`
	Balance          string    `json:"balance"`
	Account_number   string    `json:"account_number"`
	Transaction_type string    `json:"transaction_type"`
	Tags             []Tag     `json:"tags"`
}

func NewRecord(de string, ac string, am string, da time.Time, b string, t string) Record {
	tag1 := NewTag("Cash")
	tag2 := NewTag("Presents")
	tags := []Tag{tag1, tag2}
	return DatastoreRecord{
		Description:      de,
		Account_number:   ac,
		Amount:           am,
		Date:             da,
		Balance:          b,
		Transaction_type: t,
		Tags:             tags,
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
