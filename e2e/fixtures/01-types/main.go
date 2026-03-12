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

	var actual any
	if err := json.Unmarshal(marshaled, &actual); err != nil {
		panic(name + ": error unmarshaling marshaled json: " + err.Error())
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
	expected = fmt.Sprintf(
		`{
			"stringField":"hello",
			"intField":42,
			"floatField":3.14,
			"boolField":true,
			"datetimeField":"%s",
			"optStringField":"hello",
			"optIntField":42,
			"optFloatField":3.14,
			"optBoolField":true,
			"optDatetimeField":"%s"
		}`,
		anyStruct.(gen.Primitives).DatetimeField.Format(time.RFC3339Nano),
		anyStruct.(gen.Primitives).OptDatetimeField.Format(time.RFC3339Nano),
	)
	assert("Primitives", anyStruct, expected)

	fmt.Println("Test pass!")
}
