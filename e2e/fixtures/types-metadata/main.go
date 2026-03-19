package main

import (
	"fixture/gen"

	"varavel.com/testutil"
)

func mustType(name, kind string) gen.VDLTypeMetadata {
	metadata, ok := gen.VDLMetadata.GetType(name)
	metadata = testutil.MustPresent("type metadata: "+name, metadata, ok)

	testutil.MustEqual(name+" name", metadata.Name, name)
	testutil.MustEqual(name+" kind", metadata.Type.Kind, kind)
	return metadata
}

func mustField(scope string, metadata gen.VDLTypeRef, fieldName, jsonName, kind, name string, optional bool) gen.VDLFieldMetadata {
	fieldMetadata, ok := metadata.GetField(fieldName)
	fieldMetadata = testutil.MustPresent("field metadata: "+scope+"."+fieldName, fieldMetadata, ok)

	testutil.MustEqual(scope+"."+fieldName+" name", fieldMetadata.Name, fieldName)
	testutil.MustEqual(scope+"."+fieldName+" JSON name", fieldMetadata.JSONName, jsonName)
	testutil.MustEqual(scope+"."+fieldName+" kind", fieldMetadata.Type.Kind, kind)
	testutil.MustEqual(scope+"."+fieldName+" type name", fieldMetadata.Type.Name, name)
	testutil.MustEqual(scope+"."+fieldName+" optional", fieldMetadata.Optional, optional)
	return fieldMetadata
}

func main() {
	testutil.MustEqual("type count", len(gen.VDLMetadata.Types), 3)
	testutil.MustEqual("enum count", len(gen.VDLMetadata.Enums), 0)
	testutil.MustEqual("constant count", len(gen.VDLMetadata.Constants), 0)

	profile := mustType("Profile", "object")
	testutil.MustAnnotationValue("Profile resource", profile.Annotations, "resource", "profiles")

	settingsType := mustType("ProfileSettings", "object")
	testutil.MustAnnotationMissing("ProfileSettings annotations", settingsType.Annotations)

	sessionsType := mustType("ProfileSessions", "object")
	testutil.MustAnnotationMissing("ProfileSessions annotations", sessionsType.Annotations)

	nameField := mustField("Profile", profile.Type, "Name", "name", "primitive", "string", false)
	testutil.MustAnnotationValue("Profile.Name searchable", nameField.Annotations, "searchable", nil)

	settingsField := mustField("Profile", profile.Type, "Settings", "settings", "object", "", false)
	settingsEnabled := mustField("Profile.Settings", settingsField.Type, "Enabled", "enabled", "primitive", "bool", true)
	testutil.MustAnnotationValue("Profile.Settings.Enabled secure", settingsEnabled.Annotations, "secure", nil)

	sessionsField := mustField("Profile", profile.Type, "Sessions", "sessions", "array", "", false)
	testutil.MustEqual("Profile.Sessions array dims", sessionsField.Type.ArrayDims, 1)
	sessionsElement := testutil.MustPresent(
		"Profile.Sessions element",
		sessionsField.Type.Element,
		sessionsField.Type.Element != nil,
	)
	testutil.MustEqual("Profile.Sessions element kind", sessionsElement.Kind, "object")
	sessionID := mustField("Profile.Sessions[]", *sessionsElement, "Id", "id", "primitive", "string", false)
	testutil.MustAnnotationValue("Profile.Sessions[].Id token", sessionID.Annotations, "token", nil)

	missingType, ok := gen.VDLMetadata.GetType("Missing")
	testutil.MustAbsent("missing type metadata", missingType, ok, gen.VDLTypeMetadata{})

	missingField, ok := gen.VDLMetadata.Types["Profile"].GetField("Missing")
	testutil.MustAbsent("missing field metadata", missingField, ok, gen.VDLFieldMetadata{})

	missingNestedField, ok := sessionsType.Type.GetField("Missing")
	testutil.MustAbsent("missing nested field metadata", missingNestedField, ok, gen.VDLFieldMetadata{})

	missingEnum, ok := gen.VDLMetadata.GetEnum("Missing")
	testutil.MustAbsent("missing enum metadata", missingEnum, ok, gen.VDLEnumMetadata{})

	missingConstant, ok := gen.VDLMetadata.GetConstant("Missing")
	testutil.MustAbsent("missing constant metadata", missingConstant, ok, gen.VDLConstantMetadata{})
}
