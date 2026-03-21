package main

import (
	"fixture/gen"
	"varavel.com/testutil"
)

func main() {
	s := gen.Select{
		Func:      "f",
		Type:      "t",
		Interface: 1,
	}

	testutil.MustEqual("Select.Func", s.Func, "f")
	testutil.MustEqual("Select.Type", s.Type, "t")
	testutil.MustEqual("Select.Interface", s.Interface, int64(1))

	testutil.MustEqual("Default.Func", gen.Default.Func, "f")

	testutil.MustEqual("CaseDefault", string(gen.CaseDefault), "Default")
	testutil.MustEqual("CaseSwitch", string(gen.CaseSwitch), "Switch")
}
