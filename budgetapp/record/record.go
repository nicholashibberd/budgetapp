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
}

func (r Record) DecimalAmount() *inf.Dec {
	d := &inf.Dec{}

	var ok bool
	if d, ok = d.SetString(r.Amount); !ok {
		return &inf.Dec{}
	}

	return d
}
