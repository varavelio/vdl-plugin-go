package main

import (
	"fixture/gen"
	"varavel.com/testutil"
)

func main() {
	// appConfig should have timeout 30 (inherited) and retries 3 (inherited)
	testutil.MustEqual("AppConfig.Timeout", gen.AppConfig.Timeout, int64(30))
	testutil.MustEqual("AppConfig.Retries", gen.AppConfig.Retries, int64(3))
	testutil.MustEqual("AppConfig.Debug", gen.AppConfig.Debug, true)
}
