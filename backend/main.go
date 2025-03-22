package main

import (
	"log"
	"net/http"
	"os"
	"runtime"

	"github.com/gorilla/mux"
)

func main() {
	runtime.GOMAXPROCS(runtime.NumCPU())

	r := mux.NewRouter()

	http.Handle("/", r)

	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	log.Printf("Server listening on port %s", port)
	log.Fatal(http.ListenAndServe(":"+port, nil))
}
