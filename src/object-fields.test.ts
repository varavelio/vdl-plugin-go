import { irb } from "@varavel/vdl-plugin-sdk/testing";
import { describe, expect, it } from "vitest";
import { getEffectiveObjectFields } from "./object-fields";

describe("object-fields", () => {
  it("keeps only the last occurrence of duplicate field names", () => {
    const fields = getEffectiveObjectFields([
      irb.field("host", irb.primitiveType("string")),
      irb.field("port", irb.primitiveType("int")),
      irb.field("port", irb.primitiveType("int"), { optional: true }),
    ]);

    expect(fields.map((fieldDescriptor) => fieldDescriptor.name)).toEqual([
      "host",
      "port",
    ]);
    expect(fields[1]?.optional).toBe(true);
  });
});
