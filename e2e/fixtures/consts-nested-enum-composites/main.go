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
			"Tiers": ["free", "pro"],
			"ByRegion": {
				"Us": "pro",
				"Eu": "enterprise"
			},
			"Bundles": [
				{
					"Name": "starter",
					"Features": ["sync", "export"],
					"Tier": "free"
				},
				{
					"Name": "growth",
					"Features": ["sync", "export", "audit"],
					"Tier": "pro"
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
