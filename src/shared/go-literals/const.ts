import type { LiteralValue, Position, TypeRef } from "@varavel/vdl-plugin-sdk";
import type { GeneratorContext } from "../../stages/model/types";
import { expectValue, fail } from "../errors";
import {
  renderDirectEnumExpression,
  renderRawScalarLiteral,
  resolveScalarTarget,
} from "./scalar";

/**
 * Renders a VDL literal as a Go constant initializer value.
 *
 * This function handles both primitive values and enum constants. It validates
 * that the type is indeed eligible for a constant and resolves the appropriate
 * Go expression for the initializer.
 *
 * @param typeRef - The VDL type of the constant.
 * @param literal - The VDL literal value.
 * @param context - The generator context.
 * @param position - The optional VDL source position.
 * @returns A Go expression string suitable for a `const` declaration.
 * @throws {GenerationError} If the type is not eligible for a constant.
 */
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
