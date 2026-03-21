package main

import (
	"fixture/gen"
	"varavel.com/testutil"
)

func main() {
	_, ok := gen.VDLMetadata.GetEnum("Status")
	testutil.MustEqual("Enum Status ok", ok, true)

	_, ok = gen.VDLMetadata.GetType("User")
	testutil.MustEqual("Type User ok", ok, true)
}
