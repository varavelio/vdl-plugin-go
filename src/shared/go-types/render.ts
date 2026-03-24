import type { Position, PrimitiveType, TypeRef } from "@varavel/vdl-plugin-sdk";
import type { GeneratorContext } from "../../stages/model/types";
import { expectValue, fail } from "../errors";
import { toGoFieldName } from "../naming";

/**
 * Renders a VDL primitive name into its corresponding Go type name.
 *
 * It maps VDL types like `int` to `int64`, `float` to `float64`, and `datetime` to `time.Time`.
 *
 * @param primitiveName - The VDL primitive name.
 * @param position - The optional VDL source position for error reporting.
 * @returns The Go type name as a string.
 */
function renderPrimitiveGoType(
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
 * Renders a VDL TypeRef into its Go type name representation.
 *
 * This function resolves named types, enums, arrays, maps, and inline objects
 * to their generated Go names or built-in Go types.
 *
 * @param typeRef - The VDL type reference to render.
 * @param context - The generator context containing type and enum name mappings.
 * @param inlineTypeGoName - The generated Go name for an inline object type, if applicable.
 * @param position - The optional VDL source position for error reporting.
 * @returns The rendered Go type name.
 */
export function renderGoType(
  typeRef: TypeRef,
  context: GeneratorContext,
  inlineTypeGoName?: string,
  position?: Position,
): string {
  switch (typeRef.kind) {
    case "primitive":
      return renderPrimitiveGoType(typeRef.primitiveName, position);
    case "type": {
      const typeName = expectValue(
        typeRef.typeName,
        "Encountered a named type reference without a type name.",
        position,
      );

      return expectValue(
        context.typeGoNamesByVdlName.get(typeName),
        `Unknown VDL type reference ${JSON.stringify(typeName)}.`,
        position,
      );
    }
    case "enum": {
      const enumName = expectValue(
        typeRef.enumName,
        "Encountered an enum reference without an enum name.",
        position,
      );

      return expectValue(
        context.enumGoNamesByVdlName.get(enumName),
        `Unknown VDL enum reference ${JSON.stringify(enumName)}.`,
        position,
      );
    }
    case "array":
      return `${"[]".repeat(typeRef.arrayDims ?? 1)}${renderGoType(expectValue(typeRef.arrayType, "Encountered an array type reference without an element type.", position), context, inlineTypeGoName, position)}`;
    case "map":
      return `map[string]${renderGoType(expectValue(typeRef.mapType, "Encountered a map type reference without a value type.", position), context, inlineTypeGoName, position)}`;
    case "object":
      return expectValue(
        inlineTypeGoName,
        "Encountered an inline object without a generated Go type name.",
        position,
      );
    default:
      fail(
        `Unsupported VDL type kind ${JSON.stringify(typeRef.kind)}.`,
        position,
      );
  }
}

/**
 * Renders a VDL TypeRef as an anonymous Go type expression (e.g., `struct { ... }`).
 *
 * This is primarily used for generating composite literals where a named type
 * might not be appropriate or available. Inline objects are
 * expanded into anonymous struct definitions unless a name is provided.
 *
 * @param typeRef - The VDL type to render.
 * @param context - The generator context.
 * @param position - The optional VDL source position.
 * @param inlineTypeGoName - The Go name for an inline object, if it should be named.
 * @returns A Go type expression string.
 */
export function renderAnonymousGoTypeExpression(
  typeRef: TypeRef,
  context: GeneratorContext,
  position?: Position,
  inlineTypeGoName?: string,
): string {
  switch (typeRef.kind) {
    case "primitive":
      return renderPrimitiveGoType(typeRef.primitiveName, position);
    case "type":
    case "enum":
      return renderGoType(typeRef, context, undefined, position);
    case "array":
      return `${"[]".repeat(typeRef.arrayDims ?? 1)}${renderAnonymousGoTypeExpression(expectValue(typeRef.arrayType, "Encountered an array type reference without an element type.", position), context, position, inlineTypeGoName)}`;
    case "map":
      return `map[string]${renderAnonymousGoTypeExpression(expectValue(typeRef.mapType, "Encountered a map type reference without a value type.", position), context, position, inlineTypeGoName)}`;
    case "object": {
      if (inlineTypeGoName) {
        return inlineTypeGoName;
      }

      const parts = (typeRef.objectFields ?? []).map((field) => {
        const fieldType = renderAnonymousGoTypeExpression(
          field.typeRef,
          context,
          field.position,
        );
        const jsonTag = field.optional
          ? `json:${JSON.stringify(`${field.name},omitempty`)}`
          : `json:${JSON.stringify(field.name)}`;

        return `${toGoFieldName(field.name)} ${field.optional ? `*${fieldType}` : fieldType} \`${jsonTag}\``;
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
 * Renders a VDL TypeRef as a formatted, multiline anonymous Go type expression.
 *
 * Similar to `renderAnonymousGoTypeExpression`, but produces human-readable, indented
 * struct definitions suitable for inclusion in generated source code.
 *
 * @param typeRef - The VDL type to render.
 * @param context - The generator context.
 * @param position - The optional VDL source position.
 * @param inlineTypeGoName - The Go name for an inline object, if it should be named.
 * @returns A formatted Go type expression string.
 */
export function renderAnonymousGoTypeExpressionPretty(
  typeRef: TypeRef,
  context: GeneratorContext,
  position?: Position,
  inlineTypeGoName?: string,
): string {
  switch (typeRef.kind) {
    case "primitive":
      return renderPrimitiveGoType(typeRef.primitiveName, position);
    case "type":
    case "enum":
      return renderGoType(typeRef, context, undefined, position);
    case "array":
      return `${"[]".repeat(typeRef.arrayDims ?? 1)}${renderAnonymousGoTypeExpressionPretty(expectValue(typeRef.arrayType, "Encountered an array type reference without an element type.", position), context, position, inlineTypeGoName)}`;
    case "map":
      return `map[string]${renderAnonymousGoTypeExpressionPretty(expectValue(typeRef.mapType, "Encountered a map type reference without a value type.", position), context, position, inlineTypeGoName)}`;
    case "object": {
      if (inlineTypeGoName) {
        return inlineTypeGoName;
      }

      const fields = typeRef.objectFields ?? [];

      if (fields.length === 0) {
        return "struct {}";
      }

      const lines = fields.map((field) => {
        const fieldType = renderAnonymousGoTypeExpressionPretty(
          field.typeRef,
          context,
          field.position,
        );
        const jsonTag = field.optional
          ? `json:${JSON.stringify(`${field.name},omitempty`)}`
          : `json:${JSON.stringify(field.name)}`;
        const fieldDecl = `${toGoFieldName(field.name)} ${field.optional ? `*${fieldType}` : fieldType} \`${jsonTag}\``;

        return indentMultiline(fieldDecl);
      });

      return `struct {\n${lines.join("\n")}\n}`;
    }
    default:
      fail(
        `Unsupported VDL type kind ${JSON.stringify(typeRef.kind)}.`,
        position,
      );
  }
}

/**
 * Indents each line of a multiline string with a single tab character.
 *
 * @param value - The multiline string to indent.
 * @returns The indented string.
 */
function indentMultiline(value: string): string {
  return value
    .split("\n")
    .map((line) => `\t${line}`)
    .join("\n");
}
