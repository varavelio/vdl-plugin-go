import type { LiteralValue } from "@varavel/vdl-plugin-sdk";

/**
 * Renders a VDL literal value as a generic Go expression (`any`) for metadata.
 *
 * Unlike `renderTypedValueExpression`, this function renders values into a generic
 * Go representation (`[]any` for arrays, `map[string]any` for objects). This is used
 * primarily in the `metadata.go` file to represent annotation values and other
 * dynamic metadata that doesn't need strict typing at the Go level.
 *
 * @param value - The VDL literal value to render.
 * @returns A Go expression string representing the value as `any`.
 */
export function renderMetadataValueExpression(
  value: LiteralValue | undefined,
): string {
  if (!value) {
    return "nil";
  }

  switch (value.kind) {
    case "string":
      return JSON.stringify(value.stringValue);
    case "int":
      return String(value.intValue);
    case "float":
      return String(value.floatValue);
    case "bool":
      return String(value.boolValue);
    case "array":
      return `[]any{${(value.arrayItems ?? []).map((item) => renderMetadataValueExpression(item)).join(", ")}}`;
    case "object":
      return `map[string]any{${getLastObjectEntries(value.objectEntries ?? [])
        .map(
          (entry) =>
            `${JSON.stringify(entry.key)}: ${renderMetadataValueExpression(entry.value)}`,
        )
        .join(", ")}}`;
    default:
      return "nil";
  }
}

/**
 * Filters object literal entries to ensure only the last value for each key is kept.
 *
 * This implements "last-key-wins" semantics for metadata object literals,
 * mirroring how fields are handled in objects.
 *
 * @param entries - The original list of object literal entries.
 * @returns A list of unique entries where each key appears only once.
 */
function getLastObjectEntries(
  entries: NonNullable<LiteralValue["objectEntries"]>,
): NonNullable<LiteralValue["objectEntries"]> {
  const lastByKey = new Map<string, (typeof entries)[number]>();

  for (const entry of entries) {
    lastByKey.set(entry.key, entry);
  }

  return [...lastByKey.values()];
}
