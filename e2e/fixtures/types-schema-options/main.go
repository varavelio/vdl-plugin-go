package main

import (
	"encoding/json"
	"fixture/gen"

	"varavel.com/testutil"
)

func main() {
	var payload gen.Payload
	err := json.Unmarshal([]byte(`{"status":"ghost"}`), &payload)
	testutil.MustNoError("strict false unmarshal", err)
	testutil.MustEqual("strict false name", payload.Name, "")
	testutil.MustEqual("strict false status", payload.Status, gen.Status("ghost"))
	testutil.MustEqual("strict false items", payload.Items, []string(nil))

	encoded, err := json.Marshal(gen.Payload{Status: gen.Status("ghost")})
	testutil.MustNoError("strict false marshal", err)
	testutil.MustEqual(
		"strict false json",
		string(encoded),
		`{"name":"","status":"ghost","items":null}`,
	)
}
