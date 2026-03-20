import type {
  LiteralValue,
  Position,
  PrimitiveType,
  TypeRef,
} from "@varavel/vdl-plugin-sdk";
import { crypto } from "@varavel/vdl-plugin-sdk/utils";
import type {
  EnumDescriptor,
  GeneratorContext,
} from "../../stages/model/types";
import { expectValue, fail } from "../errors";
import { resolveNonTypeRef } from "../go-types";

interface ScalarTarget {
  primitiveName?: PrimitiveType;
  enumDescriptor?: EnumDescriptor;
}

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
