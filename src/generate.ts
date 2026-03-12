import type { PluginInput, PluginOutput } from "@varavel/vdl-plugin-sdk";
import { createGeneratorContext } from "./context";
import { toPluginOutputError } from "./errors";
import { generateConstantsFile } from "./generators/constants";
import { generateMetadataFile } from "./generators/metadata";
import { generatePointersFile } from "./generators/pointers";
import { generateTypesFile } from "./generators/types";
import { resolveGeneratorOptions } from "./options";

/**
 * Generates Go source files from the VDL plugin input.
 */
export function generatePluginOutput(input: PluginInput): PluginOutput {
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

    const files = [
      generateTypesFile(contextResult.context),
      generateConstantsFile(contextResult.context),
      generateMetadataFile(contextResult.context),
      generatePointersFile(contextResult.context),
    ].filter((file): file is NonNullable<typeof file> => file !== undefined);

    return {
      files,
    };
  } catch (error) {
    return {
      errors: [toPluginOutputError(error)],
    };
  }
}
