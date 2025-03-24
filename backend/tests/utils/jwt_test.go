package utils_test

import (
	"testing"

	"github.com/GabrielNat1/WorkSphere/utils"
	"github.com/stretchr/testify/assert"
)

func TestGenerateAndValidateToken(t *testing.T) {
	userId := int64(1)

	t.Run("Generate Valid Token", func(t *testing.T) {
		token, err := utils.GenerateToken(userId)
		assert.NoError(t, err)
		assert.NotEmpty(t, token)
	})

	t.Run("Validate Token", func(t *testing.T) {
		token, _ := utils.GenerateToken(userId)
		validatedUserId, err := utils.ValidateToken(token)
		assert.NoError(t, err)
		assert.Equal(t, userId, validatedUserId)
	})

	t.Run("Validate Invalid Token", func(t *testing.T) {
		_, err := utils.ValidateToken("invalid-token")
		assert.Error(t, err)
	})
}
