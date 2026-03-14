package main

import (
	"encoding/json"
	"fixture/gen"
	"fmt"
	"reflect"
	"time"
)

func assertJSON(name string, value any, expectedJSON string) {
	marshaled, err := json.Marshal(value)
	if err != nil {
		panic(name + ": error marshaling value: " + err.Error())
	}

	var actual any
	if err := json.Unmarshal(marshaled, &actual); err != nil {
		panic(name + ": error unmarshaling actual json: " + err.Error())
	}

	var expected any
	if err := json.Unmarshal([]byte(expectedJSON), &expected); err != nil {
		panic(name + ": error unmarshaling expected json: " + err.Error())
	}

	if !reflect.DeepEqual(actual, expected) {
		fmt.Println("actual:", string(marshaled))
		fmt.Println("expected:", expectedJSON)
		panic(name + ": unexpected json output")
	}
}

func assertEqual(name string, got, want any) {
	if !reflect.DeepEqual(got, want) {
		panic(fmt.Sprintf("%s: got %#v want %#v", name, got, want))
	}
}

func assertAnnotationMissing(name string, annotations gen.AnnotationSet) {
	value, ok := annotations.Get("missing")
	assertEqual(name+" annotations missing found", ok, false)
	assertEqual(name+" annotations missing value", value, nil)

	values, ok := annotations.GetAll("missing")
	assertEqual(name+" annotations missing all found", ok, false)
	assertEqual(name+" annotations missing all values", values, []any(nil))
}

func assertTypeMetadata(name, vdlName, path, parent, goType string, inline bool) {
	metadata, ok := gen.VDLMetadata.Type(name)
	if !ok {
		panic("missing type metadata: " + name)
	}

	assertEqual(name+" metadata name", metadata.Name, name)
	assertEqual(name+" metadata vdl name", metadata.VDLName, vdlName)
	assertEqual(name+" metadata path", metadata.Path, path)
	assertEqual(name+" metadata parent", metadata.Parent, parent)
	assertEqual(name+" metadata kind", metadata.Kind, "object")
	assertEqual(name+" metadata go type", metadata.GoType, goType)
	assertEqual(name+" metadata inline", metadata.Inline, inline)
	assertEqual(name+" metadata annotations has", metadata.Annotations.Has("missing"), false)
	assertAnnotationMissing(name+" metadata", metadata.Annotations)
}

func assertFieldMetadata(typeName, fieldName, vdlName, jsonName, goType string, optional bool) {
	typeMetadata, ok := gen.VDLMetadata.Type(typeName)
	if !ok {
		panic("missing type metadata: " + typeName)
	}

	fieldMetadata, ok := typeMetadata.Field(fieldName)
	if !ok {
		panic("missing field metadata: " + typeName + "." + fieldName)
	}

	assertEqual(typeName+"."+fieldName+" field name", fieldMetadata.Name, fieldName)
	assertEqual(typeName+"."+fieldName+" field vdl name", fieldMetadata.VDLName, vdlName)
	assertEqual(typeName+"."+fieldName+" field json name", fieldMetadata.JSONName, jsonName)
	assertEqual(typeName+"."+fieldName+" field go type", fieldMetadata.GoType, goType)
	assertEqual(typeName+"."+fieldName+" field optional", fieldMetadata.Optional, optional)
	assertEqual(typeName+"."+fieldName+" field annotations has", fieldMetadata.Annotations.Has("missing"), false)
	assertAnnotationMissing(typeName+"."+fieldName+" field", fieldMetadata.Annotations)
}

func testPointerHelpers() {
	assertEqual("Ptr string", *gen.Ptr("hello"), "hello")
	assertEqual("Ptr int", *gen.Ptr(int64(42)), int64(42))
	assertEqual("Val nil string", gen.Val[string](nil), "")
	assertEqual("Val string", gen.Val(gen.Ptr("hello")), "hello")
	assertEqual("Or nil string", gen.Or(nil, "fallback"), "fallback")
	assertEqual("Or string", gen.Or(gen.Ptr("hello"), "fallback"), "hello")
}

func testSimpleType() {
	simple := gen.SimpleType{Foo: "bar"}
	assertJSON("SimpleType json", simple, `{"foo":"bar"}`)
	assertEqual("SimpleType getter", simple.GetFoo(), "bar")
	assertEqual("SimpleType getter or", simple.GetFooOr("fallback"), "bar")

	var nilSimple *gen.SimpleType
	assertEqual("SimpleType nil getter", nilSimple.GetFoo(), "")
	assertEqual("SimpleType nil getter or", nilSimple.GetFooOr("fallback"), "fallback")
}

