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
import { renderNamedTypeSchemaSupport } from "./types-schema";

/**
 * Renders a Go named type declaration (struct or alias) and its supporting methods.
 *
 * For VDL objects, it generates:
 * 1. The Go `struct` definition with field-level JSON tags.
 * 2. Strict JSON support methods (unmarshaling and validation) if enabled.
 * 3. Safe, nil-tolerant getter methods (`Get<Field>` and `Get<Field>Or`) for all
 *    struct fields, allowing users to safely access nested values.
 *
 * For VDL aliases, it generates a standard Go `type <Name> <BaseType>` declaration.
 * If the alias wraps a type that needs strict validation (like an enum), the
 * necessary support methods are delegated and rendered.
 *
 * @param g - The Go code generator for writing the output.
 * @param descriptor - The descriptor for the specific named type to render.
 * @param context - The global generator context containing options and global indexes.
 */
export function renderNamedType(
  g: ReturnType<typeof newGenerator>,
  descriptor: NamedTypeDescriptor,
  context: GeneratorContext,
): void {
  const fallback = descriptor.inline
    ? `${descriptor.goName} represents the inline object declared at ${descriptor.path}.`
    : descriptor.kind === "object"
      ? `${descriptor.goName} represents a VDL object.`
      : `${descriptor.goName} declares a VDL type alias.`;

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
    if (renderNamedTypeSchemaSupport(g, descriptor, context)) {
      g.break();
    }
    renderGetters(g, descriptor.fields, descriptor.goName);
    return;
  }

  g.line(
    `type ${descriptor.goName} ${renderGoType(descriptor.typeRef, context, undefined, descriptor.position)}`,
  );

  if (renderNamedTypeSchemaSupport(g, descriptor, context)) {
    g.break();
  }
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
    const getterFallback = field.def.optional
      ? `Get${field.goName} returns the ${field.goName} field. It returns the zero value when the receiver or field is nil.`
      : `Get${field.goName} returns the ${field.goName} field. It returns the zero value when the receiver is nil.`;
    const getterOrFallback = field.def.optional
      ? `Get${field.goName}Or returns the ${field.goName} field. It returns defaultValue when the receiver or field is nil.`
      : `Get${field.goName}Or returns the ${field.goName} field. It returns defaultValue when the receiver is nil.`;

    g.line(`// ${getterFallback}`);
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

    g.line(`// ${getterOrFallback}`);
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
