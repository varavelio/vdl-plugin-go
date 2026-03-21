import { newGenerator } from "@varavel/gen";
import type { PluginOutputFile } from "@varavel/vdl-plugin-sdk";
import { renderGoFile } from "../../../shared/render/go-file";
import type { GeneratorContext } from "../../model/types";

/**
 * Emits the `pointers.go` file containing generic pointer utility helpers.
 *
 * Since Go lacks a built-in way to take the address of a literal or provide
 * nil-safe dereferencing with defaults, this file provides standard generic
 * helpers that are used throughout the generated code and available for
 * consumers of the generated package:
 *
 * 1. `Ptr[T](value T) *T`: Takes a value and returns its pointer. Useful for
 *    initializing optional/pointer fields in structs with literals.
 * 2. `Val[T](pointer *T) T`: Dereferences a pointer and returns its value, or
 *    returns the zero value for the type if the pointer is nil.
 * 3. `Or[T](pointer *T, defaultValue T) T`: Dereferences a pointer and returns
 *    its value, or returns the provided default value if the pointer is nil.
 *
 * Generation of these helpers can be disabled via the `genPointerUtils` option.
 *
 * @param context - The generator context containing pointer configuration and options.
 * @returns The generated `pointers.go` file or undefined if utilities are disabled.
 */
export function generatePointersFile(
  context: GeneratorContext,
): PluginOutputFile | undefined {
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