func testPrimitives(baseTime, offsetTime time.Time) gen.Primitives {
	withNilOptionals := gen.Primitives{
		StringField:   "hello",
		IntField:      42,
		FloatField:    3.14,
		BoolField:     true,
		DatetimeField: baseTime,
	}
	assertJSON(
		"Primitives json omits nil optionals",
		withNilOptionals,
		fmt.Sprintf(
			`{
				"stringField":"hello",
				"intField":42,
				"floatField":3.14,
				"boolField":true,
				"datetimeField":"%s"
			}`,
			baseTime.Format(time.RFC3339Nano),
		),
	)

	withZeroOptionals := gen.Primitives{
		StringField:      "world",
		IntField:         -7,
		FloatField:       -2.5,
		BoolField:        false,
		DatetimeField:    offsetTime,
		OptStringField:   gen.Ptr(""),
		OptIntField:      gen.Ptr(int64(0)),
		OptFloatField:    gen.Ptr(0.0),
		OptBoolField:     gen.Ptr(false),
		OptDatetimeField: gen.Ptr(time.Time{}),
	}
	assertJSON(
		"Primitives json includes zero optional values",
		withZeroOptionals,
		fmt.Sprintf(
			`{
				"stringField":"world",
				"intField":-7,
				"floatField":-2.5,
				"boolField":false,
				"datetimeField":"%s",
				"optStringField":"",
				"optIntField":0,
				"optFloatField":0,
				"optBoolField":false,
				"optDatetimeField":"%s"
			}`,
			offsetTime.Format(time.RFC3339Nano),
			time.Time{}.Format(time.RFC3339Nano),
		),
	)

	assertEqual("Primitives getter required", withZeroOptionals.GetStringField(), "world")
	assertEqual("Primitives getter optional zero string", withZeroOptionals.GetOptStringField(), "")
	assertEqual("Primitives getter optional zero int", withZeroOptionals.GetOptIntField(), int64(0))
	assertEqual("Primitives getter optional zero float", withZeroOptionals.GetOptFloatField(), float64(0))
	assertEqual("Primitives getter optional zero bool", withZeroOptionals.GetOptBoolField(), false)
	assertEqual("Primitives getter optional zero datetime", withZeroOptionals.GetOptDatetimeField(), time.Time{})

	var nilPrimitives *gen.Primitives
	assertEqual("Primitives nil getter required", nilPrimitives.GetStringField(), "")
	assertEqual("Primitives nil getter optional", nilPrimitives.GetOptIntField(), int64(0))
	assertEqual("Primitives nil getter or required", nilPrimitives.GetStringFieldOr("fallback"), "fallback")
	assertEqual("Primitives nil getter or optional", nilPrimitives.GetOptBoolFieldOr(true), true)

	return withZeroOptionals
}

func testArrays(baseTime, offsetTime time.Time) gen.Arrays {
	arrays := gen.Arrays{
		StringField:      []string{"", "alpha"},
		IntField:         []int64{0, -1, 42},
		FloatField:       []float64{0, -1.5, 3.14},
		BoolField:        []bool{true, false},
		DatetimeField:    []time.Time{baseTime, offsetTime},
		OptStringField:   gen.Ptr([]string{}),
		OptIntField:      gen.Ptr([]int64{0, 7}),
		OptFloatField:    gen.Ptr([]float64{}),
		OptBoolField:     gen.Ptr([]bool{false}),
		OptDatetimeField: gen.Ptr([]time.Time{}),
	}

	assertJSON(
		"Arrays json",
		arrays,
		fmt.Sprintf(
			`{
				"stringField":["","alpha"],
				"intField":[0,-1,42],
				"floatField":[0,-1.5,3.14],
				"boolField":[true,false],
				"datetimeField":["%s","%s"],
				"optStringField":[],
				"optIntField":[0,7],
				"optFloatField":[],
				"optBoolField":[false],
				"optDatetimeField":[]
			}`,
			baseTime.Format(time.RFC3339Nano),
			offsetTime.Format(time.RFC3339Nano),
		),
	)

	assertJSON(
		"Arrays zero value json",
		gen.Arrays{},
		`{
			"stringField":null,
			"intField":null,
			"floatField":null,
			"boolField":null,
			"datetimeField":null
		}`,
	)

	assertEqual("Arrays getter required", arrays.GetStringField(), []string{"", "alpha"})
	assertEqual("Arrays getter optional empty", arrays.GetOptStringField(), []string{})
	assertEqual("Arrays getter or required", arrays.GetIntFieldOr([]int64{1}), []int64{0, -1, 42})

	var nilArrays *gen.Arrays
	assertEqual("Arrays nil getter required", nilArrays.GetBoolField(), []bool(nil))
	assertEqual("Arrays nil getter optional", nilArrays.GetOptDatetimeField(), []time.Time(nil))
	assertEqual("Arrays nil getter or required", nilArrays.GetFloatFieldOr([]float64{9}), []float64{9})
	assertEqual("Arrays nil getter or optional", nilArrays.GetOptIntFieldOr([]int64{3}), []int64{3})

	return arrays
}

