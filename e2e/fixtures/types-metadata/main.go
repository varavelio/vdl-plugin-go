package main

import (
	"fixture/gen"

	"varavel.com/testutil"
)

func mustType(name, typ string) {
	metadata, ok := gen.VDLMetadata.GetType(name)
	metadata = testutil.MustPresent("type metadata: "+name, metadata, ok)

	testutil.MustEqual(name+" name", metadata.Name, name)
	testutil.MustEqual(name+" type", metadata.Type, typ)
	testutil.MustAnnotationMissing(name, metadata.Annotations)
}

func mustField(typeName, fieldName, jsonName, typ string, optional bool) {
	typeMetadata, ok := gen.VDLMetadata.GetType(typeName)
	typeMetadata = testutil.MustPresent("type metadata: "+typeName, typeMetadata, ok)

	fieldMetadata, ok := typeMetadata.GetField(fieldName)
	fieldMetadata = testutil.MustPresent("field metadata: "+typeName+"."+fieldName, fieldMetadata, ok)

	testutil.MustEqual(typeName+"."+fieldName+" name", fieldMetadata.Name, fieldName)
	testutil.MustEqual(typeName+"."+fieldName+" JSON name", fieldMetadata.JSONName, jsonName)
	testutil.MustEqual(typeName+"."+fieldName+" type", fieldMetadata.Type, typ)
	testutil.MustEqual(typeName+"."+fieldName+" optional", fieldMetadata.Optional, optional)
	testutil.MustAnnotationMissing(typeName+"."+fieldName, fieldMetadata.Annotations)
}

func main() {
	testutil.MustEqual("type count", len(gen.VDLMetadata.Types), 2)
	testutil.MustEqual("enum count", len(gen.VDLMetadata.Enums), 0)
	testutil.MustEqual("constant count", len(gen.VDLMetadata.Constants), 0)

	mustType("Profile", "object")
	mustType("ProfileSettings", "object")

	mustField("Profile", "Name", "name", "string", false)
	mustField("Profile", "Settings", "settings", "ProfileSettings", false)
	mustField("ProfileSettings", "Enabled", "enabled", "*bool", true)

	missingType, ok := gen.VDLMetadata.GetType("Missing")
	testutil.MustAbsent("missing type metadata", missingType, ok, gen.TypeMetadata{})

	missingField, ok := gen.VDLMetadata.Types["Profile"].GetField("Missing")
	testutil.MustAbsent("missing field metadata", missingField, ok, gen.FieldMetadata{})

	missingEnum, ok := gen.VDLMetadata.GetEnum("Missing")
	testutil.MustAbsent("missing enum metadata", missingEnum, ok, gen.EnumMetadata{})

	missingConstant, ok := gen.VDLMetadata.GetConstant("Missing")
	testutil.MustAbsent("missing constant metadata", missingConstant, ok, gen.ConstantMetadata{})
}
