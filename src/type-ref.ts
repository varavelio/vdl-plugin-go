import type { Position, PrimitiveType, TypeRef } from "@varavel/vdl-plugin-sdk";
import { fail } from "./errors";
import type { ImportSet } from "./imports";
import type { GeneratorContext } from "./internal-types";
import { toGoFieldName } from "./naming";
import { getEffectiveObjectFields } from "./object-fields";

/**
 * Converts a VDL primitive name into its Go type.
 */
export function renderPrimitiveGoType(
  primitiveName: PrimitiveType | undefined,
  position?: Position,
): string {
  switch (primitiveName) {
    case "string":
      return "string";
    case "int":
      return "int64";
    case "float":
      return "float64";
    case "bool":
      return "bool";
    case "datetime":
      return "time.Time";
    default:
      fail(
        "Encountered a primitive type reference without a valid primitive name.",
        position,
      );
  }
}

/**
 * Renders the Go type used by generated declarations and fields.
 */
export function renderGoType(
  typeRef: TypeRef,
  context: GeneratorContext,
  inlineTypeName?: string,
  position?: Position,
): string {
  switch (typeRef.kind) {
    case "primitive":
      return renderPrimitiveGoType(typeRef.primitiveName, position);
    case "type": {
      const typeName = typeRef.typeName;

      if (!typeName) {
        fail(
          "Encountered a named type reference without a type name.",
          position,
        );
      }

      const goName = context.typeGoNamesByVdlName.get(typeName);

      if (!goName) {
        fail(
          `Unknown VDL type reference ${JSON.stringify(typeName)}.`,
          position,
        );
      }

      return goName;
    }
    case "enum": {
      const enumName = typeRef.enumName;

      if (!enumName) {
        fail("Encountered an enum reference without an enum name.", position);
      }

      const goName = context.enumGoNamesByVdlName.get(enumName);

      if (!goName) {
        fail(
          `Unknown VDL enum reference ${JSON.stringify(enumName)}.`,
          position,
        );
      }

      return goName;
    }
    case "array": {
      const arrayType = typeRef.arrayType;
      const arrayDims = typeRef.arrayDims;

      if (!arrayType || !arrayDims || arrayDims < 1) {
        fail(
          "Encountered an array type reference without a valid element type or dimension.",
          position,
        );
      }

      return `${"[]".repeat(arrayDims)}${renderGoType(arrayType, context, inlineTypeName, position)}`;
    }
    case "map": {
      const mapType = typeRef.mapType;

      if (!mapType) {
        fail(
          "Encountered a map type reference without a value type.",
          position,
        );
      }

      return `map[string]${renderGoType(mapType, context, inlineTypeName, position)}`;
    }
    case "object": {
      if (!inlineTypeName) {
        fail(
          "Encountered an inline object without a generated Go type name.",
          position,
        );
      }

      return inlineTypeName;
    }
    default:
      fail(
        `Unsupported VDL type kind ${JSON.stringify(typeRef.kind)}.`,
        position,
      );
  }
}

/**
 * Renders an anonymous Go type expression for a VDL type reference.
 */
export function renderAnonymousGoTypeExpression(
  typeRef: TypeRef,
  context: GeneratorContext,
  position?: Position,
  inlineTypeName?: string,
): string {
  switch (typeRef.kind) {
    case "primitive":
      return renderPrimitiveGoType(typeRef.primitiveName, position);
    case "type":
    case "enum":
      return renderGoType(typeRef, context, undefined, position);
    case "array": {
      const arrayType = typeRef.arrayType;
      const arrayDims = typeRef.arrayDims;

      if (!arrayType || !arrayDims || arrayDims < 1) {
        fail(
          "Encountered an array type reference without a valid element type or dimension.",
          position,
        );
      }

      return `${"[]".repeat(arrayDims)}${renderAnonymousGoTypeExpression(arrayType, context, position, inlineTypeName)}`;
    }
    case "map": {
      const mapType = typeRef.mapType;

      if (!mapType) {
        fail(
          "Encountered a map type reference without a value type.",
          position,
        );
      }

      return `map[string]${renderAnonymousGoTypeExpression(mapType, context, position, inlineTypeName)}`;
    }
    case "object": {
      if (inlineTypeName) {
        return inlineTypeName;
      }

      if (!typeRef.objectFields) {
        fail("Encountered an object type reference without fields.", position);
      }

      const fields = getEffectiveObjectFields(typeRef.objectFields);

      const parts = fields.map((field) => {
        const fieldType = renderAnonymousGoTypeExpression(
          field.typeRef,
          context,
          field.position,
        );

        return `${toGoFieldName(field.name)} ${field.optional ? `*${fieldType}` : fieldType}`;
      });

      return `struct { ${parts.join("; ")} }`;
    }
    default:
      fail(
        `Unsupported VDL type kind ${JSON.stringify(typeRef.kind)}.`,
        position,
      );
  }
}

/**
 * Resolves a named type reference to its first non-type target.
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

  const typeName = typeRef.typeName;

  if (!typeName) {
    fail("Encountered a named type reference without a type name.", position);
  }

  if (visited.has(typeName)) {
    fail(
      `Detected a type cycle while resolving ${JSON.stringify(typeName)}.`,
      position,
    );
  }

  const typeDef = context.typeDefsByVdlName.get(typeName);

  if (!typeDef) {
    fail(`Unknown VDL type reference ${JSON.stringify(typeName)}.`, position);
  }

  visited.add(typeName);
  return resolveNonTypeRef(typeDef.typeRef, context, typeDef.position, visited);
}

/**
 * Returns true when a VDL type can be emitted as a Go const.
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

/**
 * Collects Go imports required by a VDL type definition.
 */
export function collectImportsForTypeRef(
  typeRef: TypeRef,
  imports: ImportSet,
): void {
  switch (typeRef.kind) {
    case "primitive":
      if (typeRef.primitiveName === "datetime") {
        imports.add("time");
      }
      break;
    case "array":
      if (typeRef.arrayType) {
        collectImportsForTypeRef(typeRef.arrayType, imports);
      }
      break;
    case "map":
      if (typeRef.mapType) {
        collectImportsForTypeRef(typeRef.mapType, imports);
      }
      break;
    case "object":
      for (const field of getEffectiveObjectFields(typeRef.objectFields)) {
        collectImportsForTypeRef(field.typeRef, imports);
      }
      break;
    case "type":
    case "enum":
      break;
    default:
      break;
  }
}
