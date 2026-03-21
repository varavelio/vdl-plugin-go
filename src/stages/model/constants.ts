import type {
  Field,
  LiteralValue,
  PluginOutputError,
  Position,
  TypeRef,
} from "@varavel/vdl-plugin-sdk";
import { toGoConstName } from "../../shared/naming";
import type { PackageScopeSymbolTable } from "./symbols";
import type { ConstantDescriptor, GeneratorContext } from "./types";

/**
 * Populates the context with descriptors for all constant definitions in the schema.
 *
 * This function resolves the type of each constant, either by looking up
 * synthetic "inferred" type definitions from the VDL IR or by performing
 * manual type inference from the literal value itself. It also ensures that
 * generated constant names are unique and tracked in the symbol table.
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
  const inferredTypeDefs = context.schema.types.filter(
    (typeDef) => typeDef.name.startsWith("$Const") && typeDef.name.length > 6,
  );
  const inferredTypeByConstName = new Map(
    inferredTypeDefs.map((typeDef) => [typeDef.name.slice(6), typeDef.typeRef]),
  );

  for (const constantDef of context.schema.constants) {
    const inferredType = inferredTypeByConstName.get(constantDef.name);
    let typeRef = inferredType;
    let inferenceError: string | undefined;

    if (!typeRef) {
      const inference = inferTypeRefFromLiteral(
        constantDef.value,
        constantDef.position,
      );
      typeRef = inference.typeRef;
      inferenceError = inference.error;
    }

    if (inferenceError) {
      errors.push({
        message: `Could not infer type for constant ${JSON.stringify(constantDef.name)}: ${inferenceError}`,
        position: constantDef.position,
      });
      continue;
    }

    if (!typeRef) {
      errors.push({
        message: `Could not infer type for constant ${JSON.stringify(constantDef.name)}.`,
        position: constantDef.position,
      });
      continue;
    }

    const descriptor: ConstantDescriptor = {
      def: constantDef,
      goName: toGoConstName(constantDef.name),
      typeRef,
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
 * Infer the VDL TypeRef from a literal value.
 *
 * This is used for constants that don't have an explicit type declared in VDL.
 * It recursively determines the type for primitives, arrays, and objects.
 */
function inferTypeRefFromLiteral(
  literal: LiteralValue,
  _position: Position,
): { typeRef?: TypeRef; error?: string } {
  switch (literal.kind) {
    case "string":
      return { typeRef: { kind: "primitive", primitiveName: "string" } };
    case "int":
      return { typeRef: { kind: "primitive", primitiveName: "int" } };
    case "float":
      return { typeRef: { kind: "primitive", primitiveName: "float" } };
    case "bool":
      return { typeRef: { kind: "primitive", primitiveName: "bool" } };
    case "array": {
      const items = literal.arrayItems ?? [];

      if (items.length === 0) {
        return {
          error:
            "array literals cannot be empty when no declared constant type is available",
        };
      }

      const firstItem = items[0];

      if (!firstItem) {
        return { error: "encountered an undefined array item literal" };
      }

      const elementInference = inferTypeRefFromLiteral(
        firstItem,
        firstItem.position,
      );
      const elementType = elementInference.typeRef;
      const elementError = elementInference.error;

      if (elementError) {
        return { error: elementError };
      }

      if (!elementType) {
        return { error: "could not infer array element type" };
      }

      for (let index = 1; index < items.length; index += 1) {
        const item = items[index];

        if (!item) {
          return { error: "encountered an undefined array item literal" };
        }

        const candidateInference = inferTypeRefFromLiteral(item, item.position);
        const candidate = candidateInference.typeRef;
        const candidateError = candidateInference.error;

        if (candidateError) {
          return { error: candidateError };
        }

        if (!candidate) {
          return { error: "could not infer array item type" };
        }

        if (!areTypeRefsEquivalent(elementType, candidate)) {
          return {
            error: `array literal item at index ${String(index)} does not match inferred element type`,
          };
        }
      }

      return {
        typeRef: { kind: "array", arrayDims: 1, arrayType: elementType },
      };
    }
    case "object": {
      const entries = literal.objectEntries ?? [];
      const fields: Field[] = [];

      for (const entry of getEffectiveObjectEntries(entries)) {
        const fieldInference = inferTypeRefFromLiteral(
          entry.value,
          entry.position,
        );
        const fieldType = fieldInference.typeRef;
        const fieldError = fieldInference.error;

        if (fieldError) {
          return { error: fieldError };
        }

        if (!fieldType) {
          return {
            error: `could not infer object field type for ${JSON.stringify(entry.key)}`,
          };
        }

        fields.push({
          position: entry.position,
          name: entry.key,
          optional: false,
          annotations: [],
          typeRef: fieldType,
        });
      }

      return { typeRef: { kind: "object", objectFields: fields } };
    }
    default:
      return { error: "unsupported literal kind" };
  }
}

/**
 * Filters object literal entries to implement "last-key-wins" semantics.
 */
function getEffectiveObjectEntries(
  entries: NonNullable<LiteralValue["objectEntries"]>,
): NonNullable<LiteralValue["objectEntries"]> {
  const fields = entries.map((entry) => ({
    position: entry.position,
    name: entry.key,
    optional: false,
    annotations: [],
    typeRef: { kind: "primitive", primitiveName: "string" } as TypeRef,
  }));
  const effectiveFields = fields ?? [];
  const indexByName = new Map(
    entries.map((entry, index) => [entry.key, index]),
  );

  return effectiveFields.map(
    (field) =>
      entries[
        indexByName.get(field.name) as number
      ] as (typeof entries)[number],
  );
}

/**
 * Checks if two TypeRef structures are semantically equivalent.
 */
function areTypeRefsEquivalent(left: TypeRef, right: TypeRef): boolean {
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
      return (
        (left.arrayDims ?? 1) === (right.arrayDims ?? 1) &&
        areTypeRefsEquivalent(
          left.arrayType as TypeRef,
          right.arrayType as TypeRef,
        )
      );
    case "map":
      return areTypeRefsEquivalent(
        left.mapType as TypeRef,
        right.mapType as TypeRef,
      );
    case "object": {
      const leftFields = left.objectFields ?? [];
      const rightFields = right.objectFields ?? [];

      if (leftFields.length !== rightFields.length) {
        return false;
      }

      for (let index = 0; index < leftFields.length; index += 1) {
        const leftField = leftFields[index] as Field;
        const rightField = rightFields[index] as Field;

        if (
          leftField.name !== rightField.name ||
          leftField.optional !== rightField.optional ||
          !areTypeRefsEquivalent(leftField.typeRef, rightField.typeRef)
        ) {
          return false;
        }
      }

      return true;
    }
    default:
      return false;
  }
}
