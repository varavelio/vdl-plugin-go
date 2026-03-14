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

  if (context.enumDescriptors.length > 0) {
    imports.add("encoding/json");
    imports.add("fmt");
  }

  for (const namedType of context.namedTypes) {
    collectImportsForTypeRef(namedType.typeRef, imports);
  }

  const g = newGenerator().withTabs();

  for (const enumDescriptor of context.enumDescriptors) {
    renderEnum(g, enumDescriptor);
    g.break();
  }

  for (const namedType of context.namedTypes) {
    renderNamedType(g, namedType, context);
    g.break();
  }

  return {
    path: "types.go",
    content: renderGoFile({
      packageName: context.options.packageName,
      imports,
      body: g.toString(),
    }),
  };
}
