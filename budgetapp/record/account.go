package record

import (
	"appengine"
	"appengine/datastore"
	"io"
	"encoding/json"
	// "strconv"
	// "log"
)

type Account struct {
	Id   int64  `json:"id" datastore:"-"`
	AccountNumber string `json:"accountNumber"`
	Name string `json:"name"`
	Region string `json:"region"`
}

func defaultAccountList(c appengine.Context) *datastore.Key {
	return datastore.NewKey(c, "AccountList", "default", 0, nil)
}

func (r *Account) Save(c appengine.Context) (*Account, error) {
	k, err := datastore.Put(c, r.key(c), r)
	if err != nil {
		return nil, err
	}
	r.Id = k.IntID()
	return r, nil
}

func (r *Account) key(c appengine.Context) *datastore.Key {
	if r.Id == 0 {
		return datastore.NewIncompleteKey(c, "Account", defaultAccountList(c))
	}
	return datastore.NewKey(c, "Account", "", r.Id, defaultAccountList(c))
}

func DecodeAccount(r io.ReadCloser) (*Account, error) {
	defer r.Close()
	var account Account
	err := json.NewDecoder(r).Decode(&account)
	return &account, err
}

func AccountKey(c appengine.Context) *datastore.Key {
	return datastore.NewKey(c, "Account", "default_account", 0, nil)
}
