import type { EnumDef, PluginOutputError } from "@varavel/vdl-plugin-sdk";
import { getLiteralValueKey } from "../../shared/literal-key";
import { toGoEnumMemberName } from "../../shared/naming";
import type { PackageScopeSymbolTable } from "./symbols";
import type {
  EnumDescriptor,
  EnumMemberDescriptor,
  GeneratorContext,
} from "./types";

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
      valueKey: getLiteralValueKey(member.value),
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
