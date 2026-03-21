import { definePlugin } from "@varavel/vdl-plugin-sdk";
import { generate as generateOutput } from "./generate";

/**
 * Entry point for the VDL Go plugin.
 *
 * This file adapts the pure generator orchestration from `./generate` to the
 * VDL Plugin SDK interface using `definePlugin`.
 */
export const generate = definePlugin((input) => generateOutput(input));
