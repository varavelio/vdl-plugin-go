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
  primitiveType,
  schema,
  stringLiteral,
  typeDef,
} from "../tests/helpers/builders";
import { createGeneratorContext } from "./context";
import { GenerationError } from "./errors";
import {
  canEmitConst,
  renderConstInitializer,
  renderMetadataValueExpression,
  renderTypedValueExpression,
} from "./literal-renderer";

describe("literal-renderer", () => {
  it("renders primitive, enum, alias, map, array, and object values", () => {
    const context = buildContext();

    expect(
      renderConstInitializer(
        primitiveType("string"),
        stringLiteral("hello"),
        context,
      ),
    ).toBe('"hello"');
    expect(
      renderConstInitializer(
        enumType("OrderStatus", "string"),
        stringLiteral("pending"),
        context,
      ),
    ).toBe("OrderStatusPending");
    expect(canEmitConst(namedType("UserID"), context)).toBe(true);
    expect(canEmitConst(namedType("Product"), context)).toBe(false);

    expect(
      renderTypedValueExpression(
        namedType("Labels"),
        objectLiteral({ env: stringLiteral("prod") }),
        context,
      ),
    ).toBe('Labels{"env": "prod"}');
    expect(
      renderTypedValueExpression(
        namedType("UserIDs"),
        arrayLiteral([stringLiteral("user-1"), stringLiteral("user-2")]),
        context,
      ),
    ).toBe('UserIDs{UserID("user-1"), UserID("user-2")}');
    expect(
      renderTypedValueExpression(
        namedType("Product"),
        objectLiteral({
          id: stringLiteral("user-1"),
          status: stringLiteral("pending"),
          address: objectLiteral({ city: stringLiteral("Madrid") }),
          labels: objectLiteral({ env: stringLiteral("prod") }),
        }),
        context,
      ),
    ).toBe(
      'Product{Id: UserID("user-1"), Status: OrderStatusPending, Address: ProductAddress{City: "Madrid"}, Labels: Labels{"env": "prod"}}',
    );
  });

  it("uses the last object field occurrence for spread-resolved shapes", () => {
    const context = buildContext();
    const duplicateObjectType = objectType([
      field("value", primitiveType("string")),
      field("value", primitiveType("string"), { optional: true }),
    ]);
    const duplicateLiteral = {
      position: { file: "schema.vdl", line: 1, column: 1 },
      kind: "object" as const,
      objectEntries: [
        {
          position: { file: "schema.vdl", line: 1, column: 2 },
          key: "value",
          value: stringLiteral("first"),
        },
        {
          position: { file: "schema.vdl", line: 1, column: 3 },
          key: "value",
          value: stringLiteral("second"),
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
        objectLiteral({
          owner: stringLiteral("core"),
          tags: arrayLiteral([stringLiteral("a"), stringLiteral("b")]),
        }),
      ),
    ).toBe('map[string]any{"owner": "core", "tags": []any{"a", "b"}}');
  });

  it("throws a typed error for invalid enum literals", () => {
    const context = buildContext();

    expect(() =>
      renderTypedValueExpression(
        enumType("OrderStatus", "string"),
        stringLiteral("unknown"),
        context,
      ),
    ).toThrow(GenerationError);
  });
});

function buildContext() {
  const result = createGeneratorContext({
    schema: schema({
      enums: [
        enumDef("OrderStatus", "string", [
          enumMember("Pending", stringLiteral("pending"), {
            annotations: [annotation("label", stringLiteral("Pending"))],
          }),
          enumMember("Shipped", stringLiteral("shipped")),
        ]),
      ],
      types: [
        typeDef("UserID", primitiveType("string")),
        typeDef("UserIDs", arrayType(namedType("UserID"))),
        typeDef("Labels", mapType(primitiveType("string"))),
        typeDef(
          "Product",
          objectType([
            field("id", namedType("UserID")),
            field("status", enumType("OrderStatus", "string")),
            field(
              "address",
              objectType([field("city", primitiveType("string"))]),
            ),
            field("labels", namedType("Labels")),
          ]),
        ),
      ],
      constants: [
        constantDef(
          "apiVersion",
          primitiveType("string"),
          stringLiteral("1.0.0"),
        ),
      ],
    }),
    generatorOptions: {
      packageName: "vdl",
      genConsts: true,
    },
  });

  expect(result.errors).toEqual([]);
  expect(result.context).toBeDefined();
  return result.context as NonNullable<typeof result.context>;
}
