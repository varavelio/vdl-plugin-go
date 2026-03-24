import { newGenerator } from "@varavel/gen";
import type { PluginOutputFile } from "@varavel/vdl-plugin-sdk";
import { renderGoFile } from "../../../shared/render/go-file";
import type { GeneratorContext } from "../../model/types";
import { renderEnum } from "./enums-render";

/**
 * Emits the `enums.go` file containing all VDL enum definitions.
 *
 * Each enum includes its Go type declaration, constant members, a slice of all
 * members, and utility methods like `String()` and `IsValid()`. If `strict` mode
 * is enabled, it also generates custom `MarshalJSON` and `UnmarshalJSON` methods
 * to ensure that only valid enum members are accepted during JSON decoding.
 *
 * The file is only generated if one or more enums are present in the VDL IR.
 *
 * @param context - The generator context containing enum descriptors and options.
 * @returns The generated `enums.go` file or undefined if no enums are present.
 */
export function generateEnumsFile(
  context: GeneratorContext,
): PluginOutputFile | undefined {
  if (context.enumDescriptors.length === 0) {
    return undefined;
  }

  const g = newGenerator().withTabs();

  for (const enumDescriptor of context.enumDescriptors) {
    renderEnum(g, enumDescriptor, context.options.strict);
    g.break();
  }

  return {
    path: "enums.go",
    content: renderGoFile({
      packageName: context.options.packageName,
      body: g.toString(),
    }),
  };
}
