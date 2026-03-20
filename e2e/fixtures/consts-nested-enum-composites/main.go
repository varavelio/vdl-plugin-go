package main

import (
	"fixture/gen"

	"varavel.com/testutil"
)

func main() {
	testutil.MustJSON(
		"Defaults json",
		gen.Defaults,
		`{
			"tiers": ["free", "pro"],
			"byRegion": {
				"us": "pro",
				"eu": "enterprise"
			},
			"bundles": [
				{
					"name": "starter",
					"features": ["sync", "export"],
					"tier": "free"
				},
				{
					"name": "growth",
					"features": ["sync", "export", "audit"],
					"tier": "pro"
				}
			]
		}`,
	)

	testutil.MustEqual("tier list length", len(gen.Defaults.Tiers), 2)
	testutil.MustEqual("tier list value", gen.Defaults.Tiers[1], "pro")
	testutil.MustEqual("region value", gen.Defaults.ByRegion.Eu, "enterprise")
	testutil.MustEqual("bundle count", len(gen.Defaults.Bundles), 2)
	testutil.MustEqual("bundle tier", gen.Defaults.Bundles[0].Tier, "free")
	testutil.MustEqual("bundle feature", gen.Defaults.Bundles[1].Features[2], "audit")
	testutil.MustEqual("clone matches", gen.DefaultsClone, gen.Defaults)
}
