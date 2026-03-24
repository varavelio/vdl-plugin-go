import type { PluginInput, PluginOutputError } from "@varavel/vdl-plugin-sdk";
import { options } from "@varavel/vdl-plugin-sdk/utils";
import { isValidGoPackageName } from "../../shared/naming";
import type { GeneratorOptions } from "../model/types";

/**
 * Resolves and validates the generator options from the raw plugin input.
 *
 * This function extracts string and boolean options provided by the user applying
 * sensible defaults for any missing values.
 *
 * It also performs Go-specific validation, such as ensuring the package name is
 * a valid Go identifier.
 *
 * Current supported options:
 * - `package`: The name of the generated Go package (default: "vdl").
 * - `genConsts`: Whether to emit top-level constants (default: true).
 * - `strict`: Whether to generate strict JSON validation logic (default: true).
 * - `genPointerUtils`: Whether to include the Ptr/Val/Or helpers in pointers.go (default: true).
 *
 * @param input - The raw plugin input containing the options map.
 * @returns An object containing the resolved options or a list of validation errors.
 */
export function resolveGeneratorOptions(input: PluginInput): {
  options?: GeneratorOptions;
  errors: PluginOutputError[];
} {
  const packageName = options.getOptionString(input.options, "package", "vdl");
  const genConsts = options.getOptionBool(input.options, "genConsts", true);
  const strict = options.getOptionBool(input.options, "strict", true);
  const genPointerUtils = options.getOptionBool(
    input.options,
    "genPointerUtils",
    true,
  );

  if (!isValidGoPackageName(packageName)) {
    return {
      errors: [
        {
          message: `Invalid Go package name ${JSON.stringify(packageName)}. Use a lowercase Go identifier.`,
        },
      ],
    };
  }

  return {
    errors: [],
    options: {
      packageName,
      genConsts,
      strict,
      genPointerUtils,
    },
  };
}
