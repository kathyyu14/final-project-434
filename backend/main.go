package main

import (
	"context"
	"encoding/csv"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"strings"
	"sync"

	"cloud.google.com/go/bigquery"
	"cloud.google.com/go/storage"
	"github.com/gorilla/mux"
	"google.golang.org/api/iterator"
	"github.com/gorilla/handlers"
)

// BreedRank represents a structure for a dog breed rank
type BreedRank struct {
	Breed             string `json:"breed"`
	Rank2013          string `json:"rank_2013"`
	Rank2014          string `json:"rank_2014"`
	Rank2015          string `json:"rank_2015"`
	Rank2016          string `json:"rank_2016"`
	Rank2017          string `json:"rank_2017"`
	Rank2018          string `json:"rank_2018"`
	Rank2019          string `json:"rank_2019"`
	Rank2020          string `json:"rank_2020"`
	ImageURL string `json:"image_url"`
}

// In-memory data store (thread-safe)
var breedRanks []BreedRank
var breedImageMap map[string]string
var mu sync.Mutex


func main() {
    router := mux.NewRouter()

    // Register handlers
    router.HandleFunc("/rank", GetRankHandler).Methods("GET")
    router.HandleFunc("/predict", PredictRankHandler).Methods("GET")
    router.HandleFunc("/get/{breed}/imageURL", GetBreedImageHandler).Methods("GET")

    // Allow CORS for all origins
    corsHandler := handlers.CORS(handlers.AllowedOrigins([]string{"*"}))

    server := http.Server{
        Addr:    ":8080",
        Handler: corsHandler(router), // Use CORS handler
    }

    fmt.Println("Starting Dog Breed Rank Service on Port 8080")
    log.Fatal(server.ListenAndServe())
}


// GetRankHandler handles the /rank GET endpoint
func GetRankHandler(w http.ResponseWriter, r *http.Request) {
	ctx := context.Background()
	client, err := storage.NewClient(ctx)
	if err != nil {
		http.Error(w, "Failed to create client", http.StatusInternalServerError)
		return
	}
	defer client.Close()

	bucketName := "final-project-434-bucket1" // Your bucket name
	fileName := "breed_rank.csv"              // Your file name

	rc, err := client.Bucket(bucketName).Object(fileName).NewReader(ctx)
	if err != nil {
		http.Error(w, "Failed to open file", http.StatusInternalServerError)
		return
	}
	defer rc.Close()

	// Read CSV file
	csvReader := csv.NewReader(rc)
	records, err := csvReader.ReadAll()
	if err != nil {
		http.Error(w, "Failed to read CSV data", http.StatusInternalServerError)
		return
	}

	mu.Lock()
	defer mu.Unlock()
	breedRanks = breedRanks[:0]     // Reset the slice
	breedImageMap = make(map[string]string) // Reset the map

	for _, record := range records {
		// Assuming the CSV has ten columns: breed, rank_2013 to rank_2020, image_url
		if len(record) < 10 {
			continue // skip malformed rows
		}
		breedRank := BreedRank{
			Breed:    strings.TrimSpace(record[0]),
			Rank2013: strings.TrimSpace(record[1]),
			Rank2014: strings.TrimSpace(record[2]),
			Rank2015: strings.TrimSpace(record[3]),
			Rank2016: strings.TrimSpace(record[4]),
			Rank2017: strings.TrimSpace(record[5]),
			Rank2018: strings.TrimSpace(record[6]),
			Rank2019: strings.TrimSpace(record[7]),
			Rank2020: strings.TrimSpace(record[8]),
			ImageURL: strings.TrimSpace(record[9]),
		}
		breedRanks = append(breedRanks, breedRank)
		breedImageMap[breedRank.Breed] = breedRank.ImageURL // Populate the image URL map
	}

	// Convert the data to JSON
	w.Header().Set("Content-Type", "application/json")
	if err := json.NewEncoder(w).Encode(breedRanks); err != nil {
		http.Error(w, "Failed to encode JSON", http.StatusInternalServerError)
		return
	}
}

