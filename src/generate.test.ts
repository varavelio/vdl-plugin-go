import { describe, expect, it } from "vitest";
import {
  annotation,
  arrayLiteral,
  arrayType,
  constantDef,
  enumDef,
  enumMember,
  enumType,
  field,
  mapType,
  namedType,
  objectLiteral,
  objectType,
  pluginInput,
  primitiveType,
  schema,
  stringLiteral,
  typeDef,
} from "../tests/helpers/builders";
import { generatePluginOutput } from "./generate";

function fileContent(
  result: ReturnType<typeof generatePluginOutput>,
  path: string,
): string {
  const file = result.files?.find((entry) => entry.path === path);
  expect(file).toBeDefined();
  return file?.content ?? "";
}

describe("generatePluginOutput", () => {
  it("generates enums, named types, complex constants, metadata, and pointer helpers", () => {
    const result = generatePluginOutput(
      pluginInput({
        options: {
          package: "catalog",
        },
        ir: schema({
          enums: [
            enumDef(
              "OrderStatus",
              "string",
              [
                enumMember("Pending", stringLiteral("pending"), {
                  annotations: [annotation("label", stringLiteral("Pending"))],
                }),
                enumMember("Shipped", stringLiteral("shipped"), {
                  annotations: [
                    annotation(
                      "deprecated",
                      stringLiteral("Use Delivered instead."),
                    ),
                  ],
                }),
              ],
              {
                annotations: [
                  annotation(
                    "deprecated",
                    stringLiteral("Use FulfillmentStatus instead."),
                  ),
                ],
              },
            ),
          ],
          types: [
            typeDef("UserID", primitiveType("string"), {
              annotations: [annotation("format", stringLiteral("uuid"))],
            }),
            typeDef("Labels", mapType(primitiveType("string"))),
            typeDef(
              "Product",
              objectType([
                field("id", namedType("UserID"), {
                  annotations: [annotation("format", stringLiteral("uuid"))],
                }),
                field("description", primitiveType("string"), {
                  optional: true,
                  annotations: [annotation("deprecated")],
                }),
                field("status", enumType("OrderStatus", "string")),
                field(
                  "address",
                  objectType([
                    field("city", primitiveType("string"), {
                      annotations: [
                        annotation(
                          "deprecated",
                          stringLiteral("Use locality instead."),
                        ),
                      ],
                    }),
                  ]),
                ),
              ]),
              {
                annotations: [annotation("resource", stringLiteral("catalog"))],
              },
            ),
            typeDef("UserIDs", arrayType(namedType("UserID"))),
          ],
          constants: [
            constantDef(
              "API_VERSION",
              primitiveType("string"),
              stringLiteral("1.0.0"),
            ),
            constantDef(
              "DefaultUserID",
              namedType("UserID"),
              stringLiteral("user-1"),
            ),
            constantDef(
              "DefaultStatus",
              enumType("OrderStatus", "string"),
              stringLiteral("pending"),
              {
                annotations: [
                  annotation(
                    "deprecated",
                    stringLiteral("Do not use this default."),
                  ),
                ],
              },
            ),
            constantDef(
              "DefaultLabels",
              namedType("Labels"),
              objectLiteral({
                env: stringLiteral("prod"),
                region: stringLiteral("eu"),
              }),
            ),
            constantDef(
              "DefaultProduct",
              namedType("Product"),
              objectLiteral({
                id: stringLiteral("user-1"),
                description: stringLiteral("Primary product"),
                status: stringLiteral("pending"),
                address: objectLiteral({
                  city: stringLiteral("Madrid"),
                }),
              }),
              {
                annotations: [
                  annotation(
                    "meta",
                    objectLiteral({
                      scope: stringLiteral("public"),
                    }),
                  ),
                ],
              },
            ),
            constantDef(
              "DefaultIDs",
              namedType("UserIDs"),
              arrayLiteral([stringLiteral("user-1"), stringLiteral("user-2")]),
            ),
          ],
        }),
      }),
    );

    expect(result.errors).toBeUndefined();
    expect(result.files?.map((file) => file.path)).toEqual([
      "types.go",
      "constants.go",
      "metadata.go",
      "pointers.go",
    ]);

    const types = fileContent(result, "types.go");
    expect(types).toContain("package catalog");
    expect(types).toContain("type OrderStatus string");
    expect(types).toContain('OrderStatusPending OrderStatus = "pending"');
    expect(types).toContain("Deprecated: Use FulfillmentStatus instead.");
    expect(types).toContain("type UserID string");
    expect(types).toContain("type Labels map[string]string");
    expect(types).toContain("type Product struct");
    expect(types).toContain(
      'Description *string `json:"description,omitempty"`',
    );
    expect(types).toContain("type ProductAddress struct");
    expect(types).toContain("func (x *Product) GetDescription() string");
    expect(types).toContain("type UserIDs []UserID");

    const constants = fileContent(result, "constants.go");
    expect(constants).toContain('const API_VERSION = "1.0.0"');
    expect(constants).toContain('const DefaultUserID UserID = "user-1"');
    expect(constants).toContain("const DefaultStatus = OrderStatusPending");
    expect(constants).toContain(
      'var DefaultLabels = Labels{"env": "prod", "region": "eu"}',
    );
    expect(constants).toContain(
      'var DefaultProduct = Product{Id: UserID("user-1"), Description: Ptr("Primary product"), Status: OrderStatusPending, Address: ProductAddress{City: "Madrid"}}',
    );
    expect(constants).toContain(
      'var DefaultIDs = UserIDs{UserID("user-1"), UserID("user-2")}',
    );

    const metadata = fileContent(result, "metadata.go");
    expect(metadata).toContain("var VDLMetadata = SchemaMetadata{");
    expect(metadata).toContain('"Product": TypeMetadata');
    expect(metadata).toContain(
      'Annotations: AnnotationSet{List: []Annotation{Annotation{Name: "resource", Value: "catalog"}}',
    );
    expect(metadata).toContain('"Description": FieldMetadata');
    expect(metadata).toContain('"deprecated": []any{nil}');
    expect(metadata).toContain('"OrderStatus": EnumMetadata');
    expect(metadata).toContain('ConstName: "OrderStatusPending"');
    expect(metadata).toContain('"DefaultProduct": ConstantMetadata');
    expect(metadata).toContain('map[string]any{"scope": "public"}');

    const pointers = fileContent(result, "pointers.go");
    expect(pointers).toContain("func Ptr[T any](value T) *T {");
    expect(pointers).toContain("func Val[T any](pointer *T) T {");
    expect(pointers).toContain(
      "func Or[T any](pointer *T, defaultValue T) T {",
    );
  });

  it("supports inline object arrays, datetime fields, and int enums", () => {
    const result = generatePluginOutput(
      pluginInput({
        ir: schema({
          enums: [
            enumDef("Priority", "int", [
              enumMember("Low", {
                kind: "int",
                position: { file: "schema.vdl", line: 1, column: 1 },
                intValue: 1,
              }),
              enumMember("High", {
                kind: "int",
                position: { file: "schema.vdl", line: 1, column: 1 },
                intValue: 2,
              }),
            ]),
          ],
          types: [
            typeDef(
              "Timeline",
              objectType([
                field("createdAt", primitiveType("datetime")),
                field(
                  "events",
                  arrayType(
                    objectType([
                      field("name", primitiveType("string")),
                      field("priority", enumType("Priority", "int")),
                    ]),
                  ),
                ),
              ]),
            ),
          ],
        }),
      }),
    );

    const types = fileContent(result, "types.go");
    expect(types).toContain(
      'import (\n\t"encoding/json"\n\t"fmt"\n\t"time"\n)',
    );
    expect(types).toContain("type Priority int");
    expect(types).toContain('return fmt.Sprintf("Priority(%d)", e)');
    expect(types).toContain("CreatedAt time.Time");
    expect(types).toContain("Events []TimelineEvents");
    expect(types).toContain("type TimelineEvents struct");
  });

  it("omits constants.go when genConsts is disabled", () => {
    const result = generatePluginOutput(
      pluginInput({
        options: {
          genConsts: "false",
        },
        ir: schema({
          constants: [
            constantDef("ANSWER", primitiveType("int"), {
              kind: "int",
              position: { file: "schema.vdl", line: 1, column: 1 },
              intValue: 42,
            }),
          ],
        }),
      }),
    );

    expect(result.errors).toBeUndefined();
    expect(result.files?.some((file) => file.path === "constants.go")).toBe(
      false,
    );
    expect(result.files?.some((file) => file.path === "metadata.go")).toBe(
      true,
    );
  });

  it("returns an error when generated names collide with runtime helpers", () => {
    const result = generatePluginOutput(
      pluginInput({
        ir: schema({
          constants: [
            constantDef("Ptr", primitiveType("string"), stringLiteral("oops")),
          ],
        }),
      }),
    );

    expect(result.files).toBeUndefined();
    expect(result.errors).toHaveLength(1);
    expect(result.errors?.[0]?.message).toContain(
      "collides with generated runtime support symbol",
    );
  });
});
