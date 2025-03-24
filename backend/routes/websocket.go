package routes

import (
	"database/sql"
	"log"
	"net/http"
	"strconv"
	"strings"

	"github.com/GabrielNat1/WorkSphere/controllers"
	"github.com/gorilla/websocket"
)

var upgrader = websocket.Upgrader{
	CheckOrigin: func(r *http.Request) bool {
		return true
	},
}

func HandleWebSocket(w http.ResponseWriter, r *http.Request, db *sql.DB, hub *controllers.ChatHub) {
	// Extrair eventId da URL
	parts := strings.Split(r.URL.Path, "/")
	if len(parts) < 4 {
		http.Error(w, "Invalid path", http.StatusBadRequest)
		return
	}
	eventID, err := strconv.ParseInt(parts[len(parts)-1], 10, 64)
	if err != nil {
		http.Error(w, "Invalid event ID", http.StatusBadRequest)
		return
	}

	// Fazer upgrade da conexão HTTP para WebSocket
	conn, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		log.Printf("Error upgrading connection: %v", err)
		return
	}

	// Obter userID do token
	userID, err := validateToken(r.Header.Get("Authorization"))
	if err != nil {
		conn.Close()
		return
	}

	// Criar novo cliente
	client := &controllers.Client{
		ID:      int64(userID),
		Conn:    conn,
		EventID: eventID,
	}

	// Registrar cliente no hub
	hub.Register <- client

	// Iniciar goroutine para ler mensagens
	go func() {
		defer func() {
			hub.Unregister <- client
			conn.Close()
		}()

		for {
			var message controllers.Message
			err := conn.ReadJSON(&message)
			if err != nil {
				if websocket.IsUnexpectedCloseError(err, websocket.CloseGoingAway, websocket.CloseAbnormalClosure) {
					log.Printf("Error reading message: %v", err)
				}
				break
			}

			message.UserID = int64(userID)
			message.EventID = eventID

			// Obter nome do usuário
			var userName string
			err = db.QueryRow("SELECT name FROM users WHERE id = ?", userID).Scan(&userName)
			if err == nil {
				message.UserName = userName
			}

			hub.Broadcast <- message
		}
	}()
}
