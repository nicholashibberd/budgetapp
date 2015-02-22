package record

import (
	"encoding/csv"
	"fmt"
	"io"
	"log"
	"strings"
	"time"
	"bufio"
)

type Parser interface {
	parse_record([]string) Record
	read_file(io.Reader) ([]Record, error)
}

type NatwestParser struct {
}

type ANZParser struct {
}

type SantanderParser struct {
}

func ParseFile(file io.Reader, filename string) ([]Record, error) {
	var parser Parser
	if strings.HasPrefix(filename, "HIBBERDNJ") {
		parser = NatwestParser{}
	} else if strings.HasPrefix(filename, "Statements") {
		parser = SantanderParser{}
	} else {
		parser = ANZParser{}
	}
	return parser.read_file(file)
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

type StaticRule struct {
	MatchText string
	RuleName string
}

func NewStaticRule(m string, r string) StaticRule {
	return StaticRule{
		MatchText: m,
		RuleName: r,
	}
}

func (p NatwestParser) AddTags(r *Record, t []Tag) {
	log.Print("NatwestParser called")
}

func (parser NatwestParser) read_file(file io.Reader) ([]Record, error) {
	reader := csv.NewReader(file)
	reader.FieldsPerRecord = 8
	a := []Record{}
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
		a = append(a, parser.parse_record(record))
	}

	return a, nil
}

func (parser SantanderParser) read_file(file io.Reader) ([]Record, error) {
	scanner := bufio.NewScanner(file)
	a := []Record{}
	record := make([]string, 5)
	for scanner.Scan() {
		line := scanner.Text()
		if strings.HasPrefix(line, "Account") {
			index := strings.Index(line, "\xA0")
			record[4] = line[index + 1:]
		} else if strings.HasPrefix(line, "Date") {
			index := strings.Index(line, "\xA0")
			record[0] = line[index + 1:]
		} else if strings.HasPrefix(line, "Description") {
			index := strings.Index(line, "\xA0")
			record[1] = line[index + 1:]
		} else if strings.HasPrefix(line, "Amount") {
			index := strings.Index(line, "\xA0")
			lastIndex := strings.LastIndex(line, "\xA0")
			record[2] = line[index + 1:lastIndex - 1]
		} else if strings.HasPrefix(line, "Balance") {
			index := strings.Index(line, "\xA0")
			lastIndex := strings.LastIndex(line, "\xA0")
			record[3] = line[index + 1:lastIndex - 1]
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
	account_number := strings.TrimLeft(str[6], "'")
	amount := str[3]
	balance := str[4]
	transaction_type := str[1]
	date := parse_date(str[0])
	return NewRecord(description, account_number, amount, date, balance, transaction_type)
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
