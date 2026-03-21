import type { Generator } from "@varavel/gen";
import type { Annotation } from "@varavel/vdl-plugin-sdk";
import { ir } from "@varavel/vdl-plugin-sdk/utils";

const DEFAULT_DEPRECATED_MESSAGE =
  "This symbol is deprecated and should not be used in new code.";

/**
 * Returns a deprecation message if the given annotations contain a "deprecated"
 * annotation, otherwise returns undefined.
 *
 * If the deprecated annotation has a string argument, that string will be returned
 * as the deprecation message, otherwise a default message will be returned.
 *
 * @param annotations - An array of annotations to check for deprecation.
 * @returns A deprecation message if the "deprecated" annotation is present, or undefined if it is not.
 */
export function getDeprecatedMessage(
  annotations: Annotation[] | undefined,
): string | undefined {
  const deprecated = ir.getAnnotation(annotations, "deprecated");

  if (!deprecated) {
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

/**
 * Builds an array of comment lines from the given documentation string and annotations.
 *
 * If a "deprecated" annotation is present, a "Deprecated: <message>" line will be
 * appended to the documentation at the end.
 *
 * @param options - The documentation options.
 * @param options.doc - The primary documentation string.
 * @param options.annotations - Annotations to check for deprecation.
 * @param options.fallback - A fallback documentation string if doc is undefined.
 * @returns An array of strings, each representing a line of the documentation.
 */
export function buildDocCommentLines(options: {
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
 * Writes each line of the provided documentation as a Go line comment to
 * the given Go code generator.
 *
 * Each line will be prefixed with "// " and trimmed.
 *
 * If no lines are provided, this function does nothing.
 *
 * @param g - The Go code generator.
 * @param lines - An array of documentation lines to write.
 */
export function writeDocComment(g: Generator, lines: string[]): void {
  if (lines.length === 0) return;
  for (const line of lines) {
    g.line(`// ${line}`.trim());
  }
}
