import type { newGenerator } from "@varavel/gen";
import type { TypeRef } from "@varavel/vdl-plugin-sdk";
import { expectValue, fail } from "../../../shared/errors";
import { toGoFieldName, toGoJsonName } from "../../../shared/naming";
import { getEffectiveObjectFields } from "../../../shared/object-fields";
import type { GeneratorContext } from "../../model/types";
import { writeAnnotationSetField } from "./metadata-annotations";

export function writeMetadataTypeField(
  g: ReturnType<typeof newGenerator>,
  typeRef: TypeRef,
  context: GeneratorContext,
): void {
  g.line("Type: VDLTypeRef{");
  g.block(() => {
    writeMetadataTypeRefBody(g, typeRef, context);
  });
  g.line("},");
}

function writeMetadataTypeRefBody(
  g: ReturnType<typeof newGenerator>,
  typeRef: TypeRef,
  context: GeneratorContext,
): void {
  g.line(`Kind: ${JSON.stringify(typeRef.kind)},`);

  switch (typeRef.kind) {
    case "primitive":
      g.line(
        `Name: ${JSON.stringify(
          expectValue(
            typeRef.primitiveName,
            "Encountered a primitive type reference without a primitive name.",
          ),
        )},`,
      );
      return;
    case "type": {
      const typeName = expectValue(
        typeRef.typeName,
        "Encountered a named type reference without a type name.",
      );

      g.line(
        `Name: ${JSON.stringify(
          expectValue(
            context.typeGoNamesByVdlName.get(typeName),
            `Unknown VDL type reference ${JSON.stringify(typeName)}.`,
          ),
        )},`,
      );
      return;
    }
    case "enum": {
      const enumName = expectValue(
        typeRef.enumName,
        "Encountered an enum reference without an enum name.",
      );

      g.line(
        `Name: ${JSON.stringify(
          expectValue(
            context.enumGoNamesByVdlName.get(enumName),
            `Unknown VDL enum reference ${JSON.stringify(enumName)}.`,
          ),
        )},`,
      );
      return;
    }
    case "array": {
      g.line(`ArrayDims: ${String(typeRef.arrayDims ?? 1)},`);
      g.line("Element: &VDLTypeRef{");
      g.block(() => {
        writeMetadataTypeRefBody(
          g,
          expectValue(
            typeRef.arrayType,
            "Encountered an array type reference without an element type.",
          ),
          context,
        );
      });
      g.line("},");
      return;
    }
    case "map": {
      g.line("Element: &VDLTypeRef{");
      g.block(() => {
        writeMetadataTypeRefBody(
          g,
          expectValue(
            typeRef.mapType,
            "Encountered a map type reference without a value type.",
          ),
          context,
        );
      });
      g.line("},");
      return;
    }
    case "object": {
      const fields = getEffectiveObjectFields(typeRef.objectFields);

      if (fields.length === 0) {
        g.line("Fields: nil,");
        return;
      }

      g.line("Fields: map[string]VDLFieldMetadata{");
      g.block(() => {
        for (const field of fields) {
          writeMetadataFieldEntry(g, field, context);
        }
      });
      g.line("},");
      return;
    }
    default:
      fail(`Unsupported VDL type kind ${JSON.stringify(typeRef.kind)}.`);
  }
}

function writeMetadataFieldEntry(
  g: ReturnType<typeof newGenerator>,
  field: NonNullable<TypeRef["objectFields"]>[number],
  context: GeneratorContext,
): void {
  const goName = toGoFieldName(field.name);

  g.line(`${JSON.stringify(goName)}: VDLFieldMetadata{`);
  g.block(() => {
    g.line(`Name: ${JSON.stringify(goName)},`);
    g.line(`JSONName: ${JSON.stringify(toGoJsonName(field.name))},`);
    g.line(`Optional: ${String(field.optional)},`);
    writeMetadataTypeField(g, field.typeRef, context);
    writeAnnotationSetField(g, field.annotations);
  });
  g.line("},");
}
