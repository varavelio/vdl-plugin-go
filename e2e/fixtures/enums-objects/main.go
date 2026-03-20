package main

import (
	"encoding/json"
	"fixture/gen"

	"varavel.com/testutil"
)

func main() {
	value := gen.Envelope{
		Status:    gen.StatusActive,
		OptStatus: gen.Ptr(gen.StatusUnknown),
		Priority:  gen.PriorityHigh,
		Statuses:  []gen.Status{gen.StatusUnknown, gen.StatusDisabled},
		Nested: gen.EnvelopeNested{
			Status: gen.StatusDisabled,
		},
	}

	testutil.MustJSON(
		"Envelope json",
		value,
		`{
			"status": "active",
			"optStatus": "",
			"priority": 9,
			"statuses": ["", "disabled"],
			"nested": {
				"status": "disabled"
			}
		}`,
	)

	testutil.MustEqual("GetStatus", value.GetStatus(), gen.StatusActive)
	testutil.MustEqual("GetOptStatus", value.GetOptStatus(), gen.StatusUnknown)
	testutil.MustEqual("GetPriority", value.GetPriority(), gen.PriorityHigh)
	testutil.MustEqual("GetStatuses", value.GetStatuses(), []gen.Status{gen.StatusUnknown, gen.StatusDisabled})
	nested := value.GetNested()
	testutil.MustEqual("nested GetStatus", nested.GetStatus(), gen.StatusDisabled)

	var nilValue *gen.Envelope
	testutil.MustEqual("nil GetStatus", nilValue.GetStatus(), gen.StatusUnknown)
	testutil.MustEqual("nil GetPriorityOr", nilValue.GetPriorityOr(gen.PriorityLow), gen.PriorityLow)

	_, err := json.Marshal(gen.Envelope{
		Status:   gen.Status("ghost"),
		Priority: gen.PriorityLow,
		Statuses: []gen.Status{},
		Nested:   gen.EnvelopeNested{Status: gen.StatusUnknown},
	})
	testutil.MustErrContains(
		"Envelope invalid marshal",
		err,
		`cannot marshal invalid value "ghost" for enum Status`,
	)
}
