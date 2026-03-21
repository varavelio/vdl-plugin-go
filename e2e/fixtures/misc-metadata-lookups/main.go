package main

import (
	"fixture/gen"
	"varavel.com/testutil"
)

func main() {
	// 1. Verify Enum Metadata
	enumMeta, ok := gen.VDLMetadata.GetEnum("Priority")
	testutil.MustEqual("Enum Priority ok", ok, true)
	testutil.MustEqual("Enum members count", len(enumMeta.Members), 2)
	
	lowMember, ok := enumMeta.GetMember("Low")
	testutil.MustEqual("Member Low ok", ok, true)
	testutil.MustEqual("Member Low value", lowMember.Value, "Low")
	
	// 2. Verify Type Metadata
	typeMeta, ok := gen.VDLMetadata.GetType("Task")
	testutil.MustEqual("Type Task ok", ok, true)
	
	idField, ok := typeMeta.GetField("Id")
	testutil.MustEqual("Field Id ok", ok, true)
	testutil.MustEqual("Field Id kind", idField.Type.Kind, "primitive")
	
	tagsField, ok := typeMeta.GetField("Tags")
	testutil.MustEqual("Field Tags ok", ok, true)
	testutil.MustEqual("Field Tags kind", tagsField.Type.Kind, "array")
	testutil.MustEqual("Field Tags element kind", tagsField.Type.Element.Kind, "primitive")
	
	// 3. Verify Constant Metadata
	constMeta, ok := gen.VDLMetadata.GetConstant("DefaultTask")
	testutil.MustEqual("Constant DefaultTask ok", ok, true)
	// For constants referencing objects, the Kind is "object"
	testutil.MustEqual("Constant DefaultTask kind", constMeta.Type.Kind, "object")
}
