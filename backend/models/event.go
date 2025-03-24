package models

import (
	"time"

	"gorm.io/gorm"
)

type Event struct {
	gorm.Model
	Title       string    `json:"title"`
	Description string    `json:"description"`
	Date        time.Time `json:"date"`
	Location    string    `json:"location"`
	Capacity    int       `json:"capacity"`
	CreatorID   uint      `json:"creatorId"`
	Users       []User    `json:"users" gorm:"many2many:user_events;"`
}
