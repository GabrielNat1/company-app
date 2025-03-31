package events_test

import (
	"bytes"
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"testing"
	"time"

	"github.com/GabrielNat1/WorkSphere/controllers"
	"github.com/GabrielNat1/WorkSphere/database/models"
	"github.com/gin-gonic/gin"
	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
)

func setupTestRouter() (*gin.Engine, *gorm.DB) {
	gin.SetMode(gin.TestMode)
	r := gin.Default()

	db := setupTestDB()
	eventController := controllers.NewEventController(db)

	api := r.Group("/api")
	api.Use(func(c *gin.Context) {
		// Mock authentication middleware for testing
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

	// Create test user
	testUser := models.User{
		Model: gorm.Model{ID: 1},
		Name:  "Test User",
		Email: "test@example.com",
	}
	db.Create(&testUser)

	return db
}

func TestCreateEvent(t *testing.T) {
	router, _ := setupTestRouter()

	t.Run("Create Valid Event", func(t *testing.T) {
		eventData := map[string]interface{}{
			"title":       "Test Event",
			"description": "Test Description",
			"date":        time.Now().Add(24 * time.Hour).Format(time.RFC3339),
			"location":    "Test Location",
			"capacity":    100,
		}
		jsonData, _ := json.Marshal(eventData)

		w := httptest.NewRecorder()
		req, _ := http.NewRequest("POST", "/api/events", bytes.NewBuffer(jsonData))
		req.Header.Set("Content-Type", "application/json")
		router.ServeHTTP(w, req)

		if w.Code != http.StatusCreated {
			t.Errorf("Expected status code %d, got %d. Response: %s",
				http.StatusCreated, w.Code, w.Body.String())
		}
	})
}
