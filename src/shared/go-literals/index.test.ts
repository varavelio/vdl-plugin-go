import { irb } from "@varavel/vdl-plugin-sdk/testing";
import { describe, expect, it } from "vitest";
import { createGeneratorContext } from "../../stages/model/build-context";
import { GenerationError } from "../errors";
import {
  canEmitConst,
  renderConstInitializer,
  renderMetadataValueExpression,
  renderTypedValueExpression,
} from "./index";

describe("literal-renderer", () => {
  it("renders primitive, enum, alias, map, array, and object values", () => {
    const context = buildContext();

    expect(
      renderConstInitializer(
        irb.primitiveType("string"),
        irb.stringLiteral("hello"),
        context,
      ),
    ).toBe('"hello"');
    expect(
      renderConstInitializer(
        irb.enumType("OrderStatus", "string"),
        irb.stringLiteral("pending"),
        context,
      ),
    ).toBe("OrderStatusPending");
    expect(canEmitConst(irb.namedType("UserID"), context)).toBe(true);
    expect(canEmitConst(irb.namedType("Product"), context)).toBe(false);

    expect(
      renderTypedValueExpression(
        irb.namedType("Labels"),
        irb.objectLiteral({ env: irb.stringLiteral("prod") }),
        context,
      ),
    ).toBe('Labels{"env": "prod"}');
    expect(
      renderTypedValueExpression(
        irb.namedType("UserIDs"),
        irb.arrayLiteral([
          irb.stringLiteral("user-1"),
          irb.stringLiteral("user-2"),
        ]),
        context,
      ),
    ).toBe('UserIDs{UserId("user-1"), UserId("user-2")}');
    expect(
      renderTypedValueExpression(
        irb.namedType("Product"),
        irb.objectLiteral({
          id: irb.stringLiteral("user-1"),
          status: irb.stringLiteral("pending"),
          address: irb.objectLiteral({ city: irb.stringLiteral("Madrid") }),
          labels: irb.objectLiteral({ env: irb.stringLiteral("prod") }),
        }),
        context,
      ),
    ).toBe(
      'Product{Id: UserId("user-1"), Status: OrderStatusPending, Address: ProductAddress{City: "Madrid"}, Labels: Labels{"env": "prod"}}',
    );
  });

  it("uses the last object field occurrence for spread-resolved shapes", () => {
    const context = buildContext();
    const duplicateObjectType = irb.objectType([
      irb.field("value", irb.primitiveType("string")),
      irb.field("value", irb.primitiveType("string"), { optional: true }),
    ]);
    const duplicateLiteral = {
      position: { file: "schema.vdl", line: 1, column: 1 },
      kind: "object" as const,
      objectEntries: [
        {
          position: { file: "schema.vdl", line: 1, column: 2 },
          key: "value",
          value: irb.stringLiteral("first"),
        },
        {
          position: { file: "schema.vdl", line: 1, column: 3 },
          key: "value",
          value: irb.stringLiteral("second"),
        },
      ],
    };

    expect(
      renderTypedValueExpression(
        duplicateObjectType,
        duplicateLiteral,
        context,
        undefined,
        "Wrapped",
      ),
    ).toBe('Wrapped{Value: Ptr("second")}');
  });

  it("renders metadata values for nested arrays and objects", () => {
    expect(
      renderMetadataValueExpression(
        irb.objectLiteral({
          owner: irb.stringLiteral("core"),
          tags: irb.arrayLiteral([
            irb.stringLiteral("a"),
            irb.stringLiteral("b"),
          ]),
        }),
      ),
    ).toBe('map[string]any{"owner": "core", "tags": []any{"a", "b"}}');
  });

  it("uses the last object entry for metadata values", () => {
    expect(
      renderMetadataValueExpression({
        kind: "object",
        position: { file: "schema.vdl", line: 1, column: 1 },
        objectEntries: [
          {
            key: "region",
            value: irb.stringLiteral("eu"),
            position: { file: "schema.vdl", line: 1, column: 2 },
          },
          {
            key: "region",
            value: irb.stringLiteral("us"),
            position: { file: "schema.vdl", line: 1, column: 3 },
          },
        ],
      }),
    ).toBe('map[string]any{"region": "us"}');
  });

  it("throws a typed error for invalid enum literals", () => {
    const context = buildContext();

    expect(() =>
      renderTypedValueExpression(
        irb.enumType("OrderStatus", "string"),
        irb.stringLiteral("unknown"),
        context,
      ),
    ).toThrow(GenerationError);
  });
});

function buildContext() {
  const result = createGeneratorContext({
    schema: irb.schema({
      enums: [
        irb.enumDef("OrderStatus", "string", [
          irb.enumMember("Pending", irb.stringLiteral("pending"), {
            annotations: [
              irb.annotation("label", irb.stringLiteral("Pending")),
            ],
          }),
          irb.enumMember("Shipped", irb.stringLiteral("shipped")),
        ]),
      ],
      types: [
        irb.typeDef("UserID", irb.primitiveType("string")),
        irb.typeDef("UserIDs", irb.arrayType(irb.namedType("UserID"))),
        irb.typeDef("Labels", irb.mapType(irb.primitiveType("string"))),
        irb.typeDef(
          "Product",
          irb.objectType([
            irb.field("id", irb.namedType("UserID")),
            irb.field("status", irb.enumType("OrderStatus", "string")),
            irb.field(
              "address",
              irb.objectType([irb.field("city", irb.primitiveType("string"))]),
            ),
            irb.field("labels", irb.namedType("Labels")),
          ]),
        ),
      ],
      constants: [
        irb.constantDef(
          "apiVersion",
          irb.primitiveType("string"),
          irb.stringLiteral("1.0.0"),
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

  expect(result.errors).toEqual([]);
  expect(result.context).toBeDefined();
  return result.context as NonNullable<typeof result.context>;
}
