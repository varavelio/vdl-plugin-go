package main

import (
	"fixture/gen"

	"varavel.com/testutil"
)

func mustType(name, vdlName, path, parent, goType string, inline bool) {
	metadata, ok := gen.VDLMetadata.Type(name)
	metadata = testutil.MustPresent("type metadata: "+name, metadata, ok)

	testutil.MustEqual(name+" name", metadata.Name, name)
	testutil.MustEqual(name+" VDL name", metadata.VDLName, vdlName)
	testutil.MustEqual(name+" path", metadata.Path, path)
	testutil.MustEqual(name+" parent", metadata.Parent, parent)
	testutil.MustEqual(name+" kind", metadata.Kind, "object")
	testutil.MustEqual(name+" Go type", metadata.GoType, goType)
	testutil.MustEqual(name+" inline", metadata.Inline, inline)
	testutil.MustAnnotationMissing(name, metadata.Annotations)
}

func mustField(typeName, fieldName, vdlName, jsonName, goType string, optional bool) {
	typeMetadata, ok := gen.VDLMetadata.Type(typeName)
	typeMetadata = testutil.MustPresent("type metadata: "+typeName, typeMetadata, ok)

	fieldMetadata, ok := typeMetadata.Field(fieldName)
	fieldMetadata = testutil.MustPresent("field metadata: "+typeName+"."+fieldName, fieldMetadata, ok)

	testutil.MustEqual(typeName+"."+fieldName+" name", fieldMetadata.Name, fieldName)
	testutil.MustEqual(typeName+"."+fieldName+" VDL name", fieldMetadata.VDLName, vdlName)
	testutil.MustEqual(typeName+"."+fieldName+" JSON name", fieldMetadata.JSONName, jsonName)
	testutil.MustEqual(typeName+"."+fieldName+" Go type", fieldMetadata.GoType, goType)
	testutil.MustEqual(typeName+"."+fieldName+" optional", fieldMetadata.Optional, optional)
	testutil.MustAnnotationMissing(typeName+"."+fieldName, fieldMetadata.Annotations)
}

func main() {
	testutil.MustEqual("type count", len(gen.VDLMetadata.Types), 2)
	testutil.MustEqual("enum count", len(gen.VDLMetadata.Enums), 0)
	testutil.MustEqual("constant count", len(gen.VDLMetadata.Constants), 0)

	mustType("Profile", "Profile", "Profile", "", "Profile", false)
	mustType("ProfileSettings", "settings", "Profile.settings", "Profile", "ProfileSettings", true)

	mustField("Profile", "Name", "name", "name", "string", false)
	mustField("Profile", "Settings", "settings", "settings", "ProfileSettings", false)
	mustField("ProfileSettings", "Enabled", "enabled", "enabled", "*bool", true)

	missingType, ok := gen.VDLMetadata.Type("Missing")
	testutil.MustAbsent("missing type metadata", missingType, ok, gen.TypeMetadata{})

	missingField, ok := gen.VDLMetadata.Types["Profile"].Field("Missing")
	testutil.MustAbsent("missing field metadata", missingField, ok, gen.FieldMetadata{})

	missingEnum, ok := gen.VDLMetadata.Enum("Missing")
	testutil.MustAbsent("missing enum metadata", missingEnum, ok, gen.EnumMetadata{})

	missingConstant, ok := gen.VDLMetadata.Constant("Missing")
	testutil.MustAbsent("missing constant metadata", missingConstant, ok, gen.ConstantMetadata{})
}
