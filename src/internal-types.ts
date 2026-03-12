import type {
  Annotation,
  ConstantDef,
  EnumDef,
  EnumMember,
  Field,
  IrSchema,
  PluginOutputFile,
  Position,
  TypeDef,
  TypeKind,
  TypeRef,
} from "@varavel/vdl-plugin-sdk";

/**
 * Normalized plugin options used by the generator.
 */
export interface GeneratorOptions {
  packageName: string;
  genConsts: boolean;
}

/**
 * Internal representation of a generated file.
 */
export type GeneratedFile = PluginOutputFile;

/**
 * Precomputed information for a generated struct field.
 */
export interface FieldDescriptor {
  field: Field;
  goName: string;
  jsonName: string;
  goType: string;
  inlineTypeName: string;
}

/**
 * Precomputed information for any generated named type.
 */
export interface NamedTypeDescriptor {
  name: string;
  vdlName: string;
  path: string;
  inline: boolean;
  parentName?: string;
  doc?: string;
  annotations: Annotation[];
  position: Position;
  kind: TypeKind;
  typeRef: TypeRef;
  fields: FieldDescriptor[];
}

/**
 * Precomputed information for an enum member.
 */
export interface EnumMemberDescriptor {
  member: EnumMember;
  goName: string;
  constName: string;
  valueKey: string;
}

/**
 * Precomputed information for a generated enum.
 */
export interface EnumDescriptor {
  def: EnumDef;
  goName: string;
  listName: string;
  members: EnumMemberDescriptor[];
  memberByValue: Map<string, EnumMemberDescriptor>;
}

/**
 * Precomputed information for a generated constant.
 */
export interface ConstantDescriptor {
  def: ConstantDef;
  goName: string;
}

/**
 * Shared generation context passed to file generators.
 */
export interface GeneratorContext {
  schema: IrSchema;
  options: GeneratorOptions;
  typeDefsByVdlName: Map<string, TypeDef>;
  enumDefsByVdlName: Map<string, EnumDef>;
  typeGoNamesByVdlName: Map<string, string>;
  enumGoNamesByVdlName: Map<string, string>;
  namedTypes: NamedTypeDescriptor[];
  namedTypesByGoName: Map<string, NamedTypeDescriptor>;
  enumDescriptors: EnumDescriptor[];
  enumDescriptorsByVdlName: Map<string, EnumDescriptor>;
  constantDescriptors: ConstantDescriptor[];
}
