import type {
  LiteralValue,
  Position,
  PrimitiveType,
  TypeRef,
} from "@varavel/vdl-plugin-sdk";

import { fail } from "./errors";
import type { EnumDescriptor, GeneratorContext } from "./internal-types";
import { getLiteralValueKey } from "./literal-helpers";
import { toGoFieldName, toInlineTypeName } from "./naming";
import { getEffectiveObjectFields } from "./object-fields";
import {
  isConstEligibleType,
  renderAnonymousGoTypeExpression,
  renderGoType,
  resolveNonTypeRef,
} from "./type-ref";

interface ScalarTarget {
  primitiveName?: PrimitiveType;
  enumDescriptor?: EnumDescriptor;
}

/**
 * Returns true when a constant can be emitted as a Go const declaration.
 */
export function canEmitConst(
  typeRef: TypeRef,
  context: GeneratorContext,
  position?: Position,
): boolean {
  return isConstEligibleType(typeRef, context, position);
}

/**
 * Renders the right-hand side used by a Go const declaration.
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
      scalarTarget.enumDescriptor,
      literal,
      position,
    );
  }

  return renderRawScalarLiteral(literal, scalarTarget, position);
}

/**
 * Renders a fully typed Go expression for any supported literal.
 */
export function renderTypedValueExpression(
  typeRef: TypeRef,
  literal: LiteralValue,
  context: GeneratorContext,
  position?: Position,
  namedTypeName?: string,
): string {
  switch (typeRef.kind) {
    case "primitive":
      return renderRawScalarLiteral(
        literal,
        { primitiveName: typeRef.primitiveName },
        position,
      );
    case "enum": {
      const enumDescriptor = resolveDirectEnumDescriptor(
        typeRef,
        context,
        position,
      );
      return renderDirectEnumExpression(enumDescriptor, literal, position);
    }
    case "array":
      return renderCompositeLiteral(
        renderAnonymousGoTypeExpression(
          typeRef,
          context,
          position,
          namedTypeName,
        ),
        typeRef,
        literal,
        context,
        position,
        namedTypeName,
      );
    case "map":
      return renderCompositeLiteral(
        renderAnonymousGoTypeExpression(
          typeRef,
          context,
          position,
          namedTypeName,
        ),
        typeRef,
        literal,
        context,
        position,
        namedTypeName,
      );
    case "object":
      return renderCompositeLiteral(
        renderAnonymousGoTypeExpression(
          typeRef,
          context,
          position,
          namedTypeName,
        ),
        typeRef,
        literal,
        context,
        position,
        namedTypeName,
      );
    case "type": {
      const goType = renderGoType(typeRef, context, undefined, position);
      const resolved = resolveNonTypeRef(typeRef, context, position);

      if (resolved.kind === "primitive" || resolved.kind === "enum") {
        const scalarTarget = resolveScalarTarget(typeRef, context, position);

        if (!scalarTarget) {
          fail(
            "Expected a scalar target while rendering a named scalar type.",
            position,
          );
        }

        return `${goType}(${renderRawScalarLiteral(literal, scalarTarget, position)})`;
      }

      return renderCompositeLiteral(
        goType,
        resolved,
        literal,
        context,
        position,
        goType,
      );
    }
    default:
      fail(
        `Unsupported literal rendering for type kind ${JSON.stringify(typeRef.kind)}.`,
        position,
      );
  }
}

/**
 * Renders an annotation argument as a Go `any` value.
 */
export function renderMetadataValueExpression(
  value: LiteralValue | undefined,
): string {
  if (!value) {
    return "nil";
  }

  switch (value.kind) {
    case "string":
      return JSON.stringify(value.stringValue ?? "");
    case "int":
      return String(value.intValue ?? 0);
    case "float":
      return String(value.floatValue ?? 0);
    case "bool":
      return String(value.boolValue ?? false);
    case "array": {
      const items = value.arrayItems ?? [];
      return `[]any{${items.map((item) => renderMetadataValueExpression(item)).join(", ")}}`;
    }
    case "object": {
      const entries = value.objectEntries ?? [];
      return `map[string]any{${entries
        .map(
          (entry) =>
            `${JSON.stringify(entry.key)}: ${renderMetadataValueExpression(entry.value)}`,
        )
        .join(", ")}}`;
    }
    default:
      return "nil";
  }
}

