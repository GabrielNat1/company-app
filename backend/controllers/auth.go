package controllers

import (
	"log"
	"net/http"
	"time"

	"github.com/GabrielNat1/WorkSphere/database/models"
	"github.com/GabrielNat1/WorkSphere/middleware"
	"github.com/GabrielNat1/WorkSphere/utils"
	"github.com/gin-gonic/gin"
	"github.com/go-playground/validator/v10"
	"github.com/sirupsen/logrus"
	"golang.org/x/crypto/bcrypt"
	"gorm.io/gorm"
)

type AuthController struct {
	db       *gorm.DB
	validate *validator.Validate
}

func NewAuthController(db *gorm.DB) *AuthController {
	return &AuthController{
		db:       db,
		validate: validator.New(),
	}
}

type RegisterInput struct {
	Name      string    `json:"name" validate:"required"`
	Email     string    `json:"email" validate:"required,email"`
	Password  string    `json:"password" validate:"required,min=6"`
	BirthDate time.Time `json:"birthDate" validate:"required"`
	Phone     string    `json:"phone" validate:"required"`
}

func (ac *AuthController) Register(c *gin.Context) {
	lang := c.GetString("lang")
	logger := logrus.WithField("action", "register")
	var input RegisterInput
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": utils.Translate(lang, "error.invalid_input")})
		return
	}

	if err := ac.validate.Struct(input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(input.Password), bcrypt.DefaultCost)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to hash password"})
		return
	}

	user := models.User{
		Name:      input.Name,
		Email:     input.Email,
		Password:  string(hashedPassword),
		BirthDate: input.BirthDate,
		Phone:     input.Phone,
	}

	if err := ac.db.Create(&user).Error; err != nil {
		logger.WithError(err).WithField("email", input.Email).Error("Failed to create user")
		c.JSON(http.StatusBadRequest, gin.H{"error": "Email already exists"})
		return
	}

	// Enviar notificação via webhook para novo registro de usuário
	go utils.SendWebhookNotification("user_registered", "UserRegistered", user)

	logger.WithField("email", input.Email).Info("User registered successfully")

	token, err := utils.GenerateToken(int64(user.ID))
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to generate token"})
		return
	}

	c.JSON(http.StatusCreated, gin.H{
		"message": utils.Translate(lang, "success.user_created"),
		"user":    user,
		"token":   token,
	})
}

type LoginInput struct {
	Email    string `json:"email" validate:"required,email"`
	Password string `json:"password" validate:"required"`
	MFACode  string `json:"mfaCode"` // -- MFA code field for multifactor authentication
}

func (ac *AuthController) Login(c *gin.Context) {
	logger := logrus.WithField("action", "login")
	var input LoginInput
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if err := ac.validate.Struct(input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	var user models.User
	if err := ac.db.Where("email = ?", input.Email).First(&user).Error; err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid credentials"})
		return
	}

	if err := bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(input.Password)); err != nil {
		logger.WithFields(logrus.Fields{
			"email": input.Email,
			"ip":    c.ClientIP(),
		}).Warn("Failed login attempt")
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid credentials"})
		return
	}

	// MFA check
	if user.Role == "admin" {
		if input.MFACode == "" {
			log.Printf("Suspicious login (MFA missing) for admin email: %s from IP: %s", input.Email, c.ClientIP())
			c.JSON(http.StatusUnauthorized, gin.H{"error": "MFA code required"})
			return
		}
		if input.MFACode != "123456" {
			log.Printf("Suspicious login (invalid MFA) for admin email: %s from IP: %s", input.Email, c.ClientIP())
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid MFA code"})
			return
		}
	}

	logger.WithFields(logrus.Fields{
		"email": input.Email,
		"ip":    c.ClientIP(),
	}).Info("User logged in successfully")

	token, err := utils.GenerateToken(int64(user.ID))
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to generate token"})
		return
	}

	// Generate CSRF token and set as cookie.
	csrfToken, err := middleware.GenerateCSRFToken()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to generate CSRF token"})
		return
	}
	// Set cookie (accessible to JS so HttpOnly is false).
	c.SetCookie("csrf_token", csrfToken, 3600, "/", "", false, false)

	c.JSON(http.StatusOK, gin.H{
		"token":     token,
		"csrfToken": csrfToken,
		"user": map[string]interface{}{
			"id":    user.ID,
			"name":  user.Name,
			"email": user.Email,
			"role":  user.Role,
		},
	})
}
