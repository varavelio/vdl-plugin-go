import { irb } from "@varavel/vdl-plugin-sdk/testing";
import { describe, expect, it } from "vitest";
import { createGeneratorContext } from "../context";
import { generateMetadataFile } from "./metadata";

describe("generateMetadataFile", () => {
  it("renders discoverable metadata helpers and repeated annotation indexes", () => {
    const result = createGeneratorContext({
      schema: irb.schema({
        enums: [
          irb.enumDef(
            "Status",
            "string",
            [
              irb.enumMember("Ready", irb.stringLiteral("ready"), {
                annotations: [
                  irb.annotation("label", irb.stringLiteral("Ready")),
                  irb.annotation("label", irb.stringLiteral("Operational")),
                ],
              }),
            ],
            {
              annotations: [irb.annotation("topic", irb.stringLiteral("ops"))],
            },
          ),
        ],
        types: [
          irb.typeDef(
            "Product",
            irb.objectType([
              irb.field("name", irb.primitiveType("string"), {
                annotations: [irb.annotation("searchable")],
              }),
            ]),
            {
              annotations: [
                irb.annotation("resource", irb.stringLiteral("catalog")),
              ],
            },
          ),
        ],
        constants: [
          irb.constantDef(
            "apiVersion",
            irb.primitiveType("string"),
            irb.stringLiteral("1.0.0"),
            {
              annotations: [irb.annotation("exposed")],
            },
          ),
        ],
      }),
      generatorOptions: {
        packageName: "vdl",
        genConsts: true,
      },
    });

    const file = generateMetadataFile(expectContext(result.context));

    expect(file.content).toContain(
      "func (a AnnotationSet) Has(name string) bool {",
    );
    expect(file.content).toContain(
      "func (m SchemaMetadata) Type(name string) (TypeMetadata, bool) {",
    );
    expect(file.content).toContain('"label": []any{"Ready", "Operational"}');
    expect(file.content).toContain('"searchable": []any{nil}');
    expect(file.content).toContain('"resource": []any{"catalog"}');
    expect(file.content).toContain('"ApiVersion": ConstantMetadata');
  });
});

function expectContext<T>(value: T | undefined): T {
  expect(value).toBeDefined();
  return value as T;
}
