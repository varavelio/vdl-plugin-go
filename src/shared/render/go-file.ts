import { newGenerator } from "@varavel/gen";
import type { ImportSet } from "./imports";

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

  return g.toString();
}
