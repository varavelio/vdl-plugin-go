package main

import (
	"fixture/gen"

	"varavel.com/testutil"
)

func mustEnum(name string) gen.VDLEnumMetadata {
	metadata, ok := gen.VDLMetadata.GetEnum(name)
	metadata = testutil.MustPresent("enum metadata: "+name, metadata, ok)
	testutil.MustEqual(name+" name", metadata.Name, name)
	return metadata
}

func mustMember(enumName, memberName string, value any) gen.VDLEnumMemberMetadata {
	enumMetadata, ok := gen.VDLMetadata.GetEnum(enumName)
	enumMetadata = testutil.MustPresent("enum metadata: "+enumName, enumMetadata, ok)

	memberMetadata, ok := enumMetadata.GetMember(memberName)
	memberMetadata = testutil.MustPresent("enum member metadata: "+enumName+"."+memberName, memberMetadata, ok)
	testutil.MustEqual(enumName+"."+memberName+" name", memberMetadata.Name, memberName)
	testutil.MustEqual(enumName+"."+memberName+" value", memberMetadata.Value, value)
	return memberMetadata
}

func main() {
	testutil.MustEqual("type count", len(gen.VDLMetadata.Types), 0)
	testutil.MustEqual("enum count", len(gen.VDLMetadata.Enums), 2)
	testutil.MustEqual("constant count", len(gen.VDLMetadata.Constants), 0)

	base := mustEnum("DeliveryStateBase")
	testutil.MustAnnotationValue("DeliveryStateBase meta", base.Annotations, "meta", map[string]any{"family": "string"})
	unknown := mustMember("DeliveryStateBase", "Unknown", "")
	testutil.MustAnnotationValue("DeliveryStateBase Unknown label", unknown.Annotations, "label", "empty")

	state := mustEnum("DeliveryState")
	testutil.MustAnnotationValue("DeliveryState tag", state.Annotations, "tag", nil)
	delivered := mustMember("DeliveryState", "Delivered", "delivered")
	testutil.MustAnnotationValue("DeliveryState Delivered aliases", delivered.Annotations, "aliases", []any{"done", "completed"})
	returned := mustMember("DeliveryState", "Returned", "returned")
	testutil.MustAnnotationValue("DeliveryState Returned deprecated", returned.Annotations, "deprecated", "Use Delivered instead.")

	missingEnum, ok := gen.VDLMetadata.GetEnum("Missing")
	testutil.MustAbsent("missing enum metadata", missingEnum, ok, gen.VDLEnumMetadata{})

	missingMember, ok := gen.VDLMetadata.Enums["DeliveryState"].GetMember("Missing")
	testutil.MustAbsent("missing enum member metadata", missingMember, ok, gen.VDLEnumMemberMetadata{})
}
