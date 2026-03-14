package main

import (
	"encoding/json"
	"fixture/gen"
	"fmt"
	"reflect"
	"strings"
)

var (
	_ string    = gen.ApiVersion
	_ int64     = gen.MaxItems
	_ float64   = gen.Ratio
	_ bool      = gen.FeatureEnabled
	_ string    = gen.DefaultStatus
	_ int64     = gen.DefaultPriority
	_ string    = gen.ReferencedVersion
	_ string    = gen.CopiedStatus
	_ []string  = gen.Statuses
	_ []string  = gen.ReleaseVersions
	_ [][]int64 = gen.PriorityMatrix
	_ struct {
		Env    string
		Region string
	} = gen.BaseLabels
	_ struct {
		Env    string
		Region string
		Owner  string
	} = gen.ExtraLabels
	_ struct {
		Name    string
		Version string
		Tags    []string
	} = gen.BuildInfo
	_ struct {
		Id       string
		Status   string
		Priority int64
		Tags     []string
		Labels   struct {
			Env    string
			Region string
		}
		Nested struct {
			Enabled bool
			Retries int64
		}
	} = gen.BaseProfile
	_ struct {
		Id       string
		Status   string
		Priority int64
		Labels   struct {
			Env    string
			Region string
		}
		Tags   []string
		Nested struct {
			Enabled bool
			Retries int64
		}
	} = gen.DefaultProfile
	_ struct {
		Mode    string
		Enabled bool
	} = gen.InlineSettings
	_ struct {
		Status   string
		Priority int64
	} = gen.ProfileSummary
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

func assertAnnotationMissing(name string, annotations gen.AnnotationSet) {
	value, ok := annotations.Get("missing")
	assertEqual(name+" annotations missing found", ok, false)
	assertEqual(name+" annotations missing value", value, nil)

	values, ok := annotations.GetAll("missing")
	assertEqual(name+" annotations missing all found", ok, false)
	assertEqual(name+" annotations missing all values", values, []any(nil))
}

func assertAnnotationValue(name string, annotations gen.AnnotationSet, key string, want any) {
	value, ok := annotations.Get(key)
	assertEqual(name+" annotation found", ok, true)
	assertEqual(name+" annotation value", value, want)
}

func assertAnnotationValues(name string, annotations gen.AnnotationSet, key string, want []any) {
	values, ok := annotations.GetAll(key)
	assertEqual(name+" annotation all found", ok, true)
	assertEqual(name+" annotation all values", values, want)
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

func assertEnumMemberMetadata(enumName, memberName, vdlName, constName string, value any) {
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
}

func assertConstantMetadata(name, vdlName, goType string) gen.ConstantMetadata {
	metadata, ok := gen.VDLMetadata.Constant(name)
	if !ok {
		panic("missing constant metadata: " + name)
	}

	assertEqual(name+" constant metadata name", metadata.Name, name)
	assertEqual(name+" constant metadata vdl name", metadata.VDLName, vdlName)
	assertEqual(name+" constant metadata go type", metadata.GoType, goType)

	return metadata
}

func testPointerHelpers() {
	assertEqual("Ptr string", *gen.Ptr("hello"), "hello")
	assertEqual("Ptr enum", *gen.Ptr(gen.StatusActive), gen.StatusActive)
	assertEqual("Val nil string", gen.Val[string](nil), "")
	assertEqual("Val enum", gen.Val(gen.Ptr(gen.PriorityHigh)), gen.PriorityHigh)
	assertEqual("Or nil string", gen.Or[string](nil, "fallback"), "fallback")
	assertEqual("Or enum", gen.Or(gen.Ptr(gen.StatusDisabled), gen.StatusUnknown), gen.StatusDisabled)
}

func testEnums() {
	assertEqual("Status list", gen.StatusList, []gen.Status{gen.StatusUnknown, gen.StatusActive, gen.StatusDisabled})
	assertEqual("Priority list", gen.PriorityList, []gen.Priority{gen.PriorityLow, gen.PriorityHigh})
	assertEqual("Status valid zero", gen.StatusUnknown.IsValid(), true)
	assertEqual("Status invalid", gen.Status("ghost").IsValid(), false)
	assertEqual("Priority valid zero", gen.PriorityLow.IsValid(), true)
	assertEqual("Priority invalid", gen.Priority(1).IsValid(), false)
	assertEqual("Priority invalid string", gen.Priority(1).String(), "Priority(1)")

	assertJSON("Status marshal", gen.StatusActive, `"active"`)
	assertJSON("Priority marshal", gen.PriorityHigh, `9`)

	var status gen.Status
	err := json.Unmarshal([]byte(`"disabled"`), &status)
	assertNoError("Status unmarshal valid", err)
	assertEqual("Status unmarshal value", status, gen.StatusDisabled)
	err = json.Unmarshal([]byte(`"ghost"`), &status)
	assertErrContains("Status unmarshal invalid", err, "invalid value for enum Status")

	var priority gen.Priority
	err = json.Unmarshal([]byte(`9`), &priority)
	assertNoError("Priority unmarshal valid", err)
	assertEqual("Priority unmarshal value", priority, gen.PriorityHigh)
	err = json.Unmarshal([]byte(`1`), &priority)
	assertErrContains("Priority unmarshal invalid", err, "invalid value for enum Priority")
}

func testPrimitiveConstants() {
	assertEqual("ApiVersion value", gen.ApiVersion, "1.2.3")
	assertEqual("MaxItems value", gen.MaxItems, 2147483647)
	assertEqual("Ratio value", gen.Ratio, 3.5)
	assertEqual("FeatureEnabled value", gen.FeatureEnabled, true)
	assertEqual("DefaultStatus value", gen.DefaultStatus, "active")
	assertEqual("DefaultPriority value", gen.DefaultPriority, 9)
	assertEqual("ReferencedVersion value", gen.ReferencedVersion, gen.ApiVersion)
	assertEqual("CopiedStatus value", gen.CopiedStatus, gen.DefaultStatus)

	assertEqual("ApiVersion runtime type", reflect.TypeOf(any(gen.ApiVersion)).String(), "string")
	assertEqual("MaxItems runtime type", reflect.TypeOf(any(gen.MaxItems)).String(), "int")
	assertEqual("Ratio runtime type", reflect.TypeOf(any(gen.Ratio)).String(), "float64")
	assertEqual("FeatureEnabled runtime type", reflect.TypeOf(any(gen.FeatureEnabled)).String(), "bool")
	assertEqual("DefaultPriority runtime type", reflect.TypeOf(any(gen.DefaultPriority)).String(), "int")

	assertEqual("DefaultStatus as enum", gen.Status(gen.DefaultStatus), gen.StatusActive)
	assertEqual("DefaultPriority as enum", gen.Priority(gen.DefaultPriority), gen.PriorityHigh)
}

func testCompositeConstants() {
	assertJSON("BaseLabels json", gen.BaseLabels, `{"Env":"prod","Region":"eu"}`)
	assertJSON("ExtraLabels json", gen.ExtraLabels, `{"Env":"prod","Region":"us","Owner":"core"}`)
	assertJSON("CopiedLabels json", gen.CopiedLabels, `{"Env":"prod","Region":"us","Owner":"core"}`)
	assertJSON("BuildInfo json", gen.BuildInfo, `{"Name":"plugin-go","Version":"1.2.3","Tags":["go","vdl"]}`)
	assertJSON("InlineSettings json", gen.InlineSettings, `{"Mode":"safe","Enabled":false}`)
	assertJSON("ProfileSummary json", gen.ProfileSummary, `{"Status":"active","Priority":9}`)
	assertJSON("ReleaseVersions json", gen.ReleaseVersions, `["1.2.3","1.2.3"]`)
	assertJSON("Statuses json", gen.Statuses, `["","active","disabled"]`)
	assertJSON("PriorityMatrix json", gen.PriorityMatrix, `[[0,9],[9]]`)
	assertJSON(
		"BaseProfile json",
		gen.BaseProfile,
		`{
			"Id":"user-1",
			"Status":"active",
			"Priority":0,
			"Tags":["base"],
			"Labels":{"Env":"prod","Region":"eu"},
			"Nested":{"Enabled":true,"Retries":1}
		}`,
	)
	assertJSON(
		"DefaultProfile json",
		gen.DefaultProfile,
		`{
			"Id":"user-1",
			"Status":"active",
			"Priority":0,
			"Labels":{"Env":"prod","Region":"eu"},
			"Tags":["featured",""],
			"Nested":{"Enabled":false,"Retries":0}
		}`,
	)
	assertJSON(
		"CopiedProfile json",
		gen.CopiedProfile,
		`{
			"Id":"user-1",
			"Status":"active",
			"Priority":0,
			"Labels":{"Env":"prod","Region":"eu"},
			"Tags":["featured",""],
			"Nested":{"Enabled":false,"Retries":0}
		}`,
	)

	assertEqual("ExtraLabels override region", gen.ExtraLabels.Region, "us")
	assertEqual("BaseLabels keeps original region", gen.BaseLabels.Region, "eu")
	assertEqual("CopiedLabels matches extra labels", reflect.DeepEqual(gen.CopiedLabels, gen.ExtraLabels), true)
	assertEqual("CopiedProfile matches default profile", reflect.DeepEqual(gen.CopiedProfile, gen.DefaultProfile), true)
	assertEqual("BuildInfo version references api version", gen.BuildInfo.Version, gen.ApiVersion)
	assertEqual("ReleaseVersions second references version", gen.ReleaseVersions[1], gen.ReferencedVersion)
	assertEqual("ProfileSummary status references default", gen.ProfileSummary.Status, gen.DefaultStatus)
	assertEqual("ProfileSummary priority references default", gen.ProfileSummary.Priority, int64(gen.DefaultPriority))
	assertEqual("BaseProfile status raw type", reflect.TypeOf(gen.BaseProfile.Status).String(), "string")
	assertEqual("BaseProfile priority raw type", reflect.TypeOf(gen.BaseProfile.Priority).String(), "int64")
	assertEqual("BaseProfile status enum conversion", gen.Status(gen.BaseProfile.Status), gen.StatusActive)
	assertEqual("BaseProfile priority enum conversion", gen.Priority(gen.BaseProfile.Priority), gen.PriorityLow)
	assertEqual("Statuses values convert to enums", []gen.Status{gen.Status(gen.Statuses[0]), gen.Status(gen.Statuses[1]), gen.Status(gen.Statuses[2])}, []gen.Status{gen.StatusUnknown, gen.StatusActive, gen.StatusDisabled})
	assertEqual("PriorityMatrix values convert to enums", [][]gen.Priority{{gen.Priority(gen.PriorityMatrix[0][0]), gen.Priority(gen.PriorityMatrix[0][1])}, {gen.Priority(gen.PriorityMatrix[1][0])}}, [][]gen.Priority{{gen.PriorityLow, gen.PriorityHigh}, {gen.PriorityHigh}})
}

func testCompositeTypes() {
	assertEqual("BaseLabels type", reflect.TypeOf(gen.BaseLabels).String(), "struct { Env string; Region string }")
	assertEqual("ExtraLabels type", reflect.TypeOf(gen.ExtraLabels).String(), "struct { Env string; Region string; Owner string }")
	assertEqual("CopiedLabels type", reflect.TypeOf(gen.CopiedLabels).String(), "struct { Env string; Region string; Owner string }")
	assertEqual("BuildInfo type", reflect.TypeOf(gen.BuildInfo).String(), "struct { Name string; Version string; Tags []string }")
	assertEqual("InlineSettings type", reflect.TypeOf(gen.InlineSettings).String(), "struct { Mode string; Enabled bool }")
	assertEqual("ProfileSummary type", reflect.TypeOf(gen.ProfileSummary).String(), "struct { Status string; Priority int64 }")
	assertEqual("ReleaseVersions type", reflect.TypeOf(gen.ReleaseVersions).String(), "[]string")
	assertEqual("Statuses type", reflect.TypeOf(gen.Statuses).String(), "[]string")
	assertEqual("PriorityMatrix type", reflect.TypeOf(gen.PriorityMatrix).String(), "[][]int64")
	assertEqual("BaseProfile type", reflect.TypeOf(gen.BaseProfile).String(), "struct { Id string; Status string; Priority int64; Tags []string; Labels struct { Env string; Region string }; Nested struct { Enabled bool; Retries int64 } }")
	assertEqual("DefaultProfile type", reflect.TypeOf(gen.DefaultProfile).String(), "struct { Id string; Status string; Priority int64; Labels struct { Env string; Region string }; Tags []string; Nested struct { Enabled bool; Retries int64 } }")
	assertEqual("CopiedProfile type", reflect.TypeOf(gen.CopiedProfile).String(), "struct { Id string; Status string; Priority int64; Labels struct { Env string; Region string }; Tags []string; Nested struct { Enabled bool; Retries int64 } }")
	assertEqual("Base and default profile types differ", reflect.TypeOf(gen.BaseProfile) == reflect.TypeOf(gen.DefaultProfile), false)
	assertEqual("Default and copied profile types match", reflect.TypeOf(gen.DefaultProfile) == reflect.TypeOf(gen.CopiedProfile), true)
}

func testMetadata() {
	assertEqual("metadata type count", len(gen.VDLMetadata.Types), 0)
	assertEqual("metadata enum count", len(gen.VDLMetadata.Enums), 2)
	assertEqual("metadata constant count", len(gen.VDLMetadata.Constants), 20)

	status := assertEnumMetadata("Status", "Status", "string")
	assertEqual("Status enum annotations", status.Annotations.Has("missing"), false)
	assertEnumMemberMetadata("Status", "Unknown", "Unknown", "StatusUnknown", "")
	assertEnumMemberMetadata("Status", "Active", "Active", "StatusActive", "active")
	assertEnumMemberMetadata("Status", "Disabled", "Disabled", "StatusDisabled", "disabled")

	priority := assertEnumMetadata("Priority", "Priority", "int")
	assertEqual("Priority enum annotations", priority.Annotations.Has("missing"), false)
	assertEnumMemberMetadata("Priority", "Low", "Low", "PriorityLow", 0)
	assertEnumMemberMetadata("Priority", "High", "High", "PriorityHigh", 9)

	apiVersion := assertConstantMetadata("ApiVersion", "apiVersion", "string")
	assertAnnotationValue("ApiVersion meta", apiVersion.Annotations, "meta", map[string]any{"area": "release"})
	assertAnnotationValues("ApiVersion meta", apiVersion.Annotations, "meta", []any{map[string]any{"area": "release"}})
	assertConstantMetadata("MaxItems", "maxItems", "int64")
	assertConstantMetadata("Ratio", "ratio", "float64")
	assertConstantMetadata("FeatureEnabled", "featureEnabled", "bool")
	assertConstantMetadata("DefaultStatus", "defaultStatus", "string")
	assertConstantMetadata("DefaultPriority", "defaultPriority", "int64")
	assertConstantMetadata("Statuses", "statuses", "[]string")
	assertConstantMetadata("PriorityMatrix", "priorityMatrix", "[][]int64")
	assertConstantMetadata("BaseLabels", "baseLabels", "struct { Env string; Region string }")
	assertConstantMetadata("ExtraLabels", "extraLabels", "struct { Env string; Region string; Owner string }")
	assertConstantMetadata("CopiedLabels", "copiedLabels", "struct { Env string; Region string; Owner string }")
	assertConstantMetadata("BuildInfo", "buildInfo", "struct { Name string; Version string; Tags []string }")
	assertConstantMetadata("BaseProfile", "baseProfile", "struct { Id string; Status string; Priority int64; Tags []string; Labels struct { Env string; Region string }; Nested struct { Enabled bool; Retries int64 } }")
	defaultProfile := assertConstantMetadata("DefaultProfile", "defaultProfile", "struct { Id string; Status string; Priority int64; Labels struct { Env string; Region string }; Tags []string; Nested struct { Enabled bool; Retries int64 } }")
	assertAnnotationValue("DefaultProfile tag", defaultProfile.Annotations, "tag", nil)
	assertAnnotationValues("DefaultProfile tag", defaultProfile.Annotations, "tag", []any{nil})
	assertConstantMetadata("CopiedProfile", "copiedProfile", "struct { Id string; Status string; Priority int64; Labels struct { Env string; Region string }; Tags []string; Nested struct { Enabled bool; Retries int64 } }")
	assertConstantMetadata("InlineSettings", "inlineSettings", "struct { Mode string; Enabled bool }")
	assertConstantMetadata("ProfileSummary", "profileSummary", "struct { Status string; Priority int64 }")
	assertConstantMetadata("ReferencedVersion", "referencedVersion", "string")
	assertConstantMetadata("ReleaseVersions", "releaseVersions", "[]string")
	assertConstantMetadata("CopiedStatus", "copiedStatus", "string")

	missingType, ok := gen.VDLMetadata.Type("Missing")
	assertEqual("missing type metadata found", ok, false)
	assertEqual("missing type metadata zero", missingType, gen.TypeMetadata{})

	missingEnum, ok := gen.VDLMetadata.Enum("Missing")
	assertEqual("missing enum metadata found", ok, false)
	assertEqual("missing enum metadata zero", missingEnum, gen.EnumMetadata{})

	missingMember, ok := gen.VDLMetadata.Enums["Status"].Member("Missing")
	assertEqual("missing enum member metadata found", ok, false)
	assertEqual("missing enum member metadata zero", missingMember, gen.EnumMemberMetadata{})

	missingConstant, ok := gen.VDLMetadata.Constant("Missing")
	assertEqual("missing constant metadata found", ok, false)
	assertEqual("missing constant metadata zero", missingConstant, gen.ConstantMetadata{})

	assertAnnotationMissing("empty constant metadata", gen.ConstantMetadata{}.Annotations)
}

func main() {
	testPointerHelpers()
	testEnums()
	testPrimitiveConstants()
	testCompositeConstants()
	testCompositeTypes()
	testMetadata()

	fmt.Println("Test pass!")
}
