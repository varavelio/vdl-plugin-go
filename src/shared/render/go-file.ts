import { newGenerator } from "@varavel/gen";
import * as strings from "@varavel/vdl-plugin-sdk/utils/strings";

interface GoImport {
  alias?: string;
  path: string;
}

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
 * @param options.jsonPackage - The Go import path for the JSON package.
 *   Defaults to "encoding/json". The import is always aliased as `json`.
 * @returns The full Go source code as a string.
 */
export function renderGoFile(options: {
  packageName: string;
  body: string;
  jsonPackage?: string;
}): string {
  const g = newGenerator().withTabs();
  const body = options.body.trim();
  const imports = getStandardImports(
    body,
    options.jsonPackage ?? "encoding/json",
  );

  g.line(`package ${options.packageName}`);

  if (imports.length > 0) {
    g.break();
    g.line("import (");
    g.block(() => {
      for (const imp of imports) {
        if (imp.alias) {
          g.line(`${imp.alias} ${JSON.stringify(imp.path)}`);
        } else {
          g.line(JSON.stringify(imp.path));
        }
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
 * Collects the imports referenced by generated code.
 *
 * The generator only emits a small, fixed set of standard imports, so deriving
 * them from the rendered body keeps file emitters simple and avoids import
 * bookkeeping spread across the codebase.
 *
 * The JSON import is always aliased as `json` so users can plug in any
 * encoding/json-compatible package (e.g. "github.com/goccy/go-json").
 *
 * @param body - The rendered Go declarations for a single file.
 * @param jsonPackage - The Go import path for the JSON package.
 * @returns The sorted imports required by the body.
 */
function getStandardImports(body: string, jsonPackage: string): GoImport[] {
  const code = stripCommentsAndStrings(body);
  const imports: GoImport[] = [];

  if (code.includes("json.")) {
    imports.push({ alias: "json", path: jsonPackage });
  }

  if (code.includes("fmt.")) {
    imports.push({ path: "fmt" });
  }

  if (code.includes("time.")) {
    imports.push({ path: "time" });
  }

  return imports.sort((left, right) => left.path.localeCompare(right.path));
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
