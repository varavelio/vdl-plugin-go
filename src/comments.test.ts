import { describe, expect, it } from "vitest";
import {
  annotation,
  intLiteral,
  stringLiteral,
} from "../tests/helpers/builders";
import { buildDocCommentLines, getDeprecatedMessage } from "./comments";

describe("comments", () => {
  it("extracts a deprecated message from a string annotation", () => {
    expect(
      getDeprecatedMessage([
        annotation("deprecated", stringLiteral("Use NewThing instead.")),
      ]),
    ).toBe("Use NewThing instead.");
  });

  it("falls back to the generic deprecated message", () => {
    expect(getDeprecatedMessage([annotation("deprecated")])).toBe(
      "This symbol is deprecated and should not be used in new code.",
    );
    expect(
      getDeprecatedMessage([annotation("deprecated", intLiteral(42))]),
    ).toBe("This symbol is deprecated and should not be used in new code.");
  });

  it("returns undefined when no deprecated annotation exists", () => {
    expect(getDeprecatedMessage([annotation("tag")])).toBeUndefined();
  });

  it("combines docs, fallback text, and deprecated comments", () => {
    expect(
      buildDocCommentLines({
        doc: "Line one\nLine two",
        annotations: [annotation("deprecated", stringLiteral("Use X."))],
      }),
    ).toEqual(["Line one", "Line two", "", "Deprecated: Use X."]);

    expect(
      buildDocCommentLines({
        fallback: "Fallback text",
      }),
    ).toEqual(["Fallback text"]);
  });
});
