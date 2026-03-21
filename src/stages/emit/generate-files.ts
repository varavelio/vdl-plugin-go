import type { PluginOutputFile } from "@varavel/vdl-plugin-sdk";
import { arrays } from "@varavel/vdl-plugin-sdk/utils";
import type { GeneratorContext } from "../model/types";
import { generateConstantsFile } from "./files/constants";
import { generateEnumsFile } from "./files/enums";
import { generateMetadataFile } from "./files/metadata";
import { generatePointersFile } from "./files/pointers";
import { generateTypesFile } from "./files/types";

export function generateFiles(context: GeneratorContext): PluginOutputFile[] {
  return arrays.compact([
    generateEnumsFile(context),
    generateTypesFile(context),
    generateConstantsFile(context),
    generateMetadataFile(context),
    generatePointersFile(context),
  ]);
}
