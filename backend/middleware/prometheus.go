package middleware

import (
	"time"

	"strconv"

	"github.com/gin-gonic/gin"
	"github.com/prometheus/client_golang/prometheus"
)

var (
	httpDuration = prometheus.NewHistogramVec(prometheus.HistogramOpts{
		Name:    "http_server_request_duration_seconds",
		Help:    "Histogram of response time for handler in seconds",
		Buckets: prometheus.DefBuckets,
	}, []string{"method", "endpoint", "status_code"})
)

func init() {
	prometheus.MustRegister(httpDuration)
}

func PrometheusMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		start := time.Now()
		c.Next()
		duration := time.Since(start).Seconds()

		httpDuration.WithLabelValues(
			c.Request.Method,
			strconv.Itoa(c.Writer.Status()),
			strconv.Itoa(c.Writer.Status()),
		).Observe(duration)
	}
}
