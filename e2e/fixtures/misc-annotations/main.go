package main

import (
	"fixture/gen"
	"varavel.com/testutil"
)

func main() {
	// Type annotations
	userMeta, _ := gen.VDLMetadata.GetType("User")
	testutil.MustAnnotationValue("User tag", userMeta.Annotations, "tag", "v1")
	testutil.MustAnnotationValue("User meta", userMeta.Annotations, "meta", map[string]any{"owner": "platform"})

	// Field annotations
	idField, ok := userMeta.GetField("Id") // Use Go name
	testutil.MustEqual("Id field lookup", ok, true)
	testutil.MustEqual("Id field name", idField.Name, "Id")
	_, hasIdAnn := idField.Annotations.Get("id")
	testutil.MustEqual("Id field has @id", hasIdAnn, true)

	// Constant annotations
	timeoutMeta, _ := gen.VDLMetadata.GetConstant("Timeout") // Use Go name
	_, hasConfigAnn := timeoutMeta.Annotations.Get("config")
	testutil.MustEqual("Timeout has @config", hasConfigAnn, true)

	// Enum annotations
	statusMeta, _ := gen.VDLMetadata.GetEnum("OrderStatus")
	_, hasStatusAnn := statusMeta.Annotations.Get("status")
	testutil.MustEqual("OrderStatus has @status", hasStatusAnn, true)

	// Member annotations
	pendingMember, _ := statusMeta.GetMember("Pending")
	_, hasDefaultAnn := pendingMember.Annotations.Get("default")
	testutil.MustEqual("Pending has @default", hasDefaultAnn, true)
}
