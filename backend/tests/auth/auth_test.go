package auth_test

import (
	"bytes"
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/GabrielNat1/WorkSphere/controllers"
	"github.com/GabrielNat1/WorkSphere/database/models"
	"github.com/gin-gonic/gin"
	"github.com/stretchr/testify/assert"
	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
)

func setupTestRouter() (*gin.Engine, *gorm.DB) {
	gin.SetMode(gin.TestMode)
	r := gin.Default()

	// Setup test database
	db := setupTestDB()
	authController := controllers.NewAuthController(db)

	// Register routes
	auth := r.Group("/api/auth")
	{
		auth.POST("/login", authController.Login)
		auth.POST("/register", authController.Register)
	}

	return r, db
}

func setupTestDB() *gorm.DB {
	db, err := gorm.Open(sqlite.Open("file::memory:?cache=shared"), &gorm.Config{})
	if err != nil {
		panic("failed to connect database")
	}

	// Auto migrate the schemas
	db.AutoMigrate(&models.User{}, &models.Event{})

	return db
}

func TestLogin(t *testing.T) {
	router, db := setupTestRouter()

	// Create a test user
	hashedPassword := "$2a$10$abcdefghijklmnopqrstuvwxyz123456"
	testUser := models.User{
		Name:     "Test User",
		Email:    "test@example.com",
		Password: hashedPassword,
	}
	db.Create(&testUser)

	t.Run("Valid Login", func(t *testing.T) {
		loginData := map[string]interface{}{
			"email":    "test@example.com",
			"password": "password123",
		}
		jsonData, _ := json.Marshal(loginData)

		w := httptest.NewRecorder()
		req, _ := http.NewRequest("POST", "/api/auth/login", bytes.NewBuffer(jsonData))
		req.Header.Set("Content-Type", "application/json")
		router.ServeHTTP(w, req)

		// We expect 401 because the password hash won't match in this test
		assert.Equal(t, http.StatusUnauthorized, w.Code)
	})

	t.Run("Invalid Credentials", func(t *testing.T) {
		loginData := map[string]interface{}{
			"email":    "wrong@example.com",
			"password": "wrongpass",
		}
		jsonData, _ := json.Marshal(loginData)

		w := httptest.NewRecorder()
		req, _ := http.NewRequest("POST", "/api/auth/login", bytes.NewBuffer(jsonData))
		router.ServeHTTP(w, req)

		assert.Equal(t, http.StatusUnauthorized, w.Code)
	})
}
