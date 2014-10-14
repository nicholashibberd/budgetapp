package record

import (
	"speter.net/go/exp/math/dec/inf"
	"time"
)

type Record struct {
	Date             time.Time
	Description      string
	Amount           string
	Balance          string
	Account_number   string
	Transaction_type string
	Tags             []Tag
}

func NewRecord(de string, ac string, am string, da time.Time, b string, t string) Record {
	tag1 := NewTag("Cash")
	tag2 := NewTag("Presents")
	tags := []Tag{tag1, tag2}
	return Record{
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

func (r Record) DecimalAmount() *inf.Dec {
	d := &inf.Dec{}

	var ok bool
	if d, ok = d.SetString(r.Amount); !ok {
		return &inf.Dec{}
	}

	return d
}
