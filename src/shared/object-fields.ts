import type { Field } from "@varavel/vdl-plugin-sdk";

export function getEffectiveObjectFields(fields: Field[] = []): Field[] {
  const lastIndexByName = new Map(
    fields.map((field, index) => [field.name, index]),
  );

  return fields.filter(
    (field, index) => lastIndexByName.get(field.name) === index,
  );
}
