import type { newGenerator } from "@varavel/gen";

export function renderMetadataSupportTypes(
  g: ReturnType<typeof newGenerator>,
): void {
  g.line("// Annotation describes a single VDL annotation entry.");
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

  g.line("// FieldMetadata describes a generated field.");
  g.line("type FieldMetadata struct {");
  g.block(() => {
    g.line("Name string");
    g.line("JSONName string");
    g.line("Type string");
    g.line("Optional bool");
    g.line("Annotations AnnotationSet");
  });
  g.line("}");
  g.break();

  g.line("// TypeMetadata describes a generated type.");
  g.line("type TypeMetadata struct {");
  g.block(() => {
    g.line("Name string");
    g.line("Type string");
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

  g.line("// EnumMemberMetadata describes a generated enum value.");
  g.line("type EnumMemberMetadata struct {");
  g.block(() => {
    g.line("Name string");
    g.line("Value any");
    g.line("Annotations AnnotationSet");
  });
  g.line("}");
  g.break();

  g.line("// EnumMetadata describes a generated enum.");
  g.line("type EnumMetadata struct {");
  g.block(() => {
    g.line("Name string");
    g.line("Type string");
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

  g.line("// ConstantMetadata describes a generated constant value.");
  g.line("type ConstantMetadata struct {");
  g.block(() => {
    g.line("Name string");
    g.line("Type string");
    g.line("Value any");
    g.line("Annotations AnnotationSet");
  });
  g.line("}");
  g.break();

  g.line(
    "// SchemaMetadata collects metadata for every generated declaration.",
  );
  g.line("type SchemaMetadata struct {");
  g.block(() => {
    g.line("Types map[string]TypeMetadata");
    g.line("Enums map[string]EnumMetadata");
    g.line("Constants map[string]ConstantMetadata");
  });
  g.line("}");
  g.break();

  g.line("// GetType looks up a type by its generated Go name.");
  g.line("func (m SchemaMetadata) GetType(name string) (TypeMetadata, bool) {");
  g.block(() => {
    g.line("value, ok := m.Types[name]");
    g.line("return value, ok");
  });
  g.line("}");
  g.break();

  g.line("// GetEnum looks up an enum by its generated Go name.");
  g.line("func (m SchemaMetadata) GetEnum(name string) (EnumMetadata, bool) {");
  g.block(() => {
    g.line("value, ok := m.Enums[name]");
    g.line("return value, ok");
  });
  g.line("}");
  g.break();

  g.line("// GetConstant looks up a constant by its generated Go name.");
  g.line(
    "func (m SchemaMetadata) GetConstant(name string) (ConstantMetadata, bool) {",
  );
  g.block(() => {
    g.line("value, ok := m.Constants[name]");
    g.line("return value, ok");
  });
  g.line("}");
}
