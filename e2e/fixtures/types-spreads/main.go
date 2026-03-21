package main

import (
	"fixture/gen"
	"time"
	"varavel.com/testutil"
)

func main() {
	u := gen.User{
		Id:        "user-1",
		CreatedAt: time.Now(),
		UpdatedAt: time.Now(),
		Email:     "user@example.com",
	}

	testutil.MustEqual("User.Id", u.Id, "user-1")
	testutil.MustEqual("User.Email", u.Email, "user@example.com")
}
