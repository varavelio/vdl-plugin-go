import type { PluginInput, PluginOutputError } from "@varavel/vdl-plugin-sdk";
import { options } from "@varavel/vdl-plugin-sdk/utils";
import { isValidGoPackageName } from "../../shared/naming";
import type { GeneratorOptions } from "../model/types";

export function resolveGeneratorOptions(input: PluginInput): {
  options?: GeneratorOptions;
  errors: PluginOutputError[];
} {
  const packageName = options.getOptionString(input.options, "package", "vdl");
  const genConsts = options.getOptionBool(input.options, "genConsts", true);
  const genMeta = options.getOptionBool(input.options, "genMeta", true);
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
      genMeta,
      strict,
      genPointerUtils,
    },
  };
}
