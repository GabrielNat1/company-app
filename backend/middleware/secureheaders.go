package middleware

import "net/http"

// SecureHeaders sets HTTP security headers.
func SecureHeaders(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		// Set security headers
		w.Header().Set("Content-Security-Policy", "default-src 'self';")
		w.Header().Set("X-Frame-Options", "DENY")
		w.Header().Set("X-Content-Type-Options", "nosniff")
		// Add more headers as needed
		next.ServeHTTP(w, r)
	})
}