func testMaps(baseTime, offsetTime time.Time) gen.Maps {
	maps := gen.Maps{
		StringField:      map[string]string{"empty": "", "greeting": "hola"},
		IntField:         map[string]int64{"answer": 42, "zero": 0},
		FloatField:       map[string]float64{"negative": -2.5, "zero": 0},
		BoolField:        map[string]bool{"false": false, "true": true},
		DatetimeField:    map[string]time.Time{"base": baseTime, "offset": offsetTime},
		OptStringField:   gen.Ptr(map[string]string{}),
		OptIntField:      gen.Ptr(map[string]int64{"zero": 0}),
		OptFloatField:    gen.Ptr(map[string]float64{}),
		OptBoolField:     gen.Ptr(map[string]bool{"false": false}),
		OptDatetimeField: gen.Ptr(map[string]time.Time{}),
	}

	assertJSON(
		"Maps json",
		maps,
		fmt.Sprintf(
			`{
				"stringField":{"empty":"","greeting":"hola"},
				"intField":{"answer":42,"zero":0},
				"floatField":{"negative":-2.5,"zero":0},
				"boolField":{"false":false,"true":true},
				"datetimeField":{"base":"%s","offset":"%s"},
				"optStringField":{},
				"optIntField":{"zero":0},
				"optFloatField":{},
				"optBoolField":{"false":false},
				"optDatetimeField":{}
			}`,
			baseTime.Format(time.RFC3339Nano),
			offsetTime.Format(time.RFC3339Nano),
		),
	)

	assertJSON(
		"Maps zero value json",
		gen.Maps{},
		`{
			"stringField":null,
			"intField":null,
			"floatField":null,
			"boolField":null,
			"datetimeField":null
		}`,
	)

	assertEqual("Maps getter required", maps.GetStringField(), map[string]string{"empty": "", "greeting": "hola"})
	assertEqual("Maps getter optional empty", maps.GetOptStringField(), map[string]string{})
	assertEqual("Maps getter or required", maps.GetBoolFieldOr(map[string]bool{"x": true}), map[string]bool{"false": false, "true": true})

	var nilMaps *gen.Maps
	assertEqual("Maps nil getter required", nilMaps.GetFloatField(), map[string]float64(nil))
	assertEqual("Maps nil getter optional", nilMaps.GetOptDatetimeField(), map[string]time.Time(nil))
	assertEqual("Maps nil getter or required", nilMaps.GetIntFieldOr(map[string]int64{"fallback": 9}), map[string]int64{"fallback": 9})
	assertEqual("Maps nil getter or optional", nilMaps.GetOptBoolFieldOr(map[string]bool{"fallback": true}), map[string]bool{"fallback": true})

	return maps
}

func testNested(primitives gen.Primitives, arrays gen.Arrays, maps gen.Maps) gen.Nested {
	nested := gen.Nested{
		Simple:     gen.SimpleType{Foo: "nested"},
		Primitives: primitives,
		Arrays:     arrays,
		Maps:       maps,
	}

	assertJSON(
		"Nested json",
		nested,
		fmt.Sprintf(
			`{
				"simple":{"foo":"nested"},
				"primitives":{
					"stringField":"%s",
					"intField":%d,
					"floatField":%v,
					"boolField":%t,
					"datetimeField":"%s",
					"optStringField":"",
					"optIntField":0,
					"optFloatField":0,
					"optBoolField":false,
					"optDatetimeField":"%s"
				},
				"arrays":{
					"stringField":["","alpha"],
					"intField":[0,-1,42],
					"floatField":[0,-1.5,3.14],
					"boolField":[true,false],
					"datetimeField":["%s","%s"],
					"optStringField":[],
					"optIntField":[0,7],
					"optFloatField":[],
					"optBoolField":[false],
					"optDatetimeField":[]
				},
				"maps":{
					"stringField":{
						"empty":"",
						"greeting":"hola"
					},
					"intField":{
						"answer":42,
						"zero":0
					},
					"floatField":{
						"negative":-2.5,
						"zero":0
					},
					"boolField":{
						"false":false,
						"true":true
					},
					"datetimeField":{"base":"%s","offset":"%s"},
					"optStringField":{},
					"optIntField":{"zero":0},
					"optFloatField":{},
					"optBoolField":{"false":false},
					"optDatetimeField":{}
				}
			}`,
			primitives.StringField,
			primitives.IntField,
			primitives.FloatField,
			primitives.BoolField,
			primitives.DatetimeField.Format(time.RFC3339Nano),
			primitives.OptDatetimeField.Format(time.RFC3339Nano),
			arrays.DatetimeField[0].Format(time.RFC3339Nano),
			arrays.DatetimeField[1].Format(time.RFC3339Nano),
			maps.DatetimeField["base"].Format(time.RFC3339Nano),
			maps.DatetimeField["offset"].Format(time.RFC3339Nano),
		),
	)

	assertEqual("Nested getter simple", nested.GetSimple(), gen.SimpleType{Foo: "nested"})
	assertEqual("Nested getter arrays", nested.GetArrays(), arrays)
	assertEqual("Nested getter or", nested.GetMapsOr(gen.Maps{}), maps)

	var nilNested *gen.Nested
	assertEqual("Nested nil getter", nilNested.GetPrimitives(), gen.Primitives{})
	assertEqual("Nested nil getter or", nilNested.GetSimpleOr(gen.SimpleType{Foo: "fallback"}), gen.SimpleType{Foo: "fallback"})

	return nested
}

