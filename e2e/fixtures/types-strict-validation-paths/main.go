package main

import (
	"encoding/json"
	"fixture/gen"
	"varavel.com/testutil"
)

func main() {
	var r gen.Root

	// 1. Nested Slice Path
	err := json.Unmarshal([]byte(`{
		"containers": [
			{
				"id": "1",
				"nested": {"id": "1.1", "leaf": {"val": "1"}},
				"items": [
					{"id": "1.2", "leaf": {"val": "1"}},
					{"id": "1.3", "leaf": {}}
				]
			}
		],
		"registry": {}
	}`), &r)
	testutil.MustErrContains("nested slice path", err, `field containers[0].items[1].leaf.val is required`)

	// 2. Nested Map Path
	err = json.Unmarshal([]byte(`{
		"containers": [
			{
				"id": "1",
				"nested": {"id": "1.1", "leaf": {"val": "1"}},
				"items": [{"id": "1.2", "leaf": {"val": "1"}}],
				"lookup": {
					"target": {"id": "1.4", "leaf": {}}
				}
			}
		],
		"registry": {}
	}`), &r)
	testutil.MustErrContains("nested map path", err, `field containers[0].lookup["target"].leaf.val is required`)

	// 3. Complex Map of Slices Path
	err = json.Unmarshal([]byte(`{
		"containers": [],
		"registry": {
			"primary": [
				{
					"id": "1",
					"nested": {"id": "1.1", "leaf": {}},
					"items": [{"id": "1.2", "leaf": {"val": "1"}}]
				}
			]
		}
	}`), &r)
	testutil.MustErrContains("complex map of slices path", err, `field registry["primary"][0].nested.leaf.val is required`)
}
