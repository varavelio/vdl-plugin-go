package main

import (
	"encoding/json"
	"fixture/gen"

	"varavel.com/testutil"
)

func main() {
	var value gen.Event
	err := json.Unmarshal([]byte(`{
		"id": "evt-1",
		"statuses": ["ready", "failed"],
		"byId": {
			"first": "ready",
			"second": "failed"
		},
		"nested": {
			"statuses": ["ready"],
			"byId": {
				"nested": "ready"
			}
		}
	}`), &value)
	testutil.MustNoError("unmarshal valid aliases", err)
	testutil.MustEqual("GetStatuses", value.GetStatuses(), gen.StatusValues{gen.StatusReady, gen.StatusFailed})
	testutil.MustEqual("GetById", value.GetById()["second"], gen.StatusFailed)
	testutil.MustEqual("nested statuses", value.Nested.Statuses[0], gen.StatusReady)
	testutil.MustEqual("nested map", value.Nested.ById["nested"], gen.StatusReady)

	err = json.Unmarshal([]byte(`{
		"id": "evt-2",
		"statuses": ["ghost"],
		"byId": {},
		"nested": {
			"statuses": [],
			"byId": {}
		}
	}`), &value)
	testutil.MustErrContains("invalid enum in alias list", err, `invalid value "ghost" for enum Status`)

	err = json.Unmarshal([]byte(`{
		"id": "evt-3",
		"statuses": ["ready"],
		"byId": {
			"first": "ghost"
		},
		"nested": {
			"statuses": [],
			"byId": {}
		}
	}`), &value)
	testutil.MustErrContains("invalid enum in alias map", err, `invalid value "ghost" for enum Status`)

	invalid := gen.Event{
		Id:       "evt-4",
		Statuses: gen.StatusValues{gen.StatusReady, gen.Status("ghost")},
		ById:     gen.StatusById{"first": gen.StatusReady},
		Nested: gen.EventNested{
			Statuses: gen.StatusValues{},
			ById:     gen.StatusById{},
		},
	}
	_, err = json.Marshal(invalid)
	testutil.MustErrContains("marshal invalid alias list", err, `cannot marshal invalid value "ghost" for enum Status`)

	invalidNested := gen.Event{
		Id:       "evt-5",
		Statuses: gen.StatusValues{gen.StatusReady},
		ById:     gen.StatusById{"first": gen.StatusReady},
		Nested: gen.EventNested{
			Statuses: gen.StatusValues{gen.StatusReady},
			ById:     gen.StatusById{"nested": gen.Status("ghost")},
		},
	}
	_, err = json.Marshal(invalidNested)
	testutil.MustErrContains("marshal invalid alias nested map", err, `cannot marshal invalid value "ghost" for enum Status`)
}
