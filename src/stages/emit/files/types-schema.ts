import type { newGenerator } from "@varavel/gen";
import type { Position, TypeDef, TypeRef } from "@varavel/vdl-plugin-sdk";
import { expectValue } from "../../../shared/errors";
import { renderGoType, resolveNonTypeRef } from "../../../shared/go-types";
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
    if (!namedTypeNeedsStrictObjectSupport(descriptor, context)) {
      return false;
    }

    renderPreObjectType(g, descriptor, context);
    g.break();
    renderPreObjectValidateMethod(g, descriptor, context);
    g.break();
    renderPreObjectTransformMethod(g, descriptor, context);
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
  context: GeneratorContext,
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

      g.line(
        `${field.goName} ${renderPreFieldGoType(field, context)} \`${jsonTag}\``,
      );
    }
  });
  g.line("}");
}

function renderPreObjectValidateMethod(
  g: ReturnType<typeof newGenerator>,
  descriptor: NamedTypeDescriptor,
  context: GeneratorContext,
): void {
  const preTypeName = toPreTypeName(descriptor.goName);

  g.line(
    `// validate reports whether ${preTypeName} satisfies strict JSON requirements.`,
  );
  g.line(`func (p *${preTypeName}) validate(parentPath string) error {`);
  g.block(() => {
    for (const field of descriptor.fields) {
      const needsNestedValidation = typeRefNeedsStrictTraversal(
        field.def.typeRef,
        context,
        field.def.position,
      );

      if (!field.def.optional || needsNestedValidation) {
        const fieldPathVar = `vdlPath${field.goName}`;
        renderFieldPathAssignment(
          g,
          fieldPathVar,
          "parentPath",
          field.jsonName,
        );

        if (!field.def.optional) {
          g.line(`if p.${field.goName} == nil {`);
          g.block(() => {
            g.line(
              `return fmt.Errorf(${JSON.stringify("field %s is required")}, ${fieldPathVar})`,
            );
          });
          g.line("}");
        }

        if (needsNestedValidation) {
          g.line(`if p.${field.goName} != nil {`);
          g.block(() => {
            renderValidationForType(g, {
              context,
              depth: 0,
              pathExpression: fieldPathVar,
              position: field.def.position,
              sourceExpression: `p.${field.goName}`,
              sourceIsPointer: true,
              typeRef: field.def.typeRef,
            });
          });
          g.line("}");
        }

        if (field !== descriptor.fields[descriptor.fields.length - 1]) {
          g.break();
        }
      }
    }

    g.line("return nil");
  });
  g.line("}");
}

