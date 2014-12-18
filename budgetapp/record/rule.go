package record

import (
	"appengine"
	"appengine/datastore"
	"io"
	"encoding/json"
	// "strconv"
	// "log"
)

type Rule struct {
	Id   int64  `json:"id" datastore:"-"`
	MatchText string `json:"matchText"`
	TagId int64 `json:"tagId"`
}

func defaultRuleList(c appengine.Context) *datastore.Key {
	return datastore.NewKey(c, "RuleList", "default", 0, nil)
}

func (r *Rule) Save(c appengine.Context) (*Rule, error) {
	k, err := datastore.Put(c, r.key(c), r)
	if err != nil {
		return nil, err
	}
	r.Id = k.IntID()
	return r, nil
}

func (r *Rule) key(c appengine.Context) *datastore.Key {
	if r.Id == 0 {
		return datastore.NewIncompleteKey(c, "Rule", defaultRuleList(c))
	}
	return datastore.NewKey(c, "Rule", "", r.Id, defaultRuleList(c))
}

func DecodeRule(r io.ReadCloser) (*Rule, error) {
	defer r.Close()
	var rule Rule
	err := json.NewDecoder(r).Decode(&rule)
	return &rule, err
}

func RuleKey(c appengine.Context) *datastore.Key {
	return datastore.NewKey(c, "Rule", "default_rule", 0, nil)
}
