package record

import (
	"encoding/csv"
	"fmt"
	"io"
	"log"
	"strings"
	"time"
)

type Parser interface {
	parse_record([]string) Record
	read_file(io.Reader) ([]Record, error)
}

type NatwestParser struct {
}

type ANZParser struct {
}

func Parse_file(file io.Reader, filename string) ([]Record, error) {
	var parser Parser
	if filename == "natwest.csv" {
		parser = NatwestParser{}
	} else {
		parser = ANZParser{}
	}
	return parser.read_file(file)
}

func (parser ANZParser) read_file(file io.Reader) ([]Record, error) {
	reader := csv.NewReader(file)
	a := make([]Record, 20)
	line_count := 0
	for {
		record, err := reader.Read()
		if err != nil {
			if err == io.EOF {
				break
			} else {
				log.Print(err.Error())
			}
		}
		a[line_count] = parser.parse_record(record)
		line_count += 1
	}

	return a[0:line_count], nil
}

func (parser NatwestParser) read_file(file io.Reader) ([]Record, error) {
	reader := csv.NewReader(file)
	reader.FieldsPerRecord = 8
	a := make([]Record, 20)
	line_count := 0
	for {
		record, err := reader.Read()
		if err != nil {
			if strings.Contains(err.Error(), "wrong number of fields in line") {
				fmt.Printf("%#v\n", err)
				continue
			}
			if err == io.EOF {
				break
			} else {
				log.Print(err.Error())
			}
		}
		a[line_count] = parser.parse_record(record)
		line_count += 1
	}

	return a[0:line_count], nil
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

func (parser NatwestParser) parse_record(str []string) Record {
	description := str[2]
	account_number := str[6]
	amount := str[3]
	balance := str[4]
	transaction_type := str[1]
	date := parse_date(str[0])
	return NewRecord(description, account_number, amount, date, balance, transaction_type)
}

func parse_transaction_type(str string) string {
	if strings.Contains(str, "EFTPOS") {
		return "EFTPOS"
	} else {
		return "UNDEFINED"
	}
}

func parse_date(str string) time.Time {
	time, err := time.Parse("02/01/2006", str)
	if err != nil {
		log.Print(err.Error())
	}
	return time
}
