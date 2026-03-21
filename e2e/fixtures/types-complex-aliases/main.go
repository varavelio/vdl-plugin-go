package main

import (
	"fixture/gen"
	"fmt"
	"varavel.com/testutil"
)

func main() {
	// ArrayOfIntArrays ([]IntArray) where IntArray is []int64
	var aoia gen.ArrayOfIntArrays = gen.ArrayOfIntArrays{
		gen.IntArray{1, 2},
		gen.IntArray{3},
	}
	testutil.MustEqual("aoia[0][1]", aoia[0][1], int64(2))

	// MapOfMaps (map[string]StringMap) where StringMap is map[string]string
	var mom gen.MapOfMaps = gen.MapOfMaps{
		"outer": gen.StringMap{"inner": "v"},
	}
	testutil.MustEqual("mom outer inner", mom["outer"]["inner"], "v")

	// MapOfUserArrays (map[string]UserArray) where UserArray is []User
	var moua gen.MapOfUserArrays = gen.MapOfUserArrays{
		"k": gen.UserArray{{Id: "1"}},
	}
	testutil.MustEqual("moua k 0 Id", moua["k"][0].Id, "1")

	// RecursiveAlias (UserArray)
	var ra gen.RecursiveAlias = gen.RecursiveAlias{{Id: "2"}}
	testutil.MustEqual("ra 0 Id", ra[0].Id, "2")

	fmt.Println("All types-complex-aliases tests passed")
}
