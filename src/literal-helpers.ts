import { type LiteralValue, unwrapLiteral } from "@varavel/vdl-plugin-sdk";

/**
 * Produces a deterministic comparison key for a literal value.
 */
export function getLiteralValueKey(value: LiteralValue): string {
  return `${value.kind}:${JSON.stringify(unwrapLiteral(value))}`;
}
