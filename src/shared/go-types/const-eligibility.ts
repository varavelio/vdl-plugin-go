import type { Position, TypeRef } from "@varavel/vdl-plugin-sdk";
import type { GeneratorContext } from "../../stages/model/types";
import { resolveNonTypeRef } from "./resolve";

/**
 * Determines if a VDL type is eligible to be rendered as a Go `const`.
 *
 * In Go, only primitives (strings, numbers, booleans) and types derived from them
 * (like enums) can be declared with the `const` keyword. Composite types such as
 * arrays, maps, and objects must use `var`.
 *
 * Special note: `datetime` types are not supported as Go `const` values even though
 * they are primitive in VDL.
 *
 * @param typeRef - The VDL type reference to check.
 * @param context - The generator context.
 * @param position - The optional VDL source position for error reporting during resolution.
 * @returns True if the type can be a Go constant, false otherwise.
 */
export function isConstEligibleType(
  typeRef: TypeRef,
  context: GeneratorContext,
  position?: Position,
): boolean {
  const resolved = resolveNonTypeRef(typeRef, context, position);

  if (resolved.kind === "enum") {
    return true;
  }

  return resolved.kind === "primitive" && resolved.primitiveName !== "datetime";
}
