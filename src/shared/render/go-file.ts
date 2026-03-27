import { newGenerator } from "@varavel/gen";
import * as strings from "@varavel/vdl-plugin-sdk/utils/strings";

/**
 * Renders a complete Go source file with a package declaration, imports, and a body.
 *
 * This function handles the boilerplate of a Go file, ensuring the correct order
 * of declarations and appropriate spacing between sections. It uses the `Generator`
 * from `@varavel/gen` to produce properly indented output with tabs.
 *
 * @param options - The file rendering options.
 * @param options.packageName - The name of the Go package.
 * @param options.body - The main content of the file (types, functions, constants, etc.).
 * @returns The full Go source code as a string.
 */
export function renderGoFile(options: {
  packageName: string;
  body: string;
}): string {
  const g = newGenerator().withTabs();
  const body = options.body.trim();
  const imports = getStandardImports(body);

  g.line(`package ${options.packageName}`);

  if (imports.length > 0) {
    g.break();
    g.line("import (");
    g.block(() => {
      for (const importPath of imports) {
        g.line(JSON.stringify(importPath));
      }
    });
    g.line(")");
  }

  if (body.length > 0) {
    g.break();
    g.raw(body);
    g.break();
  }

  return strings.limitBlankLines(g.toString(), 1);
}

/**
 * Collects the standard library imports referenced by generated code.
 *
 * The generator only emits a small, fixed set of standard imports, so deriving
 * them from the rendered body keeps file emitters simple and avoids import
 * bookkeeping spread across the codebase.
 *
 * @param body - The rendered Go declarations for a single file.
 * @returns The sorted import paths required by the body.
 */
function getStandardImports(body: string): string[] {
  const code = stripCommentsAndStrings(body);
  const imports: string[] = [];

  if (code.includes("json.")) {
    imports.push("encoding/json");
  }

  if (code.includes("fmt.")) {
    imports.push("fmt");
  }

  if (code.includes("time.")) {
    imports.push("time");
  }

  return imports.sort((left, right) => left.localeCompare(right));
}

/**
 * Removes comments and string literals before import detection.
 *
 * Import inference only cares about package-qualified code references such as
 * `json.Unmarshal`. Stripping comments and quoted text prevents doc comments and
 * error message strings from accidentally introducing unused imports.
 *
 * @param body - The rendered Go declarations for a single file.
 * @returns The body with comments and quoted text replaced by spaces.
 */
function stripCommentsAndStrings(body: string): string {
  return body
    .replace(/`[^`]*`/g, "``")
    .replace(/"(?:\\.|[^"\\])*"/g, '""')
    .replace(/\/\/.*$/gm, "");
}
