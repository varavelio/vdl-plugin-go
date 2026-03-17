package main

import (
	"fixture/gen"
	"fmt"
	"time"

	"varavel.com/testutil"
)

func main() {
	createdAt := time.Date(2024, time.January, 2, 3, 4, 5, 678901234, time.UTC)

	value := gen.Collections{
		Names:      []string{"alpha", ""},
		Matrix:     [][]int64{{1, 2}, nil},
		Timestamps: []time.Time{createdAt},
		Labels:     map[string]string{"env": "prod"},
		Counts:     map[string]int64{"done": 3, "open": 0},
		OptNames:   gen.Ptr([]string{}),
		OptLabels:  gen.Ptr(map[string]string{}),
	}

	testutil.MustJSON(
		"Collections json",
		value,
		fmt.Sprintf(
			`{
				"names": ["alpha", ""],
				"matrix": [[1, 2], null],
				"timestamps": ["%s"],
				"labels": {
					"env": "prod"
				},
				"counts": {
					"done": 3,
					"open": 0
				},
				"optNames": [],
				"optLabels": {}
			}`,
			createdAt.Format(time.RFC3339Nano),
		),
	)

	testutil.MustJSON(
		"Collections zero value json",
		gen.Collections{},
		`{
			"names": null,
			"matrix": null,
			"timestamps": null,
			"labels": null,
			"counts": null
		}`,
	)

	testutil.MustEqual("GetNames", value.GetNames(), []string{"alpha", ""})
	testutil.MustEqual("GetMatrix", value.GetMatrix(), [][]int64{{1, 2}, nil})
	testutil.MustEqual("GetOptNames", value.GetOptNames(), []string{})
	testutil.MustEqual("GetOptLabels", value.GetOptLabels(), map[string]string{})

	var nilValue *gen.Collections
	testutil.MustEqual("nil GetLabels", nilValue.GetLabels(), map[string]string(nil))
	testutil.MustEqual("nil GetCountsOr", nilValue.GetCountsOr(map[string]int64{"fallback": 1}), map[string]int64{"fallback": 1})
	testutil.MustEqual("nil GetOptNamesOr", nilValue.GetOptNamesOr([]string{"fallback"}), []string{"fallback"})
}
