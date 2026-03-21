package main

import (
	"encoding/json"
	"fixture/gen"
	"varavel.com/testutil"
)

func main() {
	// 1. Valid Unmarshal
	var u gen.User
	err := json.Unmarshal([]byte(`{"id": "1", "status": "Active", "roles": ["Active", "Inactive"]}`), &u)
	testutil.MustNoError("valid user unmarshal", err)
	testutil.MustEqual("user id", u.Id, "1")
	testutil.MustEqual("user status", u.Status, gen.StatusActive)
	testutil.MustEqual("user roles count", len(u.Roles), 2)

	// 2. Invalid Enum Value (Direct)
	err = json.Unmarshal([]byte(`{"id": "1", "status": "Invalid"}`), &u)
	testutil.MustErrContains("invalid enum status", err, "invalid value \"Invalid\" for Status enum")

	// 3. Invalid Enum Value (In Array)
	err = json.Unmarshal([]byte(`{"id": "1", "status": "Active", "roles": ["Active", "Oops"]}`), &u)
	testutil.MustErrContains("invalid enum role", err, "invalid value \"Oops\" for Status enum")

	// 4. Missing Required Enum Field
	err = json.Unmarshal([]byte(`{"id": "1"}`), &u)
	testutil.MustErrContains("missing status field", err, "field status is required")

	// 5. Nested Registry Validation
	var r gen.Registry
	err = json.Unmarshal([]byte(`{
		"users": {
			"alice": {
				"id": "1",
				"status": "Active",
				"roles": ["Active"]
			},
			"bob": {
				"id": "2",
				"roles": ["Active"]
			}
		}
	}`), &r)
	testutil.MustErrContains("nested missing status", err, `field users["bob"].status is required`)

	// 6. Invalid Nested Enum Value in Map
	err = json.Unmarshal([]byte(`{
		"users": {
			"alice": {
				"id": "1",
				"status": "Active",
				"roles": ["Bad"]
			}
		}
	}`), &r)
	testutil.MustErrContains("nested invalid enum", err, `invalid value "Bad" for Status enum`)
}
