import { describe, expect, it } from "vitest";
import {
  arrayLiteral,
  arrayType,
  constantDef,
  enumDef,
  enumMember,
  enumType,
  namedType,
  primitiveType,
  schema,
  stringLiteral,
  typeDef,
} from "../../tests/helpers/builders";
import { createGeneratorContext } from "../context";
import { generateConstantsFile } from "./constants";

describe("generateConstantsFile", () => {
  it("returns undefined when constants are disabled or absent", () => {
    const empty = createGeneratorContext({
      schema: schema(),
      generatorOptions: {
        packageName: "vdl",
        genConsts: true,
      },
    });
    const disabled = createGeneratorContext({
      schema: schema({
        constants: [
          constantDef(
            "apiVersion",
            primitiveType("string"),
            stringLiteral("1.0.0"),
          ),
        ],
      }),
      generatorOptions: {
        packageName: "vdl",
        genConsts: false,
      },
    });

    expect(generateConstantsFile(expectContext(empty.context))).toBeUndefined();
    expect(
      generateConstantsFile(expectContext(disabled.context)),
    ).toBeUndefined();
  });

  it("renders const and var declarations for mixed value shapes", () => {
    const result = createGeneratorContext({
      schema: schema({
        enums: [
          enumDef("Status", "string", [
            enumMember("Active", stringLiteral("active")),
          ]),
        ],
        types: [typeDef("Tags", arrayType(primitiveType("string")))],
        constants: [
          constantDef(
            "serviceName",
            primitiveType("string"),
            stringLiteral("billing"),
          ),
          constantDef(
            "defaultStatus",
            enumType("Status", "string"),
            stringLiteral("active"),
          ),
          constantDef(
            "defaultTags",
            namedType("Tags"),
            arrayLiteral([stringLiteral("featured"), stringLiteral("popular")]),
          ),
          constantDef(
            "defaultConfig",
            primitiveType("string"),
            stringLiteral("noop"),
          ),
        ],
      }),
      generatorOptions: {
        packageName: "vdl",
        genConsts: true,
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
