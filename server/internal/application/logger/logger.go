package logger

import (
	"os"

	"github.com/phuslu/log"
)

func init() {
	log.DefaultLogger = log.Logger{
		Level:      log.InfoLevel,
		Caller:     1,
		TimeField:  "date",
		TimeFormat: "01-02-2006",
		Writer:     &log.IOWriter{Writer: os.Stdout},
	}
}
