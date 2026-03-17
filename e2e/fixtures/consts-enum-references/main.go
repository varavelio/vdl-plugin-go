package main

import (
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
}
