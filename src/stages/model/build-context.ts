import type { IrSchema, PluginOutputError } from "@varavel/vdl-plugin-sdk";
import { populateConstantDescriptors } from "./constants";
import { populateEnumDescriptors } from "./enums";
import { buildDefinitionIndexes } from "./indexes";
import { populateNamedTypes } from "./named-types";
import { PackageScopeSymbolTable } from "./symbols";
import type { GeneratorContext, GeneratorOptions } from "./types";

/**
 * Creates and populates the unified GeneratorContext from the VDL schema and options.
 *
 * This function orchestrates the indexing and processing of the IR into a structured
 * format suitable for Go code generation. It handles:
 *
 * 1. **Indexing**: Building maps of raw VDL definitions.
 * 2. **Type Analysis**: Discovering all named and inline types.
 * 3. **Enum Processing**: Building descriptors for enums and their members.
 * 4. **Constant Processing**: Building descriptors for Go constants.
 * 5. **Symbol Collision Checks**: Ensuring generated Go names don't clash with
 *    reserved Go keywords or within the same package.
 *
 * @param options - The VDL IR schema and generator options.
 * @returns A result containing the populated context or a list of validation errors.
 */
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
    namedTypesByGoName: new Map(),
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
