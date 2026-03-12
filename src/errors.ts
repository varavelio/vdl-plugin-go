import type { PluginOutputError, Position } from "@varavel/vdl-plugin-sdk";

/**
 * Represents a generation failure that can be mapped directly to a plugin error.
 */
export class GenerationError extends Error {
  readonly position?: Position;

  constructor(message: string, position?: Position) {
    super(message);
    this.name = "GenerationError";
    this.position = position;
  }
}

/**
 * Throws a typed generation error.
 */
export function fail(message: string, position?: Position): never {
  throw new GenerationError(message, position);
}

/**
 * Converts a thrown error into a plugin output error.
 */
export function toPluginOutputError(error: unknown): PluginOutputError {
  if (error instanceof GenerationError) {
    return {
      message: error.message,
      position: error.position,
    };
  }

  if (error instanceof Error) {
    return {
      message: error.message,
    };
  }

  return {
    message: "An unknown generation error occurred.",
  };
}
