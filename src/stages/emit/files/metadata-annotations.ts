import type { newGenerator } from "@varavel/gen";
import type { Annotation } from "@varavel/vdl-plugin-sdk";
import { arrays, objects } from "@varavel/vdl-plugin-sdk/utils";
import { renderMetadataValueExpression } from "../../../shared/go-literals";

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
