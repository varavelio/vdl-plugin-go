import type {
  Field,
  LiteralValue,
  PluginOutputError,
  TypeRef,
} from "@varavel/vdl-plugin-sdk";
import { toGoConstName } from "../../shared/naming";
import type { PackageScopeSymbolTable } from "./symbols";
import type { ConstantDescriptor, GeneratorContext } from "./types";

/**
 * Populates the context with descriptors for all constant definitions in the schema.
 *
 * This function resolves each constant type from the best source available:
 * synthetic `$Const...` definitions when present, otherwise a lightweight type
 * inference pass over the already-valid literal shape in the VDL IR.
 *
 * @param context - The generator context to populate.
 * @param packageScopeSymbols - The symbol table for collision detection.
 * @returns A list of validation errors encountered during processing.
 */
export function populateConstantDescriptors(
  context: GeneratorContext,
  packageScopeSymbols: PackageScopeSymbolTable,
): PluginOutputError[] {
  const errors: PluginOutputError[] = [];
  const typeByConstantName = new Map<string, TypeRef>(
    context.schema.types
      .filter((typeDef) => typeDef.name.startsWith("$Const"))
      .map((typeDef) => [typeDef.name.slice("$Const".length), typeDef.typeRef]),
  );

  for (const constantDef of context.schema.constants) {
    const inferred =
      typeByConstantName.get(constantDef.name) ??
      inferTypeRefFromLiteral(constantDef.value);

    if (!inferred) {
      errors.push({
        message: `Could not infer a Go-compatible type for constant ${JSON.stringify(constantDef.name)}.`,
        position: constantDef.position,
      });
      continue;
    }

    const descriptor: ConstantDescriptor = {
      def: constantDef,
      goName: toGoConstName(constantDef.name),
      typeRef: inferred,
    };

    context.constantDescriptors.push(descriptor);

    const symbolError = packageScopeSymbols.reserve(
      descriptor.goName,
      `constant ${constantDef.name}`,
      constantDef.position,
    );

    if (symbolError) {
      errors.push(symbolError);
    }
  }

  return errors;
}

/**
 * Infers a TypeRef directly from a literal shape.
 *
 * The VDL CLI currently does not always materialize `$Const...` helper types, so
 * the generator falls back to the literal itself for constants. The IR is already
 * validated, which lets this stay small and focused on shape reconstruction.
 *
 * @param literal - The literal value attached to the constant.
 * @returns The inferred type, or `undefined` when the literal is too ambiguous.
 */
function inferTypeRefFromLiteral(literal: LiteralValue): TypeRef | undefined {
  switch (literal.kind) {
    case "string":
      return { kind: "primitive", primitiveName: "string" };
    case "int":
      return { kind: "primitive", primitiveName: "int" };
    case "float":
      return { kind: "primitive", primitiveName: "float" };
    case "bool":
      return { kind: "primitive", primitiveName: "bool" };
    case "array": {
      const items = literal.arrayItems ?? [];
      const firstItem = items[0];

      if (!firstItem) {
        return undefined;
      }

      const itemType = inferTypeRefFromLiteral(firstItem);

      if (!itemType) {
        return undefined;
      }

      for (const item of items.slice(1)) {
        const candidate = inferTypeRefFromLiteral(item);

        if (!candidate || !typeRefsMatch(itemType, candidate)) {
          return undefined;
        }
      }

      return { kind: "array", arrayDims: 1, arrayType: itemType };
    }
    case "object": {
      const objectFields: Field[] = [];

      for (const entry of getEffectiveObjectEntries(
        literal.objectEntries ?? [],
      )) {
        const fieldType = inferTypeRefFromLiteral(entry.value);

        if (!fieldType) {
          return undefined;
        }

        objectFields.push({
          annotations: [],
          name: entry.key,
          optional: false,
          position: entry.position,
          typeRef: fieldType,
        });
      }

      return { kind: "object", objectFields };
    }
    default:
      return undefined;
  }
}

/**
 * Applies the generator's last-entry-wins object semantics to literal entries.
 *
 * @param literal - The object literal to normalize.
 * @returns The effective entries after spread expansion and duplicate resolution.
 */
function getEffectiveObjectEntries(
  entries: NonNullable<LiteralValue["objectEntries"]>,
): NonNullable<LiteralValue["objectEntries"]> {
  const entryByKey = new Map<string, (typeof entries)[number]>();

  for (const entry of entries) {
    entryByKey.set(entry.key, entry);
  }

  return [...entryByKey.values()];
}

/**
 * Reports whether two inferred TypeRefs describe the same shape.
 *
 * @param left - The first inferred type.
 * @param right - The second inferred type.
 * @returns `true` when both types can share a single Go declaration.
 */
function typeRefsMatch(left: TypeRef, right: TypeRef): boolean {
  if (left.kind !== right.kind) {
    return false;
  }

  switch (left.kind) {
    case "primitive":
      return left.primitiveName === right.primitiveName;
    case "type":
      return left.typeName === right.typeName;
    case "enum":
      return (
        left.enumName === right.enumName && left.enumType === right.enumType
      );
    case "array":
      if (!left.arrayType || !right.arrayType) {
        return false;
      }

      return (
        (left.arrayDims ?? 1) === (right.arrayDims ?? 1) &&
        typeRefsMatch(left.arrayType, right.arrayType)
      );
    case "map":
      if (!left.mapType || !right.mapType) {
        return false;
      }

      return typeRefsMatch(left.mapType, right.mapType);
    case "object": {
      const leftFields = left.objectFields ?? [];
      const rightFields = right.objectFields ?? [];

      if (leftFields.length !== rightFields.length) {
        return false;
      }

      return leftFields.every((field, index) => {
        const otherField = rightFields[index];

        return (
          otherField !== undefined &&
          field.name === otherField.name &&
          field.optional === otherField.optional &&
          typeRefsMatch(field.typeRef, otherField.typeRef)
        );
      });
    }
    default:
      return false;
  }
}
