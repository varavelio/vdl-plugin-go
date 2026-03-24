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
      strict: true,
      genPointerUtils: true,
    });
  });

  it("parses boolean options", () => {
    const result = resolveGeneratorOptions(
      irb.pluginInput({
        options: {
          package: "catalog",
          genConsts: "off",
          strict: "false",
          genPointerUtils: "false",
        },
      }),
    );

    expect(result.errors).toEqual([]);
    expect(result.options).toEqual({
      packageName: "catalog",
      genConsts: false,
      strict: false,
      genPointerUtils: false,
    });
  });

  it("falls back for invalid boolean strings", () => {
    const result = resolveGeneratorOptions(
      irb.pluginInput({
        options: {
          genConsts: "definitely",
          strict: "definitely",
          genPointerUtils: "definitely",
        },
      }),
    );

    expect(result.errors).toEqual([]);
    expect(result.options?.genConsts).toBe(true);
    expect(result.options?.strict).toBe(true);
    expect(result.options?.genPointerUtils).toBe(true);
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
