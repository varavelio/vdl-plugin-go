import type { LiteralValue, Position, TypeRef } from "@varavel/vdl-plugin-sdk";
import type { GeneratorContext } from "../../stages/model/types";
import { expectValue, fail } from "../errors";
import { isConstEligibleType } from "../go-types";
import {
  renderDirectEnumExpression,
  renderRawScalarLiteral,
  resolveScalarTarget,
} from "./scalar";

export function canEmitConst(
  typeRef: TypeRef,
  context: GeneratorContext,
  position?: Position,
): boolean {
  return isConstEligibleType(typeRef, context, position);
}

export function renderConstInitializer(
  typeRef: TypeRef,
  literal: LiteralValue,
  context: GeneratorContext,
  position?: Position,
): string {
  const scalarTarget = resolveScalarTarget(typeRef, context, position);

  if (!scalarTarget) {
    fail("Tried to render a non-constant value as a Go const.", position);
  }

  if (typeRef.kind === "enum") {
    return renderDirectEnumExpression(
      expectValue(
        scalarTarget.enumDescriptor,
        "Missing enum descriptor while rendering an enum literal.",
        position,
      ),
      literal,
      position,
    );
  }

  return renderRawScalarLiteral(literal, scalarTarget, position);
}
