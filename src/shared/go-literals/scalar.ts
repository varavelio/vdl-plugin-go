import type {
  LiteralValue,
  Position,
  PrimitiveType,
  TypeRef,
} from "@varavel/vdl-plugin-sdk";
import * as crypto from "@varavel/vdl-plugin-sdk/utils/crypto";
import type {
  EnumDescriptor,
  GeneratorContext,
} from "../../stages/model/types";
import { expectValue, fail } from "../errors";
import { resolveNonTypeRef } from "../go-types/resolve";

interface ScalarTarget {
  primitiveName?: PrimitiveType;
  enumDescriptor?: EnumDescriptor;
}

/**
 * Resolves a VDL TypeRef to its underlying scalar target (primitive or enum).
 *
 * This is used to determine how a literal value should be rendered in Go.
 * If the type resolves to a structural type (array, map, object), it returns undefined.
 *
 * Note: `datetime` is currently not supported as a scalar literal target in this plugin.
 *
 * @param typeRef - The VDL type reference to resolve.
 * @param context - The generator context.
 * @param position - The optional VDL source position.
 * @returns A ScalarTarget object if it's a primitive or enum, otherwise undefined.
 */
export function resolveScalarTarget(
  typeRef: TypeRef,
  context: GeneratorContext,
  position?: Position,
): ScalarTarget | undefined {
  const resolved = resolveNonTypeRef(typeRef, context, position);

  if (resolved.kind === "primitive") {
    return resolved.primitiveName === "datetime"
      ? undefined
      : { primitiveName: resolved.primitiveName };
  }

  if (resolved.kind === "enum") {
    return {
      enumDescriptor: resolveDirectEnumDescriptor(resolved, context, position),
    };
  }

  return undefined;
}

/**
 * Retrieves the EnumDescriptor for a given enum type reference.
 *
 * @param typeRef - The VDL type reference, which must be of kind "enum".
 * @param context - The generator context.
 * @param position - The optional VDL source position.
 * @returns The resolved EnumDescriptor.
 * @throws {GenerationError} If the enum name is missing or unknown.
 */
export function resolveDirectEnumDescriptor(
  typeRef: TypeRef,
  context: GeneratorContext,
  position?: Position,
): EnumDescriptor {
  const enumName = expectValue(
    typeRef.enumName,
    "Encountered an enum reference without an enum name.",
    position,
  );

  return expectValue(
    context.enumDescriptorsByVdlName.get(enumName),
    `Unknown VDL enum reference ${JSON.stringify(enumName)}.`,
    position,
  );
}

/**
 * Renders a VDL literal as a Go enum constant expression.
 *
 * It validates that the literal value matches one of the declared members
 * of the enum and returns the corresponding Go constant name.
 *
 * @param enumDescriptor - The descriptor for the enum type.
 * @param literal - The VDL literal value.
 * @param position - The optional VDL source position.
 * @returns The Go name of the enum constant.
 * @throws {GenerationError} If the literal does not match any enum member.
 */
export function renderDirectEnumExpression(
  enumDescriptor: EnumDescriptor,
  literal: LiteralValue,
  position?: Position,
): string {
  const member = enumDescriptor.memberByValue.get(crypto.hash(literal));

  if (!member) {
    fail(
      `Invalid literal for ${JSON.stringify(enumDescriptor.def.name)} enum. Expected one of its declared members.`,
      position,
    );
  }

  return member.constName;
}

/**
 * Renders a VDL literal as a raw Go scalar value (string, number, or bool).
 *
 * This function handles the low-level rendering of scalar types, including
 * enum underlying values and primitive types.
 *
 * @param literal - The VDL literal value.
 * @param target - The scalar target (primitive or enum) to render for.
 * @param position - The optional VDL source position.
 * @returns A Go literal string.
 * @throws {GenerationError} If the literal kind doesn't match the target type.
 */
export function renderRawScalarLiteral(
  literal: LiteralValue,
  target: ScalarTarget,
  position?: Position,
): string {
  if (target.enumDescriptor) {
    return renderEnumScalarLiteral(target.enumDescriptor, literal, position);
  }

  switch (target.primitiveName) {
    case "string":
      if (literal.kind !== "string") {
        fail("Expected a string literal for a string type.", position);
      }

      return JSON.stringify(literal.stringValue);
    case "int":
      if (literal.kind !== "int") {
        fail("Expected an int literal for an int type.", position);
      }

      return String(literal.intValue);
    case "float":
      if (literal.kind !== "float" && literal.kind !== "int") {
        fail("Expected a float or int literal for a float type.", position);
      }

      return String(
        literal.kind === "float" ? literal.floatValue : literal.intValue,
      );
    case "bool":
      if (literal.kind !== "bool") {
        fail("Expected a bool literal for a bool type.", position);
      }

      return String(literal.boolValue);
    case "datetime":
    case undefined:
      fail(
        "Datetime literals are not supported by the current VDL plugin SDK.",
        position,
      );
  }
}

/**
 * Renders a VDL literal as the underlying scalar value for an enum.
 *
 * @param enumDescriptor - The enum descriptor.
 * @param literal - The VDL literal value.
 * @param position - The optional VDL source position.
 * @returns A Go literal string (quoted string or number).
 */
function renderEnumScalarLiteral(
  enumDescriptor: EnumDescriptor,
  literal: LiteralValue,
  position?: Position,
): string {
  if (!enumDescriptor.memberByValue.has(crypto.hash(literal))) {
    fail(
      `Invalid literal for ${JSON.stringify(enumDescriptor.def.name)} enum. Expected one of its declared members.`,
      position,
    );
  }

  if (enumDescriptor.def.enumType === "string") {
    if (literal.kind !== "string") {
      fail("Expected a string literal for a string enum value.", position);
    }

    return JSON.stringify(literal.stringValue);
  }

  if (literal.kind !== "int") {
    fail("Expected an int literal for an int enum value.", position);
  }

  return String(literal.intValue);
}
