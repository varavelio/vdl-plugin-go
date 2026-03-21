package main

import (
	"fixture/gen"
	"varavel.com/testutil"
)

func main() {
	m := gen.RecursiveMap{
		Nested: map[string]map[string]string{
			"outer": {"inner": "value"},
		},
		ObjMap: map[string]map[string]gen.User{
			"outer": {"inner": {Id: "1"}},
		},
	}

	testutil.MustEqual("Nested", m.Nested["outer"]["inner"], "value")
	testutil.MustEqual("ObjMap", m.ObjMap["outer"]["inner"].Id, "1")
}