function renderCompositeLiteral(
  typeExpression: string,
  typeRef: TypeRef,
  literal: LiteralValue,
  context: GeneratorContext,
  position?: Position,
  namedTypeName?: string,
): string {
  switch (typeRef.kind) {
    case "array":
      return renderArrayLiteral(
        typeExpression,
        typeRef,
        literal,
        context,
        position,
        namedTypeName,
      );
    case "map":
      return renderMapLiteral(
        typeExpression,
        typeRef,
        literal,
        context,
        position,
        namedTypeName,
      );
    case "object":
      return renderObjectLiteral(
        typeExpression,
        typeRef,
        literal,
        context,
        position,
        namedTypeName,
      );
    default:
      fail(
        "Expected a composite VDL type while rendering a composite Go literal.",
        position,
      );
  }
}

function renderArrayLiteral(
  typeExpression: string,
  typeRef: TypeRef,
  literal: LiteralValue,
  context: GeneratorContext,
  position?: Position,
  namedTypeName?: string,
): string {
  if (literal.kind !== "array") {
    fail("Expected an array literal for a VDL array type.", position);
  }

  const arrayType = typeRef.arrayType;
  const arrayDims = typeRef.arrayDims;

  if (!arrayType || !arrayDims || arrayDims < 1) {
    fail(
      "Encountered an invalid array type while rendering a literal.",
      position,
    );
  }

  const elementType: TypeRef =
    arrayDims === 1
      ? arrayType
      : {
          kind: "array",
          arrayType,
          arrayDims: arrayDims - 1,
        };

  const items = (literal.arrayItems ?? []).map((item) =>
    renderTypedValueExpression(
      elementType,
      item,
      context,
      item.position,
      namedTypeName,
    ),
  );

  return `${typeExpression}{${items.join(", ")}}`;
}

function renderMapLiteral(
  typeExpression: string,
  typeRef: TypeRef,
  literal: LiteralValue,
  context: GeneratorContext,
  position?: Position,
  namedTypeName?: string,
): string {
  if (literal.kind !== "object") {
    fail("Expected an object literal for a VDL map type.", position);
  }

  const mapType = typeRef.mapType;

  if (!mapType) {
    fail(
      "Encountered an invalid map type while rendering a literal.",
      position,
    );
  }

  const entries = (literal.objectEntries ?? []).map(
    (entry) =>
      `${JSON.stringify(entry.key)}: ${renderTypedValueExpression(mapType, entry.value, context, entry.position, namedTypeName)}`,
  );

  return `${typeExpression}{${entries.join(", ")}}`;
}

function renderObjectLiteral(
  typeExpression: string,
  typeRef: TypeRef,
  literal: LiteralValue,
  context: GeneratorContext,
  position?: Position,
  namedTypeName?: string,
): string {
  if (literal.kind !== "object") {
    fail("Expected an object literal for a VDL object type.", position);
  }

  if (!typeRef.objectFields) {
    fail(
      "Encountered an object type without fields while rendering a literal.",
      position,
    );
  }

  const fields = getEffectiveObjectFields(typeRef.objectFields);

  const remainingEntries = new Map(
    (literal.objectEntries ?? []).map((entry) => [entry.key, entry]),
  );
  const entries: string[] = [];

  for (const field of fields) {
    const entry = remainingEntries.get(field.name);

    if (!entry) {
      if (!field.optional) {
        fail(
          `Missing required object field ${JSON.stringify(field.name)} in literal.`,
          position,
        );
      }

      continue;
    }

    remainingEntries.delete(field.name);

    const childTypeName = namedTypeName
      ? toInlineTypeName(namedTypeName, field.name)
      : undefined;
    const renderedValue = renderTypedValueExpression(
      field.typeRef,
      entry.value,
      context,
      entry.position,
      childTypeName,
    );
    entries.push(
      `${toGoFieldName(field.name)}: ${field.optional ? `Ptr(${renderedValue})` : renderedValue}`,
    );
  }

  const firstUnexpectedEntry = remainingEntries.values().next().value;

  if (firstUnexpectedEntry) {
    fail(
      `Unexpected object field ${JSON.stringify(firstUnexpectedEntry.key)} in literal.`,
      firstUnexpectedEntry.position,
    );
  }

  return `${typeExpression}{${entries.join(", ")}}`;
}

