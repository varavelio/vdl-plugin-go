import type { Position, TypeRef } from "@varavel/vdl-plugin-sdk";
import type { GeneratorContext } from "../../stages/model/types";
import { resolveNonTypeRef } from "./resolve";

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
