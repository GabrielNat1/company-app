package middleware

import (
	"database/sql"
	"errors"
	"net/http"
)

// validateToken is a placeholder function to validate the token
func validateToken(token string) (string, error) {
	if token == "" {
		return "", errors.New("invalid token")
	}
	// Assume the token is valid and return a dummy userID
	return "123", nil
}

func AdminRequired(db *sql.DB) func(http.Handler) http.Handler {
	return func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			userID, err := validateToken(r.Header.Get("Authorization"))
			if err != nil {
				http.Error(w, "Unauthorized", http.StatusUnauthorized)
				return
			}

			var role string
			err = db.QueryRow("SELECT role FROM users WHERE id = ?", userID).Scan(&role)
			if err != nil || role != "admin" {
				http.Error(w, "Admin access required", http.StatusForbidden)
				return
			}

			next.ServeHTTP(w, r)
		})
	}
}
