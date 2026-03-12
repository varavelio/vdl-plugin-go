import type {
  EnumDef,
  Field,
  IrSchema,
  PluginOutputError,
  Position,
  TypeDef,
  TypeRef,
} from "@varavel/vdl-plugin-sdk";
import { toPluginOutputError } from "./errors";
import type {
  ConstantDescriptor,
  EnumDescriptor,
  EnumMemberDescriptor,
  FieldDescriptor,
  GeneratorContext,
  GeneratorOptions,
  NamedTypeDescriptor,
} from "./internal-types";
import { getLiteralValueKey } from "./literal-helpers";
import {
  toGoConstName,
  toGoEnumMemberName,
  toGoFieldName,
  toGoJsonName,
  toGoTypeName,
  toInlineTypeName,
} from "./naming";
import { renderGoType } from "./type-ref";

const RESERVED_PACKAGE_SCOPE_SYMBOLS = [
  "Ptr",
  "Val",
  "Or",
  "Annotation",
  "AnnotationSet",
  "FieldMetadata",
  "TypeMetadata",
  "EnumMemberMetadata",
  "EnumMetadata",
  "ConstantMetadata",
  "SchemaMetadata",
  "VDLMetadata",
];

interface PackageScopeSymbol {
  origin: string;
  position?: Position;
}

/**
 * Builds the shared generation context and validates symbol collisions.
 */
export function createGeneratorContext(options: {
  schema: IrSchema;
  generatorOptions: GeneratorOptions;
}): { context?: GeneratorContext; errors: PluginOutputError[] } {
  const context: GeneratorContext = {
    schema: options.schema,
    options: options.generatorOptions,
    typeDefsByVdlName: new Map(),
    enumDefsByVdlName: new Map(),
    typeGoNamesByVdlName: new Map(),
    enumGoNamesByVdlName: new Map(),
    namedTypes: [],
    namedTypesByGoName: new Map(),
    enumDescriptors: [],
    enumDescriptorsByVdlName: new Map(),
    constantDescriptors: [],
  };
  const errors: PluginOutputError[] = [];
  const packageScopeSymbols = new Map<string, PackageScopeSymbol>();

  for (const symbol of RESERVED_PACKAGE_SCOPE_SYMBOLS) {
    packageScopeSymbols.set(symbol, {
      origin: "generated runtime support symbol",
    });
  }

  for (const typeDef of options.schema.types) {
    context.typeDefsByVdlName.set(typeDef.name, typeDef);
    context.typeGoNamesByVdlName.set(typeDef.name, toGoTypeName(typeDef.name));
  }

  for (const enumDef of options.schema.enums) {
    context.enumDefsByVdlName.set(enumDef.name, enumDef);
    context.enumGoNamesByVdlName.set(enumDef.name, toGoTypeName(enumDef.name));
  }

  for (const typeDef of options.schema.types) {
    appendNamedTypeDescriptor(
      context,
      buildTopLevelTypeDescriptor(typeDef, context),
      packageScopeSymbols,
      errors,
    );
  }

  for (const enumDef of options.schema.enums) {
    const descriptor = buildEnumDescriptor(enumDef, context, errors);
    context.enumDescriptors.push(descriptor);
    context.enumDescriptorsByVdlName.set(enumDef.name, descriptor);

    reservePackageScopeSymbol(
      packageScopeSymbols,
      descriptor.goName,
      `enum ${enumDef.name}`,
      enumDef.position,
      errors,
    );
    reservePackageScopeSymbol(
      packageScopeSymbols,
      descriptor.listName,
      `enum list ${enumDef.name}`,
      enumDef.position,
      errors,
    );

    for (const member of descriptor.members) {
      reservePackageScopeSymbol(
        packageScopeSymbols,
        member.constName,
        `enum member ${enumDef.name}.${member.member.name}`,
        member.member.position,
        errors,
      );
    }
  }

  for (const constantDef of options.schema.constants) {
    const descriptor: ConstantDescriptor = {
      def: constantDef,
      goName: toGoConstName(constantDef.name),
    };

    context.constantDescriptors.push(descriptor);
    reservePackageScopeSymbol(
      packageScopeSymbols,
      descriptor.goName,
      `constant ${constantDef.name}`,
      constantDef.position,
      errors,
    );
  }

  if (errors.length > 0) {
    return { errors };
  }

  return {
    context,
    errors,
  };
}

function buildTopLevelTypeDescriptor(
  typeDef: TypeDef,
  context: GeneratorContext,
): NamedTypeDescriptor {
  const name =
    context.typeGoNamesByVdlName.get(typeDef.name) ??
    toGoTypeName(typeDef.name);
  const fields =
    typeDef.typeRef.kind === "object"
      ? buildFieldDescriptors(name, typeDef.typeRef.objectFields ?? [], context)
      : [];

  return {
    name,
    vdlName: typeDef.name,
    path: typeDef.name,
    inline: false,
    doc: typeDef.doc,
    annotations: typeDef.annotations,
    position: typeDef.position,
    kind: typeDef.typeRef.kind,
    typeRef: typeDef.typeRef,
    fields,
  };
}

function buildInlineTypeDescriptor(options: {
  parentName: string;
  path: string;
  fieldName: string;
  fieldPosition: Position;
  typeRef: TypeRef;
  context: GeneratorContext;
}): NamedTypeDescriptor {
  const name = toInlineTypeName(options.parentName, options.fieldName);
  const fields = buildFieldDescriptors(
    name,
    options.typeRef.objectFields ?? [],
    options.context,
  );

  return {
    name,
    vdlName: options.fieldName,
    path: options.path,
    inline: true,
    parentName: options.parentName,
    annotations: [],
    position: options.fieldPosition,
    kind: "object",
    typeRef: options.typeRef,
    fields,
  };
}

