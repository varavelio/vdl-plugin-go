import type { LiteralValue, Position, TypeRef } from "@varavel/vdl-plugin-sdk";
import type { GeneratorContext } from "../../stages/model/types";
import { expectValue, fail } from "../errors";
import {
  renderAnonymousGoTypeExpression,
  renderAnonymousGoTypeExpressionPretty,
  renderGoType,
} from "../go-types/render";
import { resolveNonTypeRef } from "../go-types/resolve";
import { toGoFieldName, toInlineTypeName } from "../naming";
import {
  renderDirectEnumExpression,
  renderRawScalarLiteral,
  resolveDirectEnumDescriptor,
  resolveScalarTarget,
} from "./scalar";

/**
 * Renders a VDL literal value as a typed Go expression.
 *
 * This function handles primitives, enums, and composite types (arrays, maps, objects).
 * It ensures that the generated Go code is correctly typed, including pointer wrapping
 * for optional fields and proper type conversions for named aliases.
 *
 * @param typeRef - The VDL type of the value being rendered.
 * @param literal - The VDL literal value.
 * @param context - The generator context.
 * @param position - The optional VDL source position.
 * @param namedTypeGoName - The Go name of the type if it's a named type.
 * @returns A Go expression string representing the literal value.
 */
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

/**
 * Renders a VDL literal value as a formatted, multiline Go expression.
 *
 * Similar to `renderTypedValueExpression`, but produces human-readable, indented
 * output for composite literals.
 *
 * @param typeRef - The VDL type of the value.
 * @param literal - The VDL literal value.
 * @param context - The generator context.
 * @param position - The optional VDL source position.
 * @param namedTypeGoName - The Go name of the type if it's a named type.
 * @returns A formatted Go expression string.
 */
export function renderTypedValueExpressionPretty(
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
      return renderCompositeLiteralPretty({
        typeRef,
        literal,
        context,
        position,
        namedTypeGoName,
      });
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

      return renderCompositeLiteralPretty({
        typeRef: resolved,
        literal,
        context,
        position,
        namedTypeGoName: goType,
        typeExpression: goType,
      });
    }
    default:
      fail(
        `Unsupported literal rendering for type kind ${JSON.stringify(typeRef.kind)}.`,
        position,
      );
  }
}

/**
 * Renders a composite literal (array, map, or object) in a compact format.
 *
 * @param typeExpression - The Go type expression for the literal.
 * @param typeRef - The VDL type reference.
 * @param literal - The VDL literal value.
 * @param context - The generator context.
 * @param position - The optional VDL source position.
 * @param namedTypeGoName - The Go name of the type if it's a named type.
 * @returns A compact Go composite literal string.
 */
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

/**
 * Renders an array literal in a compact format.
 *
 * Handles multi-dimensional arrays by recursively rendering nested items.
 *
 * @param typeExpression - The Go type expression.
 * @param typeRef - The VDL array type.
 * @param literal - The VDL array literal.
 * @param context - The generator context.
 * @param position - The optional VDL source position.
 * @param namedTypeGoName - The Go name of the type if it's a named type.
 * @returns A compact Go array literal string.
 */
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

/**
 * Renders a map literal in a compact format.
 *
 * All VDL maps are rendered as Go `map[string]T`.
 *
 * @param typeExpression - The Go type expression.
 * @param typeRef - The VDL map type.
 * @param literal - The VDL object literal used as a map.
 * @param context - The generator context.
 * @param position - The optional VDL source position.
 * @param namedTypeGoName - The Go name of the type if it's a named type.
 * @returns A compact Go map literal string.
 */
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

/**
 * Renders an object literal in a compact format.
 *
 * Handles optional fields by wrapping values with `Ptr()` or using an anonymous
 * closure if pointer utilities are disabled.
 *
 * @param typeExpression - The Go type expression.
 * @param typeRef - The VDL object type.
 * @param literal - The VDL object literal.
 * @param context - The generator context.
 * @param position - The optional VDL source position.
 * @param namedTypeGoName - The Go name of the type if it's a named type.
 * @returns A compact Go struct literal string.
 */
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

  const fields = typeRef.objectFields ?? [];
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

    if (!field.optional) {
      entries.push(`${toGoFieldName(field.name)}: ${renderedValue}`);
      continue;
    }

    if (context.options.genPointerUtils === false) {
      const valueType = renderAnonymousGoTypeExpression(
        field.typeRef,
        context,
        entry.position,
        childTypeGoName,
      );

      entries.push(
        `${toGoFieldName(field.name)}: func() *${valueType} { value := ${renderedValue}; return &value }()`,
      );
      continue;
    }

    entries.push(`${toGoFieldName(field.name)}: Ptr(${renderedValue})`);
  }

  return `${typeExpression}{${entries.join(", ")}}`;
}

/**
 * Renders a composite literal (array, map, or object) in a pretty-printed format.
 *
 * @param options - The rendering options.
 * @returns A formatted Go composite literal string.
 */
