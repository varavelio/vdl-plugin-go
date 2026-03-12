import { describe, expect, it } from "vitest";
import {
  annotation,
  constantDef,
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
import { generateMetadataFile } from "./metadata";

describe("generateMetadataFile", () => {
  it("renders discoverable metadata helpers and repeated annotation indexes", () => {
    const result = createGeneratorContext({
      schema: schema({
        enums: [
          enumDef(
            "Status",
            "string",
            [
              enumMember("Ready", stringLiteral("ready"), {
                annotations: [
                  annotation("label", stringLiteral("Ready")),
                  annotation("label", stringLiteral("Operational")),
                ],
              }),
            ],
            {
              annotations: [annotation("topic", stringLiteral("ops"))],
            },
          ),
        ],
        types: [
          typeDef(
            "Product",
            objectType([
              field("name", primitiveType("string"), {
                annotations: [annotation("searchable")],
              }),
            ]),
            {
              annotations: [annotation("resource", stringLiteral("catalog"))],
            },
          ),
        ],
        constants: [
          constantDef(
            "apiVersion",
            primitiveType("string"),
            stringLiteral("1.0.0"),
            {
              annotations: [annotation("exposed")],
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