function buildFieldDescriptors(
  parentTypeName: string,
  fields: Field[],
  context: GeneratorContext,
): FieldDescriptor[] {
  const seen = new Map<string, Position>();

  return fields.map((field) => {
    const goName = toGoFieldName(field.name);
    const inlineTypeName = toInlineTypeName(parentTypeName, field.name);

    if (seen.has(goName)) {
      throw new Error(
        `Generated Go field ${JSON.stringify(goName)} collides within ${parentTypeName}.`,
      );
    }

    seen.set(goName, field.position);

    const fieldGoType = renderGoType(
      field.typeRef,
      context,
      inlineTypeName,
      field.position,
    );

    return {
      field,
      goName,
      jsonName: toGoJsonName(field.name),
      goType: field.optional ? `*${fieldGoType}` : fieldGoType,
      inlineTypeName,
    };
  });
}

function buildEnumDescriptor(
  enumDef: EnumDef,
  context: GeneratorContext,
  errors: PluginOutputError[],
): EnumDescriptor {
  const goName =
    context.enumGoNamesByVdlName.get(enumDef.name) ??
    toGoTypeName(enumDef.name);
  const members: EnumMemberDescriptor[] = [];
  const memberByValue = new Map<string, EnumMemberDescriptor>();
  const seenMembers = new Set<string>();

  for (const member of enumDef.members) {
    const memberGoName = toGoEnumMemberName(member.name);

    if (seenMembers.has(memberGoName)) {
      errors.push({
        message: `Generated enum member name ${JSON.stringify(memberGoName)} collides within enum ${JSON.stringify(enumDef.name)}.`,
        position: member.position,
      });
      continue;
    }

    seenMembers.add(memberGoName);

    const descriptor: EnumMemberDescriptor = {
      member,
      goName: memberGoName,
      constName: `${goName}${memberGoName}`,
      valueKey: getLiteralValueKey(member.value),
    };

    members.push(descriptor);

    if (!memberByValue.has(descriptor.valueKey)) {
      memberByValue.set(descriptor.valueKey, descriptor);
    }
  }

  return {
    def: enumDef,
    goName,
    listName: `${goName}List`,
    members,
    memberByValue,
  };
}

function appendNamedTypeDescriptor(
  context: GeneratorContext,
  descriptor: NamedTypeDescriptor,
  packageScopeSymbols: Map<string, PackageScopeSymbol>,
  errors: PluginOutputError[],
): void {
  if (context.namedTypesByGoName.has(descriptor.name)) {
    errors.push({
      message: `Generated Go type name ${JSON.stringify(descriptor.name)} collides with another generated type.`,
      position: descriptor.position,
    });
    return;
  }

  context.namedTypes.push(descriptor);
  context.namedTypesByGoName.set(descriptor.name, descriptor);
  reservePackageScopeSymbol(
    packageScopeSymbols,
    descriptor.name,
    descriptor.inline
      ? `inline type ${descriptor.path}`
      : `type ${descriptor.vdlName}`,
    descriptor.position,
    errors,
  );

  for (const fieldDescriptor of descriptor.fields) {
    appendInlineTypesFromTypeRef({
      context,
      parentTypeName: descriptor.name,
      parentPath: descriptor.path,
      field: fieldDescriptor.field,
      typeRef: fieldDescriptor.field.typeRef,
      packageScopeSymbols,
      errors,
    });
  }
}

function appendInlineTypesFromTypeRef(options: {
  context: GeneratorContext;
  parentTypeName: string;
  parentPath: string;
  field: Field;
  typeRef: TypeRef;
  packageScopeSymbols: Map<string, PackageScopeSymbol>;
  errors: PluginOutputError[];
}): void {
  switch (options.typeRef.kind) {
    case "array":
      if (options.typeRef.arrayType) {
        appendInlineTypesFromTypeRef({
          ...options,
          typeRef: options.typeRef.arrayType,
        });
      }
      break;
    case "map":
      if (options.typeRef.mapType) {
        appendInlineTypesFromTypeRef({
          ...options,
          typeRef: options.typeRef.mapType,
        });
      }
      break;
    case "object": {
      const descriptor = buildInlineTypeDescriptor({
        parentName: options.parentTypeName,
        path: `${options.parentPath}.${options.field.name}`,
        fieldName: options.field.name,
        fieldPosition: options.field.position,
        typeRef: options.typeRef,
        context: options.context,
      });

      appendNamedTypeDescriptor(
        options.context,
        descriptor,
        options.packageScopeSymbols,
        options.errors,
      );
      break;
    }
    case "primitive":
    case "type":
    case "enum":
      break;
    default:
      break;
  }
}

function reservePackageScopeSymbol(
  symbols: Map<string, PackageScopeSymbol>,
  name: string,
  origin: string,
  position: Position | undefined,
  errors: PluginOutputError[],
): void {
  const existing = symbols.get(name);

  if (existing) {
    errors.push({
      message: `Generated Go symbol ${JSON.stringify(name)} for ${origin} collides with ${existing.origin}.`,
      position,
    });
    return;
  }

  symbols.set(name, {
    origin,
    position,
  });
}

/**
 * Wraps context-building failures as plugin errors.
 */
export function toContextBuildError(error: unknown): PluginOutputError {
  return toPluginOutputError(error);
}
