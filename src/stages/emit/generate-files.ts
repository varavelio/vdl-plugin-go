import { compact } from "es-toolkit";
import type { GeneratedFile, GeneratorContext } from "../model/types";
import { generateConstantsFile } from "./files/constants";
import { generateMetadataFile } from "./files/metadata";
import { generatePointersFile } from "./files/pointers";
import { generateTypesFile } from "./files/types";

export function generateFiles(context: GeneratorContext): GeneratedFile[] {
  return compact([
    generateTypesFile(context),
    generateConstantsFile(context),
    generateMetadataFile(context),
    generatePointersFile(context),
  ]);
}
