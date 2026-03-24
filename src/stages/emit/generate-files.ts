import type { PluginOutputFile } from "@varavel/vdl-plugin-sdk";
import { arrays } from "@varavel/vdl-plugin-sdk/utils";
import type { GeneratorContext } from "../model/types";
import { generateConstantsFile } from "./files/constants";
import { generateEnumsFile } from "./files/enums";
import { generatePointersFile } from "./files/pointers";
import { generateTypesFile } from "./files/types";

/**
 * Orchestrates the emission of all Go source files for the VDL plugin.
 *
 * This function calls individual file emitters in a fixed order and collects
 * their output. The order is intentional to maintain consistency in the
 * generated Go package and ensures that dependencies between generated files
 * are stable.
 *
 * Files are only generated if the corresponding schema definitions exist or if
 * the generator options (like `genPointerUtils`) enable them.
 *
 * @param context - The prepared generator context containing all descriptors and options.
 * @returns An array of generated Go files for the plugin output.
 */
export function generateFiles(context: GeneratorContext): PluginOutputFile[] {
  return arrays.compact([
    generateEnumsFile(context),
    generateTypesFile(context),
    generateConstantsFile(context),
    generatePointersFile(context),
  ]);
}
