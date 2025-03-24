package middleware

import (
	"github.com/GabrielNat1/WorkSphere/utils"
	"github.com/gin-gonic/gin"
)

func AuthRequired() gin.HandlerFunc {
	return func(c *gin.Context) {
		token := c.GetHeader("Authorization")
		if token == "" {
			c.AbortWithStatusJSON(401, gin.H{"error": "Authentication required"})
			return
		}

		userId, err := utils.ValidateToken(token)
		if err != nil {
			c.AbortWithStatusJSON(401, gin.H{"error": "Invalid token"})
			return
		}

		c.Set("userId", userId)
		c.Next()
	}
}
