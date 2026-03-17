package main

import (
	"encoding/json"
	"fixture/gen"

	"varavel.com/testutil"
)

func main() {
	states := gen.StatusGroup{gen.StatusUnknown, gen.StatusActive, gen.StatusDisabled}
	lookup := gen.StatusLookup{"default": gen.StatusActive}

	testutil.MustJSON("StatusGroup json", states, `[
		"",
		"active",
		"disabled"
	]`)
	testutil.MustJSON("StatusLookup json", lookup, `{
		"default": "active"
	}`)
	testutil.MustJSON("StatusGroup zero json", gen.StatusGroup(nil), `null`)
	testutil.MustJSON("StatusLookup zero json", gen.StatusLookup(nil), `null`)

	var decodedStates gen.StatusGroup
	err := json.Unmarshal([]byte(`["","disabled"]`), &decodedStates)
	testutil.MustNoError("StatusGroup valid", err)
	testutil.MustEqual("StatusGroup value", decodedStates, gen.StatusGroup{gen.StatusUnknown, gen.StatusDisabled})

	var decodedLookup gen.StatusLookup
	err = json.Unmarshal([]byte(`{"primary":"active"}`), &decodedLookup)
	testutil.MustNoError("StatusLookup valid", err)
	testutil.MustEqual("StatusLookup value", decodedLookup, gen.StatusLookup{"primary": gen.StatusActive})

	_, err = json.Marshal(gen.StatusGroup{gen.Status("ghost")})
	testutil.MustErrContains("StatusGroup invalid marshal", err, "cannot marshal invalid value for enum Status")
	err = json.Unmarshal([]byte(`["ghost"]`), &decodedStates)
	testutil.MustErrContains("StatusGroup invalid unmarshal", err, "invalid value for enum Status")
	err = json.Unmarshal([]byte(`{"bad":"ghost"}`), &decodedLookup)
	testutil.MustErrContains("StatusLookup invalid unmarshal", err, "invalid value for enum Status")
}
