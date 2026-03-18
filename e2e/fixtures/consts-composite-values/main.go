package main

import (
	"fixture/gen"
	"reflect"

	"varavel.com/testutil"
)

var (
	_ []string  = gen.Versions
	_ [][]int64 = gen.Matrix
	_ struct {
		Env    string
		Region string
	} = gen.Labels
	_ struct {
		Name string
		Tags []string
	} = gen.BuildInfo
	_ struct {
		Id     string
		Labels struct {
			Env    string
			Region string
		}
		Versions []string
	} = gen.BaseProfile
	_ struct {
		Id       string
		Versions []string
		Labels   struct {
			Env    string
			Region string
		}
	} = gen.ExtendedProfile
)

func main() {
	testutil.MustJSON("Labels json", gen.Labels, `{
		"Env": "prod",
		"Region": "eu"
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
		"Name": "plugin-go",
		"Tags": ["go", "vdl"]
	}`)
	testutil.MustJSON(
		"BaseProfile json",
		gen.BaseProfile,
		`{
			"Id": "user-1",
			"Labels": {
				"Env": "prod",
				"Region": "eu"
			},
			"Versions": ["1.0.0", "1.1.0"]
		}`,
	)
	testutil.MustJSON(
		"ExtendedProfile json",
		gen.ExtendedProfile,
		`{
			"Id": "user-1",
			"Labels": {
				"Env": "prod",
				"Region": "us"
			},
			"Versions": ["1.0.0", "1.1.0"]
		}`,
	)

	testutil.MustEqual("Labels type", reflect.TypeOf(gen.Labels).String(), "struct { Env string; Region string }")
	testutil.MustEqual("Versions type", reflect.TypeOf(gen.Versions).String(), "[]string")
	testutil.MustEqual("Matrix type", reflect.TypeOf(gen.Matrix).String(), "[][]int64")
	testutil.MustEqual("BuildInfo type", reflect.TypeOf(gen.BuildInfo).String(), "struct { Name string; Tags []string }")
	testutil.MustEqual("ExtendedProfile type", reflect.TypeOf(gen.ExtendedProfile).String(), "struct { Id string; Versions []string; Labels struct { Env string; Region string } }")
	testutil.MustEqual("Versions length", len(gen.Versions), 2)
	testutil.MustEqual("Matrix nested value", gen.Matrix[0][1], int64(2))
	testutil.MustEqual("BuildInfo first tag", gen.BuildInfo.Tags[0], "go")
	testutil.MustEqual("BaseProfile label env", gen.BaseProfile.Labels.Env, "prod")
	testutil.MustEqual("spread overrides region", gen.ExtendedProfile.Labels.Region, "us")
	testutil.MustEqual("spread keeps id", gen.ExtendedProfile.Id, gen.BaseProfile.Id)
}
