package record

type Record struct {
	Id int64
	DatastoreRecord
}

func NewRecord(dr DatastoreRecord, k int64) Record {
	return Record{
		DatastoreRecord: dr,
		Id:              k,
	}
}
