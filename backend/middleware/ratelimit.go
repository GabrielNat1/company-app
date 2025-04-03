package middleware

import (
	"net"
	"net/http"
	"sync"
	"time"
)

type visitor struct {
	limiter  *time.Ticker
	lastSeen time.Time
	count    int
}

var (
	visitors = make(map[string]*visitor)
	mu       sync.Mutex
)

func getIP(r *http.Request) string {
	ip, _, err := net.SplitHostPort(r.RemoteAddr)
	if err != nil {
		return r.RemoteAddr
	}
	return ip
}

// RateLimitMiddleware returns a middleware that allows maxRequests per window for each IP.
func RateLimitMiddleware(maxRequests int, window time.Duration) func(http.Handler) http.Handler {
	// Cleanup visitors periodically.
	go func() {
		for {
			time.Sleep(window)
			mu.Lock()
			for ip, v := range visitors {
				if time.Since(v.lastSeen) > window {
					delete(visitors, ip)
				}
			}
			mu.Unlock()
		}
	}()

	return func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			ip := getIP(r)
			mu.Lock()
			v, exists := visitors[ip]
			if !exists {
				v = &visitor{lastSeen: time.Now(), count: 1}
				visitors[ip] = v
			} else {
				v.lastSeen = time.Now()
				v.count++
			}
			mu.Unlock()

			if v.count > maxRequests {
				http.Error(w, "Too many requests", http.StatusTooManyRequests)
				return
			}

			next.ServeHTTP(w, r)
		})
	}
}
