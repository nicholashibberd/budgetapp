package record

import (
	"encoding/csv"
	"io"
	"log"
	"strings"
)

type NatwestParser struct {
}

func (parser NatwestParser) read_file(file io.Reader) ([]Record, error) {
	reader := csv.NewReader(file)
	// reader.FieldsPerRecord = 8
	a := []Record{}
	for {
		record, err := reader.Read()
		if err != nil {
			if strings.Contains(err.Error(), "wrong number of fields in line") {
				log.Printf("%#v\n", err)
				continue
			}
			if err == io.EOF {
				break
			} else {
			}
		}
		if isRecord(record) {
			a = append(a, parser.parse_record(record))
		}
	}

	return a, nil
}

func (parser NatwestParser) parse_record(str []string) Record {
	description := str[2]
	account_number := strings.TrimLeft(str[6], "'")
	amount := str[3]
	balance := str[4]
	transaction_type := str[1]
	date := parse_date(str[0])
	return NewRecord(description, account_number, amount, date, balance, transaction_type)
}

func isRecord(str []string) bool {
	return len(str[0]) > 0 && str[0] != "Date"
}
