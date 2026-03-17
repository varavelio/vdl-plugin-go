package main

import (
	"fixture/gen"

	"varavel.com/testutil"
)

func mustEnum(name, vdlName, valueType string) gen.EnumMetadata {
	metadata, ok := gen.VDLMetadata.Enum(name)
	metadata = testutil.MustPresent("enum metadata: "+name, metadata, ok)
	testutil.MustEqual(name+" name", metadata.Name, name)
	testutil.MustEqual(name+" VDL name", metadata.VDLName, vdlName)
	testutil.MustEqual(name+" value type", metadata.ValueType, valueType)
	return metadata
}

func mustMember(enumName, memberName, vdlName, constName string, value any) gen.EnumMemberMetadata {
	enumMetadata, ok := gen.VDLMetadata.Enum(enumName)
	enumMetadata = testutil.MustPresent("enum metadata: "+enumName, enumMetadata, ok)

	memberMetadata, ok := enumMetadata.Member(memberName)
	memberMetadata = testutil.MustPresent("enum member metadata: "+enumName+"."+memberName, memberMetadata, ok)
	testutil.MustEqual(enumName+"."+memberName+" name", memberMetadata.Name, memberName)
	testutil.MustEqual(enumName+"."+memberName+" VDL name", memberMetadata.VDLName, vdlName)
	testutil.MustEqual(enumName+"."+memberName+" const name", memberMetadata.ConstName, constName)
	testutil.MustEqual(enumName+"."+memberName+" value", memberMetadata.Value, value)
	return memberMetadata
}

func main() {
	testutil.MustEqual("type count", len(gen.VDLMetadata.Types), 0)
	testutil.MustEqual("enum count", len(gen.VDLMetadata.Enums), 2)
	testutil.MustEqual("constant count", len(gen.VDLMetadata.Constants), 0)

	base := mustEnum("DeliveryStateBase", "DeliveryStateBase", "string")
	testutil.MustAnnotationValue("DeliveryStateBase meta", base.Annotations, "meta", map[string]any{"family": "string"})
	testutil.MustAnnotationValues("DeliveryStateBase meta", base.Annotations, "meta", []any{map[string]any{"family": "string"}})
	unknown := mustMember("DeliveryStateBase", "Unknown", "Unknown", "DeliveryStateBaseUnknown", "")
	testutil.MustAnnotationValue("DeliveryStateBase Unknown label", unknown.Annotations, "label", "empty")

	state := mustEnum("DeliveryState", "DeliveryState", "string")
	testutil.MustAnnotationValue("DeliveryState tag", state.Annotations, "tag", nil)
	testutil.MustAnnotationValues("DeliveryState tag", state.Annotations, "tag", []any{nil})
	delivered := mustMember("DeliveryState", "Delivered", "Delivered", "DeliveryStateDelivered", "delivered")
	testutil.MustAnnotationValue("DeliveryState Delivered aliases", delivered.Annotations, "aliases", []any{"done", "completed"})
	testutil.MustAnnotationValues("DeliveryState Delivered aliases", delivered.Annotations, "aliases", []any{[]any{"done", "completed"}})
	returned := mustMember("DeliveryState", "Returned", "Returned", "DeliveryStateReturned", "returned")
	testutil.MustAnnotationValue("DeliveryState Returned deprecated", returned.Annotations, "deprecated", "Use Delivered instead.")

	missingEnum, ok := gen.VDLMetadata.Enum("Missing")
	testutil.MustAbsent("missing enum metadata", missingEnum, ok, gen.EnumMetadata{})

	missingMember, ok := gen.VDLMetadata.Enums["DeliveryState"].Member("Missing")
	testutil.MustAbsent("missing enum member metadata", missingMember, ok, gen.EnumMemberMetadata{})
}
