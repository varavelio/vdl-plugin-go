import { newGenerator } from "@varavel/gen";
import { renderGoFile } from "../../../shared/render/go-file";
import { ImportSet } from "../../../shared/render/imports";
import type { GeneratedFile, GeneratorContext } from "../../model/types";
import { renderEnum } from "./types-enums";

export function generateEnumsFile(
  context: GeneratorContext,
): GeneratedFile | undefined {
  if (context.enumDescriptors.length === 0) {
    return undefined;
  }

  const imports = new ImportSet();
  const g = newGenerator().withTabs();

  for (const enumDescriptor of context.enumDescriptors) {
    renderEnum(g, enumDescriptor, context.options.strict);

    if (
      enumDescriptor !==
      context.enumDescriptors[context.enumDescriptors.length - 1]
    ) {
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
    path: "enums.go",
    content: renderGoFile({
      packageName: context.options.packageName,
      imports,
      body,
    }),
  };
}
