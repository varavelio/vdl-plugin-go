import type { newGenerator } from "@varavel/gen";

export function renderMetadataSupportTypes(
  g: ReturnType<typeof newGenerator>,
): void {
  g.line("// VDLAnnotation describes a single VDL annotation entry.");
  g.line("type VDLAnnotation struct {");
  g.block(() => {
    g.line("Name string");
    g.line("Value any");
  });
  g.line("}");
  g.break();

  g.line(
    "// VDLAnnotationSet groups annotations in declaration order and by name.",
  );
  g.line("type VDLAnnotationSet struct {");
  g.block(() => {
    g.line("List []VDLAnnotation");
    g.line("ByName map[string]any");
  });
  g.line("}");
  g.break();

  g.line("// Has reports whether an annotation exists in the set.");
  g.line("func (a VDLAnnotationSet) Has(name string) bool {");
  g.block(() => {
    g.line("_, ok := a.ByName[name]");
    g.line("return ok");
  });
  g.line("}");
  g.break();

  g.line(
    "// Get returns the latest value associated with the annotation name.",
  );
  g.line("func (a VDLAnnotationSet) Get(name string) (any, bool) {");
  g.block(() => {
    g.line("value, ok := a.ByName[name]");
    g.line("return value, ok");
  });
  g.line("}");
  g.break();

  g.line("// VDLTypeRef describes the recursive shape of a VDL type.");
  g.line("type VDLTypeRef struct {");
  g.block(() => {
    g.line("Kind string");
    g.line("Name string");
    g.line("ArrayDims int");
    g.line("Element *VDLTypeRef");
    g.line("Fields map[string]VDLFieldMetadata");
  });
  g.line("}");
  g.break();

  g.line("// GetField looks up an object field by its generated Go name.");
  g.line(
    "func (r VDLTypeRef) GetField(name string) (VDLFieldMetadata, bool) {",
  );
  g.block(() => {
    g.line("field, ok := r.Fields[name]");
    g.line("return field, ok");
  });
  g.line("}");
  g.break();

  g.line("// VDLFieldMetadata describes a generated field.");
  g.line("type VDLFieldMetadata struct {");
  g.block(() => {
    g.line("Name string");
    g.line("JSONName string");
    g.line("Optional bool");
    g.line("Type VDLTypeRef");
    g.line("Annotations VDLAnnotationSet");
  });
  g.line("}");
  g.break();

  g.line("// VDLTypeMetadata describes a generated type.");
  g.line("type VDLTypeMetadata struct {");
  g.block(() => {
    g.line("Name string");
    g.line("Annotations VDLAnnotationSet");
    g.line("Type VDLTypeRef");
  });
  g.line("}");
  g.break();

  g.line("// GetField looks up a field by its generated Go name.");
  g.line(
    "func (m VDLTypeMetadata) GetField(name string) (VDLFieldMetadata, bool) {",
  );
  g.block(() => {
    g.line("return m.Type.GetField(name)");
  });
  g.line("}");
  g.break();

  g.line("// VDLEnumMemberMetadata describes a generated enum value.");
  g.line("type VDLEnumMemberMetadata struct {");
  g.block(() => {
    g.line("Name string");
    g.line("Value any");
    g.line("Annotations VDLAnnotationSet");
  });
  g.line("}");
  g.break();

  g.line("// VDLEnumMetadata describes a generated enum.");
  g.line("type VDLEnumMetadata struct {");
  g.block(() => {
    g.line("Name string");
    g.line("Annotations VDLAnnotationSet");
    g.line("Members map[string]VDLEnumMemberMetadata");
  });
  g.line("}");
  g.break();

  g.line(
    "// GetMember looks up an enum member by its generated Go suffix name.",
  );
  g.line(
    "func (m VDLEnumMetadata) GetMember(name string) (VDLEnumMemberMetadata, bool) {",
  );
  g.block(() => {
    g.line("member, ok := m.Members[name]");
    g.line("return member, ok");
  });
  g.line("}");
  g.break();

  g.line("// VDLConstantMetadata describes a generated constant value.");
  g.line("type VDLConstantMetadata struct {");
  g.block(() => {
    g.line("Name string");
    g.line("Annotations VDLAnnotationSet");
    g.line("Type VDLTypeRef");
  });
  g.line("}");
  g.break();

  g.line(
    "// VDLSchemaMetadata collects metadata for every generated declaration.",
  );
  g.line("type VDLSchemaMetadata struct {");
  g.block(() => {
    g.line("Types map[string]VDLTypeMetadata");
    g.line("Enums map[string]VDLEnumMetadata");
    g.line("Constants map[string]VDLConstantMetadata");
  });
  g.line("}");
  g.break();

  g.line("// GetType looks up a type by its generated Go name.");
  g.line(
    "func (m VDLSchemaMetadata) GetType(name string) (VDLTypeMetadata, bool) {",
  );
  g.block(() => {
    g.line("value, ok := m.Types[name]");
    g.line("return value, ok");
  });
  g.line("}");
  g.break();

  g.line("// GetEnum looks up an enum by its generated Go name.");
  g.line(
    "func (m VDLSchemaMetadata) GetEnum(name string) (VDLEnumMetadata, bool) {",
  );
  g.block(() => {
    g.line("value, ok := m.Enums[name]");
    g.line("return value, ok");
  });
  g.line("}");
  g.break();

  g.line("// GetConstant looks up a constant by its generated Go name.");
  g.line(
    "func (m VDLSchemaMetadata) GetConstant(name string) (VDLConstantMetadata, bool) {",
  );
  g.block(() => {
    g.line("value, ok := m.Constants[name]");
    g.line("return value, ok");
  });
  g.line("}");
}
