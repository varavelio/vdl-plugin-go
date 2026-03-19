package main

import (
	"fixture/gen"

	"varavel.com/testutil"
)

func mustConstant(name, kind, typeName string) gen.VDLConstantMetadata {
	metadata, ok := gen.VDLMetadata.GetConstant(name)
	metadata = testutil.MustPresent("constant metadata: "+name, metadata, ok)
	testutil.MustEqual(name+" name", metadata.Name, name)
	testutil.MustEqual(name+" kind", metadata.Type.Kind, kind)
	testutil.MustEqual(name+" type name", metadata.Type.Name, typeName)
	return metadata
}

func main() {
	testutil.MustEqual("type count", len(gen.VDLMetadata.Types), 0)
	testutil.MustEqual("enum count", len(gen.VDLMetadata.Enums), 1)
	testutil.MustEqual("constant count", len(gen.VDLMetadata.Constants), 2)

	status, ok := gen.VDLMetadata.GetEnum("Status")
	status = testutil.MustPresent("enum metadata: Status", status, ok)
	testutil.MustEqual("Status member count", len(status.Members), 2)

	apiVersion := mustConstant("ApiVersion", "primitive", "string")
	testutil.MustAnnotationValue("ApiVersion meta", apiVersion.Annotations, "meta", map[string]any{"area": "release"})

	defaultStatus := mustConstant("DefaultStatus", "primitive", "string")
	testutil.MustAnnotationValue("DefaultStatus tag", defaultStatus.Annotations, "tag", nil)

	missingConstant, ok := gen.VDLMetadata.GetConstant("Missing")
	testutil.MustAbsent("missing constant metadata", missingConstant, ok, gen.VDLConstantMetadata{})

	missingEnum, ok := gen.VDLMetadata.GetEnum("Missing")
	testutil.MustAbsent("missing enum metadata", missingEnum, ok, gen.VDLEnumMetadata{})
}
