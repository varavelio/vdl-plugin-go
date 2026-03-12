import { newGenerator } from "@varavel/gen";
import type { ImportSet } from "./imports";

/**
 * Wraps a Go file body with package and imports.
 */
export function renderGoFile(options: {
  packageName: string;
  imports?: ImportSet;
  body: string;
}): string {
  const g = newGenerator().withTabs();

  g.line(`package ${options.packageName}`);

  if (options.imports && options.imports.toArray().length > 0) {
    g.break();
    options.imports.render(g);
  }

  const trimmedBody = options.body.trim();

  if (trimmedBody.length > 0) {
    g.break();
    g.raw(trimmedBody);
    g.break();
  }

  return g.toString();
}
