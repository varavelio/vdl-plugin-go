import * as strings from "@varavel/vdl-plugin-sdk/utils/strings";

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

/**
 * Checks if a string is a reserved Go keyword.
 *
 * This is used to prevent generating identifiers that would cause compilation errors.
 *
 * @param value - The identifier to check.
 * @returns True if the value is a Go keyword, false otherwise.
 */
function isGoKeyword(value: string): boolean {
  return GO_KEYWORDS.has(value);
}

/**
 * Validates if a string is a valid Go package name.
 *
 * A valid package name must be lowercase, start with a letter or underscore,
 * contain only alphanumeric characters and underscores, and not be a reserved keyword.
 *
 * @param value - The package name to validate.
 * @returns True if the value is a valid Go package name, false otherwise.
 */
export function isValidGoPackageName(value: string): boolean {
  return GO_PACKAGE_RE.test(value) && !isGoKeyword(value);
}

/**
 * Converts a VDL type name to an exported Go type name.
 *
 * It uses PascalCase as required by Go for exported symbols and handles keyword escaping.
 *
 * @param value - The VDL type name.
 * @returns A safe, PascalCase Go type name.
 */
export function toGoTypeName(value: string): string {
  return escapeGoIdentifier(strings.pascalCase(value));
}

/**
 * Converts a VDL constant name to an exported Go constant name.
 *
 * Constant names follow the same PascalCase convention as types to ensure they are exported.
 *
 * @param value - The VDL constant name.
 * @returns A safe, PascalCase Go constant name.
 */
export function toGoConstName(value: string): string {
  return escapeGoIdentifier(strings.pascalCase(value));
}

/**
 * Converts a VDL field name to an exported Go struct field name.
 *
 * Fields are PascalCased to make them exported and visible to JSON encoders and other packages.
 *
 * @param value - The VDL field name.
 * @returns A safe, PascalCase Go field name.
 */
export function toGoFieldName(value: string): string {
  return escapeGoIdentifier(strings.pascalCase(value));
}

/**
 * Converts a VDL enum member name to an exported Go enum constant name.
 *
 * Enum members are exported and therefore use PascalCase.
 *
 * @param value - The VDL enum member name.
 * @returns A safe, PascalCase Go enum member name.
 */
export function toGoEnumMemberName(value: string): string {
  return escapeGoIdentifier(strings.pascalCase(value));
}

/**
 * Derives a Go type name for an inline VDL object.
 *
 * Inline types are named by concatenating the parent type name and the field name
 * to ensure uniqueness and logical grouping in the generated Go code.
 *
 * @param parentTypeName - The Go name of the containing struct type.
 * @param fieldName - The original name of the field where the inline type is defined.
 * @returns A Go type name for the inline struct.
 */
export function toInlineTypeName(
  parentTypeName: string,
  fieldName: string,
): string {
  return `${parentTypeName}${toGoFieldName(fieldName)}`;
}

/**
 * Escapes a Go identifier if it clashes with a reserved keyword.
 *
 * If the identifier is a keyword, it appends a trailing underscore (e.g., `type` becomes `type_`).
 *
 * @param value - The identifier to escape.
 * @returns The escaped identifier.
 */
function escapeGoIdentifier(value: string): string {
  return isGoKeyword(value) ? `${value}_` : value;
}
