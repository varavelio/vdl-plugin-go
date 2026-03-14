import type { newGenerator } from "@varavel/gen";
import {
  buildDocCommentLines,
  writeDocComment,
} from "../../../shared/comments";
import type { EnumDescriptor } from "../../model/types";

export function renderEnum(
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
        doc: member.def.doc,
        annotations: member.def.annotations,
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
    `// ${enumDescriptor.listGoName} contains every valid ${enumDescriptor.goName} value.`,
  );
  g.line(`var ${enumDescriptor.listGoName} = []${enumDescriptor.goName}{`);
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
    return JSON.stringify(member.def.value.stringValue);
  }

  return String(member.def.value.intValue);
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
          g.line(`return ${JSON.stringify(member.def.name)}`);
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
