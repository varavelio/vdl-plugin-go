import type {
  Annotation,
  ConstantDef,
  EnumDef,
  EnumMember,
  Field,
  IrSchema,
  LiteralValue,
  PluginInput,
  Position,
  PrimitiveType,
  TypeDef,
  TypeRef,
} from "@varavel/vdl-plugin-sdk";

/**
 * Test builder — creates a `Position` with sensible defaults.
 *
 * Pass `overrides` to customize specific fields.
 */
export function position(overrides: Partial<Position> = {}): Position {
  return {
    file: "schema.vdl",
    line: 1,
    column: 1,
    ...overrides,
  };
}

/**
 * Test builder — creates an `Annotation` with the given name
 * and an optional literal argument.
 */
export function annotation(name: string, argument?: LiteralValue): Annotation {
  return {
    position: position(),
    name,
    argument,
  };
}

/**
 * Test builder — creates a string `LiteralValue`.
 */
export function stringLiteral(value: string): LiteralValue {
  return {
    position: position(),
    kind: "string",
    stringValue: value,
  };
}

/**
 * Test builder — creates an integer `LiteralValue`.
 */
export function intLiteral(value: number): LiteralValue {
  return {
    position: position(),
    kind: "int",
    intValue: value,
  };
}

/**
 * Test builder — creates a float `LiteralValue`.
 */
export function floatLiteral(value: number): LiteralValue {
  return {
    position: position(),
    kind: "float",
    floatValue: value,
  };
}

/**
 * Test builder — creates a boolean `LiteralValue`.
 */
export function boolLiteral(value: boolean): LiteralValue {
  return {
    position: position(),
    kind: "bool",
    boolValue: value,
  };
}

/**
 * Test builder — creates an array `LiteralValue`
 * from a list of literal items.
 */
export function arrayLiteral(items: LiteralValue[]): LiteralValue {
  return {
    position: position(),
    kind: "array",
    arrayItems: items,
  };
}

/**
 * Test builder — creates an object `LiteralValue`
 * from a plain key/value record.
 */
export function objectLiteral(
  entries: Record<string, LiteralValue>,
): LiteralValue {
  return {
    position: position(),
    kind: "object",
    objectEntries: Object.entries(entries).map(([key, value]) => ({
      position: position(),
      key,
      value,
    })),
  };
}

/**
 * Test builder — creates a primitive `TypeRef`
 * (e.g. `string`, `int`, `bool`).
 */
export function primitiveType(name: PrimitiveType): TypeRef {
  return {
    kind: "primitive",
    primitiveName: name,
  };
}

/**
 * Test builder — creates a `TypeRef` that references
 * a named user-defined type.
 */
export function namedType(name: string): TypeRef {
  return {
    kind: "type",
    typeName: name,
  };
}

/**
 * Test builder — creates a `TypeRef` that references a named enum type.
 */
export function enumType(name: string, enumType: EnumDef["enumType"]): TypeRef {
  return {
    kind: "enum",
    enumName: name,
    enumType,
  };
}

/**
 * Test builder — creates an array `TypeRef` wrapping the given element type.
 *
 * @param dims - Number of array dimensions (defaults to 1).
 */
export function arrayType(type: TypeRef, dims = 1): TypeRef {
  return {
    kind: "array",
    arrayType: type,
    arrayDims: dims,
  };
}

/**
 * Test builder — creates a map `TypeRef` whose value type is `type`.
 */
export function mapType(type: TypeRef): TypeRef {
  return {
    kind: "map",
    mapType: type,
  };
}

/**
 * Test builder — creates an inline object `TypeRef` with the given fields.
 */
export function objectType(fields: Field[]): TypeRef {
  return {
    kind: "object",
    objectFields: fields,
  };
}

/**
 * Test builder — creates a `Field` with the given name and type.
 *
 * Pass `overrides` to set `optional`, `annotations`, or `doc`.
 */
export function field(
  name: string,
  typeRef: TypeRef,
  overrides: Partial<
    Omit<Field, "position" | "name" | "typeRef" | "optional" | "annotations">
  > & {
    optional?: boolean;
    annotations?: Annotation[];
  } = {},
): Field {
  return {
    position: position(),
    name,
    doc: overrides.doc,
    optional: overrides.optional ?? false,
    annotations: overrides.annotations ?? [],
    typeRef,
  };
}

/**
 * Test builder — creates a `TypeDef` with the given name and underlying type.
 *
 * Pass `overrides` to set `annotations` or `doc`.
 */
export function typeDef(
  name: string,
  typeRef: TypeRef,
  overrides: Partial<
    Omit<TypeDef, "position" | "name" | "typeRef" | "annotations">
  > & {
    annotations?: Annotation[];
  } = {},
): TypeDef {
  return {
    position: position(),
    name,
    doc: overrides.doc,
    annotations: overrides.annotations ?? [],
    typeRef,
  };
}

/**
 * Test builder — creates an `EnumMember` with the given name and literal value.
 *
 * Pass `overrides` to set `annotations` or `doc`.
 */
export function enumMember(
  name: string,
  value: LiteralValue,
  overrides: Partial<
    Omit<EnumMember, "position" | "name" | "value" | "annotations">
  > & {
    annotations?: Annotation[];
  } = {},
): EnumMember {
  return {
    position: position(),
    name,
    value,
    doc: overrides.doc,
    annotations: overrides.annotations ?? [],
  };
}

/**
 * Test builder — creates an `EnumDef` with the given name,
 * value type, and members.
 *
 * Pass `overrides` to set `annotations` or `doc`.
 */
export function enumDef(
  name: string,
  enumValueType: EnumDef["enumType"],
  members: EnumMember[],
  overrides: Partial<
    Omit<EnumDef, "position" | "name" | "enumType" | "members" | "annotations">
  > & {
    annotations?: Annotation[];
  } = {},
): EnumDef {
  return {
    position: position(),
    name,
    doc: overrides.doc,
    annotations: overrides.annotations ?? [],
    enumType: enumValueType,
    members,
  };
}

/**
 * Test builder — creates a `ConstantDef` with the given name,
 * type, and literal value.
 *
 * Pass `overrides` to set `annotations` or `doc`.
 */
export function constantDef(
  name: string,
  typeRef: TypeRef,
  value: LiteralValue,
  overrides: Partial<
    Omit<ConstantDef, "position" | "name" | "typeRef" | "value" | "annotations">
  > & {
    annotations?: Annotation[];
  } = {},
): ConstantDef {
  return {
    position: position(),
    name,
    doc: overrides.doc,
    annotations: overrides.annotations ?? [],
    typeRef,
    value,
  };
}

/**
 * Test builder — creates an `IrSchema` with empty collections.
 *
 * Pass `overrides` to populate `constants`, `enums`, `types`, or `docs`.
 */
export function schema(overrides: Partial<IrSchema> = {}): IrSchema {
  return {
    entryPoint: "/schema.vdl",
    constants: [],
    enums: [],
    types: [],
    docs: [],
    ...overrides,
  };
}

/**
 * Test builder — creates a `PluginInput` with a default version,
 * empty options, and an empty schema.
 *
 * Pass `overrides` to customize any field.
 */
export function pluginInput(overrides: Partial<PluginInput> = {}): PluginInput {
  return {
    version: "0.5.0-alpha.3",
    options: {},
    ir: schema(),
    ...overrides,
  };
}
