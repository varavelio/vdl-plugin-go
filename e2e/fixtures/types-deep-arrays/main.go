package main

import (
	"fixture/gen"
	"varavel.com/testutil"
)

func main() {
	a := gen.DeepArrays{
		D3:   [][][]int64{{{1}}},
		Obj3: [][][]gen.User{{{{Id: "1"}}}},
	}

	testutil.MustEqual("D3", a.D3[0][0][0], int64(1))
	testutil.MustEqual("Obj3", a.Obj3[0][0][0].Id, "1")
}
