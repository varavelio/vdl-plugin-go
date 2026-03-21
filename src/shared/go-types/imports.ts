import type { TypeRef } from "@varavel/vdl-plugin-sdk";
import type { ImportSet } from "../render/imports";

/**
 * Recursively scans a VDL TypeRef and adds any required standard Go library imports.
 *
 * For example, if a `datetime` type is encountered, it ensures that the `time` package
 * is added to the set of required imports for the generated Go file.
 *
 * @param typeRef - The VDL type to scan.
 * @param imports - The set of imports to update.
 */
export function collectImportsForTypeRef(
  typeRef: TypeRef,
  imports: ImportSet,
): void {
  switch (typeRef.kind) {
    case "primitive":
      if (typeRef.primitiveName === "datetime") {
        imports.add("time");
      }
      return;
    case "array":
      if (typeRef.arrayType) {
        collectImportsForTypeRef(typeRef.arrayType, imports);
      }
      return;
    case "map":
      if (typeRef.mapType) {
        collectImportsForTypeRef(typeRef.mapType, imports);
      }
      return;
    case "object":
      for (const field of typeRef.objectFields ?? []) {
        collectImportsForTypeRef(field.typeRef, imports);
      }
      return;
    case "type":
    case "enum":
      return;
    default:
      return;
  }
}
