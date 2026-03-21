package main

import (
	"fixture/gen"
	"time"
	"varavel.com/testutil"
)

func main() {
	m := gen.MapTypes{
		StrMap:   map[string]string{"k": "v"},
		IntMap:   map[string]int64{"k": 1},
		BoolMap:  map[string]bool{"k": true},
		FloatMap: map[string]float64{"k": 1.1},
		DateMap:  map[string]time.Time{"k": time.Now()},
		ObjMap:   map[string]gen.User{"k": {Id: "1"}},
	}

	testutil.MustEqual("StrMap", m.StrMap["k"], "v")
	testutil.MustEqual("IntMap", m.IntMap["k"], int64(1))
	testutil.MustEqual("BoolMap", m.BoolMap["k"], true)
	testutil.MustEqual("FloatMap", m.FloatMap["k"], 1.1)
	testutil.MustEqual("ObjMap", m.ObjMap["k"].Id, "1")
}
