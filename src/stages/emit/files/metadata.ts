import { newGenerator } from "@varavel/gen";
import type { Annotation } from "@varavel/vdl-plugin-sdk";
import { arrays, objects } from "@varavel/vdl-plugin-sdk/utils";
import { renderMetadataValueExpression } from "../../../shared/go-literals";
import { renderGoFile } from "../../../shared/render/go-file";
import type { GeneratedFile, GeneratorContext } from "../../model/types";
import {
  renderConstantMetadataType,
  renderTypeMetadataType,
} from "./metadata-literals";
import { renderMetadataSupportTypes } from "./metadata-runtime";

export function generateMetadataFile(
  context: GeneratorContext,
): GeneratedFile | undefined {
  if (!context.options.genMeta) {
    return undefined;
  }

  const g = newGenerator().withTabs();

  renderMetadataSupportTypes(g);
  g.break();

  g.line("// VDLMetadata exposes generated metadata for the current schema.");
  g.line("var VDLMetadata = SchemaMetadata{");
  g.block(() => {
    g.line("Types: map[string]TypeMetadata{");
    g.block(() => {
      for (const descriptor of context.namedTypes) {
        writeTypeMetadataEntry(g, descriptor, context);
      }
    });
    g.line("},");

    g.line("Enums: map[string]EnumMetadata{");
    g.block(() => {
      for (const enumDescriptor of context.enumDescriptors) {
        writeEnumMetadataEntry(g, enumDescriptor.goName, () => {
          g.line(`Name: ${JSON.stringify(enumDescriptor.goName)},`);
          g.line(`Type: ${JSON.stringify(enumDescriptor.def.enumType)},`);
          writeAnnotationSetField(g, enumDescriptor.def.annotations);
          g.line("Members: map[string]EnumMemberMetadata{");
          g.block(() => {
            for (const member of enumDescriptor.members) {
              g.line(`${JSON.stringify(member.goName)}: EnumMemberMetadata{`);
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

    g.line("Constants: map[string]ConstantMetadata{");
    g.block(() => {
      for (const constant of context.constantDescriptors) {
        g.line(`${JSON.stringify(constant.goName)}: ConstantMetadata{`);
        g.block(() => {
          g.line(`Name: ${JSON.stringify(constant.goName)},`);
          g.line(
            `Type: ${JSON.stringify(renderConstantMetadataType(constant, context))},`,
          );
          g.line(
            `Value: ${renderMetadataValueExpression(constant.def.value)},`,
          );
          writeAnnotationSetField(g, constant.def.annotations);
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
  g.line(`${JSON.stringify(descriptor.goName)}: TypeMetadata{`);
  g.block(() => {
    g.line(`Name: ${JSON.stringify(descriptor.goName)},`);
    g.line(
      `Type: ${JSON.stringify(renderTypeMetadataType(descriptor, context))},`,
    );
    writeAnnotationSetField(g, descriptor.annotations);

    if (descriptor.fields.length === 0) {
      g.line("Fields: nil,");
      return;
    }

    g.line("Fields: map[string]FieldMetadata{");
    g.block(() => {
      for (const field of descriptor.fields) {
        g.line(`${JSON.stringify(field.goName)}: FieldMetadata{`);
        g.block(() => {
          g.line(`Name: ${JSON.stringify(field.goName)},`);
          g.line(`JSONName: ${JSON.stringify(field.jsonName)},`);
          g.line(`Type: ${JSON.stringify(field.goType)},`);
          g.line(`Optional: ${String(field.def.optional)},`);
          writeAnnotationSetField(g, field.def.annotations);
        });
        g.line("},");
      }
    });
    g.line("},");
  });
  g.line("},");
}

function writeEnumMetadataEntry(
  g: ReturnType<typeof newGenerator>,
  enumGoName: string,
  writeBody: () => void,
): void {
  g.line(`${JSON.stringify(enumGoName)}: EnumMetadata{`);
  g.block(writeBody);
  g.line("},");
}

function writeAnnotationSetField(
  g: ReturnType<typeof newGenerator>,
  annotations: Annotation[],
): void {
  if (annotations.length === 0) {
    g.line("Annotations: AnnotationSet{},");
    return;
  }

  const grouped = arrays.groupBy(annotations, (annotation) => annotation.name);
  const byName = objects.mapValues(grouped, (group) =>
    renderMetadataValueExpression(group[group.length - 1]?.argument),
  );

  g.line("Annotations: AnnotationSet{");
  g.block(() => {
    g.line("List: []Annotation{");
    g.block(() => {
      for (const annotation of annotations) {
        g.line("Annotation{");
        g.block(() => {
          g.line(`Name: ${JSON.stringify(annotation.name)},`);
          g.line(
            `Value: ${renderMetadataValueExpression(annotation.argument)},`,
          );
        });
        g.line("},");
      }
    });
    g.line("},");

    g.line("ByName: map[string]any{");
    g.block(() => {
      for (const name of Object.keys(byName)) {
        g.line(`${JSON.stringify(name)}: ${byName[name]},`);
      }
    });
    g.line("},");
  });
  g.line("},");
}
