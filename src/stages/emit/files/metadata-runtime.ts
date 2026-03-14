import type { newGenerator } from "@varavel/gen";

export function renderMetadataSupportTypes(
  g: ReturnType<typeof newGenerator>,
): void {
  g.line("// Annotation describes a single VDL annotation.");
  g.line("type Annotation struct {");
  g.block(() => {
    g.line("Name string");
    g.line("Value any");
  });
  g.line("}");
  g.break();

  g.line(
    "// AnnotationSet groups annotations in declaration order and by name.",
  );
  g.line("type AnnotationSet struct {");
  g.block(() => {
    g.line("List []Annotation");
    g.line("ByName map[string]any");
    g.line("AllByName map[string][]any");
  });
  g.line("}");
  g.break();

  g.line("// Has reports whether an annotation exists in the set.");
  g.line("func (a AnnotationSet) Has(name string) bool {");
  g.block(() => {
    g.line("_, ok := a.ByName[name]");
    g.line("return ok");
  });
  g.line("}");
  g.break();

  g.line(
    "// Get returns the latest value associated with the annotation name.",
  );
  g.line("func (a AnnotationSet) Get(name string) (any, bool) {");
  g.block(() => {
    g.line("value, ok := a.ByName[name]");
    g.line("return value, ok");
  });
  g.line("}");
  g.break();

  g.line("// GetAll returns every value associated with the annotation name.");
  g.line("func (a AnnotationSet) GetAll(name string) ([]any, bool) {");
  g.block(() => {
    g.line("values, ok := a.AllByName[name]");
    g.line("return values, ok");
  });
  g.line("}");
  g.break();

  g.line("// FieldMetadata describes a generated Go struct field.");
  g.line("type FieldMetadata struct {");
  g.block(() => {
    g.line("Name string");
    g.line("VDLName string");
    g.line("JSONName string");
    g.line("GoType string");
    g.line("Optional bool");
    g.line("Annotations AnnotationSet");
  });
  g.line("}");
  g.break();

  g.line("// TypeMetadata describes a generated Go type.");
  g.line("type TypeMetadata struct {");
  g.block(() => {
    g.line("Name string");
    g.line("VDLName string");
    g.line("Path string");
    g.line("Parent string");
    g.line("Kind string");
    g.line("GoType string");
    g.line("Inline bool");
    g.line("Annotations AnnotationSet");
    g.line("Fields map[string]FieldMetadata");
  });
  g.line("}");
  g.break();

  g.line("// Field looks up a field by its generated Go name.");
  g.line("func (m TypeMetadata) Field(name string) (FieldMetadata, bool) {");
  g.block(() => {
    g.line("field, ok := m.Fields[name]");
    g.line("return field, ok");
  });
  g.line("}");
  g.break();

  g.line("// EnumMemberMetadata describes a generated enum member constant.");
  g.line("type EnumMemberMetadata struct {");
  g.block(() => {
    g.line("Name string");
    g.line("VDLName string");
    g.line("ConstName string");
    g.line("Value any");
    g.line("Annotations AnnotationSet");
  });
  g.line("}");
  g.break();

  g.line("// EnumMetadata describes a generated enum type.");
  g.line("type EnumMetadata struct {");
  g.block(() => {
    g.line("Name string");
    g.line("VDLName string");
    g.line("ValueType string");
    g.line("Annotations AnnotationSet");
    g.line("Members map[string]EnumMemberMetadata");
  });
  g.line("}");
  g.break();

  g.line("// Member looks up an enum member by its generated Go suffix name.");
  g.line(
    "func (m EnumMetadata) Member(name string) (EnumMemberMetadata, bool) {",
  );
  g.block(() => {
    g.line("member, ok := m.Members[name]");
    g.line("return member, ok");
  });
  g.line("}");
  g.break();

  g.line("// ConstantMetadata describes a generated Go constant or variable.");
  g.line("type ConstantMetadata struct {");
  g.block(() => {
    g.line("Name string");
    g.line("VDLName string");
    g.line("GoType string");
    g.line("Annotations AnnotationSet");
  });
  g.line("}");
  g.break();

  g.line("// SchemaMetadata exposes metadata for every generated declaration.");
  g.line("type SchemaMetadata struct {");
  g.block(() => {
    g.line("Types map[string]TypeMetadata");
    g.line("Enums map[string]EnumMetadata");
    g.line("Constants map[string]ConstantMetadata");
  });
  g.line("}");
  g.break();

  g.line("// Type looks up a type by its generated Go name.");
  g.line("func (m SchemaMetadata) Type(name string) (TypeMetadata, bool) {");
  g.block(() => {
    g.line("value, ok := m.Types[name]");
    g.line("return value, ok");
  });
  g.line("}");
  g.break();

  g.line("// Enum looks up an enum by its generated Go name.");
  g.line("func (m SchemaMetadata) Enum(name string) (EnumMetadata, bool) {");
  g.block(() => {
    g.line("value, ok := m.Enums[name]");
    g.line("return value, ok");
  });
  g.line("}");
  g.break();

  g.line("// Constant looks up a constant by its generated Go name.");
  g.line(
    "func (m SchemaMetadata) Constant(name string) (ConstantMetadata, bool) {",
  );
  g.block(() => {
    g.line("value, ok := m.Constants[name]");
    g.line("return value, ok");
  });
  g.line("}");
}
