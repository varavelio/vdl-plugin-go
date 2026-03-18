package main

import (
	"fixture/gen"

	"varavel.com/testutil"
)

func mustConstant(name, typ string, value any) gen.ConstantMetadata {
	metadata, ok := gen.VDLMetadata.Constant(name)
	metadata = testutil.MustPresent("constant metadata: "+name, metadata, ok)
	testutil.MustEqual(name+" name", metadata.Name, name)
	testutil.MustEqual(name+" type", metadata.Type, typ)
	testutil.MustEqual(name+" value", metadata.Value, value)
	return metadata
}

func main() {
	testutil.MustEqual("type count", len(gen.VDLMetadata.Types), 0)
	testutil.MustEqual("enum count", len(gen.VDLMetadata.Enums), 1)
	testutil.MustEqual("constant count", len(gen.VDLMetadata.Constants), 2)

	status, ok := gen.VDLMetadata.Enum("Status")
	status = testutil.MustPresent("enum metadata: Status", status, ok)
	testutil.MustEqual("Status type", status.Type, "string")

	apiVersion := mustConstant("ApiVersion", "string", "1.2.3")
	testutil.MustAnnotationValue("ApiVersion meta", apiVersion.Annotations, "meta", map[string]any{"area": "release"})
	testutil.MustAnnotationValues("ApiVersion meta", apiVersion.Annotations, "meta", []any{map[string]any{"area": "release"}})

	defaultStatus := mustConstant("DefaultStatus", "string", "active")
	testutil.MustAnnotationValue("DefaultStatus tag", defaultStatus.Annotations, "tag", nil)
	testutil.MustAnnotationValues("DefaultStatus tag", defaultStatus.Annotations, "tag", []any{nil})

	missingConstant, ok := gen.VDLMetadata.Constant("Missing")
	testutil.MustAbsent("missing constant metadata", missingConstant, ok, gen.ConstantMetadata{})

	missingEnum, ok := gen.VDLMetadata.Enum("Missing")
	testutil.MustAbsent("missing enum metadata", missingEnum, ok, gen.EnumMetadata{})
}
