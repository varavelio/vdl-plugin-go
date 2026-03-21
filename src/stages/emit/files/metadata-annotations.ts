import type { newGenerator } from "@varavel/gen";
import type { Annotation } from "@varavel/vdl-plugin-sdk";
import { arrays, objects } from "@varavel/vdl-plugin-sdk/utils";
import { renderMetadataValueExpression } from "../../../shared/go-literals";

/**
 * Renders a `VDLAnnotationSet` literal for use in Go runtime metadata.
 *
 * This function converts VDL annotations into a dual-representation Go structure:
 * 1. `List`: Preserves the exact declaration order of all annotations on a symbol.
 * 2. `ByName`: Provides a fast map lookup for the latest value of an annotation,
 *    following the "last-wins" semantics of the VDL language.
 *
 * Annotation values are rendered into standard Go literal expressions of type `any`
 * (e.g., `string`, `int64`, or composite literals for objects/arrays).
 *
 * @param g - The Go code generator for writing the output.
 * @param annotations - The list of VDL annotations (name and argument) to render.
 */
export function writeAnnotationSetField(
  g: ReturnType<typeof newGenerator>,
  annotations: Annotation[],
): void {
  if (annotations.length === 0) {
    g.line("Annotations: VDLAnnotationSet{},");
    return;
  }

  const byName = buildByNameEntries(annotations);

  g.line("Annotations: VDLAnnotationSet{");
  g.block(() => {
    g.line("List: []VDLAnnotation{");
    g.block(() => {
      for (const annotation of annotations) {
        g.line("VDLAnnotation{");
        g.block(() => {
          g.line(`Name: ${JSON.stringify(annotation.name)},`);
          g.line(
            `Value: ${renderMetadataValueExpression(annotation.argument)},`,
          );
        });
        g.line("},");
      }
    });
    g.line("},");

    g.line("ByName: map[string]any{");
    g.block(() => {
      for (const [name, value] of byName) {
        g.line(`${JSON.stringify(name)}: ${value},`);
      }
    });
    g.line("},");
  });
  g.line("},");
}

function buildByNameEntries(annotations: Annotation[]): [string, string][] {
  const grouped = arrays.groupBy(annotations, (annotation) => annotation.name);
  const byName = objects.mapValues(grouped, (group) =>
    renderMetadataValueExpression(group[group.length - 1]?.argument),
  );

  return Object.keys(byName).map((name) => [name, byName[name] ?? "nil"]);
}
