package main

import (
	"embed"
	"encoding/json"
	"fmt"
	"io/fs"
	"log"
	"math"
	"math/rand"
	"net/http"
	"os"
	"strconv"
	"strings"
	"sync"
	"time"
)

//go:embed static/*
var staticFiles embed.FS

type GeoPoint struct {
	Latitude  float64  `json:"latitude"`
	Longitude float64  `json:"longitude"`
	Altitude  *float64 `json:"altitude,omitempty"`
}

// WorkerReading represents telemetry from the user tracking device (sent every 10 mins)
type WorkerReading struct {
	ID             string    `json:"id"`
	RawMessage     string    `json:"rawMessage,omitempty"`
	DeviceID       string    `json:"deviceId"`
	DeviceCode     string    `json:"deviceCode"`
	WorkerID       string    `json:"workerId,omitempty"`
	EstateID       string    `json:"estateId,omitempty"`
	WorkSessionID  string    `json:"workSessionId,omitempty"`
	RecordedAt     string    `json:"recordedAt"`
	Altitude       float64   `json:"altitude"`
	Location       *GeoPoint `json:"location,omitempty"`
	ActivityStatus string    `json:"activityStatus"`
}

// EnvironmentReading represents telemetry from the environmental sensor (sent every 1 hr)
type EnvironmentReading struct {
	ID           string    `json:"id"`
	RawMessage   string    `json:"rawMessage,omitempty"`
	DeviceID     string    `json:"deviceId"`
	DeviceCode   string    `json:"deviceCode"`
	EstateID     string    `json:"estateId,omitempty"`
	RecordedAt   string    `json:"recordedAt"`
	Temperature  float64   `json:"temperature"`
	Humidity     float64   `json:"humidity"`
	SoilMoisture float64   `json:"soilMoisture"`
	Location     *GeoPoint `json:"location,omitempty"`
}

// ProductionReading represents end-of-day worker harvest weight from the smart scale
type ProductionReading struct {
	ID            string  `json:"id"`
	RawMessage    string  `json:"rawMessage,omitempty"`
	DeviceID      string  `json:"deviceId"`
	DeviceCode    string  `json:"deviceCode"`
	WorkerID      string  `json:"workerId"`
	EmployeeCode  string  `json:"employeeCode,omitempty"`
	EstateID      string  `json:"estateId"`
	EstateCode    string  `json:"estateCode,omitempty"`
	WorkSessionID string  `json:"workSessionId,omitempty"`
	Quantity      float64 `json:"quantity"`
	Weight        float64 `json:"weight"`
	Unit          string  `json:"unit"`
	RecordedAt    string  `json:"recordedAt"`
}

// BaseStationPacket represents an incoming LoRa packet forwarded by the base station
type BaseStationPacket struct {
	BaseStationID string `json:"baseStationId"`
	RawPacket     string `json:"rawPacket"`
	RSSI          int    `json:"rssi,omitempty"`
}

// SimulationSettings controls default device presets and auto-generation intervals
type SimulationSettings struct {
	AutoSimulate           bool    `json:"autoSimulate"`
	WorkerIntervalSec      int     `json:"workerIntervalSec"`      // Real: 600s (10 mins)
	EnvironmentIntervalSec int     `json:"environmentIntervalSec"` // Real: 3600s (1 hr)
	BaseStationCode        string  `json:"baseStationCode"`
	TrackerDeviceCode      string  `json:"trackerDeviceCode"`
	DefaultWorkerID        string  `json:"defaultWorkerId"`
	DefaultEstateID        string  `json:"defaultEstateId"`
	DefaultLatitude        float64 `json:"defaultLatitude"`
	DefaultLongitude       float64 `json:"defaultLongitude"`
	DefaultAltitude        float64 `json:"defaultAltitude"`
	DefaultActivityStatus  string  `json:"defaultActivityStatus"`
	EnvSensorDeviceCode    string  `json:"envSensorDeviceCode"`
	DefaultTemperature     float64 `json:"defaultTemperature"`
	DefaultHumidity        float64 `json:"defaultHumidity"`
	DefaultSoilMoisture    float64 `json:"defaultSoilMoisture"`
	SmartScaleDeviceCode   string  `json:"smartScaleDeviceCode"`
	DefaultHarvestWeight   float64 `json:"defaultHarvestWeight"`
	DefaultHarvestUnit     string  `json:"defaultHarvestUnit"`
}

type MockCloudStore struct {
	mu          sync.RWMutex
	workers     []WorkerReading
	environment []EnvironmentReading
	production  []ProductionReading
	settings    SimulationSettings
	nextID      int
}

func round2(v float64) float64 {
	return math.Round(v*100) / 100
}

func round6(v float64) float64 {
	return math.Round(v*1000000) / 1000000
}

