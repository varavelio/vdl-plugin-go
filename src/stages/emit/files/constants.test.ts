import { irb } from "@varavel/vdl-plugin-sdk/testing";
import { describe, expect, it } from "vitest";
import { createGeneratorContext } from "../../model/build-context";
import { generateConstantsFile } from "./constants";

describe("generateConstantsFile", () => {
  it("returns undefined when constants are disabled or absent", () => {
    const empty = createGeneratorContext({
      schema: irb.schema(),
      generatorOptions: {
        packageName: "vdl",
        genConsts: true,
        genMeta: true,
        strict: true,
        genPointerUtils: true,
      },
    });
    const disabled = createGeneratorContext({
      schema: irb.schema({
        constants: [
          irb.constantDef(
            "apiVersion",
            irb.primitiveType("string"),
            irb.stringLiteral("1.0.0"),
          ),
        ],
      }),
      generatorOptions: {
        packageName: "vdl",
        genConsts: false,
        genMeta: true,
        strict: true,
        genPointerUtils: true,
      },
    });

    expect(generateConstantsFile(expectContext(empty.context))).toBeUndefined();
    expect(
      generateConstantsFile(expectContext(disabled.context)),
    ).toBeUndefined();
  });

  it("renders const and var declarations for mixed value shapes", () => {
    const result = createGeneratorContext({
      schema: irb.schema({
        enums: [
          irb.enumDef("Status", "string", [
            irb.enumMember("Active", irb.stringLiteral("active")),
          ]),
        ],
        types: [
          irb.typeDef("Tags", irb.arrayType(irb.primitiveType("string"))),
        ],
        constants: [
          irb.constantDef(
            "serviceName",
            irb.primitiveType("string"),
            irb.stringLiteral("billing"),
          ),
          irb.constantDef(
            "defaultStatus",
            irb.enumType("Status", "string"),
            irb.stringLiteral("active"),
          ),
          irb.constantDef(
            "defaultTags",
            irb.namedType("Tags"),
            irb.arrayLiteral([
              irb.stringLiteral("featured"),
              irb.stringLiteral("popular"),
            ]),
          ),
          irb.constantDef(
            "defaultConfig",
            irb.primitiveType("string"),
            irb.stringLiteral("noop"),
          ),
        ],
      }),
      generatorOptions: {
        packageName: "vdl",
        genConsts: true,
        genMeta: true,
        strict: true,
        genPointerUtils: true,
      },
    });

    const file = generateConstantsFile(expectContext(result.context));

    expect(file?.content).toContain('const ServiceName = "billing"');
    expect(file?.content).toContain("const DefaultStatus = StatusActive");
    expect(file?.content).toContain(
      'var DefaultTags = Tags{"featured", "popular"}',
    );
    expect(file?.content).toContain('const DefaultConfig = "noop"');
  });
});

function expectContext<T>(value: T | undefined): T {
  expect(value).toBeDefined();
  return value as T;
}
