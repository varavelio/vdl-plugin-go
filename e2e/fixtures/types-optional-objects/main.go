package main

import (
	"fixture/gen"

	"varavel.com/testutil"
)

func main() {
	testutil.MustJSON("Holder omits nil optionals", gen.Holder{}, `{}`)

	value := gen.Holder{
		Child: gen.Ptr(gen.Child{Name: "Ada"}),
		Inline: gen.Ptr(gen.HolderInline{
			Title: "Report",
			Count: gen.Ptr(int64(0)),
		}),
	}

	testutil.MustJSON(
		"Holder includes optional objects",
		value,
		`{
			"child": {
				"name": "Ada"
			},
			"inline": {
				"title": "Report",
				"count": 0
			}
		}`,
	)

	testutil.MustEqual("GetChild", value.GetChild(), gen.Child{Name: "Ada"})
	testutil.MustEqual("GetInline", value.GetInline(), gen.HolderInline{Title: "Report", Count: gen.Ptr(int64(0))})
	inline := value.GetInline()
	testutil.MustEqual("inline GetCount", inline.GetCount(), int64(0))

	var nilValue *gen.Holder
	testutil.MustEqual("nil GetChild", nilValue.GetChild(), gen.Child{})
	testutil.MustEqual("nil GetInlineOr", nilValue.GetInlineOr(gen.HolderInline{Title: "fallback"}), gen.HolderInline{Title: "fallback"})

	var nilInline *gen.HolderInline
	testutil.MustEqual("nil inline GetTitleOr", nilInline.GetTitleOr("fallback"), "fallback")
}