func newMockCloudStore() *MockCloudStore {
	now := time.Now().UTC()
	alt1 := 1425.50
	alt2 := 1432.80

	store := &MockCloudStore{
		nextID: 100,
		settings: SimulationSettings{
			AutoSimulate:           false,
			WorkerIntervalSec:      600,  // 10 mins
			EnvironmentIntervalSec: 3600, // 1 hour
			BaseStationCode:        "BS-GATEWAY-01",
			TrackerDeviceCode:      "550e8400-e29b-41d4-a716-446655440000",
			DefaultWorkerID:        "EMP-0042",
			DefaultEstateID:        "GV-TEA-001",
			DefaultLatitude:        6.949700,
			DefaultLongitude:       80.633700,
			DefaultAltitude:        1428.50,
			DefaultActivityStatus:  "ACTIVE",
			EnvSensorDeviceCode:    "ENV-SENSOR-01",
			DefaultTemperature:     24.50,
			DefaultHumidity:        81.00,
			DefaultSoilMoisture:    46.50,
			SmartScaleDeviceCode:   "SCALE-SMART-01",
			DefaultHarvestWeight:   28.50,
			DefaultHarvestUnit:     "kg",
		},
		workers: []WorkerReading{
			{
				ID:             "wrk-1",
				RawMessage:     "WORKER|550e8400-e29b-41d4-a716-446655440000|LAT=6.949700|LON=80.633700|ALT=1425.50|STATUS=ACTIVE",
				DeviceID:       "550e8400-e29b-41d4-a716-446655440000",
				DeviceCode:     "550e8400-e29b-41d4-a716-446655440000",
				WorkerID:       "EMP-0042",
				EstateID:       "GV-TEA-001",
				RecordedAt:     now.Add(-20 * time.Minute).Format(time.RFC3339),
				Altitude:       alt1,
				Location:       &GeoPoint{Latitude: 6.949700, Longitude: 80.633700, Altitude: &alt1},
				ActivityStatus: "ACTIVE",
			},
			{
				ID:             "wrk-2",
				RawMessage:     "WORKER|550e8400-e29b-41d4-a716-446655440000|LAT=6.950120|LON=80.634150|ALT=1432.80|STATUS=ACTIVE",
				DeviceID:       "550e8400-e29b-41d4-a716-446655440000",
				DeviceCode:     "550e8400-e29b-41d4-a716-446655440000",
				WorkerID:       "EMP-0042",
				EstateID:       "GV-TEA-001",
				RecordedAt:     now.Add(-10 * time.Minute).Format(time.RFC3339),
				Altitude:       alt2,
				Location:       &GeoPoint{Latitude: 6.950120, Longitude: 80.634150, Altitude: &alt2},
				ActivityStatus: "ACTIVE",
			},
		},
		environment: []EnvironmentReading{
			{
				ID:           "env-1",
				RawMessage:   "ENV|ENV-SENSOR-01|TEMP=23.80|HUM=83.50|SOIL=47.20|LAT=6.949700|LON=80.633700",
				DeviceID:     "ENV-SENSOR-01",
				DeviceCode:   "ENV-SENSOR-01",
				EstateID:     "GV-TEA-001",
				RecordedAt:   now.Add(-2 * time.Hour).Format(time.RFC3339),
				Temperature:  23.80,
				Humidity:     83.50,
				SoilMoisture: 47.20,
				Location:     &GeoPoint{Latitude: 6.949700, Longitude: 80.633700},
			},
			{
				ID:           "env-2",
				RawMessage:   "ENV|ENV-SENSOR-01|TEMP=24.50|HUM=81.00|SOIL=46.50|LAT=6.949700|LON=80.633700",
				DeviceID:     "ENV-SENSOR-01",
				DeviceCode:   "ENV-SENSOR-01",
				EstateID:     "GV-TEA-001",
				RecordedAt:   now.Add(-1 * time.Hour).Format(time.RFC3339),
				Temperature:  24.50,
				Humidity:     81.00,
				SoilMoisture: 46.50,
				Location:     &GeoPoint{Latitude: 6.949700, Longitude: 80.633700},
			},
		},
		production: []ProductionReading{
			{
				ID:           "prd-1",
				RawMessage:   "SCALE|SCALE-SMART-01|WORKER=EMP-0042|WEIGHT=28.50|UNIT=kg|ESTATE=GV-TEA-001",
				DeviceID:     "SCALE-SMART-01",
				DeviceCode:   "SCALE-SMART-01",
				WorkerID:     "EMP-0042",
				EmployeeCode: "EMP-0042",
				EstateID:     "GV-TEA-001",
				EstateCode:   "GV-TEA-001",
				Quantity:     28.50,
				Weight:       28.50,
				Unit:         "kg",
				RecordedAt:   now.Add(-15 * time.Minute).Format(time.RFC3339),
			},
		},
	}

	return store
}

func (s *MockCloudStore) genID(prefix string) string {
	s.nextID++
	return fmt.Sprintf("%s-%d", prefix, s.nextID)
}

