package main

import (
	"encoding/json"
	"fixture/gen"

	"varavel.com/testutil"
)

func main() {
	value := gen.Envelope{
		Item: gen.EnvelopeItem{
			Label:   "alpha",
			Enabled: gen.Ptr(false),
		},
		Items: []gen.EnvelopeItems{{Code: "A"}, {Code: ""}},
		Lookup: map[string]gen.EnvelopeLookup{
			"first": {Id: "1"},
		},
		Nested: gen.EnvelopeNested{
			Child: gen.EnvelopeNestedChild{Note: gen.Ptr("")},
		},
	}

	testutil.MustJSON(
		"Envelope json",
		value,
		`{
			"item": {
				"label": "alpha",
				"enabled": false
			},
			"items": [
				{"code": "A"},
				{"code": ""}
			],
			"lookup": {
				"first": {"id": "1"}
			},
			"nested": {
				"child": {"note": ""}
			}
		}`,
	)

	testutil.MustEqual("GetItem", value.GetItem(), gen.EnvelopeItem{Label: "alpha", Enabled: gen.Ptr(false)})
	testutil.MustEqual("GetItems", value.GetItems(), []gen.EnvelopeItems{{Code: "A"}, {Code: ""}})
	testutil.MustEqual("GetLookup", value.GetLookup(), map[string]gen.EnvelopeLookup{"first": {Id: "1"}})
	nested := value.GetNested()
	child := nested.GetChild()
	testutil.MustEqual("nested GetNote", child.GetNote(), "")

	var nilValue *gen.Envelope
	testutil.MustEqual("nil GetLookup", nilValue.GetLookup(), map[string]gen.EnvelopeLookup(nil))
	testutil.MustEqual("nil GetNestedOr", nilValue.GetNestedOr(gen.EnvelopeNested{}), gen.EnvelopeNested{})

	var nilChild *gen.EnvelopeNestedChild
	testutil.MustEqual("nil child GetNoteOr", nilChild.GetNoteOr("fallback"), "fallback")

	var decoded gen.Envelope
	err := json.Unmarshal([]byte(`{
		"item": {"label": "alpha"},
		"items": [{"code": "A"}],
		"lookup": {"first": {"id": "1"}},
		"nested": {"child": {"note": "ready"}}
	}`), &decoded)
	testutil.MustNoError("strict inline valid", err)

	err = json.Unmarshal([]byte(`{
		"item": {},
		"items": [{"code": "A"}],
		"lookup": {"first": {"id": "1"}},
		"nested": {"child": {}}
	}`), &decoded)
	testutil.MustErrContains("strict inline item", err, `field "label" is required`)

	err = json.Unmarshal([]byte(`{
		"item": {"label": "alpha"},
		"items": [{}],
		"lookup": {"first": {"id": "1"}},
		"nested": {"child": {}}
	}`), &decoded)
	testutil.MustErrContains("strict inline items", err, `field "code" is required`)

	err = json.Unmarshal([]byte(`{
		"item": {"label": "alpha"},
		"items": [{"code": "A"}],
		"lookup": {"first": {}},
		"nested": {"child": {}}
	}`), &decoded)
	testutil.MustErrContains("strict inline lookup", err, `field "id" is required`)

	err = json.Unmarshal([]byte(`{
		"item": {"label": "alpha"},
		"items": [{"code": "A"}],
		"lookup": {"first": {"id": "1"}},
		"nested": {}
	}`), &decoded)
	testutil.MustErrContains("strict inline nested", err, `field "child" is required`)
}
