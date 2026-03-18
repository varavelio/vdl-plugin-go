import { newGenerator } from "@varavel/gen";
import { renderGoFile } from "../../../shared/render/go-file";
import type { GeneratedFile, GeneratorContext } from "../../model/types";
import {
  renderConstantMetadataLiteral,
  renderEnumMetadataLiteral,
  renderTypeMetadataLiteral,
} from "./metadata-literals";
import { renderMetadataSupportTypes } from "./metadata-runtime";

export function generateMetadataFile(context: GeneratorContext): GeneratedFile {
  const g = newGenerator().withTabs();

  renderMetadataSupportTypes(g);
  g.break();

  g.line("// VDLMetadata exposes generated metadata for the current schema.");
  g.line("var VDLMetadata = SchemaMetadata{");
  g.block(() => {
    g.line("Types: map[string]TypeMetadata{");
    g.block(() => {
      for (const descriptor of context.namedTypes) {
        g.line(
          `${JSON.stringify(descriptor.goName)}: ${renderTypeMetadataLiteral(descriptor, context)},`,
        );
      }
    });
    g.line("},");
    g.line("Enums: map[string]EnumMetadata{");
    g.block(() => {
      for (const enumDescriptor of context.enumDescriptors) {
        g.line(
          `${JSON.stringify(enumDescriptor.goName)}: ${renderEnumMetadataLiteral(enumDescriptor)},`,
        );
      }
    });
    g.line("},");
    g.line("Constants: map[string]ConstantMetadata{");
    g.block(() => {
      for (const constant of context.constantDescriptors) {
        g.line(
          `${JSON.stringify(constant.goName)}: ${renderConstantMetadataLiteral(constant, context)},`,
        );
      }
    });
    g.line("},");
  });
  g.line("}");

  return {
    path: "metadata.go",
    content: renderGoFile({
      packageName: context.options.packageName,
      body: g.toString(),
    }),
  };
}
