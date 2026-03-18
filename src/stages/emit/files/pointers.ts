import { newGenerator } from "@varavel/gen";
import { renderGoFile } from "../../../shared/render/go-file";
import type { GeneratedFile, GeneratorContext } from "../../model/types";

export function generatePointersFile(
  context: GeneratorContext,
): GeneratedFile | undefined {
  if (context.options.genPointerUtils === false) {
    return undefined;
  }

  const g = newGenerator().withTabs();

  g.line("// Ptr returns a pointer to the provided value.");
  g.line("func Ptr[T any](value T) *T {");
  g.block(() => {
    g.line("return &value");
  });
  g.line("}");
  g.break();

  g.line(
    "// Val dereferences a pointer or returns the zero value when it is nil.",
  );
  g.line("func Val[T any](pointer *T) T {");
  g.block(() => {
    g.line("if pointer == nil {");
    g.block(() => {
      g.line("var zero T");
      g.line("return zero");
    });
    g.line("}");
    g.line("return *pointer");
  });
  g.line("}");
  g.break();

  g.line(
    "// Or dereferences a pointer or returns the provided default when it is nil.",
  );
  g.line("func Or[T any](pointer *T, defaultValue T) T {");
  g.block(() => {
    g.line("if pointer == nil {");
    g.block(() => {
      g.line("return defaultValue");
    });
    g.line("}");
    g.line("return *pointer");
  });
  g.line("}");

  return {
    path: "pointers.go",
    content: renderGoFile({
      packageName: context.options.packageName,
      body: g.toString(),
    }),
  };
}
