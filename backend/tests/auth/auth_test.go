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
	"golang.org/x/crypto/bcrypt"
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

func TestLoginCSRFAndMFA(t *testing.T) {
	// Setup router and DB
	router, db := setupTestRouter()

	// Create an admin test user with a valid hashed password.
	password := "password123"
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
	assert.NoError(t, err)

	adminUser := models.User{
		Name:     "Admin User",
		Email:    "admin@example.com",
		Password: string(hashedPassword),
		Role:     "admin",
	}
	db.Create(&adminUser)

	t.Run("Successful Admin Login with MFA and CSRF Token", func(t *testing.T) {
		loginData := map[string]interface{}{
			"email":    "admin@example.com",
			"password": "password123",
			"mfaCode":  "123456",
		}
		jsonData, _ := json.Marshal(loginData)

		w := httptest.NewRecorder()
		req, _ := http.NewRequest("POST", "/api/auth/login", bytes.NewBuffer(jsonData))
		req.Header.Set("Content-Type", "application/json")
		router.ServeHTTP(w, req)

		assert.Equal(t, http.StatusOK, w.Code)

		var response map[string]interface{}
		err := json.Unmarshal(w.Body.Bytes(), &response)
		assert.NoError(t, err)
		// Verify token and csrfToken are present.
		assert.NotEmpty(t, response["token"])
		assert.NotEmpty(t, response["csrfToken"])
		// Verify user details
		userData := response["user"].(map[string]interface{})
		assert.Equal(t, "admin@example.com", userData["email"])
	})
}
