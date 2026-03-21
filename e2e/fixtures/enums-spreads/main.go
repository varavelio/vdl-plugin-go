package main

import (
	"fixture/gen"
	"varavel.com/testutil"
)

func main() {
	testutil.MustEqual("AllRoles.User", string(gen.AllRolesUser), "User")
	testutil.MustEqual("AllRoles.Admin", string(gen.AllRolesAdmin), "Admin")
	testutil.MustEqual("AllRoles.Guest", string(gen.AllRolesGuest), "guest")
}
