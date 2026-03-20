package main

import (
	"encoding/json"
	"fixture/gen"
	"reflect"

	"varavel.com/testutil"
)

func main() {
	var _ string = gen.DefaultStatus
	var _ string = gen.CopiedStatus
	var _ int64 = gen.DefaultPriority

	testutil.MustEqual("DefaultStatus raw value", gen.DefaultStatus, "active")
	testutil.MustEqual("CopiedStatus raw value", gen.CopiedStatus, "active")
	testutil.MustEqual("DefaultPriority raw value", gen.DefaultPriority, 9)

	testutil.MustEqual("DefaultStatus runtime type", reflect.TypeOf(any(gen.DefaultStatus)).String(), "string")
	testutil.MustEqual("DefaultPriority runtime type", reflect.TypeOf(any(gen.DefaultPriority)).String(), "int")

	testutil.MustEqual("DefaultStatus enum conversion", gen.Status(gen.DefaultStatus), gen.StatusActive)
	testutil.MustEqual("CopiedStatus enum conversion", gen.Status(gen.CopiedStatus), gen.StatusActive)
	testutil.MustEqual("DefaultPriority enum conversion", gen.Priority(gen.DefaultPriority), gen.PriorityHigh)
	testutil.MustEqual("DefaultStatus is valid", gen.Status(gen.DefaultStatus).IsValid(), true)
	testutil.MustEqual("DefaultPriority string", gen.Priority(gen.DefaultPriority).String(), "High")
	testutil.MustJSON("DefaultStatus json", gen.Status(gen.DefaultStatus), `"active"`)
	_, err := json.Marshal(gen.Status("ghost"))
	testutil.MustErrContains("invalid enum marshal", err, `cannot marshal invalid value "ghost" for enum Status`)
}
