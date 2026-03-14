import { newGenerator } from "@varavel/gen";
import { renderGoFile } from "../file";
import type {
  GeneratedFile,
  GeneratorContext,
  NamedTypeDescriptor,
} from "../internal-types";
import { renderMetadataValueExpression } from "../literal-renderer";
import { renderAnonymousGoTypeExpression, renderGoType } from "../type-ref";

/**
 * Generates discoverable Go metadata for every annotation preserved in the IR.
 */
export function generateMetadataFile(context: GeneratorContext): GeneratedFile {
  const g = newGenerator().withTabs();

  renderMetadataSupportTypes(g);
  g.break();

  g.line(
    "// VDLMetadata contains generated annotation metadata for this schema.",
  );
  g.line("var VDLMetadata = SchemaMetadata{");
  g.block(() => {
    g.line("Types: map[string]TypeMetadata{");
    g.block(() => {
      for (const descriptor of context.namedTypes) {
        g.line(
          `${JSON.stringify(descriptor.name)}: ${renderTypeMetadataLiteral(descriptor, context)},`,
        );
      }
    });
    g.line("},");
    g.line("Enums: map[string]EnumMetadata{");
    g.block(() => {
      for (const enumDescriptor of context.enumDescriptors) {
        g.line(
          `${JSON.stringify(enumDescriptor.goName)}: ${renderEnumMetadataLiteral(enumDescriptor)},`,
        );
      }
    });
    g.line("},");
    g.line("Constants: map[string]ConstantMetadata{");
    g.block(() => {
      for (const constant of context.constantDescriptors) {
        g.line(
          `${JSON.stringify(constant.goName)}: ${renderConstantMetadataLiteral(constant, context)},`,
        );
      }
    });
    g.line("},");
  });
  g.line("}");

  return {
    path: "metadata.go",
    content: renderGoFile({
      packageName: context.options.packageName,
      body: g.toString(),
    }),
  };
}

function renderMetadataSupportTypes(g: ReturnType<typeof newGenerator>): void {
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
    g.line("if a.ByName == nil {");
    g.block(() => {
      g.line("return false");
    });
    g.line("}");
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
    g.line("if a.ByName == nil {");
    g.block(() => {
      g.line("return nil, false");
    });
    g.line("}");
    g.line("value, ok := a.ByName[name]");
    g.line("return value, ok");
  });
  g.line("}");
  g.break();

  g.line("// GetAll returns every value associated with the annotation name.");
  g.line("func (a AnnotationSet) GetAll(name string) ([]any, bool) {");
  g.block(() => {
    g.line("if a.AllByName == nil {");
    g.block(() => {
      g.line("return nil, false");
    });
    g.line("}");
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
    g.line("if m.Fields == nil {");
    g.block(() => {
      g.line("var zero FieldMetadata");
      g.line("return zero, false");
    });
    g.line("}");
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
    g.line("if m.Members == nil {");
    g.block(() => {
      g.line("var zero EnumMemberMetadata");
      g.line("return zero, false");
    });
    g.line("}");
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
    g.line("if m.Types == nil {");
    g.block(() => {
      g.line("var zero TypeMetadata");
      g.line("return zero, false");
    });
    g.line("}");
    g.line("value, ok := m.Types[name]");
    g.line("return value, ok");
  });
  g.line("}");
  g.break();

  g.line("// Enum looks up an enum by its generated Go name.");
  g.line("func (m SchemaMetadata) Enum(name string) (EnumMetadata, bool) {");
  g.block(() => {
    g.line("if m.Enums == nil {");
    g.block(() => {
      g.line("var zero EnumMetadata");
      g.line("return zero, false");
    });
    g.line("}");
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
    g.line("if m.Constants == nil {");
    g.block(() => {
      g.line("var zero ConstantMetadata");
      g.line("return zero, false");
    });
    g.line("}");
    g.line("value, ok := m.Constants[name]");
    g.line("return value, ok");
  });
  g.line("}");
}

