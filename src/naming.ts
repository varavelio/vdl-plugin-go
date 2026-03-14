/**
 * Go keywords that cannot be emitted directly as identifiers.
 */
const GO_KEYWORDS = new Set([
  "break",
  "case",
  "chan",
  "const",
  "continue",
  "default",
  "defer",
  "else",
  "fallthrough",
  "for",
  "func",
  "go",
  "goto",
  "if",
  "import",
  "interface",
  "map",
  "package",
  "range",
  "return",
  "select",
  "struct",
  "switch",
  "type",
  "var",
]);

const GO_IDENTIFIER_RE = /^[A-Za-z_][A-Za-z0-9_]*$/;
const GO_PACKAGE_RE = /^[a-z_][a-z0-9_]*$/;

/**
 * Splits an identifier into normalized word segments.
 */
export function splitIdentifierWords(value: string): string[] {
  const normalized = value
    .replace(/([A-Z]+)([A-Z][a-z])/g, "$1 $2")
    .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
    .replace(/[^A-Za-z0-9]+/g, " ")
    .trim();

  return normalized.length === 0 ? [] : normalized.split(/\s+/).filter(Boolean);
}

/**
 * Converts a string into PascalCase.
 */
export function toPascalCase(value: string): string {
  const words = splitIdentifierWords(value);

  if (words.length === 0) {
    return "X";
  }

  return words.map(formatPascalWord).join("");
}

/**
 * Converts a string into lower camelCase.
 */
export function toCamelCase(value: string): string {
  const words = splitIdentifierWords(value);

  if (words.length === 0) {
    return "x";
  }

  const firstWord = words[0] ?? "x";
  const restWords = words.slice(1);
  return `${firstWord.toLowerCase()}${restWords.map(formatPascalWord).join("")}`;
}

/**
 * Returns true when the value is a reserved Go keyword.
 */
export function isGoKeyword(value: string): boolean {
  return GO_KEYWORDS.has(value);
}

/**
 * Returns true when the value is a valid Go package name.
 */
export function isValidGoPackageName(value: string): boolean {
  return GO_PACKAGE_RE.test(value) && !isGoKeyword(value);
}

/**
 * Converts a VDL type or enum name into an exported Go type name.
 */
export function toGoTypeName(value: string): string {
  const candidate = /^[A-Z][A-Za-z0-9_]*$/.test(value)
    ? value
    : toPascalCase(value);

  return escapeGoIdentifier(candidate);
}

/**
 * Converts a VDL constant name into a Go constant or variable name.
 */
export function toGoConstName(value: string): string {
  const candidate =
    GO_IDENTIFIER_RE.test(value) &&
    (/^[A-Z_][A-Z0-9_]*$/.test(value) || /^[A-Z]/.test(value))
      ? value
      : toPascalCase(value);
  return escapeGoIdentifier(candidate);
}

/**
 * Converts a VDL field name into an exported Go struct field name.
 */
export function toGoFieldName(value: string): string {
  return escapeGoIdentifier(toPascalCase(value));
}

/**
 * Converts a VDL enum member name into the suffix used by a Go enum constant.
 */
export function toGoEnumMemberName(value: string): string {
  return escapeGoIdentifier(toPascalCase(value));
}

/**
 * Converts a VDL field name into the JSON tag name used by the generator.
 */
export function toGoJsonName(value: string): string {
  return value;
}

/**
 * Derives the generated Go name for an inline object type.
 */
export function toInlineTypeName(
  parentTypeName: string,
  fieldName: string,
): string {
  return `${parentTypeName}${toGoFieldName(fieldName)}`;
}

/**
 * Appends an underscore to reserved Go keywords to avoid naming conflicts.
 */
function escapeGoIdentifier(value: string): string {
  return isGoKeyword(value) ? `${value}_` : value;
}

/**
 * Formats a word for PascalCase conversion, preserving all-uppercase words.
 */
function formatPascalWord(word: string): string {
  if (/^[A-Z0-9]+$/.test(word) && word.length > 1) {
    return word;
  }

  const normalized = word.toLowerCase();
  return `${normalized.slice(0, 1).toUpperCase()}${normalized.slice(1)}`;
}
