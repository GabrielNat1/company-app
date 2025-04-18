package utils

import (
	"github.com/go-playground/locales/en"
	"github.com/go-playground/locales/pt"
	ut "github.com/go-playground/universal-translator"
)

var Translator *ut.UniversalTranslator

func InitI18n() {
	enLocale := en.New()
	ptLocale := pt.New()
	Translator = ut.New(enLocale, enLocale, ptLocale)
}

func Translate(lang, key string, params ...interface{}) string {
	translator, _ := Translator.GetTranslator(lang)
	stringParams := make([]string, len(params))
	for i, param := range params {
		stringParams[i] = param.(string)
	}
	translated, _ := translator.T(key, stringParams...)
	return translated
}
