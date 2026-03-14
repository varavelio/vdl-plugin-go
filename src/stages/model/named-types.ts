import type {
  Field,
  PluginOutputError,
  Position,
  TypeDef,
  TypeRef,
} from "@varavel/vdl-plugin-sdk";
import { toInlineTypeName } from "../../shared/naming";
import { buildFieldDescriptors } from "./fields";
import type { PackageScopeSymbolTable } from "./symbols";
import type { GeneratorContext, NamedTypeDescriptor } from "./types";

export function populateNamedTypes(
  context: GeneratorContext,
  packageScopeSymbols: PackageScopeSymbolTable,
): PluginOutputError[] {
  const errors: PluginOutputError[] = [];
  const namedTypesByGoName = new Map<string, NamedTypeDescriptor>();

  for (const typeDef of context.schema.types) {
    appendNamedTypeDescriptor(
      context,
      buildTopLevelTypeDescriptor(typeDef, context, errors),
      namedTypesByGoName,
      packageScopeSymbols,
      errors,
    );
  }

  return errors;
}

function buildTopLevelTypeDescriptor(
  typeDef: TypeDef,
  context: GeneratorContext,
  errors: PluginOutputError[],
): NamedTypeDescriptor {
  const goName = context.typeGoNamesByVdlName.get(typeDef.name) ?? typeDef.name;
  const fieldResult = buildFieldDescriptors({
    parentGoName: goName,
    fields: typeDef.typeRef.objectFields ?? [],
    context,
  });

  errors.push(...fieldResult.errors);

  return {
    goName,
    vdlName: typeDef.name,
    path: typeDef.name,
    inline: false,
    doc: typeDef.doc,
    annotations: typeDef.annotations,
    position: typeDef.position,
    kind: typeDef.typeRef.kind,
    typeRef: typeDef.typeRef,
    fields: fieldResult.fields,
  };
}

function buildInlineTypeDescriptor(options: {
  parentGoName: string;
  path: string;
  fieldName: string;
  fieldPosition: Position;
  typeRef: TypeRef;
  context: GeneratorContext;
  errors: PluginOutputError[];
}): NamedTypeDescriptor {
  const goName = toInlineTypeName(options.parentGoName, options.fieldName);
  const fieldResult = buildFieldDescriptors({
    parentGoName: goName,
    fields: options.typeRef.objectFields ?? [],
    context: options.context,
  });

  options.errors.push(...fieldResult.errors);

  return {
    goName,
    vdlName: options.fieldName,
    path: options.path,
    inline: true,
    parentGoName: options.parentGoName,
    annotations: [],
    position: options.fieldPosition,
    kind: "object",
    typeRef: options.typeRef,
    fields: fieldResult.fields,
  };
}

function appendNamedTypeDescriptor(
  context: GeneratorContext,
  descriptor: NamedTypeDescriptor,
  namedTypesByGoName: Map<string, NamedTypeDescriptor>,
  packageScopeSymbols: PackageScopeSymbolTable,
  errors: PluginOutputError[],
): void {
  if (namedTypesByGoName.has(descriptor.goName)) {
    errors.push({
      message: `Generated Go type name ${JSON.stringify(descriptor.goName)} collides with another generated type.`,
      position: descriptor.position,
    });
    return;
  }

  namedTypesByGoName.set(descriptor.goName, descriptor);
  context.namedTypes.push(descriptor);

  const symbolError = packageScopeSymbols.reserve(
    descriptor.goName,
    descriptor.inline
      ? `inline type ${descriptor.path}`
      : `type ${descriptor.vdlName}`,
    descriptor.position,
  );

  if (symbolError) {
    errors.push(symbolError);
  }

  for (const fieldDescriptor of descriptor.fields) {
    appendInlineTypesFromTypeRef({
      context,
      parentGoName: descriptor.goName,
      parentPath: descriptor.path,
      field: fieldDescriptor.def,
      typeRef: fieldDescriptor.def.typeRef,
      namedTypesByGoName,
      packageScopeSymbols,
      errors,
    });
  }
}

function appendInlineTypesFromTypeRef(options: {
  context: GeneratorContext;
  parentGoName: string;
  parentPath: string;
  field: Field;
  typeRef: TypeRef;
  namedTypesByGoName: Map<string, NamedTypeDescriptor>;
  packageScopeSymbols: PackageScopeSymbolTable;
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
      return;
    case "map":
      if (options.typeRef.mapType) {
        appendInlineTypesFromTypeRef({
          ...options,
          typeRef: options.typeRef.mapType,
        });
      }
      return;
    case "object": {
      const descriptor = buildInlineTypeDescriptor({
        parentGoName: options.parentGoName,
        path: `${options.parentPath}.${options.field.name}`,
        fieldName: options.field.name,
        fieldPosition: options.field.position,
        typeRef: options.typeRef,
        context: options.context,
        errors: options.errors,
      });

      appendNamedTypeDescriptor(
        options.context,
        descriptor,
        options.namedTypesByGoName,
        options.packageScopeSymbols,
        options.errors,
      );
      return;
    }
    case "primitive":
    case "type":
    case "enum":
      return;
    default:
      return;
  }
}
