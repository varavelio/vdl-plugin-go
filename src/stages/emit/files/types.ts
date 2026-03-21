import { newGenerator } from "@varavel/gen";
import type { PluginOutputFile } from "@varavel/vdl-plugin-sdk";
import { collectImportsForTypeRef } from "../../../shared/go-types";
import { renderGoFile } from "../../../shared/render/go-file";
import { ImportSet } from "../../../shared/render/imports";
import type { GeneratorContext } from "../../model/types";
import { renderNamedType } from "./types-named-types";

export function generateTypesFile(
  context: GeneratorContext,
): PluginOutputFile | undefined {
  if (context.namedTypes.length === 0) {
    return undefined;
  }

  const imports = new ImportSet();

  for (const namedType of context.namedTypes) {
    collectImportsForTypeRef(namedType.typeRef, imports);
  }

  const g = newGenerator().withTabs();

  for (const namedType of context.namedTypes) {
    renderNamedType(g, namedType, context);

    if (namedType !== context.namedTypes[context.namedTypes.length - 1]) {
      g.break();
    }
  }

  const body = g.toString();

  if (body.includes("json.")) {
    imports.add("encoding/json");
  }

  if (body.includes("fmt.")) {
    imports.add("fmt");
  }

  return {
    path: "types.go",
    content: renderGoFile({
      packageName: context.options.packageName,
      imports,
      body,
    }),
  };
}
