import { describe, expect, it } from "vitest";
import {
  annotation,
  arrayType,
  enumDef,
  enumMember,
  field,
  mapType,
  objectType,
  primitiveType,
  schema,
  stringLiteral,
  typeDef,
} from "../tests/helpers/builders";
import { createGeneratorContext } from "./context";

describe("context", () => {
  it("collects nested inline object types under arrays and maps", () => {
    const result = createGeneratorContext({
      schema: schema({
        types: [
          typeDef(
            "Envelope",
            objectType([
              field(
                "locations",
                arrayType(
                  objectType([
                    field("city", primitiveType("string")),
                    field(
                      "tags",
                      mapType(
                        objectType([field("label", primitiveType("string"))]),
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
    expect(context.namedTypes.map((descriptor) => descriptor.name)).toEqual([
      "Envelope",
      "EnvelopeLocations",
      "EnvelopeLocationsTags",
    ]);
  });

  it("preserves Go names for enums and constants with acronyms", () => {
    const result = createGeneratorContext({
      schema: schema({
        enums: [
          enumDef("OrderStatus", "string", [
            enumMember("HTTPReady", stringLiteral("ready")),
          ]),
        ],
        constants: [],
        types: [
          typeDef("UserID", primitiveType("string"), {
            annotations: [annotation("format", stringLiteral("uuid"))],
          }),
        ],
      }),
      generatorOptions: {
        packageName: "vdl",
        genConsts: true,
      },
    });

    const context = expectContext(result.context);
    expect(context.typeGoNamesByVdlName.get("UserID")).toBe("UserID");
    expect(context.enumDescriptors[0]?.members[0]?.constName).toBe(
      "OrderStatusHTTPReady",
    );
  });

  it("reports colliding generated type names", () => {
    const result = createGeneratorContext({
      schema: schema({
        types: [
          typeDef("UserId", primitiveType("string")),
          typeDef("user_id", primitiveType("string")),
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