func testNestedArrays(primitives gen.Primitives, arrays gen.Arrays, maps gen.Maps) {
	nestedArrays := gen.NestedArrays{
		Simple: []gen.SimpleType{{Foo: "first"}, {Foo: ""}},
		Primitives: []gen.Primitives{
			primitives,
			{StringField: "second", IntField: 1, FloatField: 1.5, BoolField: true, DatetimeField: time.Time{}},
		},
		Arrays: []gen.Arrays{arrays},
		Maps:   []gen.Maps{maps},
	}

	assertJSON(
		"NestedArrays json",
		nestedArrays,
		fmt.Sprintf(
			`{
				"simple":[{"foo":"first"},{"foo":""}],
				"primitives":[{"stringField":"%s","intField":%d,"floatField":%v,"boolField":%t,"datetimeField":"%s","optStringField":"","optIntField":0,"optFloatField":0,"optBoolField":false,"optDatetimeField":"%s"},{"stringField":"second","intField":1,"floatField":1.5,"boolField":true,"datetimeField":"%s"}],
				"arrays":[{"stringField":["","alpha"],"intField":[0,-1,42],"floatField":[0,-1.5,3.14],"boolField":[true,false],"datetimeField":["%s","%s"],"optStringField":[],"optIntField":[0,7],"optFloatField":[],"optBoolField":[false],"optDatetimeField":[]}],
				"maps":[{"stringField":{"empty":"","greeting":"hola"},"intField":{"answer":42,"zero":0},"floatField":{"negative":-2.5,"zero":0},"boolField":{"false":false,"true":true},"datetimeField":{"base":"%s","offset":"%s"},"optStringField":{},"optIntField":{"zero":0},"optFloatField":{},"optBoolField":{"false":false},"optDatetimeField":{}}]
			}`,
			primitives.StringField,
			primitives.IntField,
			primitives.FloatField,
			primitives.BoolField,
			primitives.DatetimeField.Format(time.RFC3339Nano),
			primitives.OptDatetimeField.Format(time.RFC3339Nano),
			time.Time{}.Format(time.RFC3339Nano),
			arrays.DatetimeField[0].Format(time.RFC3339Nano),
			arrays.DatetimeField[1].Format(time.RFC3339Nano),
			maps.DatetimeField["base"].Format(time.RFC3339Nano),
			maps.DatetimeField["offset"].Format(time.RFC3339Nano),
		),
	)

	assertEqual("NestedArrays getter", nestedArrays.GetSimple(), []gen.SimpleType{{Foo: "first"}, {Foo: ""}})
	assertEqual("NestedArrays getter or", nestedArrays.GetPrimitivesOr([]gen.Primitives{{StringField: "fallback"}}), nestedArrays.Primitives)

	var nilNestedArrays *gen.NestedArrays
	assertEqual("NestedArrays nil getter", nilNestedArrays.GetMaps(), []gen.Maps(nil))
	assertEqual("NestedArrays nil getter or", nilNestedArrays.GetArraysOr([]gen.Arrays{{}}), []gen.Arrays{{}})
}

func testOptionalObjects(baseTime time.Time) {
	assertJSON("OptionalObjects nil json", gen.OptionalObjects{}, `{}`)

	value := gen.OptionalObjects{
		Simple: gen.Ptr(gen.SimpleType{Foo: ""}),
		Primitives: gen.Ptr(gen.Primitives{
			StringField:   "embedded",
			IntField:      0,
			FloatField:    0,
			BoolField:     false,
			DatetimeField: baseTime,
		}),
		Inline: gen.Ptr(gen.OptionalObjectsInline{Foo: "inline", Count: gen.Ptr(int64(0))}),
	}

	assertJSON(
		"OptionalObjects json",
		value,
		fmt.Sprintf(
			`{
				"simple":{"foo":""},
				"primitives":{"stringField":"embedded","intField":0,"floatField":0,"boolField":false,"datetimeField":"%s"},
				"inline":{"foo":"inline","count":0}
			}`,
			baseTime.Format(time.RFC3339Nano),
		),
	)

	assertEqual("OptionalObjects getter simple", value.GetSimple(), gen.SimpleType{Foo: ""})
	assertEqual("OptionalObjects getter inline", value.GetInline(), gen.OptionalObjectsInline{Foo: "inline", Count: gen.Ptr(int64(0))})
	optionalInline := value.GetInline()
	assertEqual("OptionalObjects inline getter count", optionalInline.GetCount(), int64(0))

	var nilOptionalObjects *gen.OptionalObjects
	assertEqual("OptionalObjects nil getter", nilOptionalObjects.GetPrimitives(), gen.Primitives{})
	assertEqual("OptionalObjects nil getter or", nilOptionalObjects.GetInlineOr(gen.OptionalObjectsInline{Foo: "fallback"}), gen.OptionalObjectsInline{Foo: "fallback"})

	var nilOptionalObjectsInline *gen.OptionalObjectsInline
	assertEqual("OptionalObjectsInline nil getter", nilOptionalObjectsInline.GetCount(), int64(0))
	assertEqual("OptionalObjectsInline nil getter or", nilOptionalObjectsInline.GetFooOr("fallback"), "fallback")
}

