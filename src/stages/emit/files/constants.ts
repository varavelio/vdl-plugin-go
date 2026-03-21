import { newGenerator } from "@varavel/gen";
import type { PluginOutputFile } from "@varavel/vdl-plugin-sdk";
import {
  buildDocCommentLines,
  writeDocComment,
} from "../../../shared/comments";
import {
  renderConstInitializer,
  renderTypedValueExpressionPretty,
} from "../../../shared/go-literals";
import {
  collectImportsForTypeRef,
  isConstEligibleType,
  renderGoType,
} from "../../../shared/go-types";
import { renderGoFile } from "../../../shared/render/go-file";
import { ImportSet } from "../../../shared/render/imports";
import type { GeneratorContext } from "../../model/types";

/**
 * Emits the `constants.go` file containing all VDL top-level constants.
 *
 * This emitter handles the mapping of VDL constants to Go declarations.
 * In Go, only scalar types (strings, numbers, booleans) and enums can be
 * declared as true `const` symbols.
 *
 * For composite VDL types (arrays, maps, and objects), Go does not support
 * constant expressions. For these, the emitter generates `var` declarations
 * initialized with composite literals instead. This allows the VDL-defined
 * constant values to be reachable at runtime while respecting Go's language rules.
 *
 * Constants can be disabled via the `genConsts` plugin option.
 *
 * @param context - The generator context containing all constant descriptors and options.
 * @returns The generated `constants.go` file or undefined if no constants are present or if they are disabled.
 */
export function generateConstantsFile(
  context: GeneratorContext,
): PluginOutputFile | undefined {
  if (!context.options.genConsts || context.constantDescriptors.length === 0) {
    return undefined;
  }

  const imports = new ImportSet();

  for (const constant of context.constantDescriptors) {
    collectImportsForTypeRef(constant.typeRef, imports);
  }

  const g = newGenerator().withTabs();

  for (const constant of context.constantDescriptors) {
    writeDocComment(
      g,
      buildDocCommentLines({
        doc: constant.def.doc,
        annotations: constant.def.annotations,
        fallback: `${constant.goName} holds a generated VDL constant.`,
      }),
    );

    if (isConstEligibleType(constant.typeRef, context, constant.def.position)) {
      renderConstDeclaration(g, constant.goName, constant, context);
    } else {
      const valueExpression = renderTypedValueExpressionPretty(
        constant.typeRef,
        constant.def.value,
        context,
        constant.def.position,
      );

      g.line(`var ${constant.goName} = ${valueExpression}`);
    }

    if (
      constant !==
      context.constantDescriptors[context.constantDescriptors.length - 1]
    ) {
      g.break();
    }
  }

  return {
    path: "constants.go",
    content: renderGoFile({
      packageName: context.options.packageName,
      imports,
      body: g.toString(),
    }),
  };
}

function renderConstDeclaration(
  g: ReturnType<typeof newGenerator>,
  goName: string,
  constant: GeneratorContext["constantDescriptors"][number],
  context: GeneratorContext,
): void {
  if (constant.typeRef.kind === "type") {
    g.line(
      `const ${goName} ${renderGoType(constant.typeRef, context, undefined, constant.def.position)} = ${renderConstInitializer(constant.typeRef, constant.def.value, context, constant.def.position)}`,
    );
    return;
  }

  g.line(
    `const ${goName} = ${renderConstInitializer(constant.typeRef, constant.def.value, context, constant.def.position)}`,
  );
}
