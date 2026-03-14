import type { PluginOutputError } from "@varavel/vdl-plugin-sdk";
import { toGoConstName } from "../../shared/naming";
import type { PackageScopeSymbolTable } from "./symbols";
import type { ConstantDescriptor, GeneratorContext } from "./types";

export function populateConstantDescriptors(
  context: GeneratorContext,
  packageScopeSymbols: PackageScopeSymbolTable,
): PluginOutputError[] {
  const errors: PluginOutputError[] = [];

  for (const constantDef of context.schema.constants) {
    const descriptor: ConstantDescriptor = {
      def: constantDef,
      goName: toGoConstName(constantDef.name),
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
