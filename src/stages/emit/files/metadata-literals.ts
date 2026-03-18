import { arrays, objects } from "@varavel/vdl-plugin-sdk/utils";
import { renderMetadataValueExpression } from "../../../shared/go-literals";
import {
  renderAnonymousGoTypeExpression,
  renderGoType,
} from "../../../shared/go-types";
import type {
  ConstantDescriptor,
  GeneratorContext,
  NamedTypeDescriptor,
} from "../../model/types";

export function renderTypeMetadataType(
  descriptor: NamedTypeDescriptor,
  context: GeneratorContext,
): string {
  return descriptor.kind === "object"
    ? "object"
    : renderGoType(descriptor.typeRef, context, undefined, descriptor.position);
}

export function renderConstantMetadataType(
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

export function renderAnnotationSetLiteral(
  annotations: NamedTypeDescriptor["annotations"],
): string {
  if (annotations.length === 0) {
    return "AnnotationSet{}";
  }

  const annotationsByName = arrays.groupBy(
    annotations,
    (annotation) => annotation.name,
  );
  const byName = objects.mapValues(
    annotationsByName,
    (group) =>
      group.map((annotation) =>
        renderMetadataValueExpression(annotation.argument),
      )[group.length - 1] ?? "nil",
  );

  const byNameEntries = Object.keys(byName).map(
    (name) => `${JSON.stringify(name)}: ${byName[name]}`,
  );

  return `AnnotationSet{List: []Annotation{${annotations
    .map(
      (annotation) =>
        `Annotation{Name: ${JSON.stringify(annotation.name)}, Value: ${renderMetadataValueExpression(annotation.argument)}}`,
    )
    .join(", ")}}, ByName: map[string]any{${byNameEntries.join(", ")}}}`;
}
