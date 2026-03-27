import { newGenerator } from "@varavel/gen";
import * as irb from "@varavel/vdl-plugin-sdk/testing";
import { describe, expect, it } from "vitest";
import { writeDocComment } from "./comments";

describe("comments", () => {
  it("renders docs, fallback text, and deprecated comments together", () => {
    expect(
      renderComment({
        doc: "Line one\nLine two",
        annotations: [
          irb.annotation("deprecated", irb.stringLiteral("Use X.")),
        ],
      }),
    ).toBe("// Line one\n// Line two\n//\n// Deprecated: Use X.");

    expect(renderComment({ fallback: "Fallback text" })).toBe(
      "// Fallback text",
    );
  });

  it("uses the generic deprecation message when needed", () => {
    expect(renderComment({ annotations: [irb.annotation("deprecated")] })).toBe(
      "// Deprecated: This symbol is deprecated and should not be used in new code.",
    );

    expect(
      renderComment({
        annotations: [irb.annotation("deprecated", irb.intLiteral(42))],
      }),
    ).toBe(
      "// Deprecated: This symbol is deprecated and should not be used in new code.",
    );
  });

  it("writes nothing when no doc or deprecation exists", () => {
    expect(renderComment({ annotations: [irb.annotation("tag")] })).toBe("");
  });
});

function renderComment(options: Parameters<typeof writeDocComment>[1]): string {
  const g = newGenerator().withTabs();
  writeDocComment(g, options);
  return g.toString().trim();
}
