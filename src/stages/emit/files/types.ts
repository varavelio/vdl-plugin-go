import { newGenerator } from "@varavel/gen";
import { collectImportsForTypeRef } from "../../../shared/go-types";
import { renderGoFile } from "../../../shared/render/go-file";
import { ImportSet } from "../../../shared/render/imports";
import type { GeneratedFile, GeneratorContext } from "../../model/types";
import { renderEnum } from "./types-enums";
import { renderNamedType } from "./types-named-types";

export function generateTypesFile(
  context: GeneratorContext,
): GeneratedFile | undefined {
  if (context.enumDescriptors.length === 0 && context.namedTypes.length === 0) {
    return undefined;
  }

  const imports = new ImportSet();

  for (const namedType of context.namedTypes) {
    collectImportsForTypeRef(namedType.typeRef, imports);
  }

  const g = newGenerator().withTabs();

  for (const enumDescriptor of context.enumDescriptors) {
    renderEnum(g, enumDescriptor, context.options.strict);
    g.break();
  }

  for (const namedType of context.namedTypes) {
    renderNamedType(g, namedType, context);
    g.break();
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
