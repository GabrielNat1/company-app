package middleware

import (
	"crypto/rand"
	"encoding/hex"
	"net/http"
)

// GenerateCSRFToken
func GenerateCSRFToken() (string, error) {
	b := make([]byte, 32)
	_, err := rand.Read(b)
	if err != nil {
		return "", err
	}
	return hex.EncodeToString(b), nil
}

/*
CSRFMiddleware checks that POST/PUT/DELETE requests include a valid CSRF token.
It compares the value found in the "X-CSRF-Token" header to that in the "csrf_token" cookie.
*/
func CSRFMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		// Only check for state-changing methods.
		if r.Method == http.MethodPost || r.Method == http.MethodPut || r.Method == http.MethodDelete {
			cookie, err := r.Cookie("csrf_token")
			if err != nil {
				http.Error(w, "CSRF token missing", http.StatusForbidden)
				return
			}
			if token := r.Header.Get("X-CSRF-Token"); token == "" || token != cookie.Value {
				http.Error(w, "Invalid CSRF token", http.StatusForbidden)
				return
			}
		}
		next.ServeHTTP(w, r)
	})
}
