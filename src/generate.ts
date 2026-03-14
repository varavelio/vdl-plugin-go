import type { PluginInput, PluginOutput } from "@varavel/vdl-plugin-sdk";
import { toPluginOutputError } from "./shared/errors";
import { generateFiles } from "./stages/emit/generate-files";
import { createGeneratorContext } from "./stages/model/build-context";
import { resolveGeneratorOptions } from "./stages/options/resolve";

export function generate(input: PluginInput): PluginOutput {
  const optionsResult = resolveGeneratorOptions(input);

  if (optionsResult.errors.length > 0 || !optionsResult.options) {
    return {
      errors: optionsResult.errors,
    };
  }

  try {
    const contextResult = createGeneratorContext({
      schema: input.ir,
      generatorOptions: optionsResult.options,
    });

    if (contextResult.errors.length > 0 || !contextResult.context) {
      return {
        errors: contextResult.errors,
      };
    }

    return {
      files: generateFiles(contextResult.context),
    };
  } catch (error) {
    return {
      errors: [toPluginOutputError(error)],
    };
  }
}
