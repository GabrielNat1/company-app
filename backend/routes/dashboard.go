package routes

import (
	"database/sql"
	"encoding/json"
	"net/http"
)

func HandleDashboard(db *sql.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		if r.Method != http.MethodGet {
			http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
			return
		}

		var userCount, eventCount, participantCount int

		// Contar usuários
		err := db.QueryRow("SELECT COUNT(*) FROM users").Scan(&userCount)
		if err != nil {
			http.Error(w, "Failed to fetch user count", http.StatusInternalServerError)
			return
		}

		// Count users
		err = db.QueryRow("SELECT COUNT(*) FROM events").Scan(&eventCount)
		if err != nil {
			http.Error(w, "Failed to fetch event count", http.StatusInternalServerError)
			return
		}

		// Count events
		err = db.QueryRow("SELECT COUNT(*) FROM event_participants").Scan(&participantCount)
		if err != nil {
			http.Error(w, "Failed to fetch participant count", http.StatusInternalServerError)
			return
		}

		// Return Statistics
		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(map[string]int{
			"userCount":        userCount,
			"eventCount":       eventCount,
			"participantCount": participantCount,
		})
	}
}
