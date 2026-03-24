import type { Field, PluginOutputError } from "@varavel/vdl-plugin-sdk";
import { renderGoType } from "../../shared/go-types/render";
import { toGoFieldName, toInlineTypeName } from "../../shared/naming";
import type { FieldDescriptor, GeneratorContext } from "./types";

/**
 * Builds field descriptors for a Go struct, handling name collisions and type rendering.
 *
 * This function processes each field of an object to derive its Go name,
 * JSON tag name, and Go type expression. It also ensures that multiple VDL fields
 * don't map to the same exported Go field name after case normalization.
 *
 * @param options - The fields to process, the parent type name, and the generator context.
 * @returns A list of field descriptors and any encountered validation errors.
 */
export function buildFieldDescriptors(options: {
  parentGoName: string;
  fields: Field[];
  context: GeneratorContext;
}): { fields: FieldDescriptor[]; errors: PluginOutputError[] } {
  const errors: PluginOutputError[] = [];
  const usedGoNames = new Set<string>();
  const descriptors: FieldDescriptor[] = [];

  for (const field of options.fields) {
    const goName = toGoFieldName(field.name);

    if (usedGoNames.has(goName)) {
      errors.push({
        message: `Generated Go field ${JSON.stringify(goName)} collides within ${options.parentGoName}.`,
        position: field.position,
      });
      continue;
    }

    usedGoNames.add(goName);

    const inlineTypeGoName = toInlineTypeName(options.parentGoName, field.name);
    const goType = renderGoType(
      field.typeRef,
      options.context,
      inlineTypeGoName,
      field.position,
    );

    descriptors.push({
      def: field,
      goName,
      jsonName: field.name,
      goType: field.optional ? `*${goType}` : goType,
      inlineTypeGoName,
    });
  }

  return {
    fields: descriptors,
    errors,
  };
}
