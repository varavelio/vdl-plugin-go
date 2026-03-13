import { newGenerator } from "@varavel/gen";
import { buildDocCommentLines, writeDocComment } from "../comments";
import { renderGoFile } from "../file";
import { ImportSet } from "../imports";
import type {
  EnumDescriptor,
  FieldDescriptor,
  GeneratedFile,
  GeneratorContext,
  NamedTypeDescriptor,
} from "../internal-types";
import { collectImportsForTypeRef, renderGoType } from "../type-ref";

/**
 * Generates the Go file containing enums and named types.
 */
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

function renderEnum(
  g: ReturnType<typeof newGenerator>,
  enumDescriptor: EnumDescriptor,
): void {
  writeDocComment(
    g,
    buildDocCommentLines({
      doc: enumDescriptor.def.doc,
      annotations: enumDescriptor.def.annotations,
      fallback: `${enumDescriptor.goName} is a VDL enum.`,
    }),
  );
  g.line(
    `type ${enumDescriptor.goName} ${enumDescriptor.def.enumType === "string" ? "string" : "int"}`,
  );
  g.break();

  g.line(`// ${enumDescriptor.goName} enum values.`);
  g.line("const (");
  g.block(() => {
    for (const member of enumDescriptor.members) {
      const commentLines = buildDocCommentLines({
        doc: member.member.doc,
        annotations: member.member.annotations,
      });

      if (commentLines.length > 0) {
        writeDocComment(g, commentLines);
      }

      g.line(
        `${member.constName} ${enumDescriptor.goName} = ${renderEnumMemberLiteral(enumDescriptor, member)}`,
      );
    }
  });
  g.line(")");
  g.break();

  g.line(
    `// ${enumDescriptor.listName} contains every valid ${enumDescriptor.goName} value.`,
  );
  g.line(`var ${enumDescriptor.listName} = []${enumDescriptor.goName}{`);
  g.block(() => {
    for (const member of enumDescriptor.members) {
      g.line(`${member.constName},`);
    }
  });
  g.line("}");
  g.break();

  renderEnumStringMethod(g, enumDescriptor);
  g.break();
  renderEnumIsValidMethod(g, enumDescriptor);
  g.break();
  renderEnumMarshalJSONMethod(g, enumDescriptor);
  g.break();
  renderEnumUnmarshalJSONMethod(g, enumDescriptor);
}

function renderEnumMemberLiteral(
  enumDescriptor: EnumDescriptor,
  member: EnumDescriptor["members"][number],
): string {
  if (enumDescriptor.def.enumType === "string") {
    return JSON.stringify(member.member.value.stringValue ?? "");
  }

  return String(member.member.value.intValue ?? 0);
}

function renderEnumStringMethod(
  g: ReturnType<typeof newGenerator>,
  enumDescriptor: EnumDescriptor,
): void {
  g.line(
    `// String returns the string representation of ${enumDescriptor.goName}.`,
  );
  g.line(`func (e ${enumDescriptor.goName}) String() string {`);
  g.block(() => {
    if (enumDescriptor.def.enumType === "string") {
      g.line("return string(e)");
      return;
    }

    g.line("switch e {");
    g.block(() => {
      for (const member of enumDescriptor.members) {
        g.line(`case ${member.constName}:`);
        g.block(() => {
          g.line(`return ${JSON.stringify(member.member.name)}`);
        });
      }
    });
    g.line("}");
    g.line(
      `return fmt.Sprintf(${JSON.stringify(`${enumDescriptor.goName}(%d)`)}, e)`,
    );
  });
  g.line("}");
}

function renderEnumIsValidMethod(
  g: ReturnType<typeof newGenerator>,
  enumDescriptor: EnumDescriptor,
): void {
  g.line(
    `// IsValid reports whether the value belongs to ${enumDescriptor.goName}.`,
  );
  g.line(`func (e ${enumDescriptor.goName}) IsValid() bool {`);
  g.block(() => {
    g.line("switch e {");
    g.block(() => {
      g.line(
        `case ${enumDescriptor.members.map((member) => member.constName).join(", ")}:`,
      );
      g.block(() => {
        g.line("return true");
      });
    });
    g.line("}");
    g.line("return false");
  });
  g.line("}");
}

function renderEnumMarshalJSONMethod(
  g: ReturnType<typeof newGenerator>,
  enumDescriptor: EnumDescriptor,
): void {
  g.line("// MarshalJSON implements json.Marshaler.");
  g.line(`func (e ${enumDescriptor.goName}) MarshalJSON() ([]byte, error) {`);
  g.block(() => {
    g.line("if !e.IsValid() {");
    g.block(() => {
      g.line(
        `return nil, fmt.Errorf(${JSON.stringify(`cannot marshal invalid value for enum ${enumDescriptor.goName}`)})`,
      );
    });
    g.line("}");

    if (enumDescriptor.def.enumType === "string") {
      g.line("return json.Marshal(string(e))");
      return;
    }

    g.line("return json.Marshal(int(e))");
  });
  g.line("}");
}