function resolveScalarTarget(
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

function resolveDirectEnumDescriptor(
  typeRef: TypeRef,
  context: GeneratorContext,
  position?: Position,
): EnumDescriptor {
  const enumName = typeRef.enumName;

  if (!enumName) {
    fail("Encountered an enum reference without an enum name.", position);
  }

  const enumDescriptor = context.enumDescriptorsByVdlName.get(enumName);

  if (!enumDescriptor) {
    fail(`Unknown VDL enum reference ${JSON.stringify(enumName)}.`, position);
  }

  return enumDescriptor;
}

function renderDirectEnumExpression(
  enumDescriptor: EnumDescriptor | undefined,
  literal: LiteralValue,
  position?: Position,
): string {
  if (!enumDescriptor) {
    fail("Missing enum descriptor while rendering an enum literal.", position);
  }

  const member = enumDescriptor.memberByValue.get(getLiteralValueKey(literal));

  if (!member) {
    fail(
      `Invalid literal for enum ${JSON.stringify(enumDescriptor.def.name)}. Expected one of its declared members.`,
      position,
    );
  }

  return member.constName;
}

function renderRawScalarLiteral(
  literal: LiteralValue,
  target: ScalarTarget,
  position?: Position,
): string {
  if (target.enumDescriptor) {
    const enumType = target.enumDescriptor.def.enumType;

    if (enumType === "string") {
      if (literal.kind !== "string") {
        fail("Expected a string literal for a string enum value.", position);
      }

      if (
        !target.enumDescriptor.memberByValue.has(getLiteralValueKey(literal))
      ) {
        fail(
          `Invalid literal for enum ${JSON.stringify(target.enumDescriptor.def.name)}. Expected one of its declared members.`,
          position,
        );
      }

      return JSON.stringify(literal.stringValue ?? "");
    }

    if (literal.kind !== "int") {
      fail("Expected an int literal for an int enum value.", position);
    }

    if (!target.enumDescriptor.memberByValue.has(getLiteralValueKey(literal))) {
      fail(
        `Invalid literal for enum ${JSON.stringify(target.enumDescriptor.def.name)}. Expected one of its declared members.`,
        position,
      );
    }

    return String(literal.intValue ?? 0);
  }

  switch (target.primitiveName) {
    case "string":
      if (literal.kind !== "string") {
        fail("Expected a string literal for a string type.", position);
      }

      return JSON.stringify(literal.stringValue ?? "");
    case "int":
      if (literal.kind !== "int") {
        fail("Expected an int literal for an int type.", position);
      }

      return String(literal.intValue ?? 0);
    case "float":
      if (literal.kind !== "float" && literal.kind !== "int") {
        fail("Expected a float or int literal for a float type.", position);
      }

      return String(
        literal.kind === "float"
          ? (literal.floatValue ?? 0)
          : (literal.intValue ?? 0),
      );
    case "bool":
      if (literal.kind !== "bool") {
        fail("Expected a bool literal for a bool type.", position);
      }

      return String(literal.boolValue ?? false);
    case "datetime":
    case undefined:
      fail(
        "Datetime literals are not supported by the current VDL plugin SDK.",
        position,
      );
  }
}
