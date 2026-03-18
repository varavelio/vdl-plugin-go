import { irb } from "@varavel/vdl-plugin-sdk/testing";
import { describe, expect, it } from "vitest";
import { resolveGeneratorOptions } from "./resolve";

describe("options", () => {
  it("resolves defaults", () => {
    const result = resolveGeneratorOptions(irb.pluginInput());

    expect(result.errors).toEqual([]);
    expect(result.options).toEqual({
      packageName: "vdl",
      genConsts: true,
      genMeta: true,
      strict: true,
    });
  });

  it("parses boolean options", () => {
    const result = resolveGeneratorOptions(
      irb.pluginInput({
        options: {
          package: "catalog",
          genConsts: "off",
          genMeta: "off",
          strict: "false",
        },
      }),
    );

    expect(result.errors).toEqual([]);
    expect(result.options).toEqual({
      packageName: "catalog",
      genConsts: false,
      genMeta: false,
      strict: false,
    });
  });

  it("falls back for invalid boolean strings", () => {
    const result = resolveGeneratorOptions(
      irb.pluginInput({
        options: {
          genConsts: "definitely",
          genMeta: "definitely",
          strict: "definitely",
        },
      }),
    );

    expect(result.errors).toEqual([]);
    expect(result.options?.genConsts).toBe(true);
    expect(result.options?.genMeta).toBe(true);
    expect(result.options?.strict).toBe(true);
  });

  it("rejects an invalid Go package name", () => {
    const result = resolveGeneratorOptions(
      irb.pluginInput({
        options: {
          package: "NotValid",
        },
      }),
    );

    expect(result.options).toBeUndefined();
    expect(result.errors).toHaveLength(1);
    expect(result.errors[0]?.message).toContain("Invalid Go package name");
  });
});
