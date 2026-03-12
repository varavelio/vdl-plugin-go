import { irb } from "@varavel/vdl-plugin-sdk/testing";
import { describe, expect, it } from "vitest";
import { buildDocCommentLines, getDeprecatedMessage } from "./comments";

describe("comments", () => {
  it("extracts a deprecated message from a string annotation", () => {
    expect(
      getDeprecatedMessage([
        irb.annotation(
          "deprecated",
          irb.stringLiteral("Use NewThing instead."),
        ),
      ]),
    ).toBe("Use NewThing instead.");
  });

  it("falls back to the generic deprecated message", () => {
    expect(getDeprecatedMessage([irb.annotation("deprecated")])).toBe(
      "This symbol is deprecated and should not be used in new code.",
    );
    expect(
      getDeprecatedMessage([irb.annotation("deprecated", irb.intLiteral(42))]),
    ).toBe("This symbol is deprecated and should not be used in new code.");
  });

  it("returns undefined when no deprecated annotation exists", () => {
    expect(getDeprecatedMessage([irb.annotation("tag")])).toBeUndefined();
  });

  it("combines docs, fallback text, and deprecated comments", () => {
    expect(
      buildDocCommentLines({
        doc: "Line one\nLine two",
        annotations: [
          irb.annotation("deprecated", irb.stringLiteral("Use X.")),
        ],
      }),
    ).toEqual(["Line one", "Line two", "", "Deprecated: Use X."]);

    expect(
      buildDocCommentLines({
        fallback: "Fallback text",
      }),
    ).toEqual(["Fallback text"]);
  });
});
