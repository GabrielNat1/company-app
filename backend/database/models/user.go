package models

import (
	"time"

	"gorm.io/gorm"
)

type User struct {
	gorm.Model
	Name      string    `json:"name"`
	Email     string    `json:"email" gorm:"unique"`
	Password  string    `json:"-"`
	BirthDate time.Time `json:"birthDate"`
	Phone     string    `json:"phone"`
	Role      string    `json:"role" gorm:"default:'user'"`
	Events    []Event   `json:"events" gorm:"many2many:user_events;"`
}
