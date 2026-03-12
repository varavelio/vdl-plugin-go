package main

import (
	"encoding/json"
	"fixture/gen"
	"fmt"
	"reflect"
	"time"
)

func assert(name string, anyStruct any, expectedJSON string) {
	marshaled, err := json.Marshal(anyStruct)
	if err != nil {
		panic(name + ": error marshaling struct: " + err.Error())
	}
	if string(marshaled) != expectedJSON {
		panic(name + ": unexpected json output")
	}

	var unmarshaled any
	if err := json.Unmarshal(marshaled, &unmarshaled); err != nil {
		panic(name + ": error unmarshaling json: " + err.Error())
	}
	if reflect.DeepEqual(anyStruct, unmarshaled) {
		panic(name + ": unmarshaled struct does not match original")
	}
}

func main() {
	var expected string
	var anyStruct any

	anyStruct = gen.SimpleType{Foo: "bar"}
	expected = `{"foo":"bar"}`
	assert("SimpleType", anyStruct, expected)

	anyStruct = gen.Primitives{
		StringField:      "hello",
		IntField:         42,
		FloatField:       3.14,
		BoolField:        true,
		DatetimeField:    time.Now(),
		OptStringField:   new("hello"),
		OptIntField:      new(int64(42)),
		OptFloatField:    new(3.14),
		OptBoolField:     new(true),
		OptDatetimeField: new(time.Now()),
	}
	expected = `{"stringField":"hello","intField":42,"floatField":3.14,"boolField":true,"datetimeField":"` + anyStruct.(gen.Primitives).DatetimeField.Format(time.RFC3339Nano) + `","optStringField":"hello","optIntField":42,"optFloatField":3.14,"optBoolField":true,"optDatetimeField":"` + anyStruct.(gen.Primitives).OptDatetimeField.Format(time.RFC3339Nano) + `"}`
	assert("Primitives", anyStruct, expected)

	fmt.Println("Test pass!")
}
