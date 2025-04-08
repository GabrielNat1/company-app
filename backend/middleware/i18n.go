package middleware

import (
	"strings"

	"github.com/gin-gonic/gin"
)

func I18nMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		lang := c.GetHeader("Accept-Language")
		if lang == "" {
			lang = "en" // Default to English
		} else {
			lang = strings.Split(lang, ",")[0] // Use the first language in the list
		}
		c.Set("lang", lang)
		c.Next()
	}
}
