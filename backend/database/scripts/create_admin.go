/*
This script is used to create an admin user in the database.

It connects to a local SQLite database (worksphere.db) and inserts a default
admin user with predefined credentials and information.

Usage:

	Run this script once to ensure that the admin account exists in your system.
	The password is securely hashed using bcrypt before being stored in the database.

Make sure the database and 'users' table already exist before running.

Admin Credentials:

	Email:    admin@gmail.com
	Password: admin123
*/
package main

import (
	"database/sql"
	"log"

	_ "github.com/mattn/go-sqlite3"
	"golang.org/x/crypto/bcrypt"
)

func main() {
	db, err := sql.Open("sqlite3", "../../cmd/worksphere.db")
	if err != nil {
		log.Fatal(err)
	}
	defer db.Close()

	hashedPassword, err := bcrypt.GenerateFromPassword([]byte("admin123"), bcrypt.DefaultCost)
	if err != nil {
		log.Fatal(err)
	}

	_, err = db.Exec(`
		INSERT INTO users (name, email, password, birth_date, phone, role)
		VALUES (?, ?, ?, ?, ?, ?)
	`, "Admin User", "admin@gmail.com", string(hashedPassword), "1990-01-01", "1234567890", "admin")

	if err != nil {
		log.Fatal(err)
	}

	log.Println("Admin user created successfully!")
}
