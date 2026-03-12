import { describe, expect, it } from "vitest";
import {
  annotation,
  enumDef,
  enumMember,
  field,
  objectType,
  primitiveType,
  schema,
  stringLiteral,
  typeDef,
} from "../../tests/helpers/builders";
import { createGeneratorContext } from "../context";
import { generateTypesFile } from "./types";

describe("generateTypesFile", () => {
  it("returns undefined when there is nothing to generate", () => {
    const result = createGeneratorContext({
      schema: schema(),
      generatorOptions: {
        packageName: "vdl",
        genConsts: true,
      },
    });

    expect(generateTypesFile(expectContext(result.context))).toBeUndefined();
  });

  it("renders imports, docs, deprecated comments, and getters", () => {
    const result = createGeneratorContext({
      schema: schema({
        enums: [
          enumDef(
            "Priority",
            "int",
            [
              enumMember(
                "Low",
                {
                  kind: "int",
                  position: { file: "schema.vdl", line: 1, column: 1 },
                  intValue: 1,
                },
                {
                  doc: "Low priority.",
                  annotations: [
                    annotation(
                      "deprecated",
                      stringLiteral("Use Medium instead."),
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
        types: [
          typeDef(
            "Timeline",
            objectType([
              field("createdAt", primitiveType("datetime"), {
                doc: "Creation time.",
              }),
              field("note", primitiveType("string"), {
                optional: true,
              }),
            ]),
            {
              doc: "Timeline doc.",
            },
          ),
        ],
      }),
      generatorOptions: {
        packageName: "vdl",
        genConsts: true,
      },
    });

    const file = generateTypesFile(expectContext(result.context));

    expect(file?.content).toContain('"encoding/json"');
    expect(file?.content).toContain('"fmt"');
    expect(file?.content).toContain('"time"');
    expect(file?.content).toContain("// Priority enum.");
    expect(file?.content).toContain("// Low priority.");
    expect(file?.content).toContain("// Deprecated: Use Medium instead.");
    expect(file?.content).toContain("// Timeline doc.");
    expect(file?.content).toContain("CreatedAt time.Time");
    expect(file?.content).toContain(
      "func (x *Timeline) GetNoteOr(defaultValue string) string {",
    );
  });
});

function expectContext<T>(value: T | undefined): T {
  expect(value).toBeDefined();
  return value as T;
}
