package main

import (
	"log"
	"net/http"
	"os"

	"github.com/GabrielNat1/WorkSphere/controllers"
	"github.com/GabrielNat1/WorkSphere/database"
	"github.com/GabrielNat1/WorkSphere/routes"
	"github.com/rs/cors"
)

func main() {
	db := database.InitDB()
	if db == nil {
		log.Fatal("Failed to initialize database")
	}
	defer db.Close()

	// Inicializar hub do chat
	chatHub := controllers.NewChatHub(db)
	go chatHub.Run()

	mux := http.NewServeMux()

	// Rotas públicas
	mux.HandleFunc("/api/auth/register", routes.HandleRegister(db))
	mux.HandleFunc("/api/auth/login", routes.HandleLogin(db))

	// Rotas protegidas
	mux.HandleFunc("/api/events", routes.HandleEvents(db))
	mux.HandleFunc("/api/events/join/", routes.HandleJoinEvent(db))

	// Chat WebSocket
	mux.HandleFunc("/ws/chat/", func(w http.ResponseWriter, r *http.Request) {
		routes.HandleWebSocket(w, r, db, chatHub)
	})

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