func (s *MockCloudStore) buildWorkerFromDefaults(jitter bool) WorkerReading {
	cfg := s.settings
	lat := cfg.DefaultLatitude
	lon := cfg.DefaultLongitude
	alt := cfg.DefaultAltitude
	if jitter {
		lat = round6(lat + (rand.Float64()-0.5)*0.001)
		lon = round6(lon + (rand.Float64()-0.5)*0.001)
		alt = round2(alt + (rand.Float64()-0.5)*4.0)
	}
	altCopy := alt
	raw := fmt.Sprintf("WORKER|%s|LAT=%.6f|LON=%.6f|ALT=%.2f|STATUS=%s",
		cfg.TrackerDeviceCode, lat, lon, alt, cfg.DefaultActivityStatus)

	return WorkerReading{
		ID:             s.genID("wrk"),
		RawMessage:     raw,
		DeviceID:       cfg.TrackerDeviceCode,
		DeviceCode:     cfg.TrackerDeviceCode,
		WorkerID:       cfg.DefaultWorkerID,
		EstateID:       cfg.DefaultEstateID,
		RecordedAt:     time.Now().UTC().Format(time.RFC3339),
		Altitude:       alt,
		Location:       &GeoPoint{Latitude: lat, Longitude: lon, Altitude: &altCopy},
		ActivityStatus: cfg.DefaultActivityStatus,
	}
}

func (s *MockCloudStore) buildEnvFromDefaults(jitter bool) EnvironmentReading {
	cfg := s.settings
	temp := cfg.DefaultTemperature
	hum := cfg.DefaultHumidity
	soil := cfg.DefaultSoilMoisture
	if jitter {
		temp = round2(temp + (rand.Float64()-0.5)*1.5)
		hum = round2(hum + (rand.Float64()-0.5)*3.0)
		soil = round2(soil + (rand.Float64()-0.5)*2.0)
	}
	raw := fmt.Sprintf("ENV|%s|TEMP=%.2f|HUM=%.2f|SOIL=%.2f|LAT=%.6f|LON=%.6f",
		cfg.EnvSensorDeviceCode, temp, hum, soil, cfg.DefaultLatitude, cfg.DefaultLongitude)

	return EnvironmentReading{
		ID:           s.genID("env"),
		RawMessage:   raw,
		DeviceID:     cfg.EnvSensorDeviceCode,
		DeviceCode:   cfg.EnvSensorDeviceCode,
		EstateID:     cfg.DefaultEstateID,
		RecordedAt:   time.Now().UTC().Format(time.RFC3339),
		Temperature:  temp,
		Humidity:     hum,
		SoilMoisture: soil,
		Location:     &GeoPoint{Latitude: cfg.DefaultLatitude, Longitude: cfg.DefaultLongitude},
	}
}

func (s *MockCloudStore) buildProductionFromDefaults(jitter bool) ProductionReading {
	cfg := s.settings
	weight := cfg.DefaultHarvestWeight
	if jitter {
		weight = round2(weight + (rand.Float64()-0.5)*5.0)
		if weight < 1 {
			weight = 5.0
		}
	}
	unit := cfg.DefaultHarvestUnit
	if unit == "" {
		unit = "kg"
	}
	raw := fmt.Sprintf("SCALE|%s|WORKER=%s|WEIGHT=%.2f|UNIT=%s|ESTATE=%s",
		cfg.SmartScaleDeviceCode, cfg.DefaultWorkerID, weight, unit, cfg.DefaultEstateID)

	return ProductionReading{
		ID:           s.genID("prd"),
		RawMessage:   raw,
		DeviceID:     cfg.SmartScaleDeviceCode,
		DeviceCode:   cfg.SmartScaleDeviceCode,
		WorkerID:     cfg.DefaultWorkerID,
		EmployeeCode: cfg.DefaultWorkerID,
		EstateID:     cfg.DefaultEstateID,
		EstateCode:   cfg.DefaultEstateID,
		Quantity:     weight,
		Weight:       weight,
		Unit:         unit,
		RecordedAt:   time.Now().UTC().Format(time.RFC3339),
	}
}

func withCORS(next http.HandlerFunc) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Access-Control-Allow-Origin", "*")
		w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE, OPTIONS")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization, X-API-KEY")
		if r.Method == http.MethodOptions {
			w.WriteHeader(http.StatusNoContent)
			return
		}
		next(w, r)
	}
}

func writeJSON(w http.ResponseWriter, status int, data any) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(status)
	_ = json.NewEncoder(w).Encode(data)
}

