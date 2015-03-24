package record

import (
	"encoding/json"
	"io"
	"log"
	"time"

	"appengine"
	"appengine/datastore"
)

type BudgetLine struct {
	Id         int64     `json:"id" datastore:"-"`
	Start_date time.Time `json:"start_date"`
	End_date   time.Time `json:"end_date"`
	Tag_id     int64     `json:"tag_id"`
	Amount     int64     `json:"amount"`
}

func defaultBudgetLineList(c appengine.Context) *datastore.Key {
	return datastore.NewKey(c, "BudgetLineList", "default", 0, nil)
}

func (r *BudgetLine) Save(c appengine.Context) (*BudgetLine, error) {
	k, err := datastore.Put(c, r.key(c), r)
	if err != nil {
		return nil, err
	}
	r.Id = k.IntID()
	return r, nil
}

func (r *BudgetLine) key(c appengine.Context) *datastore.Key {
	if r.Id == 0 {
		return datastore.NewIncompleteKey(c, "BudgetLine", defaultBudgetLineList(c))
	}
	return datastore.NewKey(c, "BudgetLine", "", r.Id, defaultBudgetLineList(c))
}

type BudgetLinesJson struct {
	BudgetLines []BudgetLineJson `json:"budgetLines"`
}

type BudgetLineJson struct {
	Tag_id    int64  `json:"tag_id"`
	Amount    int64  `json:"amount"`
	StartDate string `json:"start_date"`
	EndDate   string `json:"end_date"`
	Id        int64  `json:"id"`
}

func DecodeBudgetLines(r io.ReadCloser) ([]BudgetLine, error) {
	defer r.Close()
	budgetLines := []BudgetLine{}
	var data BudgetLinesJson
	err := json.NewDecoder(r).Decode(&data)
	if err != nil {
		log.Println(err)
	}
	for i := range data.BudgetLines {
		b := NewBudgetLine(
			data.BudgetLines[i].Tag_id,
			data.BudgetLines[i].Amount,
			data.BudgetLines[i].StartDate,
			data.BudgetLines[i].EndDate,
			data.BudgetLines[i].Id,
		)
		budgetLines = append(budgetLines, b)
	}
	return budgetLines, err
}

func NewBudgetLine(t int64, a int64, s string, e string, id int64) BudgetLine {
	return BudgetLine{
		Tag_id:     t,
		Amount:     a,
		Start_date: parse_date(s),
		End_date:   parse_date(e),
		Id:         id,
	}
}

func BudgetLineKey(c appengine.Context) *datastore.Key {
	return datastore.NewKey(c, "BudgetLine", "default_budget_line", 0, nil)
}