func testMatrices(baseTime, offsetTime time.Time) {
	matrices := gen.Matrices{
		Ints:      [][]int64{nil, {1, 2}},
		Strings:   [][]string{{"left", ""}, nil},
		Datetimes: [][]time.Time{{baseTime}, {offsetTime, time.Time{}}},
		Simple: [][]gen.SimpleType{
			nil,
			{{Foo: "nested"}},
		},
		Inline: [][]gen.MatricesInline{
			{{Value: "alpha", Enabled: gen.Ptr(false)}},
			{},
		},
	}

	assertJSON(
		"Matrices json",
		matrices,
		fmt.Sprintf(
			`{
				"ints":[null,[1,2]],
				"strings":[["left",""],null],
				"datetimes":[["%s"],["%s","%s"]],
				"simple":[null,[{"foo":"nested"}]],
				"inline":[[{"value":"alpha","enabled":false}],[]]
			}`,
			baseTime.Format(time.RFC3339Nano),
			offsetTime.Format(time.RFC3339Nano),
			time.Time{}.Format(time.RFC3339Nano),
		),
	)

	assertEqual("Matrices getter ints", matrices.GetInts(), [][]int64{nil, {1, 2}})
	assertEqual("Matrices getter inline", matrices.GetInline(), [][]gen.MatricesInline{{{Value: "alpha", Enabled: gen.Ptr(false)}}, {}})

	var nilMatrices *gen.Matrices
	assertEqual("Matrices nil getter", nilMatrices.GetStrings(), [][]string(nil))
	assertEqual("Matrices nil getter or", nilMatrices.GetSimpleOr([][]gen.SimpleType{{{Foo: "fallback"}}}), [][]gen.SimpleType{{{Foo: "fallback"}}})

	var nilMatricesInline *gen.MatricesInline
	assertEqual("MatricesInline nil getter", nilMatricesInline.GetEnabled(), false)
	assertEqual("MatricesInline nil getter or", nilMatricesInline.GetValueOr("fallback"), "fallback")
}

