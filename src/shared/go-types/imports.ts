import type { TypeRef } from "@varavel/vdl-plugin-sdk";
import { getEffectiveObjectFields } from "../object-fields";
import type { ImportSet } from "../render/imports";

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
      for (const field of getEffectiveObjectFields(typeRef.objectFields)) {
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
