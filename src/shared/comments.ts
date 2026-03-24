import type { Generator } from "@varavel/gen";
import type { Annotation } from "@varavel/vdl-plugin-sdk";
import { ir } from "@varavel/vdl-plugin-sdk/utils";

const DEFAULT_DEPRECATED_MESSAGE =
  "This symbol is deprecated and should not be used in new code.";

/**
 * Writes a Go doc comment block for a declaration.
 *
 * @param g - The Go code generator.
 * @param options - The documentation source data.
 * @param options.doc - The explicit documentation text from VDL.
 * @param options.annotations - The annotations attached to the declaration.
 * @param options.fallback - The fallback text to use when no explicit doc exists.
 */
export function writeDocComment(
  g: Generator,
  options: {
    doc?: string;
    annotations?: Annotation[];
    fallback?: string;
  },
): void {
  const lines = buildDocCommentLines(options);

  if (lines.length === 0) return;

  for (const line of lines) {
    g.line(`// ${line}`.trim());
  }
}

/**
 * Builds the individual lines that make up a Go doc comment block.
 *
 * The generated comment always prefers explicit documentation first and appends a
 * deprecation notice when the declaration carries `@deprecated`.
 *
 * @param options - The documentation source data.
 * @returns The normalized comment lines ready to emit.
 */
function buildDocCommentLines(options: {
  doc?: string;
  annotations?: Annotation[];
  fallback?: string;
}): string[] {
  const lines = (options.doc ?? options.fallback)?.split("\n") ?? [];
  const deprecatedMessage = getDeprecatedMessage(options.annotations);

  if (!deprecatedMessage) return lines;
  if (lines.length === 0) return [`Deprecated: ${deprecatedMessage}`];
  return [...lines, "", `Deprecated: ${deprecatedMessage}`];
}

/**
 * Extracts the deprecation message from annotations.
 *
 * A bare `@deprecated` uses a generic message, while a non-empty string argument
 * overrides it with a more specific explanation.
 *
 * @param annotations - The annotations attached to the declaration.
 * @returns The message to render, or `undefined` when the declaration is not deprecated.
 */
function getDeprecatedMessage(
  annotations: Annotation[] | undefined,
): string | undefined {
  if (!ir.getAnnotation(annotations, "deprecated")) {
    return undefined;
  }

  const argument = ir.getAnnotationArg(annotations, "deprecated");

  if (argument) {
    const unwrapped = ir.unwrapLiteral<unknown>(argument);

    if (typeof unwrapped === "string" && unwrapped.trim().length > 0) {
      return unwrapped;
    }
  }

  return DEFAULT_DEPRECATED_MESSAGE;
}
