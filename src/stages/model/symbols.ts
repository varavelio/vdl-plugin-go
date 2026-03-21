import type { PluginOutputError, Position } from "@varavel/vdl-plugin-sdk";

const RESERVED_PACKAGE_SCOPE_SYMBOLS = [
  "Ptr",
  "Val",
  "Or",
  "VDLAnnotation",
  "VDLAnnotationSet",
  "VDLTypeRef",
  "VDLFieldMetadata",
  "VDLTypeMetadata",
  "VDLEnumMemberMetadata",
  "VDLEnumMetadata",
  "VDLConstantMetadata",
  "VDLSchemaMetadata",
  "VDLMetadata",
];

interface ReservedSymbol {
  origin: string;
  position?: Position;
}

/**
 * Tracking of reserved Go package-scope identifiers to prevent collisions.
 *
 * This table ensures that generated type, enum, or constant names do not
 * clash with:
 *
 * 1. Each other.
 * 2. Generated metadata symbols (e.g., VDLMetadata).
 * 3. Pointer utility helpers (e.g., Ptr, Val).
 */
export class PackageScopeSymbolTable {
  readonly #symbols = new Map<string, ReservedSymbol>();

  constructor() {
    for (const symbol of RESERVED_PACKAGE_SCOPE_SYMBOLS) {
      this.#symbols.set(symbol, {
        origin: "generated runtime support symbol",
      });
    }
  }

  /**
   * Attempts to reserve a Go identifier in the package scope.
   *
   * @param name - The Go identifier to reserve.
   * @param origin - A description of why the symbol is being reserved (for error reporting).
   * @param position - The VDL source position related to the symbol.
   * @returns An error if the symbol is already reserved, otherwise undefined.
   */
  reserve(
    name: string,
    origin: string,
    position?: Position,
  ): PluginOutputError | undefined {
    const existing = this.#symbols.get(name);

    if (existing) {
      return {
        message: `Generated Go symbol ${JSON.stringify(name)} for ${origin} collides with ${existing.origin}.`,
        position,
      };
    }

    this.#symbols.set(name, { origin, position });
    return undefined;
  }
}
