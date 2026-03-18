import type { newGenerator } from "@varavel/gen";
import type { Position, TypeRef } from "@varavel/vdl-plugin-sdk";
import { expectValue } from "../../../shared/errors";
import { renderGoType } from "../../../shared/go-types";
import { getEffectiveObjectFields } from "../../../shared/object-fields";
import type {
  FieldDescriptor,
  GeneratorContext,
  NamedTypeDescriptor,
} from "../../model/types";

export function renderNamedTypeSchemaSupport(
  g: ReturnType<typeof newGenerator>,
  descriptor: NamedTypeDescriptor,
  context: GeneratorContext,
): boolean {
  if (!context.options.strict) {
    return false;
  }

  if (descriptor.kind === "object") {
    if (!descriptorHasRequiredFields(descriptor)) {
      return false;
    }

    renderPreObjectType(g, descriptor);
    g.break();
    renderPreObjectValidateMethod(g, descriptor);
    g.break();
    renderPreObjectTransformMethod(g, descriptor);
    g.break();
    renderObjectUnmarshalJSONMethod(g, descriptor);
    return true;
  }

  const strictBehavior = resolveStrictAliasBehavior(
    descriptor.typeRef,
    context,
    descriptor.position,
  );

  if (strictBehavior === "enum") {
    renderAliasMarshalJSONMethod(g, descriptor, context);
    g.break();
    renderAliasUnmarshalJSONMethod(g, descriptor, context);
    return true;
  }

  if (strictBehavior === "object") {
    renderAliasUnmarshalJSONMethod(g, descriptor, context);
    return true;
  }

  return false;
}

function renderPreObjectType(
  g: ReturnType<typeof newGenerator>,
  descriptor: NamedTypeDescriptor,
): void {
  const preTypeName = toPreTypeName(descriptor.goName);

  g.line(
    `// ${preTypeName} mirrors ${descriptor.goName} during strict JSON decoding.`,
  );
  g.line(`type ${preTypeName} struct {`);
  g.block(() => {
    for (const field of descriptor.fields) {
      const jsonTag = field.def.optional
        ? `json:${JSON.stringify(`${field.jsonName},omitempty`)}`
        : `json:${JSON.stringify(field.jsonName)}`;

      g.line(`${field.goName} ${renderPreFieldGoType(field)} \`${jsonTag}\``);
    }
  });
  g.line("}");
}

function renderPreObjectValidateMethod(
  g: ReturnType<typeof newGenerator>,
  descriptor: NamedTypeDescriptor,
): void {
  const preTypeName = toPreTypeName(descriptor.goName);

  g.line(
    `// validate reports whether all required JSON fields are present in ${preTypeName}.`,
  );
  g.line(`func (p *${preTypeName}) validate() error {`);
  g.block(() => {
    for (const field of descriptor.fields) {
      if (field.def.optional) {
        continue;
      }

      g.line(`if p.${field.goName} == nil {`);
      g.block(() => {
        g.line(
          `return fmt.Errorf(${JSON.stringify("field %q is required")}, ${JSON.stringify(field.jsonName)})`,
        );
      });
      g.line("}");
    }

    g.line("return nil");
  });
  g.line("}");
}

function renderPreObjectTransformMethod(
  g: ReturnType<typeof newGenerator>,
  descriptor: NamedTypeDescriptor,
): void {
  const preTypeName = toPreTypeName(descriptor.goName);

  g.line(`// transform converts ${preTypeName} to ${descriptor.goName}.`);
  g.line(`func (p *${preTypeName}) transform() ${descriptor.goName} {`);
  g.block(() => {
    g.line(`return ${descriptor.goName}{`);
    g.block(() => {
      for (const field of descriptor.fields) {
        const valueExpression = field.def.optional
          ? `p.${field.goName}`
          : `*p.${field.goName}`;
        g.line(`${field.goName}: ${valueExpression},`);
      }
    });
    g.line("}");
  });
  g.line("}");
}

