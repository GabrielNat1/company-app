package main

import (
	"database/sql"
	"fmt"
	"log"
	"net/http"

	_ "github.com/mattn/go-sqlite3"
	"github.com/rs/cors"
)

func handler(w http.ResponseWriter, r *http.Request) {
	fmt.Fprintln(w, "Server is running!")
}

func main() {
	db, err := sql.Open("sqlite3", "./data.db")
	if err != nil {
		log.Fatal(err)
	}
	defer db.Close()

	_, err = db.Exec(`CREATE TABLE IF NOT EXISTS users (
		id INTEGER PRIMARY KEY AUTOINCREMENT,
		name TEXT,
		email TEXT UNIQUE,
		password TEXT
	)`)
	if err != nil {
		log.Fatal(err)
	}

	c := cors.New(cors.Options{
		AllowedOrigins:   []string{"*"},
		AllowedMethods:   []string{"GET", "POST", "PUT", "DELETE"},
		AllowedHeaders:   []string{"Authorization", "Content-Type"},
		AllowCredentials: true,
	})

	http.HandleFunc("/", handler)
	http.HandleFunc("/users", func(w http.ResponseWriter, r *http.Request) {
		// Handle user routes
	})

	fmt.Println("Server is running on http://localhost:8080")
	http.ListenAndServe(":8080", c.Handler(http.DefaultServeMux))
}
