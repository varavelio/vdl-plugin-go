import {
  getOptionBool,
  getOptionString,
  type PluginInput,
  type PluginOutputError,
} from "@varavel/vdl-plugin-sdk";
import { isValidGoPackageName } from "../../shared/naming";
import type { GeneratorOptions } from "../model/types";

export function resolveGeneratorOptions(input: PluginInput): {
  options?: GeneratorOptions;
  errors: PluginOutputError[];
} {
  const packageName = getOptionString(input.options, "package", "vdl");
  const genConsts = getOptionBool(input.options, "genConsts", true);

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
    },
  };
}