func testMapCollections(nested gen.Nested) {
	collections := gen.MapCollections{
		SimpleField: map[string]gen.SimpleType{
			"empty":  {},
			"filled": {Foo: "bar"},
		},
		PrimitivesField: map[string]gen.Primitives{
			"zero":  {},
			"value": nested.Primitives,
		},
		ArraysField: map[string]gen.Arrays{
			"value": nested.Arrays,
		},
		NestedField: map[string]gen.Nested{
			"entry": nested,
		},
		InlineField: map[string]gen.MapCollectionsInlineField{
			"first":  {Label: "alpha"},
			"second": {Label: "beta", Active: gen.Ptr(false)},
		},
		StringListsField: map[string][]string{
			"empty": {},
			"nil":   nil,
			"vals":  {"a", "b"},
		},
		IntMatrixField: map[string][][]int64{
			"matrix": {nil, {0, 1}},
		},
	}

	assertJSON(
		"MapCollections json",
		collections,
		fmt.Sprintf(
			`{
				"simpleField":{"empty":{"foo":""},"filled":{"foo":"bar"}},
				"primitivesField":{"zero":{"stringField":"","intField":0,"floatField":0,"boolField":false,"datetimeField":"%s"},"value":{"stringField":"%s","intField":%d,"floatField":%v,"boolField":%t,"datetimeField":"%s","optStringField":"","optIntField":0,"optFloatField":0,"optBoolField":false,"optDatetimeField":"%s"}},
				"arraysField":{"value":{"stringField":["","alpha"],"intField":[0,-1,42],"floatField":[0,-1.5,3.14],"boolField":[true,false],"datetimeField":["%s","%s"],"optStringField":[],"optIntField":[0,7],"optFloatField":[],"optBoolField":[false],"optDatetimeField":[]}},
				"nestedField":{"entry":{"simple":{"foo":"nested"},"primitives":{"stringField":"%s","intField":%d,"floatField":%v,"boolField":%t,"datetimeField":"%s","optStringField":"","optIntField":0,"optFloatField":0,"optBoolField":false,"optDatetimeField":"%s"},"arrays":{"stringField":["","alpha"],"intField":[0,-1,42],"floatField":[0,-1.5,3.14],"boolField":[true,false],"datetimeField":["%s","%s"],"optStringField":[],"optIntField":[0,7],"optFloatField":[],"optBoolField":[false],"optDatetimeField":[]},"maps":{"stringField":{"empty":"","greeting":"hola"},"intField":{"answer":42,"zero":0},"floatField":{"negative":-2.5,"zero":0},"boolField":{"false":false,"true":true},"datetimeField":{"base":"%s","offset":"%s"},"optStringField":{},"optIntField":{"zero":0},"optFloatField":{},"optBoolField":{"false":false},"optDatetimeField":{}}}},
				"inlineField":{"first":{"label":"alpha"},"second":{"label":"beta","active":false}},
				"stringListsField":{"empty":[],"nil":null,"vals":["a","b"]},
				"intMatrixField":{"matrix":[null,[0,1]]}
			}`,
			time.Time{}.Format(time.RFC3339Nano),
			nested.Primitives.StringField,
			nested.Primitives.IntField,
			nested.Primitives.FloatField,
			nested.Primitives.BoolField,
			nested.Primitives.DatetimeField.Format(time.RFC3339Nano),
			nested.Primitives.OptDatetimeField.Format(time.RFC3339Nano),
			nested.Arrays.DatetimeField[0].Format(time.RFC3339Nano),
			nested.Arrays.DatetimeField[1].Format(time.RFC3339Nano),
			nested.Primitives.StringField,
			nested.Primitives.IntField,
			nested.Primitives.FloatField,
			nested.Primitives.BoolField,
			nested.Primitives.DatetimeField.Format(time.RFC3339Nano),
			nested.Primitives.OptDatetimeField.Format(time.RFC3339Nano),
			nested.Arrays.DatetimeField[0].Format(time.RFC3339Nano),
			nested.Arrays.DatetimeField[1].Format(time.RFC3339Nano),
			nested.Maps.DatetimeField["base"].Format(time.RFC3339Nano),
			nested.Maps.DatetimeField["offset"].Format(time.RFC3339Nano),
		),
	)

	assertEqual("MapCollections getter", collections.GetSimpleField(), collections.SimpleField)
	assertEqual("MapCollections getter optional style", collections.GetInlineFieldOr(nil), collections.InlineField)
	mapInline := collections.InlineField["second"]
	assertEqual("MapCollections inline getter", mapInline.GetActive(), false)

	var nilCollections *gen.MapCollections
	assertEqual("MapCollections nil getter", nilCollections.GetIntMatrixField(), map[string][][]int64(nil))
	assertEqual("MapCollections nil getter or", nilCollections.GetStringListsFieldOr(map[string][]string{"fallback": {"x"}}), map[string][]string{"fallback": {"x"}})

	var nilMapCollectionsInline *gen.MapCollectionsInlineField
	assertEqual("MapCollectionsInlineField nil getter", nilMapCollectionsInline.GetActive(), false)
	assertEqual("MapCollectionsInlineField nil getter or", nilMapCollectionsInline.GetLabelOr("fallback"), "fallback")
}

func testOptionalCollections() {
	assertJSON("OptionalCollections nil json", gen.OptionalCollections{}, `{}`)

	value := gen.OptionalCollections{
		SimpleList: gen.Ptr([]gen.SimpleType{}),
		SimpleMap:  gen.Ptr(map[string]gen.SimpleType{}),
		SimpleMatrix: gen.Ptr([][]gen.SimpleType{
			nil,
			{{Foo: "bar"}},
		}),
		InlineList: gen.Ptr([]gen.OptionalCollectionsInlineList{{Foo: "", Empty: gen.Ptr(false)}}),
		InlineMap: gen.Ptr(map[string]gen.OptionalCollectionsInlineMap{
			"first":  {Foo: "bar"},
			"second": {Foo: "", Empty: gen.Ptr(false)},
		}),
	}

	assertJSON(
		"OptionalCollections json",
		value,
		`{
			"simpleList":[],
			"simpleMap":{},
			"simpleMatrix":[null,[{"foo":"bar"}]],
			"inlineList":[{"foo":"","empty":false}],
			"inlineMap":{"first":{"foo":"bar"},"second":{"foo":"","empty":false}}
		}`,
	)

	assertEqual("OptionalCollections getter simple list", value.GetSimpleList(), []gen.SimpleType{})
	assertEqual("OptionalCollections getter simple map", value.GetSimpleMap(), map[string]gen.SimpleType{})
	assertEqual("OptionalCollections getter simple matrix", value.GetSimpleMatrix(), [][]gen.SimpleType{nil, {{Foo: "bar"}}})
	assertEqual("OptionalCollections getter inline list", value.GetInlineList(), []gen.OptionalCollectionsInlineList{{Foo: "", Empty: gen.Ptr(false)}})
	optionalInlineMap := value.GetInlineMap()["second"]
	assertEqual("OptionalCollections getter inline map empty", optionalInlineMap.GetEmpty(), false)

	var nilOptionalCollections *gen.OptionalCollections
	assertEqual("OptionalCollections nil getter", nilOptionalCollections.GetInlineMap(), map[string]gen.OptionalCollectionsInlineMap(nil))
	assertEqual("OptionalCollections nil getter or", nilOptionalCollections.GetSimpleListOr([]gen.SimpleType{{Foo: "fallback"}}), []gen.SimpleType{{Foo: "fallback"}})

	var nilOptionalCollectionsInlineList *gen.OptionalCollectionsInlineList
	assertEqual("OptionalCollectionsInlineList nil getter", nilOptionalCollectionsInlineList.GetEmpty(), false)
	assertEqual("OptionalCollectionsInlineList nil getter or", nilOptionalCollectionsInlineList.GetFooOr("fallback"), "fallback")

	var nilOptionalCollectionsInlineMap *gen.OptionalCollectionsInlineMap
	assertEqual("OptionalCollectionsInlineMap nil getter", nilOptionalCollectionsInlineMap.GetEmpty(), false)
	assertEqual("OptionalCollectionsInlineMap nil getter or", nilOptionalCollectionsInlineMap.GetFooOr("fallback"), "fallback")
}

