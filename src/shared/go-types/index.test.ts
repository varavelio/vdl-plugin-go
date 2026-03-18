import { irb } from "@varavel/vdl-plugin-sdk/testing";
import { describe, expect, it } from "vitest";
import { createGeneratorContext } from "../../stages/model/build-context";
import { ImportSet } from "../render/imports";
import {
  collectImportsForTypeRef,
  isConstEligibleType,
  renderAnonymousGoTypeExpression,
  renderGoType,
} from "./index";

describe("type-ref", () => {
  it("renders named, array, map, and inline object types", () => {
    const result = createGeneratorContext({
      schema: irb.schema({
        enums: [
          irb.enumDef("OrderStatus", "string", [
            irb.enumMember("Pending", irb.stringLiteral("pending")),
          ]),
        ],
        types: [irb.typeDef("UserID", irb.primitiveType("string"))],
      }),
      generatorOptions: {
        packageName: "vdl",
        genConsts: true,
        strict: true,
      },
    });

    const context = expectContext(result.context);

    expect(renderGoType(irb.primitiveType("string"), context, undefined)).toBe(
      "string",
    );
    expect(renderGoType(irb.namedType("UserID"), context, undefined)).toBe(
      "UserId",
    );
    expect(
      renderGoType(irb.enumType("OrderStatus", "string"), context, undefined),
    ).toBe("OrderStatus");
    expect(
      renderGoType(
        irb.arrayType(irb.primitiveType("int"), 2),
        context,
        undefined,
      ),
    ).toBe("[][]int64");
    expect(
      renderGoType(irb.mapType(irb.namedType("UserID")), context, undefined),
    ).toBe("map[string]UserId");
    expect(
      renderGoType(
        irb.objectType([irb.field("city", irb.primitiveType("string"))]),
        context,
        "UserAddress",
      ),
    ).toBe("UserAddress");
  });

  it("renders anonymous object expressions for composite literals", () => {
    const result = createGeneratorContext({
      schema: irb.schema(),
      generatorOptions: {
        packageName: "vdl",
        genConsts: true,
        strict: true,
      },
    });

    const object = irb.objectType([
      irb.field("city", irb.primitiveType("string")),
      irb.field("primary", irb.primitiveType("bool"), { optional: true }),
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
      irb.objectType([
        irb.field("createdAt", irb.primitiveType("datetime")),
        irb.field(
          "history",
          irb.arrayType(irb.mapType(irb.primitiveType("datetime")), 2),
        ),
      ]),
      imports,
    );

    expect(imports.toArray()).toEqual(["time"]);
  });

  it("knows which types can be emitted as Go const declarations", () => {
    const result = createGeneratorContext({
      schema: irb.schema({
        enums: [
          irb.enumDef("Priority", "int", [
            irb.enumMember("High", {
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
        strict: true,
      },
    });

    const context = expectContext(result.context);

    expect(isConstEligibleType(irb.primitiveType("string"), context)).toBe(
      true,
    );
    expect(isConstEligibleType(irb.primitiveType("datetime"), context)).toBe(
      false,
    );
    expect(isConstEligibleType(irb.enumType("Priority", "int"), context)).toBe(
      true,
    );
    expect(
      isConstEligibleType(irb.arrayType(irb.primitiveType("string")), context),
    ).toBe(false);
  });
});

function expectContext<T>(value: T | undefined): T {
  expect(value).toBeDefined();
  return value as T;
}
