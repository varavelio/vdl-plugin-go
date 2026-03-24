import type { PluginInput, PluginOutput } from "@varavel/vdl-plugin-sdk";
import { toPluginOutputError } from "./shared/errors";
import { generateFiles } from "./stages/emit/generate-files";
import { createGeneratorContext } from "./stages/model/build-context";
import { resolveGeneratorOptions } from "./stages/options/resolve";

/**
 * The main orchestration entrypoint for the VDL-to-Go generation pipeline.
 *
 * This function implements a synchronous, deterministic transform from the VDL IR
 * to Go source files.
 *
 * It executes the generation in three distinct stages:
 *
 * 1. **Options Resolution**: Parses and validates plugin options (package name,
 *    generation flags, etc.) from the input.
 * 2. **Context Building**: Indexes the VDL schema, derives Go-safe names,
 *    recursively discovers inline objects, and validates symbol collisions.
 * 3. **File Emission**: Emits the final Go source files (types, enums, constants,
 *    pointer helpers, etc.) based on the prepared context.
 *
 * Any failure at any stage results in a `PluginOutput` containing structured errors.
 *
 * @param input - The validated VDL IR and generator options.
 * @returns A PluginOutput containing either the generated files or a list of errors.
 */
export function generate(input: PluginInput): PluginOutput {
  try {
    const optionsResult = resolveGeneratorOptions(input);
    if (optionsResult.errors.length > 0 || !optionsResult.options) {
      return {
        errors: optionsResult.errors,
      };
    }

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
