import { describe, expect, it } from "vitest";
import {
  arrayType,
  enumDef,
  enumMember,
  enumType,
  field,
  mapType,
  namedType,
  objectType,
  primitiveType,
  schema,
  stringLiteral,
  typeDef,
} from "../tests/helpers/builders";
import { createGeneratorContext } from "./context";
import { ImportSet } from "./imports";
import {
  collectImportsForTypeRef,
  isConstEligibleType,
  renderAnonymousGoTypeExpression,
  renderGoType,
} from "./type-ref";

describe("type-ref", () => {
  it("renders named, array, map, and inline object types", () => {
    const result = createGeneratorContext({
      schema: schema({
        enums: [
          enumDef("OrderStatus", "string", [
            enumMember("Pending", stringLiteral("pending")),
          ]),
        ],
        types: [typeDef("UserID", primitiveType("string"))],
      }),
      generatorOptions: {
        packageName: "vdl",
        genConsts: true,
      },
    });

    const context = expectContext(result.context);

    expect(renderGoType(primitiveType("string"), context, undefined)).toBe(
      "string",
    );
    expect(renderGoType(namedType("UserID"), context, undefined)).toBe(
      "UserID",
    );
    expect(
      renderGoType(enumType("OrderStatus", "string"), context, undefined),
    ).toBe("OrderStatus");
    expect(
      renderGoType(arrayType(primitiveType("int"), 2), context, undefined),
    ).toBe("[][]int64");
    expect(renderGoType(mapType(namedType("UserID")), context, undefined)).toBe(
      "map[string]UserID",
    );
    expect(
      renderGoType(
        objectType([field("city", primitiveType("string"))]),
        context,
        "UserAddress",
      ),
    ).toBe("UserAddress");
  });

  it("renders anonymous object expressions for composite literals", () => {
    const result = createGeneratorContext({
      schema: schema(),
      generatorOptions: {
        packageName: "vdl",
        genConsts: true,
      },
    });

    const object = objectType([
      field("city", primitiveType("string")),
      field("primary", primitiveType("bool"), { optional: true }),
    ]);

    expect(
      renderAnonymousGoTypeExpression(
        object,
        expectContext(result.context),
        undefined,
      ),
    ).toBe("struct { City string; Primary *bool }");
    expect(
      renderAnonymousGoTypeExpression(
        object,
        expectContext(result.context),
        undefined,
        "Location",
      ),
    ).toBe("Location");
  });

  it("collects imports for nested datetime references", () => {
    const imports = new ImportSet();

    collectImportsForTypeRef(
      objectType([
        field("createdAt", primitiveType("datetime")),
        field("history", arrayType(mapType(primitiveType("datetime")), 2)),
      ]),
      imports,
    );

    expect(imports.toArray()).toEqual(["time"]);
  });

  it("knows which types can be emitted as Go const declarations", () => {
    const result = createGeneratorContext({
      schema: schema({
        enums: [
          enumDef("Priority", "int", [
            enumMember("High", {
              kind: "int",
              position: { file: "schema.vdl", line: 1, column: 1 },
              intValue: 1,
            }),
          ]),
        ],
      }),
      generatorOptions: {
        packageName: "vdl",
        genConsts: true,
      },
    });

    const context = expectContext(result.context);

    expect(isConstEligibleType(primitiveType("string"), context)).toBe(true);
    expect(isConstEligibleType(primitiveType("datetime"), context)).toBe(false);
    expect(isConstEligibleType(enumType("Priority", "int"), context)).toBe(
      true,
    );
    expect(
      isConstEligibleType(arrayType(primitiveType("string")), context),
    ).toBe(false);
  });
});

function expectContext<T>(value: T | undefined): T {
  expect(value).toBeDefined();
  return value as T;
}
