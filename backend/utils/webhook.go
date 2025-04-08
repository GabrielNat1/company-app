package utils

import (
	"bytes"
	"encoding/json"
	"net/http"

	"github.com/spf13/viper"
)

// SendWebhookNotification envia o evento e payload para a URL configurada usando a chave fornecida.
func SendWebhookNotification(webhookKey, event string, payload interface{}) error {
	webhookURL := viper.GetString("webhooks." + webhookKey)
	if webhookURL == "" {
		// Nenhum webhook configurado; não faça nada.
		return nil
	}

	data := map[string]interface{}{
		"event":   event,
		"payload": payload,
	}
	body, err := json.Marshal(data)
	if err != nil {
		return err
	}

	resp, err := http.Post(webhookURL, "application/json", bytes.NewBuffer(body))
	if err != nil {
		return err
	}
	defer resp.Body.Close()
	return nil
}