function renderEnumUnmarshalJSONMethod(
  g: ReturnType<typeof newGenerator>,
  enumDescriptor: EnumDescriptor,
): void {
  g.line("// UnmarshalJSON implements json.Unmarshaler.");
  g.line(
    `func (e *${enumDescriptor.goName}) UnmarshalJSON(data []byte) error {`,
  );
  g.block(() => {
    if (enumDescriptor.def.enumType === "string") {
      g.line("var value string");
      g.line("if err := json.Unmarshal(data, &value); err != nil {");
      g.block(() => {
        g.line("return err");
      });
      g.line("}");
      g.line(`candidate := ${enumDescriptor.goName}(value)`);
      g.line("if !candidate.IsValid() {");
      g.block(() => {
        g.line(
          `return fmt.Errorf(${JSON.stringify(`invalid value for enum ${enumDescriptor.goName}`)})`,
        );
      });
      g.line("}");
      g.line("*e = candidate");
      g.line("return nil");
      return;
    }

    g.line("var value int");
    g.line("if err := json.Unmarshal(data, &value); err != nil {");
    g.block(() => {
      g.line("return err");
    });
    g.line("}");
    g.line(`candidate := ${enumDescriptor.goName}(value)`);
    g.line("if !candidate.IsValid() {");
    g.block(() => {
      g.line(
        `return fmt.Errorf(${JSON.stringify(`invalid value for enum ${enumDescriptor.goName}`)})`,
      );
    });
    g.line("}");
    g.line("*e = candidate");
    g.line("return nil");
  });
  g.line("}");
}

function renderNamedType(
  g: ReturnType<typeof newGenerator>,
  descriptor: NamedTypeDescriptor,
  context: GeneratorContext,
): void {
  const fallback = descriptor.inline
    ? `${descriptor.name} represents the inline VDL object at ${descriptor.path}.`
    : descriptor.kind === "object"
      ? `${descriptor.name} is a VDL object type.`
      : `${descriptor.name} is a VDL type.`;

  writeDocComment(
    g,
    buildDocCommentLines({
      doc: descriptor.doc,
      annotations: descriptor.annotations,
      fallback,
    }),
  );

  if (descriptor.kind === "object") {
    renderStructType(g, descriptor);
    g.break();
    renderGetters(g, descriptor.fields, descriptor.name);
    return;
  }

  g.line(
    `type ${descriptor.name} ${renderGoType(descriptor.typeRef, context, undefined, descriptor.position)}`,
  );
}

function renderStructType(
  g: ReturnType<typeof newGenerator>,
  descriptor: NamedTypeDescriptor,
): void {
  g.line(`type ${descriptor.name} struct {`);
  g.block(() => {
    for (const field of descriptor.fields) {
      const commentLines = buildDocCommentLines({
        doc: field.field.doc,
        annotations: field.field.annotations,
      });

      if (commentLines.length > 0) {
        writeDocComment(g, commentLines);
      }

      const jsonTag = field.field.optional
        ? `json:${JSON.stringify(`${field.jsonName},omitempty`)}`
        : `json:${JSON.stringify(field.jsonName)}`;
      g.line(`${field.goName} ${field.goType} \`${jsonTag}\``);
    }
  });
  g.line("}");
}

function renderGetters(
  g: ReturnType<typeof newGenerator>,
  fields: FieldDescriptor[],
  receiverType: string,
): void {
  for (const field of fields) {
    g.line(
      `// Get${field.goName} returns ${field.goName} or its zero value when unavailable.`,
    );
    g.line(
      `func (x *${receiverType}) Get${field.goName}() ${stripPointer(field.goType)} {`,
    );
    g.block(() => {
      if (field.field.optional) {
        g.line(`if x != nil && x.${field.goName} != nil {`);
        g.block(() => {
          g.line(`return *x.${field.goName}`);
        });
        g.line("}");
        g.line(`var zero ${stripPointer(field.goType)}`);
        g.line("return zero");
      } else {
        g.line("if x != nil {");
        g.block(() => {
          g.line(`return x.${field.goName}`);
        });
        g.line("}");
        g.line(`var zero ${field.goType}`);
        g.line("return zero");
      }
    });
    g.line("}");
    g.break();

    g.line(
      `// Get${field.goName}Or returns ${field.goName} or the provided default when unavailable.`,
    );
    g.line(
      `func (x *${receiverType}) Get${field.goName}Or(defaultValue ${stripPointer(field.goType)}) ${stripPointer(field.goType)} {`,
    );
    g.block(() => {
      if (field.field.optional) {
        g.line(`if x != nil && x.${field.goName} != nil {`);
        g.block(() => {
          g.line(`return *x.${field.goName}`);
        });
        g.line("}");
        g.line("return defaultValue");
      } else {
        g.line("if x != nil {");
        g.block(() => {
          g.line(`return x.${field.goName}`);
        });
        g.line("}");
        g.line("return defaultValue");
      }
    });
    g.line("}");

    if (field !== fields[fields.length - 1]) {
      g.break();
    }
  }
}

function stripPointer(typeName: string): string {
  return typeName.startsWith("*") ? typeName.slice(1) : typeName;
}
