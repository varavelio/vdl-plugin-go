import type { LiteralValue, Position, TypeRef } from "@varavel/vdl-plugin-sdk";
import type { GeneratorContext } from "../../stages/model/types";
import { expectValue, fail } from "../errors";
import {
  renderAnonymousGoTypeExpression,
  renderGoType,
  resolveNonTypeRef,
} from "../go-types";
import { toGoFieldName, toInlineTypeName } from "../naming";
import { getEffectiveObjectFields } from "../object-fields";
import {
  renderDirectEnumExpression,
  renderRawScalarLiteral,
  resolveDirectEnumDescriptor,
  resolveScalarTarget,
} from "./scalar";

export function renderTypedValueExpression(
  typeRef: TypeRef,
  literal: LiteralValue,
  context: GeneratorContext,
  position?: Position,
  namedTypeGoName?: string,
): string {
  switch (typeRef.kind) {
    case "primitive":
      return renderRawScalarLiteral(
        literal,
        { primitiveName: typeRef.primitiveName },
        position,
      );
    case "enum":
      return renderDirectEnumExpression(
        resolveDirectEnumDescriptor(typeRef, context, position),
        literal,
        position,
      );
    case "array":
    case "map":
    case "object":
      return renderCompositeLiteral(
        renderAnonymousGoTypeExpression(
          typeRef,
          context,
          position,
          namedTypeGoName,
        ),
        typeRef,
        literal,
        context,
        position,
        namedTypeGoName,
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

function renderCompositeLiteral(
  typeExpression: string,
  typeRef: TypeRef,
  literal: LiteralValue,
  context: GeneratorContext,
  position?: Position,
  namedTypeGoName?: string,
): string {
  switch (typeRef.kind) {
    case "array":
      return renderArrayLiteral(
        typeExpression,
        typeRef,
        literal,
        context,
        position,
        namedTypeGoName,
      );
    case "map":
      return renderMapLiteral(
        typeExpression,
        typeRef,
        literal,
        context,
        position,
        namedTypeGoName,
      );
    case "object":
      return renderObjectLiteral(
        typeExpression,
        typeRef,
        literal,
        context,
        position,
        namedTypeGoName,
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
  namedTypeGoName?: string,
): string {
  if (literal.kind !== "array") {
    fail("Expected an array literal for a VDL array type.", position);
  }

  const elementType: TypeRef =
    (typeRef.arrayDims ?? 1) === 1
      ? expectValue(
          typeRef.arrayType,
          "Encountered an invalid array type while rendering a literal.",
          position,
        )
      : {
          kind: "array",
          arrayType: expectValue(
            typeRef.arrayType,
            "Encountered an invalid array type while rendering a literal.",
            position,
          ),
          arrayDims: (typeRef.arrayDims ?? 1) - 1,
        };

  const items = (literal.arrayItems ?? []).map((item) =>
    renderTypedValueExpression(
      elementType,
      item,
      context,
      item.position,
      namedTypeGoName,
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
  namedTypeGoName?: string,
): string {
  if (literal.kind !== "object") {
    fail("Expected an object literal for a VDL map type.", position);
  }

  const valueType = expectValue(
    typeRef.mapType,
    "Encountered an invalid map type while rendering a literal.",
    position,
  );

  const entries = (literal.objectEntries ?? []).map(
    (entry) =>
      `${JSON.stringify(entry.key)}: ${renderTypedValueExpression(valueType, entry.value, context, entry.position, namedTypeGoName)}`,
  );

  return `${typeExpression}{${entries.join(", ")}}`;
}

function renderObjectLiteral(
  typeExpression: string,
  typeRef: TypeRef,
  literal: LiteralValue,
  context: GeneratorContext,
  position?: Position,
  namedTypeGoName?: string,
): string {
  if (literal.kind !== "object") {
    fail("Expected an object literal for a VDL object type.", position);
  }

  const fields = getEffectiveObjectFields(typeRef.objectFields);
  const entryByName = new Map(
    (literal.objectEntries ?? []).map((entry) => [entry.key, entry]),
  );
  const entries: string[] = [];

  for (const field of fields) {
    const entry = entryByName.get(field.name);

    if (!entry) {
      continue;
    }

    const childTypeGoName = namedTypeGoName
      ? toInlineTypeName(namedTypeGoName, field.name)
      : undefined;
    const renderedValue = renderTypedValueExpression(
      field.typeRef,
      entry.value,
      context,
      entry.position,
      childTypeGoName,
    );

    entries.push(
      `${toGoFieldName(field.name)}: ${field.optional ? `Ptr(${renderedValue})` : renderedValue}`,
    );
  }

  return `${typeExpression}{${entries.join(", ")}}`;
}
