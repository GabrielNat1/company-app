package controllers

import (
	"fmt"
	"net/http"
	"strconv"
	"time"

	"github.com/GabrielNat1/WorkSphere/models"
	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

type EventController struct {
	db *gorm.DB
}

func NewEventController(db *gorm.DB) *EventController {
	return &EventController{db: db}
}

type CreateEventInput struct {
	Title       string    `json:"title" binding:"required"`
	Description string    `json:"description" binding:"required"`
	Date        time.Time `json:"date" binding:"required"`
	Location    string    `json:"location" binding:"required"`
	Capacity    int       `json:"capacity" binding:"required,min=1"`
}

func (ec *EventController) CreateEvent(c *gin.Context) {
	var input CreateEventInput
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Validate future date manually
	if input.Date.Before(time.Now()) {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Event date must be in the future"})
		return
	}

	userId := c.GetUint("userId")
	event := models.Event{
		Title:       input.Title,
		Description: input.Description,
		Date:        input.Date,
		Location:    input.Location,
		Capacity:    input.Capacity,
		CreatorID:   userId,
	}

	if err := ec.db.Create(&event).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create event"})
		return
	}

	// Log event creation for debugging
	fmt.Printf("Event created: %+v\n", event)

	c.JSON(http.StatusCreated, gin.H{
		"id":          event.ID,
		"title":       event.Title,
		"description": event.Description,
		"date":        event.Date,
		"location":    event.Location,
		"capacity":    event.Capacity,
		"creatorId":   event.CreatorID,
	})
}

func (ec *EventController) JoinEvent(c *gin.Context) {
	eventId, _ := strconv.Atoi(c.Param("id"))
	userId := c.GetUint("userId")

	var event models.Event
	if err := ec.db.First(&event, eventId).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Event not found"})
		return
	}

	count := ec.db.Model(&event).Association("Users").Count()
	if int(count) >= event.Capacity {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Event is full"})
		return
	}

	var user models.User
	if err := ec.db.First(&user, userId).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "User not found"})
		return
	}

	if err := ec.db.Model(&event).Association("Users").Append(&user); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to join event"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Successfully joined event"})
}
