import { newGenerator } from "@varavel/gen";
import type { PluginOutputFile } from "@varavel/vdl-plugin-sdk";
import { renderMetadataValueExpression } from "../../../shared/go-literals";
import { renderGoFile } from "../../../shared/render/go-file";
import type { GeneratorContext } from "../../model/types";
import { writeAnnotationSetField } from "./metadata-annotations";
import { renderMetadataSupportTypes } from "./metadata-runtime";
import { writeMetadataTypeField } from "./metadata-types";

/**
 * Emits the `metadata.go` file containing runtime metadata for the VDL schema.
 *
 * This file provides a reflection-like capability for Go code to inspect the
 * VDL schema at runtime. It includes:
 *
 * 1. Runtime Support Types: Internal Go types (`VDLSchemaMetadata`, `VDLTypeMetadata`,
 *    `VDLTypeRef`, etc.) that define the structure of the metadata.
 * 2. VDLMetadata Global: A singleton `VDLMetadata` variable that provides a
 *    registry of all named types, enums, and constants defined in the VDL.
 * 3. Annotation Support: Full access to VDL annotations on types, fields, and
 *    enum members, which can be retrieved by name or listed in order.
 * 4. Type Descriptors: Recursive type descriptors that describe the shape of
 *    generated Go types (primitives, arrays, maps, and nested objects).
 *
 * Metadata generation is enabled by default but can be disabled via the `genMeta` option.
 *
 * @param context - The generator context containing all indexed descriptors and options.
 * @returns The generated `metadata.go` file or undefined if metadata generation is disabled.
 */
export function generateMetadataFile(
  context: GeneratorContext,
): PluginOutputFile | undefined {
  if (!context.options.genMeta) {
    return undefined;
  }

  const g = newGenerator().withTabs();

  renderMetadataSupportTypes(g);
  g.break();

  g.line("// VDLMetadata exposes generated metadata for the current schema.");
  g.line("var VDLMetadata = VDLSchemaMetadata{");
  g.block(() => {
    g.line("Types: map[string]VDLTypeMetadata{");
    g.block(() => {
      for (const descriptor of context.namedTypes) {
        writeTypeMetadataEntry(g, descriptor, context);
      }
    });
    g.line("},");

    g.line("Enums: map[string]VDLEnumMetadata{");
    g.block(() => {
      for (const enumDescriptor of context.enumDescriptors) {
        writeEnumMetadataEntry(g, enumDescriptor.goName, () => {
          g.line(`Name: ${JSON.stringify(enumDescriptor.goName)},`);
          writeAnnotationSetField(g, enumDescriptor.def.annotations);
          g.line("Members: map[string]VDLEnumMemberMetadata{");
          g.block(() => {
            for (const member of enumDescriptor.members) {
              g.line(
                `${JSON.stringify(member.goName)}: VDLEnumMemberMetadata{`,
              );
              g.block(() => {
                g.line(`Name: ${JSON.stringify(member.goName)},`);
                g.line(
                  `Value: ${renderMetadataValueExpression(member.def.value)},`,
                );
                writeAnnotationSetField(g, member.def.annotations);
              });
              g.line("},");
            }
          });
          g.line("},");
        });
      }
    });
    g.line("},");

    g.line("Constants: map[string]VDLConstantMetadata{");
    g.block(() => {
      for (const constant of context.constantDescriptors) {
        g.line(`${JSON.stringify(constant.goName)}: VDLConstantMetadata{`);
        g.block(() => {
          g.line(`Name: ${JSON.stringify(constant.goName)},`);
          writeAnnotationSetField(g, constant.def.annotations);
          writeMetadataTypeField(g, constant.typeRef, context);
        });
        g.line("},");
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

function writeTypeMetadataEntry(
  g: ReturnType<typeof newGenerator>,
  descriptor: GeneratorContext["namedTypes"][number],
  context: GeneratorContext,
): void {
  g.line(`${JSON.stringify(descriptor.goName)}: VDLTypeMetadata{`);
  g.block(() => {
    g.line(`Name: ${JSON.stringify(descriptor.goName)},`);
    writeAnnotationSetField(g, descriptor.annotations);
    writeMetadataTypeField(g, descriptor.typeRef, context);
  });
  g.line("},");
}

function writeEnumMetadataEntry(
  g: ReturnType<typeof newGenerator>,
  enumGoName: string,
  writeBody: () => void,
): void {
  g.line(`${JSON.stringify(enumGoName)}: VDLEnumMetadata{`);
  g.block(writeBody);
  g.line("},");
}