func testInline() {
	value := gen.Inline{
		Simple: gen.InlineSimple{Foo: "bar"},
		Array:  []gen.InlineArray{{Foo: "alpha"}, {Foo: ""}},
		Map: map[string]gen.InlineMap{
			"entry": {Foo: "value"},
		},
		Nested: gen.InlineNested{
			Foo: gen.InlineNestedFoo{
				Bar: gen.InlineNestedFooBar{
					Baz: gen.InlineNestedFooBarBaz{Qux: gen.Ptr("")},
				},
			},
		},
	}

	assertJSON(
		"Inline json",
		value,
		`{
			"simple":{"foo":"bar"},
			"array":[{"foo":"alpha"},{"foo":""}],
			"map":{"entry":{"foo":"value"}},
			"nested":{"foo":{"bar":{"baz":{"qux":""}}}}
		}`,
	)

	assertEqual("Inline getter simple", value.GetSimple(), gen.InlineSimple{Foo: "bar"})
	assertEqual("Inline getter array", value.GetArray(), []gen.InlineArray{{Foo: "alpha"}, {Foo: ""}})
	assertEqual("Inline getter map", value.GetMap(), map[string]gen.InlineMap{"entry": {Foo: "value"}})
	nested := value.GetNested()
	nestedFoo := nested.GetFoo()
	nestedBar := nestedFoo.GetBar()
	nestedBaz := nestedBar.GetBaz()
	assertEqual("Inline nested getter optional", nestedBaz.GetQux(), "")

	var nilInline *gen.Inline
	assertEqual("Inline nil getter", nilInline.GetMap(), map[string]gen.InlineMap(nil))
	assertEqual("Inline nil getter or", nilInline.GetNestedOr(gen.InlineNested{Foo: gen.InlineNestedFoo{}}), gen.InlineNested{Foo: gen.InlineNestedFoo{}})

	var nilInlineSimple *gen.InlineSimple
	assertEqual("InlineSimple nil getter", nilInlineSimple.GetFoo(), "")

	var nilInlineArray *gen.InlineArray
	assertEqual("InlineArray nil getter or", nilInlineArray.GetFooOr("fallback"), "fallback")

	var nilInlineMap *gen.InlineMap
	assertEqual("InlineMap nil getter", nilInlineMap.GetFoo(), "")

	var nilInlineNested *gen.InlineNested
	assertEqual("InlineNested nil getter", nilInlineNested.GetFoo(), gen.InlineNestedFoo{})

	var nilInlineNestedFoo *gen.InlineNestedFoo
	assertEqual("InlineNestedFoo nil getter", nilInlineNestedFoo.GetBar(), gen.InlineNestedFooBar{})

	var nilInlineNestedFooBar *gen.InlineNestedFooBar
	assertEqual("InlineNestedFooBar nil getter", nilInlineNestedFooBar.GetBaz(), gen.InlineNestedFooBarBaz{})

	var nilInlineNestedFooBarBaz *gen.InlineNestedFooBarBaz
	assertEqual("InlineNestedFooBarBaz nil getter", nilInlineNestedFooBarBaz.GetQux(), "")
	assertEqual("InlineNestedFooBarBaz nil getter or", nilInlineNestedFooBarBaz.GetQuxOr("fallback"), "fallback")
}

