package record

import (
	/* "speter.net/go/exp/math/dec/inf" */
	"time"
)

type DatastoreRecord struct {
	Date             time.Time
	Description      string
	Amount           string
	Balance          string
	Account_number   string
	Transaction_type string
	Tags             []Tag
}

func NewDatastoreRecord(de string, ac string, am string, da time.Time, b string, t string) DatastoreRecord {
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
