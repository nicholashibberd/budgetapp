package record_collection

import (
	"budgetapp/record"
	"speter.net/go/exp/math/dec/inf"
)

type RecordCollection struct {
	Records []record.Record
}

func (rc RecordCollection) Total() string {

	total := &inf.Dec{}
	for _, r := range rc.Records {
		total.Add(total, r.DecimalAmount())
	}
	return total.String()
}
