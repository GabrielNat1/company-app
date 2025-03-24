package routes

import (
	"database/sql"
	"encoding/json"
	"net/http"

	"github.com/GabrielNat1/WorkSphere/utils"
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

func HandleLogin(db *sql.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		if r.Method != http.MethodPost {
			http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
			return
		}

		var input struct {
			Email    string `json:"email"`
			Password string `json:"password"`
		}

		if err := json.NewDecoder(r.Body).Decode(&input); err != nil {
			http.Error(w, err.Error(), http.StatusBadRequest)
			return
		}

		var user struct {
			ID       int64  `json:"id"`
			Name     string `json:"name"`
			Email    string `json:"email"`
			Password string `json:"-"`
			Role     string `json:"role"`
		}

		err := db.QueryRow(`
			SELECT id, name, email, password, role 
			FROM users 
			WHERE email = ?
		`, input.Email).Scan(&user.ID, &user.Name, &user.Email, &user.Password, &user.Role)

		if err != nil {
			http.Error(w, "Invalid credentials", http.StatusUnauthorized)
			return
		}

		if err := bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(input.Password)); err != nil {
			http.Error(w, "Invalid credentials", http.StatusUnauthorized)
			return
		}

		token, err := utils.GenerateToken(user.ID)
		if err != nil {
			http.Error(w, "Error generating token", http.StatusInternalServerError)
			return
		}

		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(map[string]interface{}{
			"token": token,
			"user": map[string]interface{}{
				"id":    user.ID,
				"name":  user.Name,
				"email": user.Email,
				"role":  user.Role,
			},
		})
	}
}
