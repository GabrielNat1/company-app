package main

import (
	"log"
	"net/http"
	"os"

	"github.com/GabrielNat1/WorkSphere/controllers"
	"github.com/GabrielNat1/WorkSphere/database"
	"github.com/GabrielNat1/WorkSphere/middleware"
	"github.com/GabrielNat1/WorkSphere/routes"
	"github.com/rs/cors"
)

func main() {
	db := database.InitDB()
	if db == nil {
		log.Fatal("Failed to initialize database")
	}
	defer db.Close()

	// Initialize the chat hub
	chatHub := controllers.NewChatHub(db)
	go chatHub.Run()

	mux := http.NewServeMux()

	// Public routes
	mux.HandleFunc("/api/auth/register", routes.HandleRegister(db))
	mux.HandleFunc("/api/auth/login", routes.HandleLogin(db))

	// Private routes
	mux.HandleFunc("/api/events", routes.HandleEvents(db))
	mux.HandleFunc("/api/events/join/", routes.HandleJoinEvent(db))
	mux.HandleFunc("/api/dashboard", func(w http.ResponseWriter, r *http.Request) {
		middleware.AdminRequired(db)(routes.HandleDashboard(db)).ServeHTTP(w, r)
	})

	// Chat WebSocket
	mux.HandleFunc("/ws/chat/", func(w http.ResponseWriter, r *http.Request) {
		routes.HandleWebSocket(w, r, db, chatHub)
	})

	// Health-check endpoint
	mux.HandleFunc("/health", func(w http.ResponseWriter, r *http.Request) {
		w.WriteHeader(http.StatusOK)
		w.Write([]byte("OK"))
	})

	// Reset password endpoint
	mux.HandleFunc("/api/auth/reset-password", routes.HandleResetPassword(db))

	// CORS configuration
	c := cors.New(cors.Options{
		AllowedOrigins:   []string{"http://localhost:3000", "http://localhost:19000"},
		AllowedMethods:   []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowedHeaders:   []string{"Authorization", "Content-Type"},
		AllowCredentials: true,
	})

	handler := c.Handler(mux)

	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	log.Printf("Server running on http://localhost:%s", port)
	log.Fatal(http.ListenAndServe(":"+port, handler))
}
