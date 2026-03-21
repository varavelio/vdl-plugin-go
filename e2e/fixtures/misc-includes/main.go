package main

import (
	"fixture/gen"
	"varavel.com/testutil"
)

func main() {
	p := gen.Profile{
		User: gen.SharedUser{Id: "shared-1"},
		Bio:  "Hello",
	}

	testutil.MustEqual("Profile.User.Id", p.User.Id, "shared-1")
}
