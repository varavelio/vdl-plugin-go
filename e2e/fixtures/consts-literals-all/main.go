package main

import (
	"fixture/gen"
	"fmt"
	"varavel.com/testutil"
)

func main() {
	// Primitives
	testutil.MustEqual("strVal", gen.StrVal, "hello")

	// Use fmt.Sprintf to avoid direct literal comparison issues if needed,
	// but MustEqual should work if types match.
	// In Go, untyped constants will be assigned a default type.
	var i int64 = gen.IntVal
	testutil.MustEqual("intVal", i, int64(42))

	var f float64 = gen.FloatVal
	testutil.MustEqual("floatVal", f, 3.14)

	testutil.MustEqual("boolVal", gen.BoolVal, true)

	// Arrays
	testutil.MustEqual("strArray", gen.StrArray[0], "a")
	testutil.MustEqual("intArray", gen.IntArray[2], int64(3))

	// Objects
	testutil.MustEqual("simpleObj.name", gen.SimpleObj.Name, "VDL")
	testutil.MustEqual("nestedObj.metadata.owner", gen.NestedObj.Metadata.Owner, "admin")

	// References
	testutil.MustEqual("anotherInt", int64(gen.AnotherInt), int64(42))
	testutil.MustEqual("enumRef", string(gen.EnumRef), "Red")

	// Spreads
	testutil.MustEqual("extended.a", gen.Extended.A, int64(1))
	testutil.MustEqual("extended.c", gen.Extended.C, int64(3))

	fmt.Println("All consts-literals-all tests passed")
}
