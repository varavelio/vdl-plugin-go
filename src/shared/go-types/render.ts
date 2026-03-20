import type { Position, PrimitiveType, TypeRef } from "@varavel/vdl-plugin-sdk";
import type { GeneratorContext } from "../../stages/model/types";
import { expectValue, fail } from "../errors";
import { toGoFieldName, toGoJsonName } from "../naming";
import { getEffectiveObjectFields } from "../object-fields";

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

      const parts = getEffectiveObjectFields(typeRef.objectFields).map(
        (field) => {
          const fieldType = renderAnonymousGoTypeExpression(
            field.typeRef,
            context,
            field.position,
          );
          const jsonTag = field.optional
            ? `json:${JSON.stringify(`${toGoJsonName(field.name)},omitempty`)}`
            : `json:${JSON.stringify(toGoJsonName(field.name))}`;

          return `${toGoFieldName(field.name)} ${field.optional ? `*${fieldType}` : fieldType} \`${jsonTag}\``;
        },
      );

      return `struct { ${parts.join("; ")} }`;
    }
    default:
      fail(
        `Unsupported VDL type kind ${JSON.stringify(typeRef.kind)}.`,
        position,
      );
  }
}
