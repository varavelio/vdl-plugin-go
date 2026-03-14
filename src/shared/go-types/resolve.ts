import type { Position, TypeRef } from "@varavel/vdl-plugin-sdk";
import type { GeneratorContext } from "../../stages/model/types";
import { expectValue, fail } from "../errors";

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
