package record

import (
	"encoding/csv"
	"io"
	"log"
)

type ANZParser struct {
}

func (parser ANZParser) read_file(file io.Reader) ([]Record, error) {
	reader := csv.NewReader(file)
	a := []Record{}
	for {
		record, err := reader.Read()
		if err != nil {
			if err == io.EOF {
				break
			} else {
				log.Print(err.Error())
			}
		}
		a = append(a, parser.parse_record(record))
	}

	return a, nil
}

func (parser ANZParser) parse_record(str []string) Record {
	description := str[3]
	account_number := str[0]
	amount := str[4]
	balance := str[5]
	transaction_type := parse_transaction_type(str[3])
	date := parse_date(str[1])
	return NewRecord(description, account_number, amount, date, balance, transaction_type)
}
