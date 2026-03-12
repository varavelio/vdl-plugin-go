import { definePlugin } from "@varavel/vdl-plugin-sdk";
import { generatePluginOutput } from "./generate";

export const generate = definePlugin((input) => generatePluginOutput(input));
