package main

import (
	"encoding/json"
	"fixture/gen"

	"varavel.com/testutil"
)

func main() {
	testutil.MustEqual("list", gen.DeliveryStateList, []gen.DeliveryState{
		gen.DeliveryStateUnknown,
		gen.DeliveryStatePending,
		gen.DeliveryStateInTransit,
	})

	testutil.MustEqual("String implicit", gen.DeliveryStatePending.String(), "Pending")
	testutil.MustEqual("String explicit", gen.DeliveryStateInTransit.String(), "in-transit")
	testutil.MustEqual("String invalid", gen.DeliveryState("ghost").String(), "ghost")
	testutil.MustEqual("IsValid true", gen.DeliveryStateUnknown.IsValid(), true)
	testutil.MustEqual("IsValid false", gen.DeliveryState("ghost").IsValid(), false)

	testutil.MustJSON("Marshal known value", gen.DeliveryStateInTransit, `"in-transit"`)
	_, err := json.Marshal(gen.DeliveryState("ghost"))
	testutil.MustErrContains("Marshal invalid value", err, `cannot marshal invalid value "ghost" for DeliveryState enum`)

	var decoded gen.DeliveryState
	err = json.Unmarshal([]byte(`"Pending"`), &decoded)
	testutil.MustNoError("Unmarshal valid", err)
	testutil.MustEqual("Unmarshal valid value", decoded, gen.DeliveryStatePending)

	err = json.Unmarshal([]byte(`"ghost"`), &decoded)
	testutil.MustErrContains("Unmarshal invalid value", err, `invalid value "ghost" for DeliveryState enum`)
	err = json.Unmarshal([]byte(`123`), &decoded)
	testutil.MustErrContains("Unmarshal wrong type", err, "cannot unmarshal number into Go value of type string")
}
