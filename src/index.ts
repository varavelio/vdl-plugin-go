import { definePlugin } from "@varavel/vdl-plugin-sdk";
import { generate as generateOutput } from "./generate";

export const generate = definePlugin((input) => generateOutput(input));
