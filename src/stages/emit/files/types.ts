import { newGenerator } from "@varavel/gen";
import type { PluginOutputFile } from "@varavel/vdl-plugin-sdk";
import { renderGoFile } from "../../../shared/render/go-file";
import { ImportSet } from "../../../shared/render/imports";
import type { GeneratorContext } from "../../model/types";
import { renderNamedType } from "./types-named-types";

/**
 * Emits the `types.go` file containing all VDL named types and inline objects.
 *
 * Each type becomes an exported Go type:
 * - VDL objects render as Go `struct` types with JSON tags.
 * - VDL primitives, arrays, and maps render as Go type aliases.
 *
 * If `strict` mode is enabled, it generates `UnmarshalJSON` and `validate` methods
 * for structs to enforce that required fields are present and valid. It also
 * generates getter methods (`Get<Field>` and `Get<Field>Or`) for all fields
 * to provide nil-safe access to optional and nested values.
 *
 * @param context - The generator context containing all named type descriptors and options.
 * @returns The generated `types.go` file or undefined if no named types are present.
 */
export function generateTypesFile(
  context: GeneratorContext,
): PluginOutputFile | undefined {
  if (context.namedTypes.length === 0) {
    return undefined;
  }

  const imports = new ImportSet();
  const g = newGenerator().withTabs();

  for (const namedType of context.namedTypes) {
    renderNamedType(g, namedType, context);
    g.break();
  }

  const body = g.toString();
  if (body.includes("time.")) imports.add("time");
  if (body.includes("json.")) imports.add("encoding/json");
  if (body.includes("fmt.")) imports.add("fmt");

  return {
    path: "types.go",
    content: renderGoFile({
      packageName: context.options.packageName,
      imports,
      body,
    }),
  };
}
