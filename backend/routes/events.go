package routes

import (
	"database/sql"
	"encoding/json"
	"errors"
	"net/http"
	"strings"
	"sync"
	"time"
)

func validateToken(authHeader string) (int, error) {
	if authHeader == "" {
		return 0, errors.New("no token provided")
	}

	// Simulate token validation
	tokenParts := strings.Split(authHeader, " ")
	if len(tokenParts) != 2 || tokenParts[0] != "Bearer" {
		return 0, errors.New("invalid token format")
	}

	// Simulate extracting user ID from token
	userID := 1 // Replace with actual logic to extract user ID from token
	return userID, nil
}

func getEventIDFromPath(path string) (int, error) {
	// Simulate extracting event ID from path
	// Replace with actual logic to extract event ID from path
	if path == "" {
		return 0, errors.New("path is empty")
	}
	return 1, nil // Replace with actual event ID extraction logic
}

var (
	eventsCache      []byte
	eventsCacheMutex sync.Mutex
	eventsCacheTime  time.Time
	cacheDuration    = 5 * time.Minute
)

func HandleEvents(db *sql.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		// Verificar autenticação
		userID, err := validateToken(r.Header.Get("Authorization"))
		if err != nil {
			http.Error(w, "Unauthorized", http.StatusUnauthorized)
			return
		}

		switch r.Method {
		case http.MethodGet:
			// Check cache
			eventsCacheMutex.Lock()
			if time.Since(eventsCacheTime) < cacheDuration && eventsCache != nil {
				w.Header().Set("Content-Type", "application/json")
				w.Write(eventsCache)
				eventsCacheMutex.Unlock()
				return
			}
			eventsCacheMutex.Unlock()

			rows, err := db.Query(`
				SELECT id, title, description, date, location, capacity
				FROM events
			`)
			if err != nil {
				http.Error(w, err.Error(), http.StatusInternalServerError)
				return
			}
			defer rows.Close()

			type Event struct {
				ID          int    `json:"id"`
				Title       string `json:"title"`
				Description string `json:"description"`
				Date        string `json:"date"`
				Location    string `json:"location"`
				Capacity    int    `json:"capacity"`
			}

			var events []Event
			for rows.Next() {
				var event Event
				err = rows.Scan(&event.ID, &event.Title, &event.Description,
					&event.Date, &event.Location, &event.Capacity)
				if err != nil {
					http.Error(w, err.Error(), http.StatusInternalServerError)
					return
				}
				events = append(events, event)
			}

			// Cache the response
			response, err := json.Marshal(events)
			if err != nil {
				http.Error(w, err.Error(), http.StatusInternalServerError)
				return
			}

			eventsCacheMutex.Lock()
			eventsCache = response
			eventsCacheTime = time.Now()
			eventsCacheMutex.Unlock()

			w.Header().Set("Content-Type", "application/json")
			w.Write(response)

		case http.MethodPost:
			// Invalidate cache on POST
			eventsCacheMutex.Lock()
			eventsCache = nil
			eventsCacheMutex.Unlock()

			// Verify admin role
			var role string
			err := db.QueryRow("SELECT role FROM users WHERE id = ?", userID).Scan(&role)
			if err != nil || role != "admin" {
				http.Error(w, "Admin access required", http.StatusForbidden)
				return
			}

			var input struct {
				Title       string `json:"title"`
				Description string `json:"description"`
				Date        string `json:"date"`
				Location    string `json:"location"`
				Capacity    int    `json:"capacity"`
			}

			if err := json.NewDecoder(r.Body).Decode(&input); err != nil {
				http.Error(w, err.Error(), http.StatusBadRequest)
				return
			}

			result, err := db.Exec(`
				INSERT INTO events (title, description, date, location, capacity, creator_id)
				VALUES (?, ?, ?, ?, ?, ?)
			`, input.Title, input.Description, input.Date, input.Location, input.Capacity, userID)

			if err != nil {
				http.Error(w, err.Error(), http.StatusInternalServerError)
				return
			}

			id, _ := result.LastInsertId()
			w.WriteHeader(http.StatusCreated)
			json.NewEncoder(w).Encode(map[string]interface{}{
				"id":          id,
				"title":       input.Title,
				"description": input.Description,
				"date":        input.Date,
				"location":    input.Location,
				"capacity":    input.Capacity,
			})
		}
	}
}

func HandleJoinEvent(db *sql.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		if r.Method != http.MethodPost {
			http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
			return
		}

		userID, err := validateToken(r.Header.Get("Authorization"))
		if err != nil {
			http.Error(w, "Unauthorized", http.StatusUnauthorized)
			return
		}

		eventID, err := getEventIDFromPath(r.URL.Path)
		if err != nil {
			http.Error(w, "Invalid event ID", http.StatusBadRequest)
			return
		}
		if eventID == 0 {
			http.Error(w, "Invalid event ID", http.StatusBadRequest)
			return
		}

		// Verificar capacidade do evento
		var capacity, currentParticipants int
		err = db.QueryRow(`
			SELECT e.capacity, COUNT(ep.user_id) 
			FROM events e 
			LEFT JOIN event_participants ep ON e.id = ep.event_id 
			WHERE e.id = ?
			GROUP BY e.id, e.capacity
		`, eventID).Scan(&capacity, &currentParticipants)

		if err != nil {
			http.Error(w, "Event not found", http.StatusNotFound)
			return
		}

		if currentParticipants >= capacity {
			http.Error(w, "Event is full", http.StatusBadRequest)
			return
		}

		// Registrar participação
		_, err = db.Exec(`
			INSERT INTO event_participants (user_id, event_id)
			VALUES (?, ?)
		`, userID, eventID)

		if err != nil {
			http.Error(w, "Already registered for this event", http.StatusBadRequest)
			return
		}

		w.WriteHeader(http.StatusOK)
		json.NewEncoder(w).Encode(map[string]string{
			"message": "Successfully joined event",
		})
	}
}
