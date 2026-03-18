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