function renderObjectUnmarshalJSONMethod(
  g: ReturnType<typeof newGenerator>,
  descriptor: NamedTypeDescriptor,
): void {
  const preTypeName = toPreTypeName(descriptor.goName);

  g.line(
    `// UnmarshalJSON decodes ${descriptor.goName} while requiring every non-optional JSON field.`,
  );
  g.line(`func (x *${descriptor.goName}) UnmarshalJSON(data []byte) error {`);
  g.block(() => {
    g.line(`var pre ${preTypeName}`);
    g.line("if err := json.Unmarshal(data, &pre); err != nil {");
    g.block(() => {
      g.line("return err");
    });
    g.line("}");
    g.line("if err := pre.validate(); err != nil {");
    g.block(() => {
      g.line("return err");
    });
    g.line("}");
    g.line("*x = pre.transform()");
    g.line("return nil");
  });
  g.line("}");
}

function renderAliasMarshalJSONMethod(
  g: ReturnType<typeof newGenerator>,
  descriptor: NamedTypeDescriptor,
  context: GeneratorContext,
): void {
  const underlyingType = renderGoType(
    descriptor.typeRef,
    context,
    undefined,
    descriptor.position,
  );

  g.line(
    `// MarshalJSON encodes ${descriptor.goName} using its underlying strict JSON representation.`,
  );
  g.line(`func (x ${descriptor.goName}) MarshalJSON() ([]byte, error) {`);
  g.block(() => {
    g.line(`return json.Marshal(${underlyingType}(x))`);
  });
  g.line("}");
}

function renderAliasUnmarshalJSONMethod(
  g: ReturnType<typeof newGenerator>,
  descriptor: NamedTypeDescriptor,
  context: GeneratorContext,
): void {
  const underlyingType = renderGoType(
    descriptor.typeRef,
    context,
    undefined,
    descriptor.position,
  );

  g.line(
    `// UnmarshalJSON decodes ${descriptor.goName} using its underlying strict JSON representation.`,
  );
  g.line(`func (x *${descriptor.goName}) UnmarshalJSON(data []byte) error {`);
  g.block(() => {
    g.line(`var value ${underlyingType}`);
    g.line("if err := json.Unmarshal(data, &value); err != nil {");
    g.block(() => {
      g.line("return err");
    });
    g.line("}");
    g.line(`*x = ${descriptor.goName}(value)`);
    g.line("return nil");
  });
  g.line("}");
}

function descriptorHasRequiredFields(descriptor: NamedTypeDescriptor): boolean {
  return descriptor.fields.some((field) => !field.def.optional);
}

function resolveStrictAliasBehavior(
  typeRef: TypeRef,
  context: GeneratorContext,
  position?: Position,
  visited = new Set<string>(),
): "enum" | "object" | undefined {
  switch (typeRef.kind) {
    case "enum":
      return "enum";
    case "object":
      return typeRefHasRequiredFields(typeRef) ? "object" : undefined;
    case "type": {
      const typeName = expectValue(
        typeRef.typeName,
        "Encountered a named type reference without a type name.",
        position,
      );

      if (visited.has(typeName)) {
        return undefined;
      }

      visited.add(typeName);

      const referencedType = getReferencedTypeRef(typeName, context, position);
      return resolveStrictAliasBehavior(
        referencedType,
        context,
        position,
        visited,
      );
    }
    case "primitive":
    case "array":
    case "map":
      return undefined;
    default:
      return undefined;
  }
}

function getReferencedTypeRef(
  typeName: string,
  context: GeneratorContext,
  position?: Position,
): TypeRef {
  const typeDef = expectValue(
    context.typeDefsByVdlName.get(typeName),
    `Unknown VDL type reference ${JSON.stringify(typeName)}.`,
    position,
  );

  return typeDef.typeRef;
}

function typeRefHasRequiredFields(typeRef: TypeRef): boolean {
  if (typeRef.kind !== "object") {
    return false;
  }

  return getEffectiveObjectFields(typeRef.objectFields).some(
    (field) => !field.optional,
  );
}

function renderPreFieldGoType(field: FieldDescriptor): string {
  return field.def.optional ? field.goType : `*${field.goType}`;
}

function toPreTypeName(goName: string): string {
  return `pre${goName}`;
}
