import { newGenerator } from "@varavel/gen";
import {
  buildDocCommentLines,
  writeDocComment,
} from "../../../shared/comments";
import {
  canEmitConst,
  renderConstInitializer,
  renderTypedValueExpressionPretty,
} from "../../../shared/go-literals";
import {
  collectImportsForTypeRef,
  renderGoType,
} from "../../../shared/go-types";
import { renderGoFile } from "../../../shared/render/go-file";
import { ImportSet } from "../../../shared/render/imports";
import type { GeneratedFile, GeneratorContext } from "../../model/types";

export function generateConstantsFile(
  context: GeneratorContext,
): GeneratedFile | undefined {
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

    if (canEmitConst(constant.typeRef, context, constant.def.position)) {
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
