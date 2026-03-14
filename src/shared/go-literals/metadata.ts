import type { LiteralValue } from "@varavel/vdl-plugin-sdk";

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
      return `map[string]any{${(value.objectEntries ?? [])
        .map(
          (entry) =>
            `${JSON.stringify(entry.key)}: ${renderMetadataValueExpression(entry.value)}`,
        )
        .join(", ")}}`;
    default:
      return "nil";
  }
}
