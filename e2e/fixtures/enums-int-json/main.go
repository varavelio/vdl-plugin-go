package main

import (
	"encoding/json"
	"fixture/gen"

	"varavel.com/testutil"
)

func main() {
	testutil.MustEqual("list", gen.PriorityList, []gen.Priority{
		gen.PriorityLow,
		gen.PriorityHigh,
		gen.PriorityUrgent,
	})

	testutil.MustEqual("String zero", gen.PriorityLow.String(), "Low")
	testutil.MustEqual("String explicit", gen.PriorityUrgent.String(), "Urgent")
	testutil.MustEqual("String invalid", gen.Priority(1).String(), "Priority(1)")
	testutil.MustEqual("IsValid true", gen.PriorityHigh.IsValid(), true)
	testutil.MustEqual("IsValid false", gen.Priority(1).IsValid(), false)

	testutil.MustJSON("Marshal known value", gen.PriorityHigh, `5`)
	_, err := json.Marshal(gen.Priority(1))
	testutil.MustErrContains("Marshal invalid value", err, "cannot marshal invalid value for enum Priority")

	var decoded gen.Priority
	err = json.Unmarshal([]byte(`9`), &decoded)
	testutil.MustNoError("Unmarshal valid", err)
	testutil.MustEqual("Unmarshal valid value", decoded, gen.PriorityUrgent)

	err = json.Unmarshal([]byte(`1`), &decoded)
	testutil.MustErrContains("Unmarshal invalid value", err, "invalid value for enum Priority")
	err = json.Unmarshal([]byte(`"high"`), &decoded)
	testutil.MustErrContains("Unmarshal wrong type", err, "cannot unmarshal string into Go value of type int")
}
