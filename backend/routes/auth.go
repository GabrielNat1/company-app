package routes

import (
	"database/sql"
	"encoding/json"
	"net/http"

	"golang.org/x/crypto/bcrypt"
)

func HandleRegister(db *sql.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		if r.Method != http.MethodPost {
			http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
			return
		}

		var input struct {
			Name      string `json:"name"`
			Email     string `json:"email"`
			Password  string `json:"password"`
			BirthDate string `json:"birthDate"`
			Phone     string `json:"phone"`
		}

		if err := json.NewDecoder(r.Body).Decode(&input); err != nil {
			http.Error(w, err.Error(), http.StatusBadRequest)
			return
		}

		hashedPassword, err := bcrypt.GenerateFromPassword([]byte(input.Password), bcrypt.DefaultCost)
		if err != nil {
			http.Error(w, "Internal server error", http.StatusInternalServerError)
			return
		}

		_, err = db.Exec(`
			INSERT INTO users (name, email, password, birth_date, phone)
			VALUES (?, ?, ?, ?, ?)
		`, input.Name, input.Email, hashedPassword, input.BirthDate, input.Phone)

		if err != nil {
			http.Error(w, "Email already exists", http.StatusBadRequest)
			return
		}

		w.WriteHeader(http.StatusCreated)
		json.NewEncoder(w).Encode(map[string]string{"message": "User created successfully"})
	}
}
