package database

import (
	"database/sql"
	"log"

	_ "github.com/mattn/go-sqlite3"
	"github.com/spf13/viper"
)

func InitDB() *sql.DB {
	connection := viper.GetString("database.connection")
	db, err := sql.Open(viper.GetString("database.driver"), connection)
	if err != nil {
		log.Fatal(err)
	}

	sqlStmt := `
	PRAGMA foreign_keys = ON;
	
	CREATE TABLE IF NOT EXISTS users (
		id INTEGER PRIMARY KEY AUTOINCREMENT,
		name TEXT NOT NULL,
		email TEXT UNIQUE NOT NULL,
		password TEXT NOT NULL,
		birth_date TEXT NOT NULL,
		phone TEXT NOT NULL,
		role TEXT DEFAULT 'user',
		created_at DATETIME DEFAULT CURRENT_TIMESTAMP
	);

	CREATE TABLE IF NOT EXISTS events (
		id INTEGER PRIMARY KEY AUTOINCREMENT,
		title TEXT NOT NULL,
		description TEXT,
		date TEXT NOT NULL,
		location TEXT NOT NULL,
		capacity INTEGER NOT NULL,
		creator_id INTEGER,
		created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
		FOREIGN KEY(creator_id) REFERENCES users(id)
	);

	CREATE TABLE IF NOT EXISTS event_participants (
		user_id INTEGER,
		event_id INTEGER,
		joined_at DATETIME DEFAULT CURRENT_TIMESTAMP,
		FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE,
		FOREIGN KEY(event_id) REFERENCES events(id) ON DELETE CASCADE,
		PRIMARY KEY(user_id, event_id)
	);

	CREATE TABLE IF NOT EXISTS chat_messages (
		id INTEGER PRIMARY KEY AUTOINCREMENT,
		event_id INTEGER,
		user_id INTEGER,
		message TEXT NOT NULL,
		created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
		FOREIGN KEY(event_id) REFERENCES events(id) ON DELETE CASCADE,
		FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
	);`

	_, err = db.Exec(sqlStmt)
	if err != nil {
		log.Printf("%q: %s\n", err, sqlStmt)
		return nil
	}

	return db
}
