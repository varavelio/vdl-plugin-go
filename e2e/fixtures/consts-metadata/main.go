package main

import (
	"fixture/gen"

	"varavel.com/testutil"
)

func mustConstant(name, vdlName, goType string) gen.ConstantMetadata {
	metadata, ok := gen.VDLMetadata.Constant(name)
	metadata = testutil.MustPresent("constant metadata: "+name, metadata, ok)
	testutil.MustEqual(name+" name", metadata.Name, name)
	testutil.MustEqual(name+" VDL name", metadata.VDLName, vdlName)
	testutil.MustEqual(name+" Go type", metadata.GoType, goType)
	return metadata
}

func main() {
	testutil.MustEqual("type count", len(gen.VDLMetadata.Types), 0)
	testutil.MustEqual("enum count", len(gen.VDLMetadata.Enums), 1)
	testutil.MustEqual("constant count", len(gen.VDLMetadata.Constants), 2)

	status, ok := gen.VDLMetadata.Enum("Status")
	status = testutil.MustPresent("enum metadata: Status", status, ok)
	testutil.MustEqual("Status value type", status.ValueType, "string")

	apiVersion := mustConstant("ApiVersion", "apiVersion", "string")
	testutil.MustAnnotationValue("ApiVersion meta", apiVersion.Annotations, "meta", map[string]any{"area": "release"})
	testutil.MustAnnotationValues("ApiVersion meta", apiVersion.Annotations, "meta", []any{map[string]any{"area": "release"}})

	defaultStatus := mustConstant("DefaultStatus", "defaultStatus", "string")
	testutil.MustAnnotationValue("DefaultStatus tag", defaultStatus.Annotations, "tag", nil)
	testutil.MustAnnotationValues("DefaultStatus tag", defaultStatus.Annotations, "tag", []any{nil})

	missingConstant, ok := gen.VDLMetadata.Constant("Missing")
	testutil.MustAbsent("missing constant metadata", missingConstant, ok, gen.ConstantMetadata{})

	missingEnum, ok := gen.VDLMetadata.Enum("Missing")
	testutil.MustAbsent("missing enum metadata", missingEnum, ok, gen.EnumMetadata{})
}
