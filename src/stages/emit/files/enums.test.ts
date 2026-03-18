import { irb } from "@varavel/vdl-plugin-sdk/testing";
import { describe, expect, it } from "vitest";
import { createGeneratorContext } from "../../model/build-context";
import { generateEnumsFile } from "./enums";

describe("generateEnumsFile", () => {
  it("returns undefined when there are no enums", () => {
    const result = createGeneratorContext({
      schema: irb.schema(),
      generatorOptions: {
        packageName: "vdl",
        genConsts: true,
        strict: true,
      },
    });

    expect(generateEnumsFile(expectContext(result.context))).toBeUndefined();
  });

  it("renders enum docs, helpers, and strict JSON methods", () => {
    const result = createGeneratorContext({
      schema: irb.schema({
        enums: [
          irb.enumDef(
            "Priority",
            "int",
            [
              irb.enumMember(
                "Low",
                {
                  kind: "int",
                  position: { file: "schema.vdl", line: 1, column: 1 },
                  intValue: 1,
                },
                {
                  doc: "Low priority.",
                  annotations: [
                    irb.annotation(
                      "deprecated",
                      irb.stringLiteral("Use Medium instead."),
                    ),
                  ],
                },
              ),
            ],
            {
              doc: "Priority enum.",
            },
          ),
        ],
      }),
      generatorOptions: {
        packageName: "vdl",
        genConsts: true,
        strict: true,
      },
    });

    const file = generateEnumsFile(expectContext(result.context));

    expect(file?.content).toContain('"encoding/json"');
    expect(file?.content).toContain('"fmt"');
    expect(file?.content).toContain("// Priority enum.");
    expect(file?.content).toContain("// Low priority.");
    expect(file?.content).toContain("// Deprecated: Use Medium instead.");
    expect(file?.content).toContain("case PriorityLow:");
    expect(file?.content).toContain(
      "func (e Priority) MarshalJSON() ([]byte, error) {",
    );
    expect(file?.content).toContain(
      "func (e *Priority) UnmarshalJSON(data []byte) error {",
    );
  });

  it("omits enum JSON methods when strict mode is disabled", () => {
    const result = createGeneratorContext({
      schema: irb.schema({
        enums: [
          irb.enumDef("Status", "string", [
            irb.enumMember("Ready", irb.stringLiteral("ready")),
          ]),
        ],
      }),
      generatorOptions: {
        packageName: "vdl",
        genConsts: true,
        strict: false,
      },
    });

    const file = generateEnumsFile(expectContext(result.context));

    expect(file?.content).toContain("func (e Status) IsValid() bool {");
    expect(file?.content).not.toContain(
      "func (e Status) MarshalJSON() ([]byte, error) {",
    );
    expect(file?.content).not.toContain(
      "func (e *Status) UnmarshalJSON(data []byte) error {",
    );
  });
});

function expectContext<T>(value: T | undefined): T {
  expect(value).toBeDefined();
  return value as T;
}
