package main

import (
	"encoding/json"
	"fixture/gen"

	"varavel.com/testutil"
)

func main() {
	var payload gen.Payload
	err := json.Unmarshal([]byte(`{
		"name": "demo",
		"status": "ready",
		"items": [{"id": "item-1", "status": "paused"}],
		"statusesByName": {"primary": "ready"},
		"note": "hello"
	}`), &payload)
	testutil.MustNoError("Unmarshal valid payload", err)
	testutil.MustEqual("Payload status", payload.Status, gen.StatusReady)
	testutil.MustEqual("Payload item status", payload.Items[0].Status, gen.StatusPaused)
	testutil.MustEqual(
		"Payload map status",
		payload.StatusesByName["primary"],
		gen.StatusReady,
	)
	testutil.MustJSON(
		"Marshal valid payload",
		payload,
		`{
			"name": "demo",
			"status": "ready",
			"items": [{"id": "item-1", "status": "paused"}],
			"statusesByName": {"primary": "ready"},
			"note": "hello"
		}`,
	)

	err = json.Unmarshal([]byte(`{"status":"ready","items":[],"statusesByName":{}}`), &payload)
	testutil.MustErrContains(
		"Unmarshal missing required field",
		err,
		"field name is required",
	)

	err = json.Unmarshal(
		[]byte(`{"name":"demo","status":"ghost","items":[],"statusesByName":{}}`),
		&payload,
	)
	testutil.MustErrContains(
		"Unmarshal invalid enum",
		err,
		`invalid value "ghost" for enum Status`,
	)

	invalidCollection := gen.Payload{
		Name:   "demo",
		Status: gen.StatusReady,
	}
	testutil.MustJSON(
		"Marshal zero-value required collections",
		invalidCollection,
		`{
			"name": "demo",
			"status": "ready",
			"items": null,
			"statusesByName": null
		}`,
	)

	invalidItem := gen.Payload{
		Name:   "demo",
		Status: gen.StatusReady,
		Items: []gen.PayloadItems{{
			Id:     "item-1",
			Status: gen.Status("ghost"),
		}},
		StatusesByName: map[string]gen.Status{"primary": gen.StatusReady},
	}
	_, err = json.Marshal(invalidItem)
	testutil.MustErrContains(
		"Marshal invalid nested item",
		err,
		`cannot marshal invalid value "ghost" for enum Status`,
	)

	invalidMap := gen.Payload{
		Name:   "demo",
		Status: gen.StatusReady,
		Items: []gen.PayloadItems{{
			Id:     "item-1",
			Status: gen.StatusReady,
		}},
		StatusesByName: map[string]gen.Status{"primary": gen.Status("ghost")},
	}
	_, err = json.Marshal(invalidMap)
	testutil.MustErrContains(
		"Marshal invalid map value",
		err,
		`cannot marshal invalid value "ghost" for enum Status`,
	)
}
