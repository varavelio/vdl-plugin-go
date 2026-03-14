import type { IrSchema, PluginOutputError } from "@varavel/vdl-plugin-sdk";
import { populateConstantDescriptors } from "./constants";
import { populateEnumDescriptors } from "./enums";
import { buildDefinitionIndexes } from "./indexes";
import { populateNamedTypes } from "./named-types";
import { PackageScopeSymbolTable } from "./symbols";
import type { GeneratorContext, GeneratorOptions } from "./types";

export function createGeneratorContext(options: {
  schema: IrSchema;
  generatorOptions: GeneratorOptions;
}): { context?: GeneratorContext; errors: PluginOutputError[] } {
  const indexes = buildDefinitionIndexes(options.schema);
  const packageScopeSymbols = new PackageScopeSymbolTable();
  const context: GeneratorContext = {
    schema: options.schema,
    options: options.generatorOptions,
    typeDefsByVdlName: indexes.typeDefsByVdlName,
    typeGoNamesByVdlName: indexes.typeGoNamesByVdlName,
    enumGoNamesByVdlName: indexes.enumGoNamesByVdlName,
    namedTypes: [],
    enumDescriptors: [],
    enumDescriptorsByVdlName: new Map(),
    constantDescriptors: [],
  };

  const errors = [
    ...populateNamedTypes(context, packageScopeSymbols),
    ...populateEnumDescriptors(context, packageScopeSymbols),
    ...populateConstantDescriptors(context, packageScopeSymbols),
  ];

  if (errors.length > 0) {
    return { errors };
  }

  return {
    context,
    errors: [],
  };
}
