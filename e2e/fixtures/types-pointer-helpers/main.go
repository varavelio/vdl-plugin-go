package main

import (
	"fixture/gen"

	"varavel.com/testutil"
)

func main() {
	testutil.MustEqual("Ptr string", *gen.Ptr("hello"), "hello")
	testutil.MustEqual("Ptr int", *gen.Ptr(int64(42)), int64(42))

	var nilString *string
	testutil.MustEqual("Val nil string", gen.Val(nilString), "")
	testutil.MustEqual("Val string", gen.Val(gen.Ptr("hello")), "hello")
	testutil.MustEqual("Or nil string", gen.Or(nilString, "fallback"), "fallback")
	testutil.MustEqual("Or string", gen.Or(gen.Ptr("hello"), "fallback"), "hello")
}
