import * as irb from "@varavel/vdl-plugin-sdk/testing";
import { describe, expect, it } from "vitest";
import { createGeneratorContext } from "../../model/build-context";
import { generateTypesFile } from "./types";

describe("generateTypesFile", () => {
  it("returns undefined when there is nothing to generate", () => {
    const result = createGeneratorContext({
      schema: irb.schema(),
      generatorOptions: {
        packageName: "vdl",
        genConsts: true,
        strict: true,
        genPointerUtils: true,
      },
    });

    expect(generateTypesFile(expectContext(result.context))).toBeUndefined();
  });

  it("renders imports, docs, deprecated comments, and getters", () => {
    const result = createGeneratorContext({
      schema: irb.schema({
        types: [
          irb.typeDef(
            "Timeline",
            irb.objectType([
              irb.field("createdAt", irb.primitiveType("datetime"), {
                doc: "Creation time.",
              }),
              irb.field("note", irb.primitiveType("string"), {
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
        strict: true,
        genPointerUtils: true,
      },
    });

    const file = generateTypesFile(expectContext(result.context));

    expect(file?.content).toContain('"encoding/json"');
    expect(file?.content).toContain('"fmt"');
    expect(file?.content).toContain('"time"');
    expect(file?.content).toContain("// Timeline doc.");
    expect(file?.content).toContain("CreatedAt time.Time");
    expect(file?.content).toContain(
      "func (x *Timeline) GetNoteOr(defaultValue string) string {",
    );
    expect(file?.content).toContain(
      "// GetNoteOr returns the Note field. It returns defaultValue when the receiver or field is nil.",
    );
  });

  it("renders strict object unmarshal helpers", () => {
    const result = createGeneratorContext({
      schema: irb.schema({
        enums: [
          irb.enumDef("Status", "string", [
            irb.enumMember("Ready", irb.stringLiteral("ready")),
          ]),
        ],
        types: [
          irb.typeDef(
            "Payload",
            irb.objectType([
              irb.field("name", irb.primitiveType("string")),
              irb.field("status", irb.enumType("Status", "string")),
              irb.field(
                "items",
                irb.arrayType(
                  irb.objectType([
                    irb.field("id", irb.primitiveType("string")),
                  ]),
                ),
              ),
            ]),
          ),
        ],
      }),
      generatorOptions: {
        packageName: "vdl",
        genConsts: true,
        strict: true,
        genPointerUtils: true,
      },
    });

    const file = generateTypesFile(expectContext(result.context));

    expect(file?.content).toContain("type prePayload struct {");
    expect(file?.content).toContain('Status *Status `json:"status"`');
    expect(file?.content).toContain('Items *[]prePayloadItems `json:"items"`');
    expect(file?.content).not.toContain("func vdlJoinFieldPath(");
    expect(file?.content).not.toContain("func vdlJoinIndexPath(");
    expect(file?.content).not.toContain("func vdlJoinMapKeyPath(");
    expect(file?.content).toContain(
      "func (x *Payload) UnmarshalJSON(data []byte) error {",
    );
    expect(file?.content).toContain(
      "func (p *prePayload) validate(parentPath string) error {",
    );
    expect(file?.content).toContain(
      'return fmt.Errorf("field %s is required", vdlPathItems)',
    );
    expect(file?.content).toContain(
      "if err := vdlItem0.validate(vdlItemPath0); err != nil {",
    );
    expect(file?.content).toContain(
      "vdlTransformed0 = PayloadItems(vdlItem0.transform())",
    );
    expect(file?.content).not.toContain(
      "func (x Payload) ValidateSchema() error {",
    );
    expect(file?.content).not.toContain(
      "func (x Payload) MarshalJSON() ([]byte, error) {",
    );
  });

  it("does not emit useless object validation methods", () => {
    const result = createGeneratorContext({
      schema: irb.schema({
        types: [
          irb.typeDef(
            "Primitives",
            irb.objectType([
              irb.field("text", irb.primitiveType("string")),
              irb.field("optText", irb.primitiveType("string"), {
                optional: true,
              }),
            ]),
          ),
        ],
      }),
      generatorOptions: {
        packageName: "vdl",
        genConsts: true,
        strict: true,
        genPointerUtils: true,
      },
    });

    const file = generateTypesFile(expectContext(result.context));

    expect(file?.content).not.toContain(
      "func (x Primitives) ValidateSchema() error {",
    );
    expect(file?.content).not.toContain(
      "func (x Primitives) MarshalJSON() ([]byte, error) {",
    );
  });

  it("omits strict helpers when strict mode is disabled", () => {
    const result = createGeneratorContext({
      schema: irb.schema({
        enums: [
          irb.enumDef("Status", "string", [
            irb.enumMember("Ready", irb.stringLiteral("ready")),
          ]),
        ],
        types: [
          irb.typeDef(
            "Payload",
            irb.objectType([irb.field("name", irb.primitiveType("string"))]),
          ),
        ],
      }),
      generatorOptions: {
        packageName: "vdl",
        genConsts: true,
        strict: false,
        genPointerUtils: true,
      },
    });

    const file = generateTypesFile(expectContext(result.context));

    expect(file?.content).not.toContain("type prePayload struct {");
    expect(file?.content).not.toContain(
      "func (x *Payload) UnmarshalJSON(data []byte) error {",
    );
    expect(file?.content).not.toContain(
      "func (e Status) MarshalJSON() ([]byte, error) {",
    );
    expect(file?.content).not.toContain(
      "func (e *Status) UnmarshalJSON(data []byte) error {",
    );
    expect(file?.content).toContain("func (x *Payload) GetName() string {");
  });
});

function expectContext<T>(value: T | undefined): T {
  expect(value).toBeDefined();
  return value as T;
}
