import type { PluginOutputError, Position } from "@varavel/vdl-plugin-sdk";
import { misc } from "@varavel/vdl-plugin-sdk/utils";

/**
 * Error thrown during the generation process.
 *
 * It extends the standard Error class to include a source code position,
 * allowing the VDL CLI to report errors at specific locations in the schema.
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
 * Throws a GenerationError with a given message and optional position.
 *
 * Use this to immediately halt generation when a fatal condition is met.
 *
 * @param message - The error message.
 * @param position - The optional VDL source position.
 * @throws {GenerationError} Always throws the error.
 */
export function fail(message: string, position?: Position): never {
  throw new GenerationError(message, position);
}

/**
 * Asserts that a condition is truthy, throwing a GenerationError otherwise.
 *
 * This is used for invariant checking throughout the generator.
 *
 * @param condition - The condition to evaluate.
 * @param message - The message for the error if the condition is falsy.
 * @param position - The optional VDL source position.
 */
export function expectCondition(
  condition: unknown,
  message: string,
  position?: Position,
): void {
  misc.invariant(condition, new GenerationError(message, position));
}

/**
 * Asserts that a value is neither null nor undefined, throwing a GenerationError otherwise.
 *
 * This is used to ensure required properties or lookups exist before proceeding.
 *
 * @param value - The value to check.
 * @param message - The message for the error if the value is null or undefined.
 * @param position - The optional VDL source position.
 * @returns The non-null, non-undefined value.
 */
export function expectValue<T>(
  value: T | null | undefined,
  message: string,
  position?: Position,
): T {
  expectCondition(value !== null && value !== undefined, message, position);
  return value as T;
}

/**
 * Converts any error into a structured PluginOutputError.
 *
 * This normalizes internal errors into the format expected by the VDL Plugin SDK contract,
 * preserving the source position if it's a GenerationError.
 *
 * @param error - The caught error object.
 * @returns A standardized PluginOutputError.
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
