package main

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
)

type IntakeData struct {
	EventType      string                 `json:"event_type"`
	VisitorID      string                 `json:"visitor_id"`
	SessionID      string                 `json:"session_id"`
	Domain         string                 `json:"domain"`
	PageURL        string                 `json:"page_url"`
	ReferrerURL    string                 `json:"referrer_url"`
	BrowserLanguage string                `json:"browserLanguage"`
	Metadata       map[string]interface{} `json:"metadata,omitempty"`
}

func corsMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Access-Control-Allow-Origin", "*")
		w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type")

		if r.Method == http.MethodOptions {
			w.WriteHeader(http.StatusOK)
			return
		}

		next.ServeHTTP(w, r)
	})
}

func intakeHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "Invalid request method", http.StatusMethodNotAllowed)
		return
	}

	var data IntakeData
	err := json.NewDecoder(r.Body).Decode(&data)
	if err != nil {
		http.Error(w, "Invalid JSON", http.StatusBadRequest)
		return
	}

	logData, err := json.MarshalIndent(data, "", "  ")
	if err != nil {
			fmt.Println("Error marshalling data:", err)
			return
	}

	fmt.Println("Received data:", string(logData))

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	response := map[string]interface{}{
		"message":      "Data received successfully!",
		"receivedData": data,
	}
	json.NewEncoder(w).Encode(response)
}

func statusHandler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	response := map[string]string{
		"message": "API is running!",
	}
	json.NewEncoder(w).Encode(response)
}

func main() {
	http.HandleFunc("/api/intake", intakeHandler)
	http.HandleFunc("/api/status", statusHandler)

	handler := corsMiddleware(http.DefaultServeMux)

	port := "3000"
	log.Printf("Server running on port %s\n", port)
	
	err := http.ListenAndServe(":"+port, handler)

	if err != nil {
		log.Fatal(err)
	}
}
