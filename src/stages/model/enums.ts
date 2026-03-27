import type { EnumDef, PluginOutputError } from "@varavel/vdl-plugin-sdk";
import * as crypto from "@varavel/vdl-plugin-sdk/utils/crypto";
import { toGoEnumMemberName } from "../../shared/naming";
import type { PackageScopeSymbolTable } from "./symbols";
import type {
  EnumDescriptor,
  EnumMemberDescriptor,
  GeneratorContext,
} from "./types";

/**
 * Populates the context with descriptors for all enum definitions in the schema.
 *
 * This function handles the generation of Go enum types, their member constants,
 * and the list of all members. It also ensures that all generated identifiers
 * (enum type, members, and the member list) are unique and tracked in the symbol table.
 *
 * @param context - The generator context to populate.
 * @param packageScopeSymbols - The symbol table for collision detection.
 * @returns A list of validation errors encountered during processing.
 */
export function populateEnumDescriptors(
  context: GeneratorContext,
  packageScopeSymbols: PackageScopeSymbolTable,
): PluginOutputError[] {
  const errors: PluginOutputError[] = [];

  for (const enumDef of context.schema.enums) {
    const descriptor = buildEnumDescriptor(enumDef, context, errors);
    context.enumDescriptors.push(descriptor);
    context.enumDescriptorsByVdlName.set(enumDef.name, descriptor);

    const goNameError = packageScopeSymbols.reserve(
      descriptor.goName,
      `enum ${enumDef.name}`,
      enumDef.position,
    );

    if (goNameError) {
      errors.push(goNameError);
    }

    const listError = packageScopeSymbols.reserve(
      descriptor.listGoName,
      `enum list ${enumDef.name}`,
      enumDef.position,
    );

    if (listError) {
      errors.push(listError);
    }

    for (const member of descriptor.members) {
      const symbolError = packageScopeSymbols.reserve(
        member.constName,
        `enum member ${enumDef.name}.${member.def.name}`,
        member.def.position,
      );

      if (symbolError) {
        errors.push(symbolError);
      }
    }
  }

  return errors;
}

/**
 * Builds a descriptor for a single VDL enum definition.
 *
 * It maps each enum member to a unique Go constant name (usually prefixed
 * with the enum's Go type name) and computes a stable hash key for value lookups.
 */
function buildEnumDescriptor(
  enumDef: EnumDef,
  context: GeneratorContext,
  errors: PluginOutputError[],
): EnumDescriptor {
  const goName = context.enumGoNamesByVdlName.get(enumDef.name) ?? enumDef.name;
  const usedMemberNames = new Set<string>();
  const members: EnumMemberDescriptor[] = [];
  const memberByValue = new Map<string, EnumMemberDescriptor>();

  for (const member of enumDef.members) {
    const memberGoName = toGoEnumMemberName(member.name);

    if (usedMemberNames.has(memberGoName)) {
      errors.push({
        message: `Generated enum member name ${JSON.stringify(memberGoName)} collides within enum ${JSON.stringify(enumDef.name)}.`,
        position: member.position,
      });
      continue;
    }

    usedMemberNames.add(memberGoName);

    const descriptor: EnumMemberDescriptor = {
      def: member,
      goName: memberGoName,
      constName: `${goName}${memberGoName}`,
      valueKey: crypto.hash(member.value),
    };

    members.push(descriptor);

    if (!memberByValue.has(descriptor.valueKey)) {
      memberByValue.set(descriptor.valueKey, descriptor);
    }
  }

  return {
    def: enumDef,
    goName,
    listGoName: `${goName}List`,
    members,
    memberByValue,
  };
}
