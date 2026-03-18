package main

import (
	"fixture/gen"
	"reflect"

	"varavel.com/testutil"
)

func main() {
	var _ string = gen.ApiVersion
	var _ int64 = gen.MaxItems
	var _ float64 = gen.Ratio
	var _ bool = gen.FeatureEnabled

	testutil.MustEqual("ApiVersion", gen.ApiVersion, "1.2.3")
	testutil.MustEqual("MaxItems", gen.MaxItems, 2147483647)
	testutil.MustEqual("Ratio", gen.Ratio, 3.5)
	testutil.MustEqual("FeatureEnabled", gen.FeatureEnabled, true)

	testutil.MustEqual("ApiVersion runtime type", reflect.TypeOf(any(gen.ApiVersion)).String(), "string")
	testutil.MustEqual("MaxItems runtime type", reflect.TypeOf(any(gen.MaxItems)).String(), "int")
	testutil.MustEqual("Ratio runtime type", reflect.TypeOf(any(gen.Ratio)).String(), "float64")
	testutil.MustEqual("FeatureEnabled runtime type", reflect.TypeOf(any(gen.FeatureEnabled)).String(), "bool")
	testutil.MustEqual("MaxItems arithmetic", gen.MaxItems+1, 2147483648)
	testutil.MustEqual("Ratio multiplication", gen.Ratio*2, 7.0)
}
