package main

import (
	"fixture/gen"
	"varavel.com/testutil"
)

func main() {
	u := gen.User{Id: "1", Email: "a@b.com"}
	testutil.MustEqual("User ID", u.Id, "1")
	
	testutil.MustEqual("Enum Status", string(gen.StatusActive), "Active")
}
