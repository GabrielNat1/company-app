package controllers

import (
	"database/sql"
	"log"
	"sync"

	"github.com/gorilla/websocket"
)

type Client struct {
	ID      int64
	Conn    *websocket.Conn
	EventID int64
}

type Message struct {
	EventID  int64  `json:"eventId"`
	UserID   int64  `json:"userId"`
	UserName string `json:"userName"`
	Content  string `json:"content"`
}

type ChatHub struct {
	clients    map[*Client]bool
	Broadcast  chan Message
	Register   chan *Client
	Unregister chan *Client
	db         *sql.DB
	mu         sync.Mutex
}

func NewChatHub(db *sql.DB) *ChatHub {
	return &ChatHub{
		clients:    make(map[*Client]bool),
		Broadcast:  make(chan Message),
		Register:   make(chan *Client),
		Unregister: make(chan *Client),
		db:         db,
	}
}

func (h *ChatHub) Run() {
	for {
		select {
		case client := <-h.Register:
			h.mu.Lock()
			h.clients[client] = true
			h.mu.Unlock()

		case client := <-h.Unregister:
			h.mu.Lock()
			if _, ok := h.clients[client]; ok {
				delete(h.clients, client)
				client.Conn.Close()
			}
			h.mu.Unlock()

		case message := <-h.Broadcast:
			h.mu.Lock()
			// Salvar mensagem no banco
			_, err := h.db.Exec(`
				INSERT INTO chat_messages (event_id, user_id, message)
				VALUES (?, ?, ?)
			`, message.EventID, message.UserID, message.Content)
			if err != nil {
				log.Printf("Error saving message: %v", err)
			}

			// Enviar para todos os clientes no mesmo evento
			for client := range h.clients {
				if client.EventID == message.EventID {
					err := client.Conn.WriteJSON(message)
					if err != nil {
						client.Conn.Close()
						delete(h.clients, client)
					}
				}
			}
			h.mu.Unlock()
		}
	}
}
