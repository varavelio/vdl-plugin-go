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
          irb.typeDef("$ConstapiVersion", irb.primitiveType("string")),
          irb.typeDef(
            "Product",
            irb.objectType([
              irb.field("name", irb.primitiveType("string"), {
                annotations: [irb.annotation("searchable")],
              }),
              irb.field(
                "variants",
                irb.arrayType(
                  irb.objectType([
                    irb.field("sku", irb.primitiveType("string"), {
                      annotations: [irb.annotation("sensitive")],
                    }),
                  ]),
                ),
              ),
            ]),
            {
              annotations: [
                irb.annotation("resource", irb.stringLiteral("catalog")),
              ],
            },
          ),
        ],
        constants: [
          irb.constantDef("apiVersion", irb.stringLiteral("1.0.0"), {
            annotations: [irb.annotation("exposed")],
          }),
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

    const file = generateMetadataFile(expectContext(result.context));
    expect(file).toBeDefined();
    const content = file?.content ?? "";

    expect(content).toContain(
      "func (a VDLAnnotationSet) Has(name string) bool {",
    );
    expect(content).toContain(
      "func (a VDLAnnotationSet) Get(name string) (any, bool) {",
    );
    expect(content).toContain(
      "func (r VDLTypeRef) GetField(name string) (VDLFieldMetadata, bool) {",
    );
    expect(content).toContain(
      "func (m VDLSchemaMetadata) GetType(name string) (VDLTypeMetadata, bool) {",
    );
    expect(content).toContain(
      "func (m VDLTypeMetadata) GetField(name string) (VDLFieldMetadata, bool) {",
    );
    expect(content).toContain(
      "func (m VDLSchemaMetadata) GetEnum(name string) (VDLEnumMetadata, bool) {",
    );
    expect(content).toContain(
      "func (m VDLEnumMetadata) GetMember(name string) (VDLEnumMemberMetadata, bool) {",
    );
    expect(content).toContain(
      "func (m VDLSchemaMetadata) GetConstant(name string) (VDLConstantMetadata, bool) {",
    );
    expect(content).toContain("type VDLTypeRef struct {");
    expect(content).toContain("Type VDLTypeRef");
    expect(content).toContain("Value any");
    expect(content).toContain("ByName map[string]any");
    expect(content).not.toContain("AllByName map[string][]any");
    expect(content).not.toContain("GetAll(name string)");
    expect(content).toContain('"Product": VDLTypeMetadata{');
    expect(content).toContain('"Name": VDLFieldMetadata{');
    expect(content).toContain('"Variants": VDLFieldMetadata{');
    expect(content).toContain("ArrayDims: 1");
    expect(content).toContain("Element: &VDLTypeRef{");
    expect(content).toContain('"Sku": VDLFieldMetadata{');
    expect(content).toContain('"Status": VDLEnumMetadata{');
    expect(content).toContain('"ApiVersion": VDLConstantMetadata{');
    expect(content).toContain("Annotations: VDLAnnotationSet{");
    expect(content).toContain("List: []VDLAnnotation{");
    expect(content).toContain("ByName: map[string]any{");
    expect(content).toContain('"label": "Operational"');
    expect(content).toContain('"searchable": nil');
    expect(content).toContain('"sensitive": nil');
    expect(content).toContain('"resource": "catalog"');
    expect(content).not.toContain(
      "type VDLEnumMetadata struct {\n\tName string\n\tType string",
    );
    expect(content).not.toContain(
      "type VDLConstantMetadata struct {\n\tName string\n\tType string",
    );
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
        genPointerUtils: true,
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
