package main

import (
	"encoding/json"
	"fixture/gen"
	"fmt"
	"reflect"
	"strings"
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

func assertNoError(name string, err error) {
	if err != nil {
		panic(name + ": unexpected error: " + err.Error())
	}
}

func assertErrContains(name string, err error, substring string) {
	if err == nil {
		panic(name + ": expected error")
	}
	if !strings.Contains(err.Error(), substring) {
		panic(fmt.Sprintf("%s: got error %q, expected substring %q", name, err.Error(), substring))
	}
}

func assertTypeMetadata(name, vdlName, path, parent, kind, goType string, inline bool) {
	metadata, ok := gen.VDLMetadata.Type(name)
	if !ok {
		panic("missing type metadata: " + name)
	}

	assertEqual(name+" metadata name", metadata.Name, name)
	assertEqual(name+" metadata vdl name", metadata.VDLName, vdlName)
	assertEqual(name+" metadata path", metadata.Path, path)
	assertEqual(name+" metadata parent", metadata.Parent, parent)
	assertEqual(name+" metadata kind", metadata.Kind, kind)
	assertEqual(name+" metadata go type", metadata.GoType, goType)
	assertEqual(name+" metadata inline", metadata.Inline, inline)
	assertEqual(name+" metadata annotations has", metadata.Annotations.Has("missing"), false)
	assertEqual(name+" metadata annotations get", metadata.Annotations.Get("missing"), []any(nil))
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
	assertEqual(typeName+"."+fieldName+" field annotations get", fieldMetadata.Annotations.Get("missing"), []any(nil))
}

func assertEnumMetadata(name, vdlName, valueType string) gen.EnumMetadata {
	metadata, ok := gen.VDLMetadata.Enum(name)
	if !ok {
		panic("missing enum metadata: " + name)
	}

	assertEqual(name+" enum metadata name", metadata.Name, name)
	assertEqual(name+" enum metadata vdl name", metadata.VDLName, vdlName)
	assertEqual(name+" enum metadata value type", metadata.ValueType, valueType)

	return metadata
}

func assertEnumMemberMetadata(enumName, memberName, vdlName, constName string, value any) gen.EnumMemberMetadata {
	enumMetadata, ok := gen.VDLMetadata.Enum(enumName)
	if !ok {
		panic("missing enum metadata: " + enumName)
	}

	memberMetadata, ok := enumMetadata.Member(memberName)
	if !ok {
		panic("missing enum member metadata: " + enumName + "." + memberName)
	}

	assertEqual(enumName+"."+memberName+" member name", memberMetadata.Name, memberName)
	assertEqual(enumName+"."+memberName+" member vdl name", memberMetadata.VDLName, vdlName)
	assertEqual(enumName+"."+memberName+" member const name", memberMetadata.ConstName, constName)
	assertEqual(enumName+"."+memberName+" member value", memberMetadata.Value, value)

	return memberMetadata
}

func testPointerHelpers() {
	assertEqual("Ptr string", *gen.Ptr("hello"), "hello")
	assertEqual("Ptr enum", *gen.Ptr(gen.PriorityHigh), gen.PriorityHigh)
	assertEqual("Val nil enum", gen.Val[*gen.Priority](nil), (*gen.Priority)(nil))
	assertEqual("Val string", gen.Val(gen.Ptr("hello")), "hello")
	assertEqual("Or nil string", gen.Or(nil, "fallback"), "fallback")
	assertEqual("Or enum", gen.Or(gen.Ptr(gen.DeliveryStateDelivered), gen.DeliveryStateUnknown), gen.DeliveryStateDelivered)
}

func testStringEnums() {
	assertEqual("DeliveryState list", gen.DeliveryStateList, []gen.DeliveryState{
		gen.DeliveryStateUnknown,
		gen.DeliveryStatePending,
		gen.DeliveryStateInTransit,
		gen.DeliveryStateDelivered,
		gen.DeliveryStateReturned,
	})
	assertEqual("DeliveryState base list", gen.DeliveryStateBaseList, []gen.DeliveryStateBase{
		gen.DeliveryStateBaseUnknown,
		gen.DeliveryStateBasePending,
		gen.DeliveryStateBaseInTransit,
	})

	assertEqual("DeliveryState string implicit", gen.DeliveryStatePending.String(), "Pending")
	assertEqual("DeliveryState string explicit", gen.DeliveryStateInTransit.String(), "in-transit")
	assertEqual("DeliveryState string invalid", gen.DeliveryState("ghost").String(), "ghost")
	assertEqual("DeliveryState valid zero", gen.DeliveryStateUnknown.IsValid(), true)
	assertEqual("DeliveryState invalid", gen.DeliveryState("ghost").IsValid(), false)
	assertEqual("DeliveryState base string", gen.DeliveryStateBasePending.String(), "Pending")
	assertEqual("DeliveryState base invalid", gen.DeliveryStateBase("ghost").IsValid(), false)

	assertJSON("DeliveryState marshal zero", gen.DeliveryStateUnknown, `""`)
	assertJSON("DeliveryState marshal explicit", gen.DeliveryStateDelivered, `"delivered"`)
	assertJSON("DeliveryStateBase marshal", gen.DeliveryStateBaseInTransit, `"in-transit"`)

	_, err := json.Marshal(gen.DeliveryState("ghost"))
	assertErrContains("DeliveryState invalid marshal", err, "cannot marshal invalid value for enum DeliveryState")
	_, err = json.Marshal(gen.DeliveryStateBase("ghost"))
	assertErrContains("DeliveryStateBase invalid marshal", err, "cannot marshal invalid value for enum DeliveryStateBase")

	var state gen.DeliveryState
	err = json.Unmarshal([]byte(`"in-transit"`), &state)
	assertNoError("DeliveryState unmarshal valid", err)
	assertEqual("DeliveryState unmarshal valid value", state, gen.DeliveryStateInTransit)

	err = json.Unmarshal([]byte(`"ghost"`), &state)
	assertErrContains("DeliveryState unmarshal invalid value", err, "invalid value for enum DeliveryState")
	err = json.Unmarshal([]byte(`123`), &state)
	assertErrContains("DeliveryState unmarshal wrong type", err, "cannot unmarshal number into Go value of type string")

	var baseState gen.DeliveryStateBase
	err = json.Unmarshal([]byte(`"Pending"`), &baseState)
	assertNoError("DeliveryStateBase unmarshal valid", err)
	assertEqual("DeliveryStateBase unmarshal valid value", baseState, gen.DeliveryStateBasePending)
	err = json.Unmarshal([]byte(`"ghost"`), &baseState)
	assertErrContains("DeliveryStateBase unmarshal invalid value", err, "invalid value for enum DeliveryStateBase")
}

func testIntEnums() {
	assertEqual("Priority list", gen.PriorityList, []gen.Priority{
		gen.PriorityLow,
		gen.PriorityNormal,
		gen.PriorityHigh,
		gen.PriorityUrgent,
	})
	assertEqual("Priority base list", gen.PriorityBaseList, []gen.PriorityBase{
		gen.PriorityBaseLow,
		gen.PriorityBaseNormal,
	})

	assertEqual("Priority string zero", gen.PriorityLow.String(), "Low")
	assertEqual("Priority string spread", gen.PriorityNormal.String(), "Normal")
	assertEqual("Priority string explicit", gen.PriorityUrgent.String(), "Urgent")
	assertEqual("Priority string invalid", gen.Priority(42).String(), "Priority(42)")
	assertEqual("Priority valid zero", gen.PriorityLow.IsValid(), true)
	assertEqual("Priority invalid", gen.Priority(2).IsValid(), false)
	assertEqual("PriorityBase string", gen.PriorityBaseNormal.String(), "Normal")
	assertEqual("PriorityBase invalid string", gen.PriorityBase(9).String(), "PriorityBase(9)")

	assertJSON("Priority marshal zero", gen.PriorityLow, `0`)
	assertJSON("Priority marshal explicit", gen.PriorityHigh, `5`)
	assertJSON("PriorityBase marshal", gen.PriorityBaseNormal, `1`)

	_, err := json.Marshal(gen.Priority(2))
	assertErrContains("Priority invalid marshal", err, "cannot marshal invalid value for enum Priority")
	_, err = json.Marshal(gen.PriorityBase(9))
	assertErrContains("PriorityBase invalid marshal", err, "cannot marshal invalid value for enum PriorityBase")

	var priority gen.Priority
	err = json.Unmarshal([]byte(`9`), &priority)
	assertNoError("Priority unmarshal valid", err)
	assertEqual("Priority unmarshal valid value", priority, gen.PriorityUrgent)
	err = json.Unmarshal([]byte(`2`), &priority)
	assertErrContains("Priority unmarshal invalid value", err, "invalid value for enum Priority")
	err = json.Unmarshal([]byte(`"high"`), &priority)
	assertErrContains("Priority unmarshal wrong type", err, "cannot unmarshal string into Go value of type int")

	var basePriority gen.PriorityBase
	err = json.Unmarshal([]byte(`1`), &basePriority)
	assertNoError("PriorityBase unmarshal valid", err)
	assertEqual("PriorityBase unmarshal valid value", basePriority, gen.PriorityBaseNormal)
	err = json.Unmarshal([]byte(`3`), &basePriority)
	assertErrContains("PriorityBase unmarshal invalid value", err, "invalid value for enum PriorityBase")
}

func testEnumCollections() {
	states := gen.DeliveryStates{
		gen.DeliveryStateUnknown,
		gen.DeliveryStateInTransit,
		gen.DeliveryStateReturned,
	}
	lookup := gen.PriorityLookup{
		"default": gen.PriorityNormal,
		"urgent":  gen.PriorityUrgent,
	}

	assertJSON("DeliveryStates json", states, `["","in-transit","returned"]`)
	assertJSON("PriorityLookup json", lookup, `{"default":1,"urgent":9}`)

	var zeroStates gen.DeliveryStates
	var zeroLookup gen.PriorityLookup
	assertJSON("DeliveryStates zero json", zeroStates, `null`)
	assertJSON("PriorityLookup zero json", zeroLookup, `null`)

	var decodedStates gen.DeliveryStates
	err := json.Unmarshal([]byte(`["Pending","delivered"]`), &decodedStates)
	assertNoError("DeliveryStates unmarshal valid", err)
	assertEqual("DeliveryStates unmarshal value", decodedStates, gen.DeliveryStates{
		gen.DeliveryStatePending,
		gen.DeliveryStateDelivered,
	})

	var decodedLookup gen.PriorityLookup
	err = json.Unmarshal([]byte(`{"primary":0,"secondary":9}`), &decodedLookup)
	assertNoError("PriorityLookup unmarshal valid", err)
	assertEqual("PriorityLookup unmarshal value", decodedLookup, gen.PriorityLookup{
		"primary":   gen.PriorityLow,
		"secondary": gen.PriorityUrgent,
	})

	_, err = json.Marshal(gen.DeliveryStates{gen.DeliveryState("ghost")})
	assertErrContains("DeliveryStates invalid marshal", err, "cannot marshal invalid value for enum DeliveryState")
	_, err = json.Marshal(gen.PriorityLookup{"bad": gen.Priority(2)})
	assertErrContains("PriorityLookup invalid marshal", err, "cannot marshal invalid value for enum Priority")
	err = json.Unmarshal([]byte(`["ghost"]`), &decodedStates)
	assertErrContains("DeliveryStates invalid unmarshal", err, "invalid value for enum DeliveryState")
	err = json.Unmarshal([]byte(`{"bad":2}`), &decodedLookup)
	assertErrContains("PriorityLookup invalid unmarshal", err, "invalid value for enum Priority")
}

func testEnumObjects() {
	envelope := gen.EnumEnvelope{
		State:       gen.DeliveryStatePending,
		OptState:    gen.Ptr(gen.DeliveryStateUnknown),
		Priority:    gen.PriorityUrgent,
		OptPriority: gen.Ptr(gen.PriorityLow),
		States: gen.DeliveryStates{
			gen.DeliveryStateUnknown,
			gen.DeliveryStateInTransit,
			gen.DeliveryStateDelivered,
		},
		PriorityMatrix: [][]gen.Priority{
			{gen.PriorityLow, gen.PriorityHigh},
			nil,
			{gen.PriorityUrgent},
		},
		StateMap: map[string]gen.DeliveryState{
			"empty":  gen.DeliveryStateUnknown,
			"return": gen.DeliveryStateReturned,
		},
		PriorityMap: gen.PriorityLookup{
			"default": gen.PriorityNormal,
			"urgent":  gen.PriorityUrgent,
		},
		Nested: gen.EnumEnvelopeNested{
			State:    gen.DeliveryStateDelivered,
			Priority: gen.PriorityHigh,
			OptState: gen.Ptr(gen.DeliveryStateUnknown),
		},
	}

	assertJSON(
		"EnumEnvelope json",
		envelope,
		`{
			"state":"Pending",
			"optState":"",
			"priority":9,
			"optPriority":0,
			"states":["","in-transit","delivered"],
			"priorityMatrix":[[0,5],null,[9]],
			"stateMap":{"empty":"","return":"returned"},
			"priorityMap":{"default":1,"urgent":9},
			"nested":{"state":"delivered","priority":5,"optState":""}
		}`,
	)

	assertEqual("EnumEnvelope getter state", envelope.GetState(), gen.DeliveryStatePending)
	assertEqual("EnumEnvelope getter opt state", envelope.GetOptState(), gen.DeliveryStateUnknown)
	assertEqual("EnumEnvelope getter priority", envelope.GetPriority(), gen.PriorityUrgent)
	assertEqual("EnumEnvelope getter opt priority", envelope.GetOptPriority(), gen.PriorityLow)
	assertEqual("EnumEnvelope getter states", envelope.GetStates(), gen.DeliveryStates{gen.DeliveryStateUnknown, gen.DeliveryStateInTransit, gen.DeliveryStateDelivered})
	assertEqual("EnumEnvelope getter priority matrix", envelope.GetPriorityMatrix(), [][]gen.Priority{{gen.PriorityLow, gen.PriorityHigh}, nil, {gen.PriorityUrgent}})
	assertEqual("EnumEnvelope getter state map", envelope.GetStateMap(), map[string]gen.DeliveryState{"empty": gen.DeliveryStateUnknown, "return": gen.DeliveryStateReturned})
	assertEqual("EnumEnvelope getter priority map", envelope.GetPriorityMap(), gen.PriorityLookup{"default": gen.PriorityNormal, "urgent": gen.PriorityUrgent})

	nested := envelope.GetNested()
	assertEqual("EnumEnvelope nested getter state", nested.GetState(), gen.DeliveryStateDelivered)
	assertEqual("EnumEnvelope nested getter priority", nested.GetPriority(), gen.PriorityHigh)
	assertEqual("EnumEnvelope nested getter opt state", nested.GetOptState(), gen.DeliveryStateUnknown)

	var nilEnvelope *gen.EnumEnvelope
	assertEqual("EnumEnvelope nil getter state", nilEnvelope.GetState(), gen.DeliveryStateUnknown)
	assertEqual("EnumEnvelope nil getter opt state", nilEnvelope.GetOptState(), gen.DeliveryStateUnknown)
	assertEqual("EnumEnvelope nil getter priority", nilEnvelope.GetPriority(), gen.PriorityLow)
	assertEqual("EnumEnvelope nil getter opt priority or", nilEnvelope.GetOptPriorityOr(gen.PriorityHigh), gen.PriorityHigh)
	assertEqual("EnumEnvelope nil getter states or", nilEnvelope.GetStatesOr(gen.DeliveryStates{gen.DeliveryStateDelivered}), gen.DeliveryStates{gen.DeliveryStateDelivered})
	assertEqual("EnumEnvelope nil getter state map", nilEnvelope.GetStateMap(), map[string]gen.DeliveryState(nil))

	var nilNested *gen.EnumEnvelopeNested
	assertEqual("EnumEnvelopeNested nil getter state", nilNested.GetState(), gen.DeliveryStateUnknown)
	assertEqual("EnumEnvelopeNested nil getter priority or", nilNested.GetPriorityOr(gen.PriorityUrgent), gen.PriorityUrgent)
	assertEqual("EnumEnvelopeNested nil getter opt state", nilNested.GetOptState(), gen.DeliveryStateUnknown)

	groups := gen.EnumGroups{
		States:     gen.DeliveryStates{gen.DeliveryStatePending, gen.DeliveryStateReturned},
		Priorities: []gen.Priority{gen.PriorityLow, gen.PriorityNormal, gen.PriorityUrgent},
	}
	assertJSON("EnumGroups json", groups, `{"states":["Pending","returned"],"priorities":[0,1,9]}`)
	assertEqual("EnumGroups getter states", groups.GetStates(), gen.DeliveryStates{gen.DeliveryStatePending, gen.DeliveryStateReturned})

	var decoded gen.EnumEnvelope
	err := json.Unmarshal([]byte(`{
			"state":"Pending",
			"optState":"",
			"priority":9,
			"optPriority":0,
			"states":["","in-transit","delivered"],
			"priorityMatrix":[[0,5],null,[9]],
			"stateMap":{"empty":"","return":"returned"},
			"priorityMap":{"default":1,"urgent":9},
			"nested":{"state":"delivered","priority":5,"optState":""}
		}`), &decoded)
	assertNoError("EnumEnvelope unmarshal valid", err)
	assertEqual("EnumEnvelope unmarshal value", decoded, envelope)

	err = json.Unmarshal([]byte(`{
			"state":"ghost",
			"priority":9,
			"states":[],
			"priorityMatrix":[],
			"stateMap":{},
			"priorityMap":{},
			"nested":{"state":"","priority":0}
		}`), &decoded)
	assertErrContains("EnumEnvelope unmarshal invalid", err, "invalid value for enum DeliveryState")

	_, err = json.Marshal(gen.EnumEnvelope{
		State:          gen.DeliveryState("ghost"),
		Priority:       gen.PriorityLow,
		States:         gen.DeliveryStates{},
		PriorityMatrix: [][]gen.Priority{},
		StateMap:       map[string]gen.DeliveryState{},
		PriorityMap:    gen.PriorityLookup{},
		Nested: gen.EnumEnvelopeNested{
			State:    gen.DeliveryStateUnknown,
			Priority: gen.PriorityLow,
		},
	})
	assertErrContains("EnumEnvelope invalid marshal", err, "cannot marshal invalid value for enum DeliveryState")
}

func testMetadata() {
	assertEqual("metadata type count", len(gen.VDLMetadata.Types), 5)
	assertEqual("metadata enum count", len(gen.VDLMetadata.Enums), 4)
	assertEqual("metadata constant count", len(gen.VDLMetadata.Constants), 0)

	assertTypeMetadata("DeliveryStates", "DeliveryStates", "DeliveryStates", "", "array", "[]DeliveryState", false)
	assertTypeMetadata("PriorityLookup", "PriorityLookup", "PriorityLookup", "", "map", "map[string]Priority", false)
	assertTypeMetadata("EnumEnvelope", "EnumEnvelope", "EnumEnvelope", "", "object", "EnumEnvelope", false)
	assertTypeMetadata("EnumEnvelopeNested", "nested", "EnumEnvelope.nested", "EnumEnvelope", "object", "EnumEnvelopeNested", true)
	assertTypeMetadata("EnumGroups", "EnumGroups", "EnumGroups", "", "object", "EnumGroups", false)

	assertFieldMetadata("EnumEnvelope", "State", "state", "state", "DeliveryState", false)
	assertFieldMetadata("EnumEnvelope", "OptState", "optState", "optState", "*DeliveryState", true)
	assertFieldMetadata("EnumEnvelope", "PriorityMatrix", "priorityMatrix", "priorityMatrix", "[][]Priority", false)
	assertFieldMetadata("EnumEnvelope", "PriorityMap", "priorityMap", "priorityMap", "PriorityLookup", false)
	assertFieldMetadata("EnumEnvelopeNested", "OptState", "optState", "optState", "*DeliveryState", true)
	assertFieldMetadata("EnumGroups", "Priorities", "priorities", "priorities", "[]Priority", false)

	deliveryState := assertEnumMetadata("DeliveryState", "DeliveryState", "string")
	assertEqual("DeliveryState annotation tag", deliveryState.Annotations.Has("tag"), true)
	assertEqual("DeliveryState annotation tag values", deliveryState.Annotations.Get("tag"), []any{nil})

	deliveryStateUnknown := assertEnumMemberMetadata("DeliveryState", "Unknown", "Unknown", "DeliveryStateUnknown", "")
	assertEqual("DeliveryState Unknown label", deliveryStateUnknown.Annotations.Get("label"), []any{"empty"})
	deliveryStateReturned := assertEnumMemberMetadata("DeliveryState", "Returned", "Returned", "DeliveryStateReturned", "returned")
	assertEqual("DeliveryState Returned deprecated", deliveryStateReturned.Annotations.Get("deprecated"), []any{"Use Delivered instead."})

	deliveryStateBase := assertEnumMetadata("DeliveryStateBase", "DeliveryStateBase", "string")
	assertEqual("DeliveryStateBase annotation meta", deliveryStateBase.Annotations.Get("meta"), []any{map[string]any{"family": "string"}})
	assertEnumMemberMetadata("DeliveryStateBase", "InTransit", "InTransit", "DeliveryStateBaseInTransit", "in-transit")

	priority := assertEnumMetadata("Priority", "Priority", "int")
	assertEqual("Priority annotation deprecated", priority.Annotations.Get("deprecated"), []any{"Use DeliveryState severity labels instead."})
	assertEnumMemberMetadata("Priority", "Low", "Low", "PriorityLow", 0)
	assertEnumMemberMetadata("Priority", "Urgent", "Urgent", "PriorityUrgent", 9)

	priorityBase := assertEnumMetadata("PriorityBase", "PriorityBase", "int")
	assertEqual("PriorityBase annotation meta", priorityBase.Annotations.Get("meta"), []any{map[string]any{"family": "int"}})
	assertEnumMemberMetadata("PriorityBase", "Normal", "Normal", "PriorityBaseNormal", 1)

	missingType, ok := gen.VDLMetadata.Type("Missing")
	assertEqual("missing type metadata found", ok, false)
	assertEqual("missing type metadata zero", missingType, gen.TypeMetadata{})

	missingField, ok := gen.VDLMetadata.Types["DeliveryStates"].Field("Missing")
	assertEqual("missing field metadata found", ok, false)
	assertEqual("missing field metadata zero", missingField, gen.FieldMetadata{})

	missingEnum, ok := gen.VDLMetadata.Enum("Missing")
	assertEqual("missing enum metadata found", ok, false)
	assertEqual("missing enum metadata zero", missingEnum, gen.EnumMetadata{})

	missingMember, ok := gen.VDLMetadata.Enums["Priority"].Member("Missing")
	assertEqual("missing enum member metadata found", ok, false)
	assertEqual("missing enum member metadata zero", missingMember, gen.EnumMemberMetadata{})

	missingConstant, ok := gen.VDLMetadata.Constant("Missing")
	assertEqual("missing constant metadata found", ok, false)
	assertEqual("missing constant metadata zero", missingConstant, gen.ConstantMetadata{})
}

func main() {
	testPointerHelpers()
	testStringEnums()
	testIntEnums()
	testEnumCollections()
	testEnumObjects()
	testMetadata()

	fmt.Println("Test pass!")
}