func testMetadata() {
	assertEqual("metadata type count", len(gen.VDLMetadata.Types), 23)
	assertEqual("metadata enum count", len(gen.VDLMetadata.Enums), 0)
	assertEqual("metadata constant count", len(gen.VDLMetadata.Constants), 0)

	assertTypeMetadata("SimpleType", "SimpleType", "SimpleType", "", "SimpleType", false)
	assertTypeMetadata("Inline", "Inline", "Inline", "", "Inline", false)
	assertTypeMetadata("InlineNestedFooBarBaz", "baz", "Inline.nested.foo.bar.baz", "InlineNestedFooBar", "InlineNestedFooBarBaz", true)
	assertTypeMetadata("Matrices", "Matrices", "Matrices", "", "Matrices", false)
	assertTypeMetadata("MatricesInline", "inline", "Matrices.inline", "Matrices", "MatricesInline", true)
	assertTypeMetadata("MapCollections", "MapCollections", "MapCollections", "", "MapCollections", false)
	assertTypeMetadata("MapCollectionsInlineField", "inlineField", "MapCollections.inlineField", "MapCollections", "MapCollectionsInlineField", true)
	assertTypeMetadata("OptionalObjects", "OptionalObjects", "OptionalObjects", "", "OptionalObjects", false)
	assertTypeMetadata("OptionalObjectsInline", "inline", "OptionalObjects.inline", "OptionalObjects", "OptionalObjectsInline", true)
	assertTypeMetadata("OptionalCollections", "OptionalCollections", "OptionalCollections", "", "OptionalCollections", false)
	assertTypeMetadata("OptionalCollectionsInlineList", "inlineList", "OptionalCollections.inlineList", "OptionalCollections", "OptionalCollectionsInlineList", true)
	assertTypeMetadata("OptionalCollectionsInlineMap", "inlineMap", "OptionalCollections.inlineMap", "OptionalCollections", "OptionalCollectionsInlineMap", true)

	assertFieldMetadata("SimpleType", "Foo", "foo", "foo", "string", false)
	assertFieldMetadata("Inline", "Map", "map", "map", "map[string]InlineMap", false)
	assertFieldMetadata("InlineNestedFooBarBaz", "Qux", "qux", "qux", "*string", true)
	assertFieldMetadata("Primitives", "OptBoolField", "optBoolField", "optBoolField", "*bool", true)
	assertFieldMetadata("Arrays", "OptDatetimeField", "optDatetimeField", "optDatetimeField", "*[]time.Time", true)
	assertFieldMetadata("Maps", "IntField", "intField", "intField", "map[string]int64", false)
	assertFieldMetadata("NestedArrays", "Primitives", "primitives", "primitives", "[]Primitives", false)
	assertFieldMetadata("Matrices", "Inline", "inline", "inline", "[][]MatricesInline", false)
	assertFieldMetadata("MatricesInline", "Enabled", "enabled", "enabled", "*bool", true)
	assertFieldMetadata("MapCollections", "StringListsField", "stringListsField", "stringListsField", "map[string][]string", false)
	assertFieldMetadata("MapCollections", "IntMatrixField", "intMatrixField", "intMatrixField", "map[string][][]int64", false)
	assertFieldMetadata("MapCollectionsInlineField", "Active", "active", "active", "*bool", true)
	assertFieldMetadata("OptionalObjects", "Simple", "simple", "simple", "*SimpleType", true)
	assertFieldMetadata("OptionalObjectsInline", "Count", "count", "count", "*int64", true)
	assertFieldMetadata("OptionalCollections", "SimpleMatrix", "simpleMatrix", "simpleMatrix", "*[][]SimpleType", true)
	assertFieldMetadata("OptionalCollections", "InlineMap", "inlineMap", "inlineMap", "*map[string]OptionalCollectionsInlineMap", true)
	assertFieldMetadata("OptionalCollectionsInlineList", "Empty", "empty", "empty", "*bool", true)

	missingType, ok := gen.VDLMetadata.Type("Missing")
	assertEqual("missing type metadata found", ok, false)
	assertEqual("missing type metadata zero", missingType, gen.TypeMetadata{})

	missingField, ok := gen.VDLMetadata.Types["SimpleType"].Field("Missing")
	assertEqual("missing field metadata found", ok, false)
	assertEqual("missing field metadata zero", missingField, gen.FieldMetadata{})

	missingEnum, ok := gen.VDLMetadata.Enum("Missing")
	assertEqual("missing enum metadata found", ok, false)
	assertEqual("missing enum metadata zero", missingEnum, gen.EnumMetadata{})

	missingConstant, ok := gen.VDLMetadata.Constant("Missing")
	assertEqual("missing constant metadata found", ok, false)
	assertEqual("missing constant metadata zero", missingConstant, gen.ConstantMetadata{})

	missingMember, ok := gen.EnumMetadata{}.Member("Missing")
	assertEqual("missing enum member metadata found", ok, false)
	assertEqual("missing enum member metadata zero", missingMember, gen.EnumMemberMetadata{})
}

func main() {
	baseTime := time.Date(2024, time.January, 2, 3, 4, 5, 678901234, time.UTC)
	offsetTime := time.Date(2025, time.June, 7, 8, 9, 10, 111213000, time.FixedZone("UTC-3", -3*60*60))

	testPointerHelpers()
	testSimpleType()
	primitives := testPrimitives(baseTime, offsetTime)
	arrays := testArrays(baseTime, offsetTime)
	maps := testMaps(baseTime, offsetTime)
	nested := testNested(primitives, arrays, maps)
	testNestedArrays(primitives, arrays, maps)
	testOptionalObjects(baseTime)
	testMatrices(baseTime, offsetTime)
	testMapCollections(nested)
	testOptionalCollections()
	testInline()
	testMetadata()

	fmt.Println("Test pass!")
}
