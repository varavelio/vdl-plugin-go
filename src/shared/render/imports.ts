import type { Generator } from "@varavel/gen";

export class ImportSet {
  readonly #paths = new Set<string>();

  add(path: string | undefined): void {
    if (path) {
      this.#paths.add(path);
    }
  }

  merge(other: ImportSet): void {
    for (const path of other.toArray()) {
      this.add(path);
    }
  }

  toArray(): string[] {
    return [...this.#paths].sort((left, right) => left.localeCompare(right));
  }

  render(g: Generator): void {
    const imports = this.toArray();

    if (imports.length === 0) {
      return;
    }

    g.line("import (");
    g.block(() => {
      for (const path of imports) {
        g.line(JSON.stringify(path));
      }
    });
    g.line(")");
  }
}
