import type { Generator } from "@varavel/gen";
import {
  type Annotation,
  getAnnotation,
  getAnnotationArg,
  unwrapLiteral,
} from "@varavel/vdl-plugin-sdk";

const DEFAULT_DEPRECATED_MESSAGE =
  "This symbol is deprecated and should not be used in new code.";

/**
 * Returns the normalized deprecated comment message, if present.
 */
export function getDeprecatedMessage(
  annotations: Annotation[] | undefined,
): string | undefined {
  const deprecated = getAnnotation(annotations, "deprecated");
  if (!deprecated) return undefined;

  const argument = getAnnotationArg(annotations, "deprecated");
  if (argument) {
    const unwrapped = unwrapLiteral<unknown>(argument);
    if (typeof unwrapped === "string" && unwrapped.trim().length > 0) {
      return unwrapped;
    }
  }

  return DEFAULT_DEPRECATED_MESSAGE;
}

/**
 * Builds the Go doc comment lines for a symbol.
 */
export function buildDocCommentLines(options: {
  doc?: string;
  annotations?: Annotation[];
  fallback?: string;
}): string[] {
  const baseText = options.doc ?? options.fallback;
  const lines = baseText ? baseText.split("\n") : [];
  const deprecatedMessage = getDeprecatedMessage(options.annotations);

  if (deprecatedMessage) {
    if (lines.length > 0) lines.push("");
    lines.push(`Deprecated: ${deprecatedMessage}`);
  }

  return lines;
}

/**
 * Writes Go doc comments when at least one line is present.
 */
export function writeDocComment(g: Generator, lines: string[]): void {
  for (const line of lines) {
    g.line(`// ${line}`.trim());
  }
}
