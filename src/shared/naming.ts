import { strings } from "@varavel/vdl-plugin-sdk/utils";

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

const GO_PACKAGE_RE = /^[a-z_][a-z0-9_]*$/;

export function isGoKeyword(value: string): boolean {
  return GO_KEYWORDS.has(value);
}

export function isValidGoPackageName(value: string): boolean {
  return GO_PACKAGE_RE.test(value) && !isGoKeyword(value);
}

export function toGoTypeName(value: string): string {
  return escapeGoIdentifier(toGoPascalIdentifier(value));
}

export function toGoConstName(value: string): string {
  return escapeGoIdentifier(toGoPascalIdentifier(value));
}

export function toGoFieldName(value: string): string {
  return escapeGoIdentifier(toGoPascalIdentifier(value));
}

export function toGoEnumMemberName(value: string): string {
  return escapeGoIdentifier(toGoPascalIdentifier(value));
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

function escapeGoIdentifier(value: string): string {
  return isGoKeyword(value) ? `${value}_` : value;
}

function toGoPascalIdentifier(value: string): string {
  const candidate = strings.pascalCase(value);

  if (candidate.length === 0) {
    return "X";
  }

  return /^[A-Za-z_]/.test(candidate) ? candidate : `X${candidate}`;
}
