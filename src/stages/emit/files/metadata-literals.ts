import { groupBy, mapValues } from "es-toolkit";
import { renderMetadataValueExpression } from "../../../shared/go-literals";
import {
  renderAnonymousGoTypeExpression,
  renderGoType,
} from "../../../shared/go-types";
import type {
  ConstantDescriptor,
  EnumDescriptor,
  GeneratorContext,
  NamedTypeDescriptor,
} from "../../model/types";

export function renderTypeMetadataLiteral(
  descriptor: NamedTypeDescriptor,
  context: GeneratorContext,
): string {
  const goType =
    descriptor.kind === "object"
      ? descriptor.goName
      : renderGoType(
          descriptor.typeRef,
          context,
          undefined,
          descriptor.position,
        );
  const fieldsLiteral =
    descriptor.fields.length === 0
      ? "nil"
      : `map[string]FieldMetadata{${descriptor.fields
          .map(
            (field) =>
              `${JSON.stringify(field.goName)}: FieldMetadata{Name: ${JSON.stringify(field.goName)}, VDLName: ${JSON.stringify(field.def.name)}, JSONName: ${JSON.stringify(field.jsonName)}, GoType: ${JSON.stringify(field.goType)}, Optional: ${String(field.def.optional)}, Annotations: ${renderAnnotationSetLiteral(field.def.annotations)}}`,
          )
          .join(", ")}}`;

  return `TypeMetadata{Name: ${JSON.stringify(descriptor.goName)}, VDLName: ${JSON.stringify(descriptor.vdlName)}, Path: ${JSON.stringify(descriptor.path)}, Parent: ${JSON.stringify(descriptor.parentGoName ?? "")}, Kind: ${JSON.stringify(descriptor.kind)}, GoType: ${JSON.stringify(goType)}, Inline: ${String(descriptor.inline)}, Annotations: ${renderAnnotationSetLiteral(descriptor.annotations)}, Fields: ${fieldsLiteral}}`;
}

export function renderEnumMetadataLiteral(
  enumDescriptor: EnumDescriptor,
): string {
  return `EnumMetadata{Name: ${JSON.stringify(enumDescriptor.goName)}, VDLName: ${JSON.stringify(enumDescriptor.def.name)}, ValueType: ${JSON.stringify(enumDescriptor.def.enumType)}, Annotations: ${renderAnnotationSetLiteral(enumDescriptor.def.annotations)}, Members: map[string]EnumMemberMetadata{${enumDescriptor.members
    .map(
      (member) =>
        `${JSON.stringify(member.goName)}: EnumMemberMetadata{Name: ${JSON.stringify(member.goName)}, VDLName: ${JSON.stringify(member.def.name)}, ConstName: ${JSON.stringify(member.constName)}, Value: ${renderMetadataValueExpression(member.def.value)}, Annotations: ${renderAnnotationSetLiteral(member.def.annotations)}}`,
    )
    .join(", ")}}}`;
}

export function renderConstantMetadataLiteral(
  constant: ConstantDescriptor,
  context: GeneratorContext,
): string {
  return `ConstantMetadata{Name: ${JSON.stringify(constant.goName)}, VDLName: ${JSON.stringify(constant.def.name)}, GoType: ${JSON.stringify(renderMetadataGoType(constant, context))}, Annotations: ${renderAnnotationSetLiteral(constant.def.annotations)}}`;
}

function renderMetadataGoType(
  constant: ConstantDescriptor,
  context: GeneratorContext,
): string {
  return constant.def.typeRef.kind === "object"
    ? renderAnonymousGoTypeExpression(
        constant.def.typeRef,
        context,
        constant.def.position,
      )
    : renderGoType(
        constant.def.typeRef,
        context,
        undefined,
        constant.def.position,
      );
}

function renderAnnotationSetLiteral(
  annotations: NamedTypeDescriptor["annotations"],
): string {
  if (annotations.length === 0) {
    return "AnnotationSet{}";
  }

  const annotationsByName = groupBy(
    annotations,
    (annotation) => annotation.name,
  );
  const allByName = mapValues(annotationsByName, (group) =>
    group.map((annotation) =>
      renderMetadataValueExpression(annotation.argument),
    ),
  );
  const byName = mapValues(
    allByName,
    (values) => values[values.length - 1] ?? "nil",
  );

  const byNameEntries = Object.keys(byName).map(
    (name) => `${JSON.stringify(name)}: ${byName[name]}`,
  );
  const allByNameEntries = Object.keys(allByName).map(
    (name) => `${JSON.stringify(name)}: []any{${allByName[name]?.join(", ")}}`,
  );

  return `AnnotationSet{List: []Annotation{${annotations
    .map(
      (annotation) =>
        `Annotation{Name: ${JSON.stringify(annotation.name)}, Value: ${renderMetadataValueExpression(annotation.argument)}}`,
    )
    .join(
      ", ",
    )}}, ByName: map[string]any{${byNameEntries.join(", ")}}, AllByName: map[string][]any{${allByNameEntries.join(", ")}}}`;
}
