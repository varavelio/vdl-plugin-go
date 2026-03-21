package main

import (
	"fixture/gen"
	"fmt"
	"varavel.com/testutil"
)

func main() {
	// matrix [[1 2] [3 4]]
	testutil.MustEqual("matrix[1][0]", gen.Matrix[1][0], int64(3))

	// mapOfArrays { k1 [1 2] k2 [3 4] }
	testutil.MustEqual("mapOfArrays.k2[1]", gen.MapOfArrays.K2[1], int64(4))

	// arrayOfMaps [{a 1} {a 2}]
	testutil.MustEqual("arrayOfMaps[1].a", gen.ArrayOfMaps[1].A, int64(2))

	// deep nested
	testutil.MustEqual("deep.level1.level2.level3.value", gen.Deep.Level1.Level2.Level3.Value, "deep")

	testutil.MustEqual("notEmptyArray[0]", gen.NotEmptyArray[0], int64(1))

	fmt.Println("All consts-edge-cases tests passed")
}
