package record

import (
	"appengine"
	"appengine/datastore"
	"io"
	"encoding/json"
)

type Tag struct {
	Id   int64  `json:"id" datastore:"-"`
	Name string
}

func NewTag(name string) Tag {
	return Tag{
		Name: name,
	}
}

func defaultTagList(c appengine.Context) *datastore.Key {
	return datastore.NewKey(c, "TagList", "default", 0, nil)
}

func (r *Tag) Save(c appengine.Context) (*Tag, error) {
	k, err := datastore.Put(c, r.key(c), r)
	if err != nil {
		return nil, err
	}
	r.Id = k.IntID()
	return r, nil
}

func (r *Tag) key(c appengine.Context) *datastore.Key {
	if r.Id == 0 {
		return datastore.NewIncompleteKey(c, "Tag", defaultTagList(c))
	}
	return datastore.NewKey(c, "Tag", "", r.Id, defaultTagList(c))
}

func DecodeTag(r io.ReadCloser) (*Tag, error) {
	defer r.Close()
	var tag Tag
	err := json.NewDecoder(r).Decode(&tag)
	return &tag, err
}

func TagKey(c appengine.Context) *datastore.Key {
	return datastore.NewKey(c, "Tag", "default_tag", 0, nil)
}
