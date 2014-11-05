package record

import (
	/* "speter.net/go/exp/math/dec/inf" */
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
	return Record{
		Description:      de,
		Account_number:   ac,
		Amount:           am,
		Date:             da,
		Balance:          b,
		Transaction_type: t,
	}
}
