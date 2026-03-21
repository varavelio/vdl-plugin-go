import { newGenerator } from "@varavel/gen";
import { strings } from "@varavel/vdl-plugin-sdk/utils";
import type { ImportSet } from "./imports";

/**
 * Renders a complete Go source file with a package declaration, imports, and a body.
 *
 * This function handles the boilerplate of a Go file, ensuring the correct order
 * of declarations and appropriate spacing between sections. It uses the `Generator`
 * from `@varavel/gen` to produce properly indented output with tabs.
 *
 * @param options - The file rendering options.
 * @param options.packageName - The name of the Go package.
 * @param options.imports - An optional set of imports to include.
 * @param options.body - The main content of the file (types, functions, constants, etc.).
 * @returns The full Go source code as a string.
 */
export function renderGoFile(options: {
  packageName: string;
  imports?: ImportSet;
  body: string;
}): string {
  const g = newGenerator().withTabs();
  const imports = options.imports?.toArray() ?? [];
  const body = options.body.trim();

  g.line(`package ${options.packageName}`);

  if (imports.length > 0 && options.imports) {
    g.break();
    options.imports.render(g);
  }

  if (body.length > 0) {
    g.break();
    g.raw(body);
    g.break();
  }

  return strings.limitBlankLines(g.toString(), 1);
}
