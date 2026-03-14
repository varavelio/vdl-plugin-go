import type { PluginOutputError, Position } from "@varavel/vdl-plugin-sdk";
import { invariant } from "es-toolkit/util";

export class GenerationError extends Error {
  readonly position?: Position;

  constructor(message: string, position?: Position) {
    super(message);
    this.name = "GenerationError";
    this.position = position;
  }
}

export function fail(message: string, position?: Position): never {
  throw new GenerationError(message, position);
}

export function expectCondition(
  condition: unknown,
  message: string,
  position?: Position,
): void {
  invariant(condition, new GenerationError(message, position));
}

export function expectValue<T>(
  value: T | null | undefined,
  message: string,
  position?: Position,
): T {
  expectCondition(value !== null && value !== undefined, message, position);
  return value as T;
}

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
