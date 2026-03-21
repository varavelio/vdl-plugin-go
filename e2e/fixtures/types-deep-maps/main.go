package main

import (
	"fixture/gen"
	"varavel.com/testutil"
)

func main() {
	testutil.MustEqual("Item 0 ID", gen.SampleMatrix.Deep.Outer.Middle.Inner[0].Id, "1")
	testutil.MustEqual("Item 0 Status", string(gen.SampleMatrix.Deep.Outer.Middle.Inner[0].Status), "Active")
	
	testutil.MustEqual("Item 1 ID", gen.SampleMatrix.Deep.Outer.Middle.Inner[1].Id, "2")
	testutil.MustEqual("Item 1 Status", string(gen.SampleMatrix.Deep.Outer.Middle.Inner[1].Status), "Inactive")
}
