import type { LiteralValue } from "@varavel/vdl-plugin-sdk";
import { ir } from "@varavel/vdl-plugin-sdk/utils";

export function getLiteralValueKey(value: LiteralValue): string {
  return `${value.kind}:${JSON.stringify(ir.unwrapLiteral(value))}`;
}
