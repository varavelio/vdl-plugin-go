import type { IrSchema, TypeDef } from "@varavel/vdl-plugin-sdk";
import { toGoTypeName } from "../../shared/naming";

/**
 * Caches and initial lookups for VDL definitions and their corresponding Go names.
 *
 * This provides a fast way to resolve VDL type and enum names to their definitions
 * or generated Go identifiers during the model building stage.
 */
export interface DefinitionIndexes {
  /** Map of VDL type name to its definition. */
  typeDefsByVdlName: Map<string, TypeDef>;
  /** Map of VDL type name to its generated PascalCase Go name. */
  typeGoNamesByVdlName: Map<string, string>;
  /** Map of VDL enum name to its generated PascalCase Go name. */
  enumGoNamesByVdlName: Map<string, string>;
}

/**
 * Scans the VDL IR schema to build initial name-based lookup indexes.
 *
 * This is the first step of context building, ensuring all top-level types
 * and enums have pre-computed Go names.
 *
 * @param schema - The VDL IR schema.
 * @returns The built definition indexes.
 */
export function buildDefinitionIndexes(schema: IrSchema): DefinitionIndexes {
  return {
    typeDefsByVdlName: new Map(
      schema.types.map((typeDef) => [typeDef.name, typeDef]),
    ),
    typeGoNamesByVdlName: new Map(
      schema.types.map((typeDef) => [typeDef.name, toGoTypeName(typeDef.name)]),
    ),
    enumGoNamesByVdlName: new Map(
      schema.enums.map((enumDef) => [enumDef.name, toGoTypeName(enumDef.name)]),
    ),
  };
}
