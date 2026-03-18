import { irb } from "@varavel/vdl-plugin-sdk/testing";
import { describe, expect, it } from "vitest";
import { createGeneratorContext } from "../../model/build-context";
import { generateMetadataFile } from "./metadata";

describe("generateMetadataFile", () => {
  it("renders discoverable metadata helpers with readable literals", () => {
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
        genMeta: true,
        strict: true,
      },
    });

    const file = generateMetadataFile(expectContext(result.context));
    expect(file).toBeDefined();
    const content = file?.content ?? "";

    expect(content).toContain("func (a AnnotationSet) Has(name string) bool {");
    expect(content).toContain(
      "func (a AnnotationSet) Get(name string) (any, bool) {",
    );
    expect(content).toContain(
      "func (m SchemaMetadata) GetType(name string) (TypeMetadata, bool) {",
    );
    expect(content).toContain(
      "func (m SchemaMetadata) GetEnum(name string) (EnumMetadata, bool) {",
    );
    expect(content).toContain(
      "func (m SchemaMetadata) GetConstant(name string) (ConstantMetadata, bool) {",
    );
    expect(content).toContain("Type string");
    expect(content).toContain("Value any");
    expect(content).toContain("ByName map[string]any");
    expect(content).not.toContain("AllByName map[string][]any");
    expect(content).not.toContain("GetAll(name string)");
    expect(content).toContain('"Product": TypeMetadata{');
    expect(content).toContain('"Name": FieldMetadata{');
    expect(content).toContain('"Status": EnumMetadata{');
    expect(content).toContain('"ApiVersion": ConstantMetadata{');
    expect(content).toContain('"label": "Operational"');
    expect(content).toContain('"searchable": nil');
    expect(content).toContain('"resource": "catalog"');
    expect(content).not.toContain("VDLName string");
    expect(content).not.toContain("GoType string");
    expect(content).not.toContain("Path string");
  });

  it("omits metadata.go when genMeta is disabled", () => {
    const result = createGeneratorContext({
      schema: irb.schema({
        types: [
          irb.typeDef(
            "Product",
            irb.objectType([irb.field("name", irb.primitiveType("string"))]),
          ),
        ],
      }),
      generatorOptions: {
        packageName: "vdl",
        genConsts: true,
        genMeta: false,
        strict: true,
      },
    });

    const file = generateMetadataFile(expectContext(result.context));
    expect(file).toBeUndefined();
  });
});

function expectContext<T>(value: T | undefined): T {
  expect(value).toBeDefined();
  return value as T;
}
