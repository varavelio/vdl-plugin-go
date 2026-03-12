import type { Field } from "@varavel/vdl-plugin-sdk";

/**
 * Returns the effective field list for an object shape after spread expansion.
 *
 * VDL object literal spreads can produce duplicate keys in the resolved IR.
 * The last occurrence wins, which matches override semantics in the source.
 */
export function getEffectiveObjectFields(fields: Field[] | undefined): Field[] {
  if (!fields || fields.length === 0) {
    return [];
  }

  const lastIndexByName = new Map<string, number>();

  for (let index = 0; index < fields.length; index += 1) {
    lastIndexByName.set(fields[index]?.name ?? "", index);
  }

  return fields.filter(
    (field, index) => lastIndexByName.get(field.name) === index,
  );
}
