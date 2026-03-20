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

export interface GeneratorOptions {
  packageName: string;
  genConsts: boolean;
  genMeta: boolean;
  genPointerUtils: boolean;
  strict: boolean;
}

export type GeneratedFile = PluginOutputFile;

export interface FieldDescriptor {
  def: Field;
  goName: string;
  jsonName: string;
  goType: string;
  inlineTypeGoName: string;
}

export interface NamedTypeDescriptor {
  goName: string;
  vdlName: string;
  path: string;
  inline: boolean;
  parentGoName?: string;
  doc?: string;
  annotations: Annotation[];
  position: Position;
  kind: TypeKind;
  typeRef: TypeRef;
  fields: FieldDescriptor[];
}

export interface EnumMemberDescriptor {
  def: EnumMember;
  goName: string;
  constName: string;
  valueKey: string;
}

export interface EnumDescriptor {
  def: EnumDef;
  goName: string;
  listGoName: string;
  members: EnumMemberDescriptor[];
  memberByValue: Map<string, EnumMemberDescriptor>;
}

export interface ConstantDescriptor {
  def: ConstantDef;
  goName: string;
  typeRef: TypeRef;
}

export interface GeneratorContext {
  schema: IrSchema;
  options: GeneratorOptions;
  typeDefsByVdlName: Map<string, TypeDef>;
  typeGoNamesByVdlName: Map<string, string>;
  enumGoNamesByVdlName: Map<string, string>;
  namedTypes: NamedTypeDescriptor[];
  namedTypesByGoName: Map<string, NamedTypeDescriptor>;
  enumDescriptors: EnumDescriptor[];
  enumDescriptorsByVdlName: Map<string, EnumDescriptor>;
  constantDescriptors: ConstantDescriptor[];
}
