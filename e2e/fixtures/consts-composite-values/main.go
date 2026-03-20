package main

import (
	"fixture/gen"
	"reflect"

	"varavel.com/testutil"
)

var (
	_ []string  = gen.Versions
	_ [][]int64 = gen.Matrix
)

func main() {
	testutil.MustJSON("Labels json", gen.Labels, `{
		"env": "prod",
		"region": "eu"
	}`)
	testutil.MustJSON("Versions json", gen.Versions, `[
		"1.0.0",
		"1.1.0"
	]`)
	testutil.MustJSON("Matrix json", gen.Matrix, `[
		[1, 2],
		[3]
	]`)
	testutil.MustJSON("BuildInfo json", gen.BuildInfo, `{
		"name": "plugin-go",
		"tags": ["go", "vdl"]
	}`)
	testutil.MustJSON(
		"BaseProfile json",
		gen.BaseProfile,
		`{
			"id": "user-1",
			"labels": {
				"env": "prod",
				"region": "eu"
			},
			"versions": ["1.0.0", "1.1.0"]
		}`,
	)
	testutil.MustJSON(
		"ExtendedProfile json",
		gen.ExtendedProfile,
		`{
			"id": "user-1",
			"labels": {
				"env": "prod",
				"region": "us"
			},
			"versions": ["1.0.0", "1.1.0"]
		}`,
	)

	testutil.MustEqual("Labels type", reflect.TypeOf(gen.Labels).String(), "struct { Env string \"json:\\\"env\\\"\"; Region string \"json:\\\"region\\\"\" }")
	testutil.MustEqual("Versions type", reflect.TypeOf(gen.Versions).String(), "[]string")
	testutil.MustEqual("Matrix type", reflect.TypeOf(gen.Matrix).String(), "[][]int64")
	testutil.MustEqual("BuildInfo type", reflect.TypeOf(gen.BuildInfo).String(), "struct { Name string \"json:\\\"name\\\"\"; Tags []string \"json:\\\"tags\\\"\" }")
	testutil.MustEqual("ExtendedProfile type", reflect.TypeOf(gen.ExtendedProfile).String(), "struct { Id string \"json:\\\"id\\\"\"; Versions []string \"json:\\\"versions\\\"\"; Labels struct { Env string \"json:\\\"env\\\"\"; Region string \"json:\\\"region\\\"\" } \"json:\\\"labels\\\"\" }")
	testutil.MustEqual("Versions length", len(gen.Versions), 2)
	testutil.MustEqual("Matrix nested value", gen.Matrix[0][1], int64(2))
	testutil.MustEqual("BuildInfo first tag", gen.BuildInfo.Tags[0], "go")
	testutil.MustEqual("BaseProfile label env", gen.BaseProfile.Labels.Env, "prod")
	testutil.MustEqual("spread overrides region", gen.ExtendedProfile.Labels.Region, "us")
	testutil.MustEqual("spread keeps id", gen.ExtendedProfile.Id, gen.BaseProfile.Id)
}
