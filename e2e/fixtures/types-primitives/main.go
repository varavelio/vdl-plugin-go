package main

import (
	"fixture/gen"
	"fmt"
	"time"

	"varavel.com/testutil"
)

func main() {
	createdAt := time.Date(2024, time.January, 2, 3, 4, 5, 678901234, time.UTC)

	withOptionals := gen.Primitives{
		Text:         "hello",
		Count:        42,
		Ratio:        3.5,
		Active:       true,
		CreatedAt:    createdAt,
		OptText:      gen.Ptr(""),
		OptCount:     gen.Ptr(int64(0)),
		OptRatio:     gen.Ptr(0.0),
		OptActive:    gen.Ptr(false),
		OptCreatedAt: gen.Ptr(time.Time{}),
	}

	testutil.MustJSON(
		"Primitives includes optional zero values",
		withOptionals,
		fmt.Sprintf(
			`{
				"text": "hello",
				"count": 42,
				"ratio": 3.5,
				"active": true,
				"createdAt": "%s",
				"optText": "",
				"optCount": 0,
				"optRatio": 0,
				"optActive": false,
				"optCreatedAt": "%s"
			}`,
			createdAt.Format(time.RFC3339Nano),
			time.Time{}.Format(time.RFC3339Nano),
		),
	)

	withoutOptionals := gen.Primitives{
		Text:      "hello",
		Count:     42,
		Ratio:     3.5,
		Active:    true,
		CreatedAt: createdAt,
	}
	testutil.MustJSON(
		"Primitives omits nil optionals",
		withoutOptionals,
		fmt.Sprintf(
			`{
				"text": "hello",
				"count": 42,
				"ratio": 3.5,
				"active": true,
				"createdAt": "%s"
			}`,
			createdAt.Format(time.RFC3339Nano),
		),
	)

	testutil.MustEqual("GetText", withOptionals.GetText(), "hello")
	testutil.MustEqual("GetOptText", withOptionals.GetOptText(), "")
	testutil.MustEqual("GetOptCount", withOptionals.GetOptCount(), int64(0))
	testutil.MustEqual("GetOptRatio", withOptionals.GetOptRatio(), float64(0))
	testutil.MustEqual("GetOptActive", withOptionals.GetOptActive(), false)
	testutil.MustEqual("GetOptCreatedAt", withOptionals.GetOptCreatedAt(), time.Time{})

	var nilValue *gen.Primitives
	testutil.MustEqual("nil GetText", nilValue.GetText(), "")
	testutil.MustEqual("nil GetCountOr", nilValue.GetCountOr(7), int64(7))
	testutil.MustEqual("nil GetOptActiveOr", nilValue.GetOptActiveOr(true), true)
}