function renderCompositeLiteralPretty(options: {
  typeRef: TypeRef;
  literal: LiteralValue;
  context: GeneratorContext;
  position?: Position;
  namedTypeGoName?: string;
  typeExpression?: string;
}): string {
  const typeExpression =
    options.typeExpression ??
    renderAnonymousGoTypeExpressionPretty(
      options.typeRef,
      options.context,
      options.position,
      options.namedTypeGoName,
    );

  switch (options.typeRef.kind) {
    case "array":
      return renderArrayLiteralPretty({
        typeExpression,
        typeRef: options.typeRef,
        literal: options.literal,
        context: options.context,
        position: options.position,
        namedTypeGoName: options.namedTypeGoName,
      });
    case "map":
      return renderMapLiteralPretty({
        typeExpression,
        typeRef: options.typeRef,
        literal: options.literal,
        context: options.context,
        position: options.position,
        namedTypeGoName: options.namedTypeGoName,
      });
    case "object":
      return renderObjectLiteralPretty({
        typeExpression,
        typeRef: options.typeRef,
        literal: options.literal,
        context: options.context,
        position: options.position,
        namedTypeGoName: options.namedTypeGoName,
      });
    default:
      fail(
        "Expected a composite VDL type while rendering a composite Go literal.",
        options.position,
      );
  }
}

/**
 * Renders an array literal in a pretty-printed format.
 *
 * @param options - The rendering options.
 * @returns A formatted Go array literal string.
 */
function renderArrayLiteralPretty(options: {
  typeExpression: string;
  typeRef: TypeRef;
  literal: LiteralValue;
  context: GeneratorContext;
  position?: Position;
  namedTypeGoName?: string;
}): string {
  if (options.literal.kind !== "array") {
    fail("Expected an array literal for a VDL array type.", options.position);
  }

  const elementType: TypeRef =
    (options.typeRef.arrayDims ?? 1) === 1
      ? expectValue(
          options.typeRef.arrayType,
          "Encountered an invalid array type while rendering a literal.",
          options.position,
        )
      : {
          kind: "array",
          arrayType: expectValue(
            options.typeRef.arrayType,
            "Encountered an invalid array type while rendering a literal.",
            options.position,
          ),
          arrayDims: (options.typeRef.arrayDims ?? 1) - 1,
        };

  const items = (options.literal.arrayItems ?? []).map((item) =>
    renderTypedValueExpressionPretty(
      elementType,
      item,
      options.context,
      item.position,
      options.namedTypeGoName,
    ),
  );

  return renderBlockLiteral(options.typeExpression, items);
}

/**
 * Renders a map literal in a pretty-printed format.
 *
 * @param options - The rendering options.
 * @returns A formatted Go map literal string.
 */
function renderMapLiteralPretty(options: {
  typeExpression: string;
  typeRef: TypeRef;
  literal: LiteralValue;
  context: GeneratorContext;
  position?: Position;
  namedTypeGoName?: string;
}): string {
  if (options.literal.kind !== "object") {
    fail("Expected an object literal for a VDL map type.", options.position);
  }

  const valueType = expectValue(
    options.typeRef.mapType,
    "Encountered an invalid map type while rendering a literal.",
    options.position,
  );

  const entries = (options.literal.objectEntries ?? []).map(
    (entry) =>
      `${JSON.stringify(entry.key)}: ${renderTypedValueExpressionPretty(valueType, entry.value, options.context, entry.position, options.namedTypeGoName)}`,
  );

  return renderBlockLiteral(options.typeExpression, entries);
}

/**
 * Renders an object literal in a pretty-printed format.
 *
 * @param options - The rendering options.
 * @returns A formatted Go struct literal string.
 */
function renderObjectLiteralPretty(options: {
  typeExpression: string;
  typeRef: TypeRef;
  literal: LiteralValue;
  context: GeneratorContext;
  position?: Position;
  namedTypeGoName?: string;
}): string {
  if (options.literal.kind !== "object") {
    fail("Expected an object literal for a VDL object type.", options.position);
  }

  const fields = options.typeRef.objectFields ?? [];
  const entryByName = new Map(
    (options.literal.objectEntries ?? []).map((entry) => [entry.key, entry]),
  );
  const entries: string[] = [];

  for (const field of fields) {
    const entry = entryByName.get(field.name);

    if (!entry) {
      continue;
    }

    const childTypeGoName = options.namedTypeGoName
      ? toInlineTypeName(options.namedTypeGoName, field.name)
      : undefined;
    const renderedValue = renderTypedValueExpressionPretty(
      field.typeRef,
      entry.value,
      options.context,
      entry.position,
      childTypeGoName,
    );

    if (!field.optional) {
      entries.push(`${toGoFieldName(field.name)}: ${renderedValue}`);
      continue;
    }

    if (options.context.options.genPointerUtils === false) {
      const valueType = renderAnonymousGoTypeExpression(
        field.typeRef,
        options.context,
        entry.position,
        childTypeGoName,
      );

      entries.push(
        `${toGoFieldName(field.name)}: func() *${valueType} { value := ${renderedValue}; return &value }()`,
      );
      continue;
    }

    entries.push(`${toGoFieldName(field.name)}: Ptr(${renderedValue})`);
  }

  return renderBlockLiteral(options.typeExpression, entries);
}

/**
 * Renders a block literal (multiline composite literal) with the provided entries.
 *
 * @param typeExpression - The Go type expression.
 * @param entries - The rendered literal entries (fields, items, or keys:values).
 * @returns A formatted, multiline Go composite literal string.
 */
function renderBlockLiteral(typeExpression: string, entries: string[]): string {
  if (entries.length === 0) {
    return `${typeExpression}{}`;
  }

  const body = entries.map((entry) => indentBlock(entry)).join(",\n");
  return `${typeExpression}{\n${body},\n}`;
}

/**
 * Indents each line of a string block with a single tab.
 *
 * @param value - The string to indent.
 * @returns The indented string.
 */
function indentBlock(value: string): string {
  return value
    .split("\n")
    .map((line) => `\t${line}`)
    .join("\n");
}