function renderTypeMetadataLiteral(
  descriptor: NamedTypeDescriptor,
  context: GeneratorContext,
): string {
  const goType =
    descriptor.kind === "object"
      ? descriptor.name
      : renderGoType(
          descriptor.typeRef,
          context,
          undefined,
          descriptor.position,
        );
  const parent = descriptor.parentName
    ? JSON.stringify(descriptor.parentName)
    : '""';
  const fieldsLiteral =
    descriptor.fields.length === 0
      ? "nil"
      : `map[string]FieldMetadata{${descriptor.fields
          .map(
            (field) =>
              `${JSON.stringify(field.goName)}: FieldMetadata{Name: ${JSON.stringify(field.goName)}, VDLName: ${JSON.stringify(field.field.name)}, JSONName: ${JSON.stringify(field.jsonName)}, GoType: ${JSON.stringify(field.goType)}, Optional: ${String(field.field.optional)}, Annotations: ${renderAnnotationSetLiteral(field.field.annotations)}}`,
          )
          .join(", ")}}`;

  return `TypeMetadata{Name: ${JSON.stringify(descriptor.name)}, VDLName: ${JSON.stringify(descriptor.vdlName)}, Path: ${JSON.stringify(descriptor.path)}, Parent: ${parent}, Kind: ${JSON.stringify(descriptor.kind)}, GoType: ${JSON.stringify(goType)}, Inline: ${String(descriptor.inline)}, Annotations: ${renderAnnotationSetLiteral(descriptor.annotations)}, Fields: ${fieldsLiteral}}`;
}

function renderEnumMetadataLiteral(
  enumDescriptor: GeneratorContext["enumDescriptors"][number],
): string {
  return `EnumMetadata{Name: ${JSON.stringify(enumDescriptor.goName)}, VDLName: ${JSON.stringify(enumDescriptor.def.name)}, ValueType: ${JSON.stringify(enumDescriptor.def.enumType)}, Annotations: ${renderAnnotationSetLiteral(enumDescriptor.def.annotations)}, Members: map[string]EnumMemberMetadata{${enumDescriptor.members
    .map(
      (member) =>
        `${JSON.stringify(member.goName)}: EnumMemberMetadata{Name: ${JSON.stringify(member.goName)}, VDLName: ${JSON.stringify(member.member.name)}, ConstName: ${JSON.stringify(member.constName)}, Value: ${renderMetadataValueExpression(member.member.value)}, Annotations: ${renderAnnotationSetLiteral(member.member.annotations)}}`,
    )
    .join(", ")}}}`;
}

function renderConstantMetadataLiteral(
  constant: GeneratorContext["constantDescriptors"][number],
  context: GeneratorContext,
): string {
  return `ConstantMetadata{Name: ${JSON.stringify(constant.goName)}, VDLName: ${JSON.stringify(constant.def.name)}, GoType: ${JSON.stringify(renderMetadataGoType(constant.def.typeRef, context, constant.def.position))}, Annotations: ${renderAnnotationSetLiteral(constant.def.annotations)}}`;
}

function renderMetadataGoType(
  typeRef: GeneratorContext["constantDescriptors"][number]["def"]["typeRef"],
  context: GeneratorContext,
  position: GeneratorContext["constantDescriptors"][number]["def"]["position"],
): string {
  return typeRef.kind === "object"
    ? renderAnonymousGoTypeExpression(typeRef, context, position)
    : renderGoType(typeRef, context, undefined, position);
}

function renderAnnotationSetLiteral(
  annotations: NamedTypeDescriptor["annotations"],
): string {
  if (annotations.length === 0) {
    return "AnnotationSet{}";
  }

  const byName = new Map<string, string>();
  const allByName = new Map<string, string[]>();

  for (const annotation of annotations) {
    const valueExpression = renderMetadataValueExpression(annotation.argument);
    byName.set(annotation.name, valueExpression);

    const values = allByName.get(annotation.name) ?? [];
    values.push(valueExpression);
    allByName.set(annotation.name, values);
  }

  return `AnnotationSet{List: []Annotation{${annotations
    .map(
      (annotation) =>
        `Annotation{Name: ${JSON.stringify(annotation.name)}, Value: ${renderMetadataValueExpression(annotation.argument)}}`,
    )
    .join(", ")}}, ByName: map[string]any{${[...byName.entries()]
    .map(([name, value]) => `${JSON.stringify(name)}: ${value}`)
    .join(", ")}}, AllByName: map[string][]any{${[...allByName.entries()]
    .map(
      ([name, values]) =>
        `${JSON.stringify(name)}: []any{${values.join(", ")}}`,
    )
    .join(", ")}}}`;
}
