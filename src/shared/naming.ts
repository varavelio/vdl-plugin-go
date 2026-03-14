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

const GO_IDENTIFIER_START_RE = /^[A-Za-z_]/;
const GO_PACKAGE_RE = /^[a-z_][a-z0-9_]*$/;

export function splitIdentifierWords(value: string): string[] {
  const normalized = value
    .replace(/([A-Z]+)([A-Z][a-z])/g, "$1 $2")
    .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
    .replace(/[^A-Za-z0-9]+/g, " ")
    .trim();

  return normalized.length === 0 ? [] : normalized.split(/\s+/);
}

export function toPascalCase(value: string): string {
  return normalizeIdentifier(
    splitIdentifierWords(value)
      .map((word) => capitalizeWord(word))
      .join(""),
    "X",
  );
}

export function toCamelCase(value: string): string {
  const [firstWord = "x", ...restWords] = splitIdentifierWords(value);

  return escapeGoIdentifier(
    normalizeIdentifier(
      `${firstWord.toLowerCase()}${restWords.map((word) => capitalizeWord(word)).join("")}`,
      "x",
    ),
  );
}

export function isGoKeyword(value: string): boolean {
  return GO_KEYWORDS.has(value);
}

export function isValidGoPackageName(value: string): boolean {
  return GO_PACKAGE_RE.test(value) && !isGoKeyword(value);
}

export function toGoTypeName(value: string): string {
  return escapeGoIdentifier(toPascalCase(value));
}

export function toGoConstName(value: string): string {
  return escapeGoIdentifier(toPascalCase(value));
}

export function toGoFieldName(value: string): string {
  return escapeGoIdentifier(toPascalCase(value));
}

export function toGoEnumMemberName(value: string): string {
  return escapeGoIdentifier(toPascalCase(value));
}

export function toGoJsonName(value: string): string {
  return value;
}

export function toInlineTypeName(
  parentTypeName: string,
  fieldName: string,
): string {
  return `${parentTypeName}${toGoFieldName(fieldName)}`;
}

function normalizeIdentifier(value: string, fallback: string): string {
  if (value.length === 0) {
    return fallback;
  }

  return GO_IDENTIFIER_START_RE.test(value) ? value : `${fallback}${value}`;
}

function escapeGoIdentifier(value: string): string {
  return isGoKeyword(value) ? `${value}_` : value;
}

function capitalizeWord(value: string): string {
  const normalized = value.toLowerCase();
  return `${normalized.slice(0, 1).toUpperCase()}${normalized.slice(1)}`;
}
