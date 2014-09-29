package record

import (
	"encoding/csv"
	"fmt"
	"io"
	"strings"
)

type Record struct {
	Date             string
	Description      string
	Amount           string
	Balance          string
	Account_number   string
	Transaction_type string
}

func Parse_file(file io.Reader) ([]Record, error) {
	reader := csv.NewReader(file)
	first_line := reader.Read()
	if first_line[0] == 'Date' {
		bank := "natwest"
	} else {
		bank := "anz"
	}
	a := make([]Record, 20)
	line_count := 0
	for {
		record, err := reader.Read()
		if err == io.EOF {
			break
		} else if err != nil {
			fmt.Println(err)
			return nil, err
		}

		a[line_count] = Parse_record(record)
		line_count += 1
	}

	return a[0:line_count], nil
}

func Parse_record(str []string) Record {
	description := str[3]
	account_number := str[0]
	date := str[1]
	amount := str[4]
	balance := str[5]
	transaction_type := parse_transaction_type(str[3])
	return Record{
		Description:      description,
		Account_number:   account_number,
		Amount:           amount,
		Date:             date,
		Balance:          balance,
		Transaction_type: transaction_type,
	}
}

func parse_transaction_type(str string) string {
	if strings.Contains(str, "EFTPOS") {
		return "EFTPOS"
	} else {
		return "UNDEFINED"
	}
}
