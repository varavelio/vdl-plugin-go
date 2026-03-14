import { type LiteralValue, unwrapLiteral } from "@varavel/vdl-plugin-sdk";

export function getLiteralValueKey(value: LiteralValue): string {
  return `${value.kind}:${JSON.stringify(unwrapLiteral(value))}`;
}
