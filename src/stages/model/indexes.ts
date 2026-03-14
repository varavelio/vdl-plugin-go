import type { IrSchema, TypeDef } from "@varavel/vdl-plugin-sdk";
import { toGoTypeName } from "../../shared/naming";

export interface DefinitionIndexes {
  typeDefsByVdlName: Map<string, TypeDef>;
  typeGoNamesByVdlName: Map<string, string>;
  enumGoNamesByVdlName: Map<string, string>;
}

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
