package main

import (
	"log"
	"net/http"

	"github.com/gorilla/mux"
	"github.com/rs/cors"
)

func main() {
	r := mux.NewRouter()
	routes.RegisterRoutes(r)

	//cors config
	c := cors.New(cors.Options{
		AllowedOrigins:   []string{"*"},
		AllowedMethods:   []string{"GET", "POST", "PUT", "DELETE"},
		AllowedHeaders:   []string{"Authorization", "Content-Type"},
		AllowCredentials: true,
	})

	port := ":8080"
	log.Printf("Servidor rodando na porta", port)
	log.Fatal(http.ListenAndServe(port, c.Handler(r)))
}