function renderPreObjectTransformMethod(
  g: ReturnType<typeof newGenerator>,
  descriptor: NamedTypeDescriptor,
  context: GeneratorContext,
): void {
  const preTypeName = toPreTypeName(descriptor.goName);

  g.line(`// transform converts ${preTypeName} to ${descriptor.goName}.`);
  g.line(`func (p *${preTypeName}) transform() ${descriptor.goName} {`);
  g.block(() => {
    for (const field of descriptor.fields) {
      renderFieldTransform(g, field, context);

      if (field !== descriptor.fields[descriptor.fields.length - 1]) {
        g.break();
      }
    }

    if (descriptor.fields.length > 0) {
      g.break();
    }

    g.line(`return ${descriptor.goName}{`);
    g.block(() => {
      for (const field of descriptor.fields) {
        g.line(`${field.goName}: trans${field.goName},`);
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
    g.line('if err := pre.validate(""); err != nil {');
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

function namedTypeNeedsStrictObjectSupport(
  descriptor: NamedTypeDescriptor,
  context: GeneratorContext,
): boolean {
  return typeRefNeedsStrictTraversal(
    descriptor.typeRef,
    context,
    descriptor.position,
  );
}

function typeRefNeedsStrictTraversal(
  typeRef: TypeRef,
  context: GeneratorContext,
  position?: Position,
  visited = new Set<string>(),
): boolean {
  switch (typeRef.kind) {
    case "primitive":
    case "enum":
      return false;
    case "array":
      return typeRef.arrayType
        ? typeRefNeedsStrictTraversal(
            typeRef.arrayType,
            context,
            position,
            visited,
          )
        : false;
    case "map":
      return typeRef.mapType
        ? typeRefNeedsStrictTraversal(
            typeRef.mapType,
            context,
            position,
            visited,
          )
        : false;
    case "object": {
      const fields = getEffectiveObjectFields(typeRef.objectFields);

      if (fields.some((field) => !field.optional)) {
        return true;
      }

      return fields.some((field) =>
        typeRefNeedsStrictTraversal(
          field.typeRef,
          context,
          field.position,
          visited,
        ),
      );
    }
    case "type": {
      const typeName = expectValue(
        typeRef.typeName,
        "Encountered a named type reference without a type name.",
        position,
      );

      if (visited.has(typeName)) {
        return false;
      }

      visited.add(typeName);
      return typeRefNeedsStrictTraversal(
        getReferencedTypeDef(typeName, context, position).typeRef,
        context,
        position,
        visited,
      );
    }
    default:
      return false;
  }
}

function renderPreFieldGoType(
  field: FieldDescriptor,
  context: GeneratorContext,
): string {
  return `*${renderPreTypeExpression(field.def.typeRef, context, field.def.position, field.inlineTypeGoName)}`;
}

function renderPreTypeExpression(
  typeRef: TypeRef,
  context: GeneratorContext,
  position?: Position,
  inlineTypeGoName?: string,
): string {
  if (!typeRefNeedsStrictTraversal(typeRef, context, position)) {
    return renderGoType(typeRef, context, inlineTypeGoName, position);
  }

  switch (typeRef.kind) {
    case "primitive":
    case "enum":
      return renderGoType(typeRef, context, inlineTypeGoName, position);
    case "array":
      return `${"[]".repeat(typeRef.arrayDims ?? 1)}${renderPreTypeExpression(expectValue(typeRef.arrayType, "Encountered an array type reference without an element type.", position), context, position, inlineTypeGoName)}`;
    case "map":
      return `map[string]${renderPreTypeExpression(expectValue(typeRef.mapType, "Encountered a map type reference without a value type.", position), context, position, inlineTypeGoName)}`;
    case "object":
      return toPreTypeName(
        expectValue(
          inlineTypeGoName,
          "Encountered an inline object without a generated Go type name.",
          position,
        ),
      );
    case "type": {
      const typeName = expectValue(
        typeRef.typeName,
        "Encountered a named type reference without a type name.",
        position,
      );
      const typeDef = getReferencedTypeDef(typeName, context, position);

      if (typeDef.typeRef.kind === "object") {
        return toPreTypeName(getTypeGoName(typeName, context, position));
      }

      return renderPreTypeExpression(
        typeDef.typeRef,
        context,
        typeDef.position,
        inlineTypeGoName,
      );
    }
    default:
      return renderGoType(typeRef, context, inlineTypeGoName, position);
  }
}

function renderValidationForType(
  g: ReturnType<typeof newGenerator>,
  options: {
    context: GeneratorContext;
    depth: number;
    pathExpression: string;
    position?: Position;
    sourceExpression: string;
    sourceIsPointer: boolean;
    typeRef: TypeRef;
  },
): void {
  if (
    !typeRefNeedsStrictTraversal(
      options.typeRef,
      options.context,
      options.position,
    )
  ) {
    return;
  }

  const resolved =
    options.typeRef.kind === "type"
      ? resolveNonTypeRef(options.typeRef, options.context, options.position)
      : options.typeRef;

  switch (resolved.kind) {
    case "object":
      g.line(
        `if err := ${options.sourceExpression}.validate(${options.pathExpression}); err != nil {`,
      );
      g.block(() => {
        g.line("return err");
      });
      g.line("}");
      return;
    case "array": {
      const itemTypeRef = getArrayItemTypeRef(resolved, options.position);
      const rangeSource = options.sourceIsPointer
        ? `*${options.sourceExpression}`
        : options.sourceExpression;
      const indexName = `vdlIndex${String(options.depth)}`;
      const itemName = `vdlItem${String(options.depth)}`;
      const itemPathName = `vdlItemPath${String(options.depth)}`;

      g.line(`for ${indexName}, ${itemName} := range ${rangeSource} {`);
      g.block(() => {
        renderIndexPathAssignment(
          g,
          itemPathName,
          options.pathExpression,
          indexName,
        );
        renderValidationForType(g, {
          ...options,
          depth: options.depth + 1,
          pathExpression: itemPathName,
          sourceExpression: itemName,
          sourceIsPointer: false,
          typeRef: itemTypeRef,
        });
      });
      g.line("}");
      return;
    }
    case "map": {
      const rangeSource = options.sourceIsPointer
        ? `*${options.sourceExpression}`
        : options.sourceExpression;
      const valueTypeRef = expectValue(
        resolved.mapType,
        "Encountered a map type reference without a value type.",
        options.position,
      );
      const keyName = `vdlKey${String(options.depth)}`;
      const valueName = `vdlValue${String(options.depth)}`;
      const valuePathName = `vdlValuePath${String(options.depth)}`;

      g.line(`for ${keyName}, ${valueName} := range ${rangeSource} {`);
      g.block(() => {
        renderMapKeyPathAssignment(
          g,
          valuePathName,
          options.pathExpression,
          keyName,
        );
        renderValidationForType(g, {
          ...options,
          depth: options.depth + 1,
          pathExpression: valuePathName,
          sourceExpression: valueName,
          sourceIsPointer: false,
          typeRef: valueTypeRef,
        });
      });
      g.line("}");
      return;
    }
    default:
      return;
  }
}

function renderFieldTransform(
  g: ReturnType<typeof newGenerator>,
  field: FieldDescriptor,
  context: GeneratorContext,
): void {
  const tempName = `trans${field.goName}`;
  const needsStrictTransform = typeRefNeedsStrictTraversal(
    field.def.typeRef,
    context,
    field.def.position,
  );

  g.line(`var ${tempName} ${field.goType}`);

  if (field.def.optional) {
    if (!needsStrictTransform) {
      g.line(`${tempName} = p.${field.goName}`);
      return;
    }

    const valueName = `value${field.goName}`;
    const valueType = renderGoType(
      field.def.typeRef,
      context,
      field.inlineTypeGoName,
      field.def.position,
    );

    g.line(`if p.${field.goName} != nil {`);
    g.block(() => {
      g.line(`var ${valueName} ${valueType}`);
      renderTransformIntoValue(g, {
        context,
        depth: 0,
        destinationExpression: valueName,
        destinationType: valueType,
        inlineTypeGoName: field.inlineTypeGoName,
        position: field.def.position,
        sourceExpression: `p.${field.goName}`,
        sourceIsPointer: true,
        typeRef: field.def.typeRef,
      });
      g.line(`${tempName} = &${valueName}`);
    });
    g.line("}");
    return;
  }

  renderTransformIntoValue(g, {
    context,
    depth: 0,
    destinationExpression: tempName,
    destinationType: field.goType,
    inlineTypeGoName: field.inlineTypeGoName,
    position: field.def.position,
    sourceExpression: `p.${field.goName}`,
    sourceIsPointer: true,
    typeRef: field.def.typeRef,
  });
}

function renderTransformIntoValue(
  g: ReturnType<typeof newGenerator>,
  options: {
    context: GeneratorContext;
    depth: number;
    destinationExpression: string;
    destinationType: string;
    inlineTypeGoName: string;
    position?: Position;
    sourceExpression: string;
    sourceIsPointer: boolean;
    typeRef: TypeRef;
  },
): void {
  if (
    !typeRefNeedsStrictTraversal(
      options.typeRef,
      options.context,
      options.position,
    )
  ) {
    const valueExpression = options.sourceIsPointer
      ? `*${options.sourceExpression}`
      : options.sourceExpression;
    g.line(`${options.destinationExpression} = ${valueExpression}`);
    return;
  }

  const resolved =
    options.typeRef.kind === "type"
      ? resolveNonTypeRef(options.typeRef, options.context, options.position)
      : options.typeRef;

  switch (resolved.kind) {
    case "object":
      g.line(
        `${options.destinationExpression} = ${options.destinationType}(${options.sourceExpression}.transform())`,
      );
      return;
    case "array":
      renderArrayTransformIntoValue(g, {
        ...options,
        typeRef: resolved,
      });
      return;
    case "map":
      renderMapTransformIntoValue(g, {
        ...options,
        typeRef: resolved,
      });
      return;
    default:
      return;
  }
}

function renderArrayTransformIntoValue(
  g: ReturnType<typeof newGenerator>,
  options: {
    context: GeneratorContext;
    depth: number;
    destinationExpression: string;
    destinationType: string;
    inlineTypeGoName: string;
    position?: Position;
    sourceExpression: string;
    sourceIsPointer: boolean;
    typeRef: TypeRef;
  },
): void {
  const itemTypeRef = getArrayItemTypeRef(options.typeRef, options.position);
  const rangeSource = options.sourceIsPointer
    ? `*${options.sourceExpression}`
    : options.sourceExpression;
  const itemDestinationType = renderGoType(
    itemTypeRef,
    options.context,
    options.inlineTypeGoName,
    options.position,
  );
  const indexName = `vdlIndex${String(options.depth)}`;
  const itemName = `vdlItem${String(options.depth)}`;
  const transformedName = `vdlTransformed${String(options.depth)}`;

  g.line(
    `${options.destinationExpression} = make(${options.destinationType}, len(${rangeSource}))`,
  );
  g.line(`for ${indexName}, ${itemName} := range ${rangeSource} {`);
  g.block(() => {
    if (
      !typeRefNeedsStrictTraversal(
        itemTypeRef,
        options.context,
        options.position,
      )
    ) {
      g.line(`${options.destinationExpression}[${indexName}] = ${itemName}`);
      return;
    }

    g.line(`var ${transformedName} ${itemDestinationType}`);
    renderTransformIntoValue(g, {
      ...options,
      depth: options.depth + 1,
      destinationExpression: transformedName,
      destinationType: itemDestinationType,
      sourceExpression: itemName,
      sourceIsPointer: false,
      typeRef: itemTypeRef,
    });
    g.line(
      `${options.destinationExpression}[${indexName}] = ${transformedName}`,
    );
  });
  g.line("}");
}

function renderMapTransformIntoValue(
  g: ReturnType<typeof newGenerator>,
  options: {
    context: GeneratorContext;
    depth: number;
    destinationExpression: string;
    destinationType: string;
    inlineTypeGoName: string;
    position?: Position;
    sourceExpression: string;
    sourceIsPointer: boolean;
    typeRef: TypeRef;
  },
): void {
  const rangeSource = options.sourceIsPointer
    ? `*${options.sourceExpression}`
    : options.sourceExpression;
  const valueTypeRef = expectValue(
    options.typeRef.mapType,
    "Encountered a map type reference without a value type.",
    options.position,
  );
  const valueDestinationType = renderGoType(
    valueTypeRef,
    options.context,
    options.inlineTypeGoName,
    options.position,
  );
  const keyName = `vdlKey${String(options.depth)}`;
  const valueName = `vdlValue${String(options.depth)}`;
  const transformedName = `vdlTransformed${String(options.depth)}`;

  g.line(
    `${options.destinationExpression} = make(${options.destinationType}, len(${rangeSource}))`,
  );
  g.line(`for ${keyName}, ${valueName} := range ${rangeSource} {`);
  g.block(() => {
    if (
      !typeRefNeedsStrictTraversal(
        valueTypeRef,
        options.context,
        options.position,
      )
    ) {
      g.line(`${options.destinationExpression}[${keyName}] = ${valueName}`);
      return;
    }

    g.line(`var ${transformedName} ${valueDestinationType}`);
    renderTransformIntoValue(g, {
      ...options,
      depth: options.depth + 1,
      destinationExpression: transformedName,
      destinationType: valueDestinationType,
      sourceExpression: valueName,
      sourceIsPointer: false,
      typeRef: valueTypeRef,
    });
    g.line(`${options.destinationExpression}[${keyName}] = ${transformedName}`);
  });
  g.line("}");
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
      return typeRefNeedsStrictTraversal(typeRef, context, position)
        ? "object"
        : undefined;
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

      return resolveStrictAliasBehavior(
        getReferencedTypeDef(typeName, context, position).typeRef,
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

function getReferencedTypeDef(
  typeName: string,
  context: GeneratorContext,
  position?: Position,
): TypeDef {
  return expectValue(
    context.typeDefsByVdlName.get(typeName),
    `Unknown VDL type reference ${JSON.stringify(typeName)}.`,
    position,
  );
}

function getTypeGoName(
  typeName: string,
  context: GeneratorContext,
  position?: Position,
): string {
  return expectValue(
    context.typeGoNamesByVdlName.get(typeName),
    `Unknown VDL type reference ${JSON.stringify(typeName)}.`,
    position,
  );
}

function getArrayItemTypeRef(typeRef: TypeRef, position?: Position): TypeRef {
  return (typeRef.arrayDims ?? 1) === 1
    ? expectValue(
        typeRef.arrayType,
        "Encountered an array type reference without an element type.",
        position,
      )
    : {
        kind: "array",
        arrayDims: (typeRef.arrayDims ?? 1) - 1,
        arrayType: expectValue(
          typeRef.arrayType,
          "Encountered an array type reference without an element type.",
          position,
        ),
      };
}

function toPreTypeName(goName: string): string {
  return `pre${goName}`;
}

function renderFieldPathAssignment(
  g: ReturnType<typeof newGenerator>,
  variableName: string,
  parentExpression: string,
  fieldName: string,
): void {
  g.line(`${variableName} := ${JSON.stringify(fieldName)}`);
  g.line(`if ${parentExpression} != "" {`);
  g.block(() => {
    g.line(
      `${variableName} = ${parentExpression} + ${JSON.stringify(`.${fieldName}`)}`,
    );
  });
  g.line("}");
}

function renderIndexPathAssignment(
  g: ReturnType<typeof newGenerator>,
  variableName: string,
  parentExpression: string,
  indexName: string,
): void {
  g.line(
    `${variableName} := fmt.Sprintf(${JSON.stringify("%s[%d]")}, ${parentExpression}, ${indexName})`,
  );
}

function renderMapKeyPathAssignment(
  g: ReturnType<typeof newGenerator>,
  variableName: string,
  parentExpression: string,
  keyName: string,
): void {
  g.line(
    `${variableName} := fmt.Sprintf(${JSON.stringify("%s[%q]")}, ${parentExpression}, ${keyName})`,
  );
}
