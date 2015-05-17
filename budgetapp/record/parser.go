package record

import (
	"io"
	"log"
	"strings"
	"time"
)

type Parser interface {
	parse_record([]string) Record
	read_file(io.Reader) ([]Record, error)
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