// PredictRankHandler handles the /predict GET endpoint using BigQuery ML model
func PredictRankHandler(w http.ResponseWriter, r *http.Request) {
	ctx := context.Background()
	client, err := bigquery.NewClient(ctx, "final-project-434")
	if err != nil {
		http.Error(w, "Failed to create BigQuery client", http.StatusInternalServerError)
		log.Println("Failed to create BigQuery client:", err)
		return
	}
	defer client.Close()

	// BigQuery ML prediction query
	query := client.Query(`
		SELECT
			Breed,
			ROUND(predicted_Rank2020) AS PredictedRank2024
		FROM
			ML.PREDICT(
				MODEL ` + "`final-project-434.finalprojectdataset.breed_rank_model`" + `,
				(
					SELECT
						Breed,
						CAST(Rank2013 AS INT64) AS Rank2013,
						CAST(Rank2014 AS INT64) AS Rank2014,
						CAST(Rank2015 AS INT64) AS Rank2015,
						CAST(Rank2016 AS INT64) AS Rank2016,
						CAST(Rank2017 AS INT64) AS Rank2017,
						CAST(Rank2018 AS INT64) AS Rank2018,
						CAST(Rank2019 AS INT64) AS Rank2019,
						CAST(Rank2020 AS INT64) AS Rank2020
					FROM
						` + "`final-project-434.finalprojectdataset.breed_rank`" + `
				)
			)
	`)

	it, err := query.Read(ctx)
	if err != nil {
		http.Error(w, "Failed to run query", http.StatusInternalServerError)
		log.Println("Failed to run query:", err)
		return
	}

	var predictions []map[string]interface{}
	for {
		var values []bigquery.Value
		err := it.Next(&values)
		if err == iterator.Done {
			break
		}
		if err != nil {
			http.Error(w, "Failed to read query result", http.StatusInternalServerError)
			log.Println("Failed to read query result:", err)
			return
		}

		predictions = append(predictions, map[string]interface{}{
			"Breed":             values[0],
			"PredictedRank2024": values[1],
		})
	}

	// Return the predictions as JSON
	w.Header().Set("Content-Type", "application/json")
	if err := json.NewEncoder(w).Encode(predictions); err != nil {
		http.Error(w, "Failed to encode JSON", http.StatusInternalServerError)
		log.Println("Failed to encode JSON:", err)
		return
	}
}

// GetBreedImageHandler handles the /get/{breed}/imageURL GET endpoint
func GetBreedImageHandler(w http.ResponseWriter, r *http.Request) {
    vars := mux.Vars(r)
    breed := vars["breed"]

    ctx := context.Background()
    client, err := storage.NewClient(ctx)
    if err != nil {
        http.Error(w, "Failed to create storage client", http.StatusInternalServerError)
        log.Println("Failed to create storage client:", err)
        return
    }
    defer client.Close()

    bucketName := "final-project-434-bucket1" // Your bucket name
    fileName := "breed_rank.csv"              // Your CSV file name

    rc, err := client.Bucket(bucketName).Object(fileName).NewReader(ctx)
    if err != nil {
        http.Error(w, "Failed to open file", http.StatusInternalServerError)
        log.Println("Failed to open file:", err)
        return
    }
    defer rc.Close()

    csvReader := csv.NewReader(rc)
    records, err := csvReader.ReadAll()
    if err != nil {
        http.Error(w, "Failed to read CSV data", http.StatusInternalServerError)
        log.Println("Failed to read CSV data:", err)
        return
    }

    for _, record := range records {
        if len(record) < 2 {
            continue // Skip malformed rows
        }

        // Assuming the breed is in the first column and the image URL in the 'Image' column (likely index 10 or 11 based on the image)
        if record[0] == breed {
            imageURL := record[10] // Assuming 'Image' is the 11th column (index 10)
            response := map[string]string{
                "Breed":    breed,
                "ImageURL": imageURL,
            }

            w.Header().Set("Content-Type", "application/json")
            if err := json.NewEncoder(w).Encode(response); err != nil {
                http.Error(w, "Failed to encode JSON", http.StatusInternalServerError)
                log.Println("Failed to encode JSON:", err)
            }
            return
        }
    }

    http.Error(w, "Breed not found", http.StatusNotFound)
}
