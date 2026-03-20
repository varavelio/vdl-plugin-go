import type { Generator } from "@varavel/gen";

/**
 * Represents a set of unique Go package import paths.
 *
 * This class ensures that import paths are not duplicated and provides
 * a standard way to sort and render them in a `import ( ... )` block.
 */
export class ImportSet {
  readonly #paths = new Set<string>();

  /**
   * Adds an import path to the set.
   *
   * @param path - The import path to add.
   */
  add(path: string | undefined): void {
    if (path) {
      this.#paths.add(path);
    }
  }

  /**
   * Merges another ImportSet into this one.
   *
   * @param other - The set to merge from.
   */
  merge(other: ImportSet): void {
    for (const path of other.toArray()) {
      this.add(path);
    }
  }

  /**
   * Returns the import paths sorted alphabetically.
   *
   * @returns An array of sorted import path strings.
   */
  toArray(): string[] {
    return [...this.#paths].sort((left, right) => left.localeCompare(right));
  }

  /**
   * Renders the import set as a Go `import ( ... )` block.
   *
   * If the set is empty, this function does nothing.
   *
   * @param g - The Go code generator.
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
