import type { Position, TypeRef } from "@varavel/vdl-plugin-sdk";
import type { GeneratorContext } from "../../stages/model/types";
import { expectValue, fail } from "../errors";

/**
 * Resolves a VDL TypeRef until it is no longer a named type reference.
 *
 * This function recursively follows type aliases in the VDL schema to find the underlying
 * structural type (e.g., a primitive, array, map, or object). It includes cycle detection
 * to prevent infinite recursion on malformed schemas.
 *
 * @param typeRef - The initial type reference to resolve.
 * @param context - The generator context containing all type definitions.
 * @param position - The optional VDL source position for error reporting.
 * @param visited - An internal set of visited type names used for cycle detection.
 * @returns The underlying non-named TypeRef.
 * @throws {GenerationError} If a type cycle is detected or if a type reference is unknown.
 */
export function resolveNonTypeRef(
  typeRef: TypeRef,
  context: GeneratorContext,
  position?: Position,
  visited = new Set<string>(),
): TypeRef {
  if (typeRef.kind !== "type") {
    return typeRef;
  }

  const typeName = expectValue(
    typeRef.typeName,
    "Encountered a named type reference without a type name.",
    position,
  );

  if (visited.has(typeName)) {
    fail(
      `Detected a type cycle while resolving ${JSON.stringify(typeName)}.`,
      position,
    );
  }

  const typeDef = expectValue(
    context.typeDefsByVdlName.get(typeName),
    `Unknown VDL type reference ${JSON.stringify(typeName)}.`,
    position,
  );

  visited.add(typeName);
  return resolveNonTypeRef(typeDef.typeRef, context, typeDef.position, visited);
}
