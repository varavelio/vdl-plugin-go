import type { Generator } from "@varavel/gen";

/**
 * Collects imports for a generated Go file.
 */
export class ImportSet {
  readonly #paths = new Set<string>();

  /**
   * Adds an import path when it is defined.
   */
  add(path: string | undefined): void {
    if (path) {
      this.#paths.add(path);
    }
  }

  /**
   * Adds all imports from another import set.
   */
  merge(other: ImportSet): void {
    for (const path of other.toArray()) {
      this.add(path);
    }
  }

  /**
   * Returns the sorted import list.
   */
  toArray(): string[] {
    return [...this.#paths].sort((left, right) => left.localeCompare(right));
  }

  /**
   * Renders the import block when imports are present.
   */
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
