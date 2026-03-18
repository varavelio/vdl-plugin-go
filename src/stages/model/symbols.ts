import type { PluginOutputError, Position } from "@varavel/vdl-plugin-sdk";

const RESERVED_PACKAGE_SCOPE_SYMBOLS = [
  "Ptr",
  "Val",
  "Or",
  "VDLAnnotation",
  "VDLAnnotationSet",
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

export class PackageScopeSymbolTable {
  readonly #symbols = new Map<string, ReservedSymbol>();

  constructor() {
    for (const symbol of RESERVED_PACKAGE_SCOPE_SYMBOLS) {
      this.#symbols.set(symbol, {
        origin: "generated runtime support symbol",
      });
    }
  }

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
