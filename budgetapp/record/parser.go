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

func ParseFile(file io.Reader, filename string) ([]Record, error) {
	var parser Parser
	if strings.HasPrefix(filename, "HIBBERDNJ") {
		parser = NatwestParser{}
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

// func (p ANZParser) AddTags(r *Record, t []Tag) {
// 	rules := []StaticRule{
// 		NewStaticRule("OPTUS PRE PAID", "Mobile Phone"),
// 		NewStaticRule("TRANSPORT FOR NSW-OPAL", "Travel"),
// 		NewStaticRule("ANZ ATM", "Cash"),
// 		NewStaticRule("COLES", "Supermarket"),
// 		NewStaticRule("ANZ M-BANKING PAYMENT", "Bank Transfer"),
// 		NewStaticRule("ANZ M-BANKING FUNDS", "Funds Transfer"),
// 		NewStaticRule("ANZ INTERNET BANKING FUNDS", "Funds Transfer"),
// 		NewStaticRule("DEBIT INTEREST CHARGED", "Interest"),
// 		NewStaticRule("PAY/SALARY", "Salary"),
// 		NewStaticRule("PETROL", "Petrol"),
// 		NewStaticRule("DAN MURPHY'S", "Alcohol"),
// 		NewStaticRule("MENULOG", "Takeaway"),
// 		NewStaticRule("ALDI", "Supermarket"),
// 		NewStaticRule("BWS LIQUOR", "Alcohol"),
// 		NewStaticRule("CALTEX", "Petrol"),
// 		NewStaticRule("DENDY CINEMAS", "Cinema"),
// 		NewStaticRule("IGA", "Supermarket"),
// 		NewStaticRule("WOOLWORTHS", "Supermarket"),
// 		NewStaticRule("FOXTEL", "Foxtel"),
// 		NewStaticRule("MEDICAL", "Medical"),
// 		NewStaticRule("HAIRDRESSING", "Beauty"),
// 		NewStaticRule("BEAUTY", "Beauty"),
// 		NewStaticRule("CARPARK", "Car"),
// 		NewStaticRule("TRUE PROPERTY", "Rent"),
// 		NewStaticRule("TERRI SCHEER INSURANCE", "Villa"),
// 		NewStaticRule("TELSTRA", "Internet"),
// 	}
// 	for i := 0; i < len(rules); i++ {
// 		ru := rules[i]
// 		if strings.Contains(r.Description, ru.MatchText) {
// 			r.AddTag(ru.RuleName, t)
// 		}
// 	}
// }

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
