import { irb } from "@varavel/vdl-plugin-sdk/testing";
import { describe, expect, it } from "vitest";
import { createGeneratorContext } from "./build-context";

describe("build-context", () => {
  it("collects nested inline object types under arrays and maps", () => {
    const result = createGeneratorContext({
      schema: irb.schema({
        types: [
          irb.typeDef(
            "Envelope",
            irb.objectType([
              irb.field(
                "locations",
                irb.arrayType(
                  irb.objectType([
                    irb.field("city", irb.primitiveType("string")),
                    irb.field(
                      "tags",
                      irb.mapType(
                        irb.objectType([
                          irb.field("label", irb.primitiveType("string")),
                        ]),
                      ),
                    ),
                  ]),
                ),
              ),
            ]),
          ),
        ],
      }),
      generatorOptions: {
        packageName: "vdl",
        genConsts: true,
      },
    });

    const context = expectContext(result.context);
    expect(result.errors).toEqual([]);
    expect(context.namedTypes.map((descriptor) => descriptor.goName)).toEqual([
      "Envelope",
      "EnvelopeLocations",
      "EnvelopeLocationsTags",
    ]);
  });

  it("normalizes Go names for enums and constants with acronyms", () => {
    const result = createGeneratorContext({
      schema: irb.schema({
        enums: [
          irb.enumDef("OrderStatus", "string", [
            irb.enumMember("HTTPReady", irb.stringLiteral("ready")),
          ]),
        ],
        constants: [],
        types: [
          irb.typeDef("UserID", irb.primitiveType("string"), {
            annotations: [irb.annotation("format", irb.stringLiteral("uuid"))],
          }),
        ],
      }),
      generatorOptions: {
        packageName: "vdl",
        genConsts: true,
      },
    });

    const context = expectContext(result.context);
    expect(context.typeGoNamesByVdlName.get("UserID")).toBe("UserId");
    expect(context.enumDescriptors[0]?.members[0]?.constName).toBe(
      "OrderStatusHttpReady",
    );
  });

  it("reports colliding generated type names", () => {
    const result = createGeneratorContext({
      schema: irb.schema({
        types: [
          irb.typeDef("UserId", irb.primitiveType("string")),
          irb.typeDef("user_id", irb.primitiveType("string")),
        ],
      }),
      generatorOptions: {
        packageName: "vdl",
        genConsts: true,
      },
    });

    expect(result.context).toBeUndefined();
    expect(result.errors).toHaveLength(1);
    expect(result.errors[0]?.message).toContain(
      "collides with another generated type",
    );
  });
});

function expectContext<T>(value: T | undefined): T {
  expect(value).toBeDefined();
  return value as T;
}
