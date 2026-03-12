import { describe, expect, it } from "vitest";
import { field, primitiveType } from "../tests/helpers/builders";
import { getEffectiveObjectFields } from "./object-fields";

describe("object-fields", () => {
  it("keeps only the last occurrence of duplicate field names", () => {
    const fields = getEffectiveObjectFields([
      field("host", primitiveType("string")),
      field("port", primitiveType("int")),
      field("port", primitiveType("int"), { optional: true }),
    ]);

    expect(fields.map((fieldDescriptor) => fieldDescriptor.name)).toEqual([
      "host",
      "port",
    ]);
    expect(fields[1]?.optional).toBe(true);
  });
});
