package main

import (
	"log"
	"net/http"
	"os"

	"github.com/gin-gonic/gin"
	"github.com/sirupsen/logrus"

	"github.com/GabrielNat1/WorkSphere/controllers"
	"github.com/GabrielNat1/WorkSphere/database"
	"github.com/GabrielNat1/WorkSphere/middleware"
	"github.com/GabrielNat1/WorkSphere/routes"
	"github.com/GabrielNat1/WorkSphere/utils"
	"github.com/prometheus/client_golang/prometheus/promhttp"
	"github.com/rs/cors"
)

func main() {
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
	router.Use(middleware.I18nMiddleware()) // Adicionar middleware de i18n

	// Public routes
	router.POST("/api/auth/register", gin.WrapF(routes.HandleRegister(db)))
	router.POST("/api/auth/login", gin.WrapF(routes.HandleLogin(db)))

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

	// Prometheus
	router.GET("/metrics", gin.WrapH(promhttp.Handler()))

	// CORS
	c := cors.New(cors.Options{
		AllowedOrigins:   []string{"http://localhost:3000", "http://localhost:19000"},
		AllowedMethods:   []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowedHeaders:   []string{"Authorization", "Content-Type"},
		AllowCredentials: true,
	})
	handler := c.Handler(router)

	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	logger.WithFields(logrus.Fields{
		"port": port,
	}).Info("Server started")
	log.Fatal(http.ListenAndServe(":"+port, handler))
}