func applyLimitAndFilter[T any](items []T, r *http.Request, matchEstate func(T, string) bool, matchWorker func(T, string) bool) []T {
	estateID := strings.TrimSpace(r.URL.Query().Get("estateId"))
	workerID := strings.TrimSpace(r.URL.Query().Get("workerId"))
	limitStr := strings.TrimSpace(r.URL.Query().Get("limit"))

	filtered := make([]T, 0, len(items))
	// Return newest first
	for i := len(items) - 1; i >= 0; i-- {
		item := items[i]
		if estateID != "" && matchEstate != nil && !matchEstate(item, estateID) {
			continue
		}
		if workerID != "" && matchWorker != nil && !matchWorker(item, workerID) {
			continue
		}
		filtered = append(filtered, item)
	}

	if limitStr != "" {
		if limit, err := strconv.Atoi(limitStr); err == nil && limit > 0 && limit < len(filtered) {
			filtered = filtered[:limit]
		}
	}
	return filtered
}

func main() {
	store := newMockCloudStore()

	// Background ticker for automatic device transmissions when AutoSimulate is enabled
	go func() {
		lastWorkerTick := time.Now()
		lastEnvTick := time.Now()
		ticker := time.NewTicker(1 * time.Second)
		defer ticker.Stop()

		for now := range ticker.C {
			store.mu.Lock()
			cfg := store.settings
			if cfg.AutoSimulate {
				wInterval := time.Duration(cfg.WorkerIntervalSec) * time.Second
				if wInterval < 2*time.Second {
					wInterval = 2 * time.Second
				}
				if now.Sub(lastWorkerTick) >= wInterval {
					store.workers = append(store.workers, store.buildWorkerFromDefaults(true))
					lastWorkerTick = now
				}

				eInterval := time.Duration(cfg.EnvironmentIntervalSec) * time.Second
				if eInterval < 2*time.Second {
					eInterval = 2 * time.Second
				}
				if now.Sub(lastEnvTick) >= eInterval {
					store.environment = append(store.environment, store.buildEnvFromDefaults(true))
					lastEnvTick = now
				}
			}
			store.mu.Unlock()
		}
	}()

	mux := http.NewServeMux()

	// Health / Overview
	mux.HandleFunc("/health", withCORS(func(w http.ResponseWriter, r *http.Request) {
		store.mu.RLock()
		defer store.mu.RUnlock()
		writeJSON(w, http.StatusOK, map[string]any{
			"status":              "ok",
			"service":             "estate360-iot-mock-cloud",
			"baseStation":         store.settings.BaseStationCode,
			"workerReadings":      len(store.workers),
			"environmentReadings": len(store.environment),
			"productionReadings":  len(store.production),
			"timestamp":           time.Now().UTC().Format(time.RFC3339),
		})
	}))

	// State & Settings endpoint for Frontend UI
	mux.HandleFunc("/api/state", withCORS(func(w http.ResponseWriter, r *http.Request) {
		store.mu.RLock()
		defer store.mu.RUnlock()
		writeJSON(w, http.StatusOK, map[string]any{
			"settings":    store.settings,
			"workers":     store.workers,
			"environment": store.environment,
			"production":  store.production,
		})
	}))

	mux.HandleFunc("/api/settings", withCORS(func(w http.ResponseWriter, r *http.Request) {
		switch r.Method {
		case http.MethodGet:
			store.mu.RLock()
			defer store.mu.RUnlock()
			writeJSON(w, http.StatusOK, store.settings)
		case http.MethodPut, http.MethodPatch, http.MethodPost:
			var updated SimulationSettings
			if err := json.NewDecoder(r.Body).Decode(&updated); err != nil {
				writeJSON(w, http.StatusBadRequest, map[string]string{"error": "invalid JSON payload"})
				return
			}
			store.mu.Lock()
			store.settings = updated
			store.mu.Unlock()
			writeJSON(w, http.StatusOK, updated)
		default:
			w.WriteHeader(http.StatusMethodNotAllowed)
		}
	}))

	// Simulate immediate transmission from any of the 3 devices via the Base Station
	mux.HandleFunc("/api/simulate/", withCORS(func(w http.ResponseWriter, r *http.Request) {
		if r.Method != http.MethodPost {
			w.WriteHeader(http.StatusMethodNotAllowed)
			return
		}
		target := strings.TrimPrefix(r.URL.Path, "/api/simulate/")
		store.mu.Lock()
		defer store.mu.Unlock()

		switch target {
		case "worker":
			item := store.buildWorkerFromDefaults(false)
			store.workers = append(store.workers, item)
			writeJSON(w, http.StatusCreated, item)
		case "environment":
			item := store.buildEnvFromDefaults(false)
			store.environment = append(store.environment, item)
			writeJSON(w, http.StatusCreated, item)
		case "production", "scale":
			item := store.buildProductionFromDefaults(false)
			store.production = append(store.production, item)
			writeJSON(w, http.StatusCreated, item)
		case "clear":
			store.workers = []WorkerReading{}
			store.environment = []EnvironmentReading{}
			store.production = []ProductionReading{}
			writeJSON(w, http.StatusOK, map[string]string{"status": "cleared"})
		default:
			writeJSON(w, http.StatusNotFound, map[string]string{"error": "unknown simulation target"})
		}
	}))

	// Base Station LoRa Raw Packet Ingest (simulates physical base station forwarding LoRa string)
	mux.HandleFunc("/base-station/ingest", withCORS(func(w http.ResponseWriter, r *http.Request) {
		if r.Method != http.MethodPost {
			w.WriteHeader(http.StatusMethodNotAllowed)
			return
		}
		var pkt BaseStationPacket
		if err := json.NewDecoder(r.Body).Decode(&pkt); err != nil {
			writeJSON(w, http.StatusBadRequest, map[string]string{"error": "invalid packet payload"})
			return
		}
		raw := strings.TrimSpace(pkt.RawPacket)
		parts := strings.Split(raw, "|")
		if len(parts) < 2 {
			writeJSON(w, http.StatusBadRequest, map[string]string{"error": "malformed LoRa packet"})
			return
		}

		store.mu.Lock()
		defer store.mu.Unlock()

		nowStr := time.Now().UTC().Format(time.RFC3339)
		prefix := strings.ToUpper(parts[0])
		deviceCode := parts[1]

		switch prefix {
		case "WORKER":
			lat := store.settings.DefaultLatitude
			lon := store.settings.DefaultLongitude
			alt := store.settings.DefaultAltitude
			status := "ACTIVE"
			for _, p := range parts[2:] {
				kv := strings.SplitN(p, "=", 2)
				if len(kv) != 2 {
					continue
				}
				switch kv[0] {
				case "LAT":
					if v, err := strconv.ParseFloat(kv[1], 64); err == nil {
						lat = v
					}
				case "LON":
					if v, err := strconv.ParseFloat(kv[1], 64); err == nil {
						lon = v
					}
				case "ALT":
					if v, err := strconv.ParseFloat(kv[1], 64); err == nil {
						alt = v
					}
				case "STATUS":
					status = kv[1]
				}
			}
			altCopy := alt
			item := WorkerReading{
				ID:             store.genID("wrk"),
				RawMessage:     raw,
				DeviceID:       deviceCode,
				DeviceCode:     deviceCode,
				WorkerID:       store.settings.DefaultWorkerID,
				EstateID:       store.settings.DefaultEstateID,
				RecordedAt:     nowStr,
				Altitude:       alt,
				Location:       &GeoPoint{Latitude: lat, Longitude: lon, Altitude: &altCopy},
				ActivityStatus: status,
			}
			store.workers = append(store.workers, item)
			writeJSON(w, http.StatusCreated, item)

		case "ENV":
			temp := store.settings.DefaultTemperature
			hum := store.settings.DefaultHumidity
			soil := store.settings.DefaultSoilMoisture
			lat := store.settings.DefaultLatitude
			lon := store.settings.DefaultLongitude
			for _, p := range parts[2:] {
				kv := strings.SplitN(p, "=", 2)
				if len(kv) != 2 {
					continue
				}
				if v, err := strconv.ParseFloat(kv[1], 64); err == nil {
					switch kv[0] {
					case "TEMP":
						temp = v
					case "HUM":
						hum = v
					case "SOIL":
						soil = v
					case "LAT":
						lat = v
					case "LON":
						lon = v
					}
				}
			}
			item := EnvironmentReading{
				ID:           store.genID("env"),
				RawMessage:   raw,
				DeviceID:     deviceCode,
				DeviceCode:   deviceCode,
				EstateID:     store.settings.DefaultEstateID,
				RecordedAt:   nowStr,
				Temperature:  temp,
				Humidity:     hum,
				SoilMoisture: soil,
				Location:     &GeoPoint{Latitude: lat, Longitude: lon},
			}
			store.environment = append(store.environment, item)
			writeJSON(w, http.StatusCreated, item)

		case "SCALE", "PRODUCTION":
			workerID := store.settings.DefaultWorkerID
			estateID := store.settings.DefaultEstateID
			weight := store.settings.DefaultHarvestWeight
			unit := store.settings.DefaultHarvestUnit
			for _, p := range parts[2:] {
				kv := strings.SplitN(p, "=", 2)
				if len(kv) != 2 {
					continue
				}
				switch kv[0] {
				case "WORKER", "WORKER_ID":
					workerID = kv[1]
				case "ESTATE", "ESTATE_ID":
					estateID = kv[1]
				case "WEIGHT", "QTY", "QUANTITY":
					if v, err := strconv.ParseFloat(kv[1], 64); err == nil {
						weight = v
					}
				case "UNIT":
					unit = kv[1]
				}
			}
			item := ProductionReading{
				ID:           store.genID("prd"),
				RawMessage:   raw,
				DeviceID:     deviceCode,
				DeviceCode:   deviceCode,
				WorkerID:     workerID,
				EmployeeCode: workerID,
				EstateID:     estateID,
				EstateCode:   estateID,
				Quantity:     weight,
				Weight:       weight,
				Unit:         unit,
				RecordedAt:   nowStr,
			}
			store.production = append(store.production, item)
			writeJSON(w, http.StatusCreated, item)

		default:
			writeJSON(w, http.StatusBadRequest, map[string]string{"error": "unsupported packet prefix (use WORKER, ENV, or SCALE)"})
		}
	}))

	// 1. Worker Tracker Readings Endpoint: /readings/workers (and /readings/workers/{id})
	handleWorkers := withCORS(func(w http.ResponseWriter, r *http.Request) {
		id := strings.TrimPrefix(r.URL.Path, "/readings/workers")
		id = strings.TrimPrefix(id, "/")

		switch r.Method {
		case http.MethodGet:
			store.mu.RLock()
			defer store.mu.RUnlock()
			result := applyLimitAndFilter(store.workers, r,
				func(item WorkerReading, estateID string) bool {
					return item.EstateID == "" || strings.EqualFold(item.EstateID, estateID)
				},
				func(item WorkerReading, workerID string) bool {
					return item.WorkerID == "" || strings.EqualFold(item.WorkerID, workerID)
				},
			)
			writeJSON(w, http.StatusOK, result)

		case http.MethodPost:
			var item WorkerReading
			if err := json.NewDecoder(r.Body).Decode(&item); err != nil {
				writeJSON(w, http.StatusBadRequest, map[string]string{"error": "invalid payload"})
				return
			}
			store.mu.Lock()
			if item.ID == "" {
				item.ID = store.genID("wrk")
			}
			if item.DeviceCode == "" {
				item.DeviceCode = item.DeviceID
			}
			if item.DeviceID == "" {
				item.DeviceID = item.DeviceCode
			}
			if item.RecordedAt == "" {
				item.RecordedAt = time.Now().UTC().Format(time.RFC3339)
			}
			if item.ActivityStatus == "" {
				item.ActivityStatus = "ACTIVE"
			}
			if item.Location != nil && item.Location.Altitude == nil {
				altCopy := item.Altitude
				item.Location.Altitude = &altCopy
			}
			if item.RawMessage == "" && item.Location != nil {
				item.RawMessage = fmt.Sprintf("WORKER|%s|LAT=%.6f|LON=%.6f|ALT=%.2f|STATUS=%s",
					item.DeviceCode, item.Location.Latitude, item.Location.Longitude, item.Altitude, item.ActivityStatus)
			}
			store.workers = append(store.workers, item)
			store.mu.Unlock()
			writeJSON(w, http.StatusCreated, item)

		case http.MethodPut, http.MethodPatch:
			var updated WorkerReading
			if err := json.NewDecoder(r.Body).Decode(&updated); err != nil {
				writeJSON(w, http.StatusBadRequest, map[string]string{"error": "invalid payload"})
				return
			}
			targetID := id
			if targetID == "" {
				targetID = updated.ID
			}
			store.mu.Lock()
			defer store.mu.Unlock()
			for i := range store.workers {
				if store.workers[i].ID == targetID {
					updated.ID = targetID
					if updated.DeviceCode == "" {
						updated.DeviceCode = updated.DeviceID
					}
					if updated.DeviceID == "" {
						updated.DeviceID = updated.DeviceCode
					}
					if updated.RecordedAt == "" {
						updated.RecordedAt = store.workers[i].RecordedAt
					}
					if updated.Location != nil {
						altCopy := updated.Altitude
						updated.Location.Altitude = &altCopy
						updated.RawMessage = fmt.Sprintf("WORKER|%s|LAT=%.6f|LON=%.6f|ALT=%.2f|STATUS=%s",
							updated.DeviceCode, updated.Location.Latitude, updated.Location.Longitude, updated.Altitude, updated.ActivityStatus)
					}
					store.workers[i] = updated
					writeJSON(w, http.StatusOK, updated)
					return
				}
			}
			writeJSON(w, http.StatusNotFound, map[string]string{"error": "reading not found"})

		case http.MethodDelete:
			targetID := id
			if targetID == "" {
				targetID = r.URL.Query().Get("id")
			}
			store.mu.Lock()
			defer store.mu.Unlock()
			for i := range store.workers {
				if store.workers[i].ID == targetID {
					store.workers = append(store.workers[:i], store.workers[i+1:]...)
					writeJSON(w, http.StatusOK, map[string]string{"deleted": targetID})
					return
				}
			}
			writeJSON(w, http.StatusNotFound, map[string]string{"error": "reading not found"})

		default:
			w.WriteHeader(http.StatusMethodNotAllowed)
		}
	})
	mux.HandleFunc("/readings/workers", handleWorkers)
	mux.HandleFunc("/readings/workers/", handleWorkers)

	// 2. Environmental Sensor Readings Endpoint: /readings/environment (and /readings/environment/{id})
	handleEnvironment := withCORS(func(w http.ResponseWriter, r *http.Request) {
		id := strings.TrimPrefix(r.URL.Path, "/readings/environment")
		id = strings.TrimPrefix(id, "/")

		switch r.Method {
		case http.MethodGet:
			store.mu.RLock()
			defer store.mu.RUnlock()
			result := applyLimitAndFilter(store.environment, r,
				func(item EnvironmentReading, estateID string) bool {
					return item.EstateID == "" || strings.EqualFold(item.EstateID, estateID)
				},
				nil,
			)
			writeJSON(w, http.StatusOK, result)

		case http.MethodPost:
			var item EnvironmentReading
			if err := json.NewDecoder(r.Body).Decode(&item); err != nil {
				writeJSON(w, http.StatusBadRequest, map[string]string{"error": "invalid payload"})
				return
			}
			store.mu.Lock()
			if item.ID == "" {
				item.ID = store.genID("env")
			}
			if item.DeviceCode == "" {
				item.DeviceCode = item.DeviceID
			}
			if item.DeviceID == "" {
				item.DeviceID = item.DeviceCode
			}
			if item.RecordedAt == "" {
				item.RecordedAt = time.Now().UTC().Format(time.RFC3339)
			}
			if item.RawMessage == "" {
				lat, lon := 0.0, 0.0
				if item.Location != nil {
					lat = item.Location.Latitude
					lon = item.Location.Longitude
				}
				item.RawMessage = fmt.Sprintf("ENV|%s|TEMP=%.2f|HUM=%.2f|SOIL=%.2f|LAT=%.6f|LON=%.6f",
					item.DeviceCode, item.Temperature, item.Humidity, item.SoilMoisture, lat, lon)
			}
			store.environment = append(store.environment, item)
			store.mu.Unlock()
			writeJSON(w, http.StatusCreated, item)

		case http.MethodPut, http.MethodPatch:
			var updated EnvironmentReading
			if err := json.NewDecoder(r.Body).Decode(&updated); err != nil {
				writeJSON(w, http.StatusBadRequest, map[string]string{"error": "invalid payload"})
				return
			}
			targetID := id
			if targetID == "" {
				targetID = updated.ID
			}
			store.mu.Lock()
			defer store.mu.Unlock()
			for i := range store.environment {
				if store.environment[i].ID == targetID {
					updated.ID = targetID
					if updated.DeviceCode == "" {
						updated.DeviceCode = updated.DeviceID
					}
					if updated.DeviceID == "" {
						updated.DeviceID = updated.DeviceCode
					}
					if updated.RecordedAt == "" {
						updated.RecordedAt = store.environment[i].RecordedAt
					}
					lat, lon := 0.0, 0.0
					if updated.Location != nil {
						lat = updated.Location.Latitude
						lon = updated.Location.Longitude
					}
					updated.RawMessage = fmt.Sprintf("ENV|%s|TEMP=%.2f|HUM=%.2f|SOIL=%.2f|LAT=%.6f|LON=%.6f",
						updated.DeviceCode, updated.Temperature, updated.Humidity, updated.SoilMoisture, lat, lon)
					store.environment[i] = updated
					writeJSON(w, http.StatusOK, updated)
					return
				}
			}
			writeJSON(w, http.StatusNotFound, map[string]string{"error": "reading not found"})

		case http.MethodDelete:
			targetID := id
			if targetID == "" {
				targetID = r.URL.Query().Get("id")
			}
			store.mu.Lock()
			defer store.mu.Unlock()
			for i := range store.environment {
				if store.environment[i].ID == targetID {
					store.environment = append(store.environment[:i], store.environment[i+1:]...)
					writeJSON(w, http.StatusOK, map[string]string{"deleted": targetID})
					return
				}
			}
			writeJSON(w, http.StatusNotFound, map[string]string{"error": "reading not found"})

		default:
			w.WriteHeader(http.StatusMethodNotAllowed)
		}
	})
	mux.HandleFunc("/readings/environment", handleEnvironment)
	mux.HandleFunc("/readings/environment/", handleEnvironment)

	// 3. Smart Scale Daily Production Readings Endpoint: /readings/production (and /readings/production/{id})
	handleProduction := withCORS(func(w http.ResponseWriter, r *http.Request) {
		id := strings.TrimPrefix(r.URL.Path, "/readings/production")
		id = strings.TrimPrefix(id, "/")

		switch r.Method {
		case http.MethodGet:
			store.mu.RLock()
			defer store.mu.RUnlock()
			result := applyLimitAndFilter(store.production, r,
				func(item ProductionReading, estateID string) bool {
					return item.EstateID == "" || strings.EqualFold(item.EstateID, estateID) || strings.EqualFold(item.EstateCode, estateID)
				},
				func(item ProductionReading, workerID string) bool {
					return item.WorkerID == "" || strings.EqualFold(item.WorkerID, workerID) || strings.EqualFold(item.EmployeeCode, workerID)
				},
			)
			writeJSON(w, http.StatusOK, result)

		case http.MethodPost:
			var item ProductionReading
			if err := json.NewDecoder(r.Body).Decode(&item); err != nil {
				writeJSON(w, http.StatusBadRequest, map[string]string{"error": "invalid payload"})
				return
			}
			store.mu.Lock()
			if item.ID == "" {
				item.ID = store.genID("prd")
			}
			if item.DeviceCode == "" {
				item.DeviceCode = item.DeviceID
			}
			if item.DeviceID == "" {
				item.DeviceID = item.DeviceCode
			}
			if item.Quantity <= 0 && item.Weight > 0 {
				item.Quantity = item.Weight
			}
			if item.Weight <= 0 && item.Quantity > 0 {
				item.Weight = item.Quantity
			}
			if item.EmployeeCode == "" {
				item.EmployeeCode = item.WorkerID
			}
			if item.WorkerID == "" {
				item.WorkerID = item.EmployeeCode
			}
			if item.EstateCode == "" {
				item.EstateCode = item.EstateID
			}
			if item.EstateID == "" {
				item.EstateID = item.EstateCode
			}
			if item.Unit == "" {
				item.Unit = "kg"
			}
			if item.RecordedAt == "" {
				item.RecordedAt = time.Now().UTC().Format(time.RFC3339)
			}
			if item.RawMessage == "" {
				item.RawMessage = fmt.Sprintf("SCALE|%s|WORKER=%s|WEIGHT=%.2f|UNIT=%s|ESTATE=%s",
					item.DeviceCode, item.WorkerID, item.Quantity, item.Unit, item.EstateID)
			}
			store.production = append(store.production, item)
			store.mu.Unlock()
			writeJSON(w, http.StatusCreated, item)

		case http.MethodPut, http.MethodPatch:
			var updated ProductionReading
			if err := json.NewDecoder(r.Body).Decode(&updated); err != nil {
				writeJSON(w, http.StatusBadRequest, map[string]string{"error": "invalid payload"})
				return
			}
			targetID := id
			if targetID == "" {
				targetID = updated.ID
			}
			store.mu.Lock()
			defer store.mu.Unlock()
			for i := range store.production {
				if store.production[i].ID == targetID {
					updated.ID = targetID
					if updated.DeviceCode == "" {
						updated.DeviceCode = updated.DeviceID
					}
					if updated.DeviceID == "" {
						updated.DeviceID = updated.DeviceCode
					}
					if updated.Quantity <= 0 && updated.Weight > 0 {
						updated.Quantity = updated.Weight
					}
					if updated.Weight <= 0 && updated.Quantity > 0 {
						updated.Weight = updated.Quantity
					}
					if updated.EmployeeCode == "" {
						updated.EmployeeCode = updated.WorkerID
					}
					if updated.EstateCode == "" {
						updated.EstateCode = updated.EstateID
					}
					if updated.Unit == "" {
						updated.Unit = "kg"
					}
					if updated.RecordedAt == "" {
						updated.RecordedAt = store.production[i].RecordedAt
					}
					updated.RawMessage = fmt.Sprintf("SCALE|%s|WORKER=%s|WEIGHT=%.2f|UNIT=%s|ESTATE=%s",
						updated.DeviceCode, updated.WorkerID, updated.Quantity, updated.Unit, updated.EstateID)
					store.production[i] = updated
					writeJSON(w, http.StatusOK, updated)
					return
				}
			}
			writeJSON(w, http.StatusNotFound, map[string]string{"error": "reading not found"})

		case http.MethodDelete:
			targetID := id
			if targetID == "" {
				targetID = r.URL.Query().Get("id")
			}
			store.mu.Lock()
			defer store.mu.Unlock()
			for i := range store.production {
				if store.production[i].ID == targetID {
					store.production = append(store.production[:i], store.production[i+1:]...)
					writeJSON(w, http.StatusOK, map[string]string{"deleted": targetID})
					return
				}
			}
			writeJSON(w, http.StatusNotFound, map[string]string{"error": "reading not found"})

		default:
			w.WriteHeader(http.StatusMethodNotAllowed)
		}
	})
	mux.HandleFunc("/readings/production", handleProduction)
	mux.HandleFunc("/readings/production/", handleProduction)

	// Serve Embedded Static Frontend at /
	staticFS, err := fs.Sub(staticFiles, "static")
	if err != nil {
		log.Fatalf("Failed to mount embedded static directory: %v", err)
	}
	mux.Handle("/", http.FileServer(http.FS(staticFS)))

	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	addr := ":" + port
	log.Printf("Estate360 Mock IoT Cloud Server listening on http://localhost%s", addr)
	log.Printf("  - Dashboard UI:            http://localhost%s/", addr)
	log.Printf("  - Worker Tracker (10m):    http://localhost%s/readings/workers", addr)
	log.Printf("  - Env Sensor (1h):         http://localhost%s/readings/environment", addr)
	log.Printf("  - Smart Scale Production:  http://localhost%s/readings/production", addr)
	if err := http.ListenAndServe(addr, mux); err != nil {
		log.Fatalf("Server failed: %v", err)
	}
}
