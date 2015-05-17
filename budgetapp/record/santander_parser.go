package record

import (
	"bufio"
	"io"
	"log"
	"strings"
)

type SantanderParser struct {
}

func (parser SantanderParser) read_file(file io.Reader) ([]Record, error) {
	scanner := bufio.NewScanner(file)
	a := []Record{}
	record := make([]string, 5)
	for scanner.Scan() {
		line := scanner.Text()
		if strings.HasPrefix(line, "Account") {
			index := strings.Index(line, "\xA0")
			record[4] = line[index+1:]
		} else if strings.HasPrefix(line, "Date") {
			index := strings.Index(line, "\xA0")
			record[0] = line[index+1:]
		} else if strings.HasPrefix(line, "Description") {
			index := strings.Index(line, "\xA0")
			record[1] = line[index+1:]
		} else if strings.HasPrefix(line, "Amount") {
			index := strings.Index(line, "\xA0")
			lastIndex := strings.LastIndex(line, "\xA0")
			record[2] = line[index+1 : lastIndex]
		} else if strings.HasPrefix(line, "Balance") {
			index := strings.Index(line, "\xA0")
			lastIndex := strings.LastIndex(line, "\xA0")
			record[3] = line[index+1 : lastIndex]
			a = append(a, parser.parse_record(record))
			record[0] = ""
			record[1] = ""
			record[2] = ""
			record[3] = ""
		}
	}
	if err := scanner.Err(); err != nil {
		log.Print(err.Error())
	}

	return a, nil
}

func (parser SantanderParser) parse_record(str []string) Record {
	description := str[1]
	account_number := str[4]
	amount := str[2]
	balance := str[3]
	log.Print("description: " + description)
	log.Print("account number " + account_number)
	log.Print("amount " + amount)
	log.Print("balance " + balance)
	transaction_type := parse_transaction_type("UNDEFINED")
	date := parse_date(str[0])
	return NewRecord(description, account_number, amount, date, balance, transaction_type)
}
