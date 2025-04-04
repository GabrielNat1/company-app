package integration_test

import (
	"bytes"
	"encoding/json"
	"fmt"
	"net/http"
	"net/http/httptest"
	"testing"
	"time"

	"github.com/GabrielNat1/WorkSphere/controllers"
	"github.com/GabrielNat1/WorkSphere/database/models"
	"github.com/GabrielNat1/WorkSphere/middleware"
	"github.com/gin-gonic/gin"
	"github.com/stretchr/testify/assert"
	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
)

func setupIntegrationTest() (*gin.Engine, *gorm.DB) {
	gin.SetMode(gin.TestMode)
	r := gin.Default()

	db := setupTestDB()
	authController := controllers.NewAuthController(db)
	eventController := controllers.NewEventController(db)

	auth := r.Group("/api/auth")
	{
		auth.POST("/register", authController.Register)
		auth.POST("/login", authController.Login)
	}

	api := r.Group("/api")
	api.Use(func(c *gin.Context) {
		// Mock authentication for testing
		c.Set("userId", uint(1))
		c.Next()
	})
	{
		api.POST("/events", eventController.CreateEvent)
		api.POST("/events/:id/join", eventController.JoinEvent)
	}

	return r, db
}

func setupTestDB() *gorm.DB {
	db, err := gorm.Open(sqlite.Open("file::memory:?cache=shared"), &gorm.Config{})
	if err != nil {
		panic("failed to connect database")
	}

	db.AutoMigrate(&models.User{}, &models.Event{})
	return db
}

func TestAPIIntegration(t *testing.T) {
	router, _ := setupIntegrationTest()

	t.Run("Full User Journey", func(t *testing.T) {
		// Register
		registerData := map[string]interface{}{
			"name":      "Test User",
			"email":     "test@example.com",
			"password":  "password123",
			"birthDate": time.Now().Format(time.RFC3339),
			"phone":     "1234567890",
		}
		jsonData, _ := json.Marshal(registerData)

		w := httptest.NewRecorder()
		req, _ := http.NewRequest("POST", "/api/auth/register", bytes.NewBuffer(jsonData))
		req.Header.Set("Content-Type", "application/json")
		router.ServeHTTP(w, req)

		assert.Equal(t, http.StatusCreated, w.Code)

		var response map[string]interface{}
		json.Unmarshal(w.Body.Bytes(), &response)
		token := response["token"].(string)

		// Create Event with proper body
		eventData := map[string]interface{}{
			"title":       "Test Event",
			"description": "Test Description",
			"date":        time.Now().Add(24 * time.Hour).Format(time.RFC3339),
			"location":    "Test Location",
			"capacity":    100,
		}
		jsonData, _ = json.Marshal(eventData)

		w = httptest.NewRecorder()
		req, _ = http.NewRequest("POST", "/api/events", bytes.NewBuffer(jsonData))
		req.Header.Set("Authorization", "Bearer "+token)
		req.Header.Set("Content-Type", "application/json")
		router.ServeHTTP(w, req)

		assert.Equal(t, http.StatusCreated, w.Code)

		// Extract event ID from response
		var eventResponse map[string]interface{}
		json.Unmarshal(w.Body.Bytes(), &eventResponse)
		eventID, ok := eventResponse["id"].(float64)
		if !ok {
			t.Fatalf("Expected event ID to be a float64, got %T", eventResponse["id"])
		}

		// Join Event using correct ID
		w = httptest.NewRecorder()
		req, _ = http.NewRequest("POST", fmt.Sprintf("/api/events/%d/join", int(eventID)), nil)
		req.Header.Set("Authorization", "Bearer "+token)
		router.ServeHTTP(w, req)
		assert.Equal(t, http.StatusOK, w.Code)
	})

	t.Run("Secure Headers Present", func(t *testing.T) {
		// Create a new Gin engine with SecureHeaders middleware wrapped
		r := gin.New()
		// Wrap requests with SecureHeaders
		r.Use(func(c *gin.Context) {
			middleware.SecureHeaders(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
				// simply continue the Gin handler chain
				c.Next()
			})).ServeHTTP(c.Writer, c.Request)
		})
		// Dummy health endpoint
		r.GET("/health", func(c *gin.Context) {
			c.String(http.StatusOK, "OK")
		})

		req := httptest.NewRequest("GET", "/health", nil)
		w := httptest.NewRecorder()
		r.ServeHTTP(w, req)

		assert.Equal(t, "default-src 'self';", w.Header().Get("Content-Security-Policy"))
		assert.Equal(t, "DENY", w.Header().Get("X-Frame-Options"))
		assert.Equal(t, "nosniff", w.Header().Get("X-Content-Type-Options"))
	})
}
