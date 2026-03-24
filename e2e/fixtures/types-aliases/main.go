package main

import (
	"fixture/gen"
	"reflect"
	"varavel.com/testutil"
)

func main() {
	// Test types exist and have correct underlying types
	testutil.MustEqual("StringAlias", reflect.TypeOf(gen.StringAlias("")).Kind(), reflect.String)
	testutil.MustEqual("IntAlias", reflect.TypeOf(gen.IntAlias(0)).Kind(), reflect.Int64)
	testutil.MustEqual("FloatAlias", reflect.TypeOf(gen.FloatAlias(0)).Kind(), reflect.Float64)
	testutil.MustEqual("BoolAlias", reflect.TypeOf(gen.BoolAlias(true)).Kind(), reflect.Bool)

	// Test collection aliases
	var sa gen.StringArray = []string{"a", "b"}
	testutil.MustEqual("StringArray", len(sa), 2)

	var m gen.UserMap = map[string]gen.User{"1": {Id: "1"}}
	testutil.MustEqual("UserMap", m["1"].Id, "1")

	// Test nested map alias
	var nm gen.NestedMap = map[string]map[string]int64{"a": {"b": 1}}
	testutil.MustEqual("NestedMap", nm["a"]["b"], int64(1))
}
