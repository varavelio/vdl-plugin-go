import type { newGenerator } from "@varavel/gen";
import {
  buildDocCommentLines,
  writeDocComment,
} from "../../../shared/comments";
import { renderGoType } from "../../../shared/go-types";
import type {
  FieldDescriptor,
  GeneratorContext,
  NamedTypeDescriptor,
} from "../../model/types";

export function renderNamedType(
  g: ReturnType<typeof newGenerator>,
  descriptor: NamedTypeDescriptor,
  context: GeneratorContext,
): void {
  const fallback = descriptor.inline
    ? `${descriptor.goName} represents the inline VDL object at ${descriptor.path}.`
    : descriptor.kind === "object"
      ? `${descriptor.goName} is a VDL object type.`
      : `${descriptor.goName} is a VDL type.`;

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
    renderGetters(g, descriptor.fields, descriptor.goName);
    return;
  }

  g.line(
    `type ${descriptor.goName} ${renderGoType(descriptor.typeRef, context, undefined, descriptor.position)}`,
  );
}

function renderStructType(
  g: ReturnType<typeof newGenerator>,
  descriptor: NamedTypeDescriptor,
): void {
  g.line(`type ${descriptor.goName} struct {`);
  g.block(() => {
    for (const field of descriptor.fields) {
      const commentLines = buildDocCommentLines({
        doc: field.def.doc,
        annotations: field.def.annotations,
      });

      if (commentLines.length > 0) {
        writeDocComment(g, commentLines);
      }

      const jsonTag = field.def.optional
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
    const valueType = stripPointer(field.goType);

    g.line(
      `// Get${field.goName} returns ${field.goName} or its zero value when unavailable.`,
    );
    g.line(`func (x *${receiverType}) Get${field.goName}() ${valueType} {`);
    g.block(() => {
      if (field.def.optional) {
        g.line(`if x != nil && x.${field.goName} != nil {`);
        g.block(() => {
          g.line(`return *x.${field.goName}`);
        });
        g.line("}");
        g.line(`var zero ${valueType}`);
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
      `func (x *${receiverType}) Get${field.goName}Or(defaultValue ${valueType}) ${valueType} {`,
    );
    g.block(() => {
      if (field.def.optional) {
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
