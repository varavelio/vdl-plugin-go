import { irb } from "@varavel/vdl-plugin-sdk/testing";
import { describe, expect, it } from "vitest";
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
      irb.pluginInput({
        options: {
          package: "catalog",
        },
        ir: irb.schema({
          enums: [
            irb.enumDef(
              "OrderStatus",
              "string",
              [
                irb.enumMember("Pending", irb.stringLiteral("pending"), {
                  annotations: [
                    irb.annotation("label", irb.stringLiteral("Pending")),
                  ],
                }),
                irb.enumMember("Shipped", irb.stringLiteral("shipped"), {
                  annotations: [
                    irb.annotation(
                      "deprecated",
                      irb.stringLiteral("Use Delivered instead."),
                    ),
                  ],
                }),
              ],
              {
                annotations: [
                  irb.annotation(
                    "deprecated",
                    irb.stringLiteral("Use FulfillmentStatus instead."),
                  ),
                ],
              },
            ),
          ],
          types: [
            irb.typeDef("UserID", irb.primitiveType("string"), {
              annotations: [
                irb.annotation("format", irb.stringLiteral("uuid")),
              ],
            }),
            irb.typeDef("Labels", irb.mapType(irb.primitiveType("string"))),
            irb.typeDef(
              "Product",
              irb.objectType([
                irb.field("id", irb.namedType("UserID"), {
                  annotations: [
                    irb.annotation("format", irb.stringLiteral("uuid")),
                  ],
                }),
                irb.field("description", irb.primitiveType("string"), {
                  optional: true,
                  annotations: [irb.annotation("deprecated")],
                }),
                irb.field("status", irb.enumType("OrderStatus", "string")),
                irb.field(
                  "address",
                  irb.objectType([
                    irb.field("city", irb.primitiveType("string"), {
                      annotations: [
                        irb.annotation(
                          "deprecated",
                          irb.stringLiteral("Use locality instead."),
                        ),
                      ],
                    }),
                  ]),
                ),
              ]),
              {
                annotations: [
                  irb.annotation("resource", irb.stringLiteral("catalog")),
                ],
              },
            ),
            irb.typeDef("UserIDs", irb.arrayType(irb.namedType("UserID"))),
          ],
          constants: [
            irb.constantDef(
              "API_VERSION",
              irb.primitiveType("string"),
              irb.stringLiteral("1.0.0"),
            ),
            irb.constantDef(
              "DefaultUserID",
              irb.namedType("UserID"),
              irb.stringLiteral("user-1"),
            ),
            irb.constantDef(
              "DefaultStatus",
              irb.enumType("OrderStatus", "string"),
              irb.stringLiteral("pending"),
              {
                annotations: [
                  irb.annotation(
                    "deprecated",
                    irb.stringLiteral("Do not use this default."),
                  ),
                ],
              },
            ),
            irb.constantDef(
              "DefaultLabels",
              irb.namedType("Labels"),
              irb.objectLiteral({
                env: irb.stringLiteral("prod"),
                region: irb.stringLiteral("eu"),
              }),
            ),
            irb.constantDef(
              "DefaultProduct",
              irb.namedType("Product"),
              irb.objectLiteral({
                id: irb.stringLiteral("user-1"),
                description: irb.stringLiteral("Primary product"),
                status: irb.stringLiteral("pending"),
                address: irb.objectLiteral({
                  city: irb.stringLiteral("Madrid"),
                }),
              }),
              {
                annotations: [
                  irb.annotation(
                    "meta",
                    irb.objectLiteral({
                      scope: irb.stringLiteral("public"),
                    }),
                  ),
                ],
              },
            ),
            irb.constantDef(
              "DefaultIDs",
              irb.namedType("UserIDs"),
              irb.arrayLiteral([
                irb.stringLiteral("user-1"),
                irb.stringLiteral("user-2"),
              ]),
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
    expect(metadata).toContain('"deprecated": nil');
    expect(metadata).toContain(
      'AllByName: map[string][]any{"deprecated": []any{nil}}',
    );
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
      irb.pluginInput({
        ir: irb.schema({
          enums: [
            irb.enumDef("Priority", "int", [
              irb.enumMember("Low", {
                kind: "int",
                position: { file: "schema.vdl", line: 1, column: 1 },
                intValue: 1,
              }),
              irb.enumMember("High", {
                kind: "int",
                position: { file: "schema.vdl", line: 1, column: 1 },
                intValue: 2,
              }),
            ]),
          ],
          types: [
            irb.typeDef(
              "Timeline",
              irb.objectType([
                irb.field("createdAt", irb.primitiveType("datetime")),
                irb.field(
                  "events",
                  irb.arrayType(
                    irb.objectType([
                      irb.field("name", irb.primitiveType("string")),
                      irb.field("priority", irb.enumType("Priority", "int")),
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
      irb.pluginInput({
        options: {
          genConsts: "false",
        },
        ir: irb.schema({
          constants: [
            irb.constantDef("ANSWER", irb.primitiveType("int"), {
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
      irb.pluginInput({
        ir: irb.schema({
          constants: [
            irb.constantDef(
              "Ptr",
              irb.primitiveType("string"),
              irb.stringLiteral("oops"),
            ),
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
