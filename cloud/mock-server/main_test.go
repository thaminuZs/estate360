package main

import (
	"bytes"
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"testing"
)

func TestMockCloudStoreDefaults(t *testing.T) {
	store := newMockCloudStore()
	if len(store.workers) != 2 {
		t.Fatalf("expected 2 initial worker readings, got %d", len(store.workers))
	}
	if len(store.environment) != 2 {
		t.Fatalf("expected 2 initial environment readings, got %d", len(store.environment))
	}
	if len(store.production) != 1 {
		t.Fatalf("expected 1 initial production reading, got %d", len(store.production))
	}
	if store.workers[0].Altitude <= 0 {
		t.Fatalf("expected positive altitude on worker reading, got %f", store.workers[0].Altitude)
	}
}

func TestApplyLimitAndFilter(t *testing.T) {
	store := newMockCloudStore()
	req := httptest.NewRequest(http.MethodGet, "/readings/workers?estateId=GV-TEA-001&limit=1", nil)
	res := applyLimitAndFilter(store.workers, req,
		func(item WorkerReading, estateID string) bool { return item.EstateID == estateID },
		nil,
	)
	if len(res) != 1 {
		t.Fatalf("expected 1 filtered reading, got %d", len(res))
	}

	body, _ := json.Marshal(res)
	if !bytes.Contains(body, []byte("altitude")) {
		t.Fatalf("expected altitude field in serialized JSON: %s", string(body))
	}
}
