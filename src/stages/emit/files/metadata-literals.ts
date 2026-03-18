import { arrays, objects } from "@varavel/vdl-plugin-sdk/utils";
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
  const typeLiteral =
    descriptor.kind === "object"
      ? "object"
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
              `${JSON.stringify(field.goName)}: FieldMetadata{Name: ${JSON.stringify(field.goName)}, JSONName: ${JSON.stringify(field.jsonName)}, Type: ${JSON.stringify(field.goType)}, Optional: ${String(field.def.optional)}, Annotations: ${renderAnnotationSetLiteral(field.def.annotations)}}`,
          )
          .join(", ")}}`;

  return `TypeMetadata{Name: ${JSON.stringify(descriptor.goName)}, Type: ${JSON.stringify(typeLiteral)}, Annotations: ${renderAnnotationSetLiteral(descriptor.annotations)}, Fields: ${fieldsLiteral}}`;
}

export function renderEnumMetadataLiteral(
  enumDescriptor: EnumDescriptor,
): string {
  return `EnumMetadata{Name: ${JSON.stringify(enumDescriptor.goName)}, Type: ${JSON.stringify(enumDescriptor.def.enumType)}, Annotations: ${renderAnnotationSetLiteral(enumDescriptor.def.annotations)}, Members: map[string]EnumMemberMetadata{${enumDescriptor.members
    .map(
      (member) =>
        `${JSON.stringify(member.goName)}: EnumMemberMetadata{Name: ${JSON.stringify(member.goName)}, Value: ${renderMetadataValueExpression(member.def.value)}, Annotations: ${renderAnnotationSetLiteral(member.def.annotations)}}`,
    )
    .join(", ")}}}`;
}

export function renderConstantMetadataLiteral(
  constant: ConstantDescriptor,
  context: GeneratorContext,
): string {
  return `ConstantMetadata{Name: ${JSON.stringify(constant.goName)}, Type: ${JSON.stringify(renderMetadataType(constant, context))}, Value: ${renderMetadataValueExpression(constant.def.value)}, Annotations: ${renderAnnotationSetLiteral(constant.def.annotations)}}`;
}

function renderMetadataType(
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

  const annotationsByName = arrays.groupBy(
    annotations,
    (annotation) => annotation.name,
  );
  const allByName = objects.mapValues(annotationsByName, (group) =>
    group.map((annotation) =>
      renderMetadataValueExpression(annotation.argument),
    ),
  );
  const byName = objects.mapValues(
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
