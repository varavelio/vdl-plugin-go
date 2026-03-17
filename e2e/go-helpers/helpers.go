package testutil

import (
	"encoding/json"
	"fmt"
	"reflect"
	"strings"
)

// AnnotationReader exposes annotation lookups used by metadata assertions.
type AnnotationReader interface {
	Get(name string) (any, bool)
	GetAll(name string) ([]any, bool)
}

// MustEqual panics when the values are not deeply equal.
func MustEqual(name string, got, want any) {
	if !reflect.DeepEqual(got, want) {
		panic(fmt.Sprintf("%s: got %#v want %#v", name, got, want))
	}
}

// MustPresent panics when a lookup is missing and returns the found value.
func MustPresent[T any](name string, value T, ok bool) T {
	if !ok {
		panic("missing " + name)
	}
	return value
}

// MustAbsent panics when a lookup unexpectedly exists or does not return its zero value.
func MustAbsent[T any](name string, value T, ok bool, zero T) {
	MustEqual(name+" exists", ok, false)
	MustEqual(name+" zero", value, zero)
}

// MustJSON panics when the value does not match the expected JSON document.
func MustJSON(name string, value any, want string) {
	marshaled, err := json.Marshal(value)
	if err != nil {
		panic(name + ": marshal failed: " + err.Error())
	}

	gotValue := mustDecodeJSON(name+" actual", marshaled)
	wantValue := mustDecodeJSON(name+" expected", []byte(want))

	if !reflect.DeepEqual(gotValue, wantValue) {
		panic(fmt.Sprintf("%s: got %s want %s", name, string(marshaled), want))
	}
}

// MustNoError panics when err is not nil.
func MustNoError(name string, err error) {
	if err != nil {
		panic(name + ": unexpected error: " + err.Error())
	}
}

// MustErrContains panics when err is nil or does not contain the expected text.
func MustErrContains(name string, err error, want string) {
	if err == nil {
		panic(name + ": expected error")
	}
	if !strings.Contains(err.Error(), want) {
		panic(fmt.Sprintf("%s: got %q want substring %q", name, err.Error(), want))
	}
}

// MustAnnotationMissing panics when an annotation lookup unexpectedly returns a value.
func MustAnnotationMissing(name string, annotations AnnotationReader) {
	value, ok := annotations.Get("missing")
	MustEqual(name+" missing annotation exists", ok, false)
	MustEqual(name+" missing annotation value", value, nil)

	values, ok := annotations.GetAll("missing")
	MustEqual(name+" missing annotation list exists", ok, false)
	MustEqual(name+" missing annotation list", values, []any(nil))
}

// MustAnnotationValue panics when the latest annotation value does not match.
func MustAnnotationValue(name string, annotations AnnotationReader, key string, want any) {
	value, ok := annotations.Get(key)
	MustEqual(name+" annotation exists", ok, true)
	MustEqual(name+" annotation value", value, want)
}

// MustAnnotationValues panics when the repeated annotation values do not match.
func MustAnnotationValues(name string, annotations AnnotationReader, key string, want []any) {
	values, ok := annotations.GetAll(key)
	MustEqual(name+" annotation list exists", ok, true)
	MustEqual(name+" annotation list", values, want)
}

func mustDecodeJSON(name string, data []byte) any {
	var value any
	if err := json.Unmarshal(data, &value); err != nil {
		panic(name + ": unmarshal failed: " + err.Error())
	}
	return value
}
