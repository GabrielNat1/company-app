package main

import (
	"log"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/sirupsen/logrus"
	"github.com/spf13/viper"

	"github.com/GabrielNat1/WorkSphere/controllers"
	"github.com/GabrielNat1/WorkSphere/database"
	"github.com/GabrielNat1/WorkSphere/middleware"
	"github.com/GabrielNat1/WorkSphere/routes"
	"github.com/GabrielNat1/WorkSphere/utils"
	"github.com/prometheus/client_golang/prometheus/promhttp"
	"github.com/rs/cors"
)

func initConfig() {
	viper.SetConfigName("config")
	viper.SetConfigType("yaml")
	viper.AddConfigPath(".")         // Current directory
	viper.AddConfigPath("../config") // Corrected path to the config directory

	if err := viper.ReadInConfig(); err != nil {
		log.Fatalf("Error reading config file: %v", err)
	}

	viper.AutomaticEnv()
}

func main() {
	initConfig()

	// Initialize logger
	logger := logrus.New()
	logger.SetFormatter(&logrus.JSONFormatter{})
	logger.SetLevel(logrus.InfoLevel)

	db := database.InitDB()
	if db == nil {
		logger.Fatal("Failed to initialize database")
	}
	defer db.Close()

	logger.Info("Database initialized successfully")

	// Initialize the chat hub
	chatHub := controllers.NewChatHub(db)
	go chatHub.Run()
	logger.Info("Chat hub initialized")

	utils.InitI18n()

	router := gin.Default()
	router.Use(middleware.I18nMiddleware())       // Adicionar middleware de i18n
	router.Use(middleware.PrometheusMiddleware()) // Use PrometheusMiddleware from middleware package

	// Public routes
	router.POST("/api/auth/register", gin.WrapF(routes.HandleRegister(db)))
	router.POST("/api/auth/login", gin.WrapF(routes.HandleLogin(db)))

	// Webhook endpoints (tests)
	router.POST("/webhook/user-registered", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{"message": "user registered webhook received"})
	})
	router.POST("/webhook/event-created", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{"message": "event created webhook received"})
	})

	// Private routes
	router.GET("/api/events", gin.WrapF(routes.HandleEvents(db)))
	router.POST("/api/events/join/:id", gin.WrapF(routes.HandleJoinEvent(db)))
	router.GET("/api/dashboard", gin.WrapH(middleware.AdminRequired(db)(routes.HandleDashboard(db))))

	// WebSocket
	router.GET("/ws/chat/:eventId", func(c *gin.Context) {
		routes.HandleWebSocket(c.Writer, c.Request, db, chatHub)
	})

	// Endpoint health
	router.GET("/health", func(c *gin.Context) {
		c.String(http.StatusOK, "OK")
	})

	// EndPoint reset password
	router.POST("/api/auth/reset-password", gin.WrapF(routes.HandleResetPassword(db)))

	// Prometheus metrics endpoint
	router.GET("/metrics", gin.WrapH(promhttp.Handler()))

	// CORS configuration
	corsConfig := cors.New(cors.Options{
		AllowedOrigins:   viper.GetStringSlice("cors.allowed_origins"),
		AllowedMethods:   viper.GetStringSlice("cors.allowed_methods"),
		AllowedHeaders:   append(viper.GetStringSlice("cors.allowed_headers"), "X-CSRF-Token"),
		ExposedHeaders:   []string{"X-CSRF-Token"},
		AllowCredentials: true,
		MaxAge:           300, // Maximum age for CORS preflight cache
	})

	handler := corsConfig.Handler(router)

	// userWebhookURL is currently unused, but you can use it in your webhook logic
	_ = viper.GetString("webhooks.user_registered")

	// Use these URLs in the respective controllers
	// Example: Pass them to SendWebhookNotification calls

	port := viper.GetString("server.port")
	if port == "" {
		port = "8080"
	}

	logger.WithFields(logrus.Fields{
		"port": port,
	}).Info("Server started")
	log.Fatal(http.ListenAndServe(":"+port, handler))
}
