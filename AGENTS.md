# Agent Context for vdl-plugin-go

## Summary

This repository contains a VDL code generation plugin that transforms a flattened, validated VDL IR schema into Go source files. The project is written in TypeScript, uses `@varavel/vdl-plugin-sdk` for the plugin contract, and emits a `PluginOutput` containing either generated files or structured generation errors.

The generator is architected as a deterministic IR-to-files transform with an explicit stage pipeline under `src/stages/`. The most important invariant is that plugin logic behaves like a pure, synchronous, side-effect-free function from VDL input to plugin output. In the current tree, that pure orchestration entrypoint lives in `src/generate.ts` as `generate(input): PluginOutput`, and `src/index.ts` stays a thin SDK wrapper around it.

To create the plugin, we are using the VDL Plugin SDK. It is IMPERATIVE that you download and read the manual for using the SDK BEFORE starting ANY task, as it defines and explains many important things. It is also important that you use the manual information when writing tests or any utility code, as it contains helpers that should be used whenever possible to avoid duplicating code and keep the code of all VDL plugins in a similar way.

VDL Plugin SDK manual URL (ALWAYS download and read it): https://vdl-plugin-sdk.varavel.com/llms.txt

## Maintaining this Document

After completing any task, review this file and update it if you made structural changes or discovered patterns worth documenting. Only add information that helps understand how to work with the project. Avoid implementation details, file listings, or trivial changes. This is a general guide, not a changelog.

When updating this document, do so with the context of the entire document in mind; do not simply add new sections at the end, but place them where they make the most sense within the context of the document.

## Architecture & Organization

### Root Layout

- `package.json`: source of truth for build, check, lint, format, unit, e2e, and CI commands.
- `src/`: core plugin implementation and colocated unit tests.
- `src/generate.ts`: pure orchestration entrypoint that resolves options, builds context, emits files, and maps failures to plugin errors.
- `src/index.ts`: minimal SDK-facing wrapper created with `definePlugin(...)`.
- `src/stages/`: explicit pipeline stages for options, model/context building, and file emission.
- `src/shared/`: cross-cutting naming, error, Go type, Go literal, import, and comment helpers.
- `e2e/`: end-to-end tests that run the plugin through the real `vdl generate` CLI and compile/run Go fixtures.
- `e2e/fixtures/`: VDL fixture projects used by the e2e suite.
- `e2e/__snapshots__/`: snapshots of generated Go output.
- `temp/`: scratch and historical material; not part of the active generator contract.
- `biome.json`: Biome formatting/linting configuration.
- `dprint.json`: dprint formatting/linting configuration.
- `vitest.config.ts`: Vitest configuration for unit and e2e test runs.
- `tsconfig.json`: TypeScript project configuration.
- `tsconfig.vitest.json`: TypeScript config used by tests.

### `src/` (Core Generator)

- **Role**: Implements the full VDL IR -> Go plugin pipeline, plus unit tests that lock down naming, typing, literal rendering, comments, options, and generated file behavior.
- **Entrypoints**:
  - `src/index.ts`: SDK-facing plugin export. Keep it thin.
  - `src/generate.ts`: pure orchestration that resolves options, builds context, emits files, and converts thrown failures into plugin errors.
- **Stage Layout**:
- `src/stages/options/resolve.ts`: parses plugin options. Current options are `package`, `genConsts`, `genMeta`, `strict`, and `genPointerUtils`.
  - `src/stages/model/build-context.ts`: builds the shared generation context and aggregates stage errors.
  - `src/stages/model/*.ts`: indexes schema definitions, derives Go names, discovers inline object types recursively, builds descriptors, and validates Go-specific symbol collisions.
  - `src/stages/emit/generate-files.ts`: emits files in fixed order.
- `src/stages/emit/files/*.ts`: file-level Go emitters for `enums.go`, `types.go`, `constants.go`, `metadata.go`, and `pointers.go`.
- Metadata emission is split into focused helpers: runtime type/method definitions (`metadata-runtime.ts`), type-shape literals (`metadata-literals.ts`), and annotation literal formatting (`metadata-annotations.ts`).
- **Shared Modules**:
  - `src/shared/errors.ts`: typed generation errors, assertions, and conversion to `PluginOutputError`.
  - `src/shared/naming.ts`: VDL-to-Go naming rules for types, fields, enum members, constants, inline types, and package validation, built on SDK string utilities.
  - `src/shared/comments.ts`: doc/deprecation comment normalization.
  - `src/shared/object-fields.ts`: enforces last-field-wins semantics for duplicate object fields in resolved IR.
  - `src/shared/literal-key.ts`: stable literal comparison keys used mainly for enum value matching.
  - `src/shared/go-types/*.ts`: Go type rendering, anonymous type expressions, import requirements, named-type resolution, and const eligibility.
  - `src/shared/go-literals/*.ts`: Go literal rendering for consts, typed values, scalars, and metadata.
  - `src/shared/render/*.ts`: package/import wrappers for emitted Go files.
- **Tests in `src/`**:
  - Tests are colocated beside the modules they specify.

### `e2e/` (Integration Verification)

- **Role**: Verifies the plugin through the real CLI and a real Go toolchain.
- `e2e/e2e.test.ts`:
  - Discovers fixtures dynamically.
  - Writes a temporary `go.mod` per fixture using module path `fixture` and a local `replace` so fixtures can import the shared Go test helper package as `varavel.com/testutil`.
  - Runs `npx vdl generate` inside each fixture.
  - Snapshots generated `.go` files.
  - Then either runs `go run main.go` or `go build ./...`.
- `e2e/go-helpers/`:
  - Shared Go assertion helpers used by fixture `main.go` files.
- `e2e/fixtures/*`:
  - Self-contained fixture projects used to validate generator behavior end-to-end.
  - Fixture directory names should use behavior prefixes such as `types-*`, `enums-*`, and `consts-*`.
  - Prefer many small fixtures over a few broad ones: keep each schema focused on one generator behavior and keep `main.go` assertions narrow and readable.
  - Prefer importing `varavel.com/testutil` over re-declaring equality, JSON, error, or annotation helpers in each fixture.

## General Instructions

- **Understand the pipeline first**: Read `src/index.ts`, `src/generate.ts`, `src/stages/model/build-context.ts`, and the relevant emitter under `src/stages/emit/files/` before changing behavior.
- **Preserve the plugin contract**: Treat generation as a pure, synchronous, deterministic transform from `PluginInput` to `PluginOutput`. Do not introduce filesystem access, network calls, environment-driven behavior, randomness, clocks, logging side effects, or async control flow into the core generator path.
- **Preferred entrypoint shape**: Keep the public plugin surface as an exported `generate` function in the pure orchestration module (`src/generate.ts` in the current tree), with `src/index.ts` only adapting it to the SDK.
- **Do not bypass context building**: All file emitters depend on the normalized `GeneratorContext` from `src/stages/model/build-context.ts`. New generation features should usually be modeled there first, not computed ad hoc inside emitters.
- **Use errors as data**: Validation failures should become `PluginOutputError` objects with `position` when available. Throw only when it simplifies internal control flow, then map through `toPluginOutputError`.
- **Preserve determinism**: File order, import sorting, symbol naming, enum member resolution, and object field behavior are intentionally stable and covered by tests.
- **Respect Go symbol reservations**: `src/stages/model/symbols.ts` reserves helper and metadata symbols such as `Ptr`, `Val`, `Or`, `VDLAnnotation`, `VDLFieldMetadata`, and `VDLMetadata`. Any new generated symbol must participate in collision checking.
- **Keep `src/index.ts` thin**: Business logic belongs in pure helpers, not the SDK export wrapper.
- **Follow existing TypeScript style**: ESM imports, small focused modules, explicit helper functions, early returns, and discriminated-union switching over IR kinds.
- **Prefer SDK utilities over ad hoc helpers**: In plugin runtime code, reach for `@varavel/vdl-plugin-sdk/utils` namespaces such as `strings`, `arrays`, `objects`, `options`, `ir`, etc before introducing custom utility layers or third-party helpers.
- **Use the right helper instead of duplicating logic**:
  - Naming changes belong in `src/shared/naming.ts`.
  - Type rendering/import rules belong in `src/shared/go-types/`.
  - Literal emission belongs in `src/shared/go-literals/`.
  - Comment behavior belongs in `src/shared/comments.ts`.
  - Duplicate object-field semantics belong in `src/shared/object-fields.ts`.

## Generator Flow

1. `src/index.ts` exposes the plugin as `generate` through `definePlugin(...)`.
2. `src/generate.ts` resolves options from `input.options`.
3. `src/stages/model/build-context.ts` indexes the IR, derives Go names, recursively discovers inline object types, and validates Go-specific collisions.
4. If validation succeeds, `src/stages/emit/generate-files.ts` emits files in fixed order:
   - `enums.go` (optional)
   - `types.go` (optional)
   - `constants.go` (optional)
   - `metadata.go` (optional)
   - `pointers.go` (optional)
5. If any phase fails, the plugin returns `errors` instead of partial success.

This order is intentional and covered by tests. Preserve it unless the test suite and downstream expectations are updated together.

## Core Domain Rules

### Input, Output, and Side Effects

- Input comes from `PluginInput`, primarily `input.ir` plus stringly plugin options.
- Output is a `PluginOutput` with either `files` or `errors`.
- The generator should be referentially transparent for the same input. Generated content must not depend on ambient machine state.

### Naming Rules

- Types and enums become exported Go identifiers.
- Struct fields become exported Go field names.
- JSON tags preserve the original VDL field name exactly.
- Inline object types are named by concatenating parent Go type name plus field Go name.
- Generated Go names intentionally delegate case normalization to SDK string utilities. Acronym-heavy identifiers may therefore normalize to mixed-case Go names such as `UserId` or `HttpReady`.
- Go keywords are escaped with a trailing underscore.
- Package names must be lowercase Go identifiers and must not be Go keywords.

### Type Rules

- VDL primitives map to Go as:
  - `string -> string`
  - `int -> int64`
  - `float -> float64`
  - `bool -> bool`
  - `datetime -> time.Time`
- Arrays render as repeated `[]` dimensions.
- Maps currently render only as `map[string]...`.
- Optional object fields render as pointers.
- Inline objects become named Go structs in generated output; anonymous struct expressions are mainly used for composite literals and constant metadata type strings.

### Strict JSON Rules

- `strict` enables runtime JSON guards for generated Go code and defaults to `true`.
- Object types use generated unexported `pre<Type>` decoder structs plus `UnmarshalJSON()` so required fields are checked by JSON presence rather than Go zero values.
- Strict decode propagates through nested objects, arrays, and maps by decoding nested object shapes into matching `pre<Type>` values before transforming them into final Go types.
- Generated `validate(parentPath string)` methods build contextual field paths such as `items[0].code` or `lookup["primary"].id`, so nested required-field failures report where they happened. Path assembly is inlined inside generated methods rather than emitted as shared runtime helper functions, which avoids extra package-level symbols and keeps collision risk low.
- Object types do not generate custom `MarshalJSON()` methods; zero values remain the Go-native output behavior.
- Enums always generate `IsValid()`, and `strict` additionally generates enum `MarshalJSON()` and `UnmarshalJSON()` methods that reject out-of-set values.
- Named aliases only get strict JSON helpers when they wrap object or enum behavior that needs delegation; plain primitive and collection aliases stay lightweight.

### Literal Rules

- Scalar aliases render as typed conversions.
- Direct enum literals resolve to generated enum member constants by literal value, not only by member name.
- Composite literals support arrays, maps, and objects.
- Optional object fields in literals are wrapped with `Ptr(...)`.
- Datetime types are supported, but datetime literals are currently not supported for const emission through the current SDK path.
- Object literal validation is strict: required fields must be present and unexpected fields error.

### Object Field Semantics

- Resolved IR can contain duplicate object fields after spread expansion.
- The project intentionally applies last-field-wins semantics via `src/shared/object-fields.ts`.
- Preserve this behavior for both type-shape inspection and literal rendering.

### Enum Rules

- String enums render as `type X string`; int enums render as `type X int`.
- Enums generate:
  - member constants
  - `<Enum>List`
  - `String()`
  - `IsValid()`
  - `strict` additionally generates enum `MarshalJSON()` and `UnmarshalJSON()` methods.
- Enum JSON handling rejects invalid values and now includes the rejected value plus the allowed set in the returned error.
- Top-level constants whose declared type is a direct enum currently emit as untyped underlying scalar constants; tests lock this behavior in.

### Metadata Rules

- `metadata.go` is emitted only when `genMeta` is enabled (default `true`).
- `VDLMetadata` exposes generated metadata for types, enums, and constants.
- Metadata is intentionally compact: avoid dumping raw IR, positions, docs, or fully duplicated constant values into the generated Go runtime.
- Types, constants, and fields now describe shape through a recursive `VDLTypeRef` tree (`kind`, named target, array dims, element, and nested object fields) so annotations remain reachable inside arrays, maps, and inline objects without bloating the output.
- Annotation metadata preserves declaration order in `List` and latest value in `ByName`.
- Schema lookup helpers are `GetType`, `GetEnum`, and `GetConstant`.
- Nested metadata lookup helpers are `GetField` on both `VDLTypeMetadata` and `VDLTypeRef`, plus `GetMember` on `VDLEnumMetadata`.
- Enum member metadata keeps resolved values, but constant metadata intentionally omits duplicated runtime values.
- Missing metadata lookups must return zero values plus `false`, not panic.

### Pointer Helper Rules

- `pointers.go` is emitted unless `genPointerUtils` is disabled.
- Reserved helper names are `Ptr`, `Val`, and `Or`.
- Optional-field emission depends on `Ptr(...)`; do not rename helpers without updating reserved symbol handling and snapshots.

## Testing & Quality

### Strategy

- Treat unit tests in `src/` as the behavioral contract for helper modules and generator invariants.
- Treat e2e tests in `e2e/` as the contract for real CLI integration, snapshot stability, and generated Go validity.
- When changing output shape, update both narrow unit tests and any affected snapshots/fixtures.

### Important Invariants Covered by Tests

- Fixed generated file order.
- Stable naming for types, fields, enum members, constants, and inline types.
- Recursive inline object discovery.
- Datetime import propagation.
- `genConsts` option behavior.
- `genMeta` option behavior.
- `strict` option behavior.
- `genPointerUtils` option behavior.
- Runtime helper name collision reporting.
- Last duplicate object field wins.
- Optional fields use pointers and `omitempty`.
- Enum marshal/unmarshal validation.
- Object strict JSON presence checks and enum strict JSON behavior.
- Metadata helper behavior and annotation handling.

### Test Conventions

- Unit tests live beside source as `*.test.ts`.
- Stage and shared-module tests are colocated under `src/stages/**` and `src/shared/**`.
- The top-level orchestration contract is covered by `src/generate.test.ts`.
- End-to-end tests live under `e2e/` and depend on the Go toolchain and `npx vdl generate`.

### Commands

- **Unit tests**: `npm run test:unit`
- **E2E tests**: `npm run test:e2e`
- **Full test suite**: `npm run test`

For behavior changes in generated output, run at least the focused unit tests plus relevant e2e coverage if snapshots or emitted Go change.

## Tech Stack & Conventions

- **Language**: TypeScript 5.9, ESM modules.
- **Runtime**: Node.js tooling via npm scripts.
- **Plugin SDK**: `@varavel/vdl-plugin-sdk`.
- **SDK utility surface**: `@varavel/vdl-plugin-sdk/utils` for shared helpers.
- **Code generation helper**: `@varavel/gen`.
- **Testing**: Vitest.
- **Formatting/Linting**: dprint and Biome.
- **Target output**: Go source files intended to compile with a modern Go toolchain.

### Coding Conventions

- Prefer small pure helpers over shared mutable state.
- Switch on IR discriminants (`kind`) exhaustively.
- Attach source `position` to user-facing errors whenever possible.
- Assume general schema semantics were already validated by VDL. Keep plugin-side validation focused on Go-specific output constraints, symbol collisions, and current SDK limitations.
- Keep generation decisions centralized; avoid duplicating naming or rendering rules in multiple modules.
- Preserve stable output ordering because snapshots and downstream consumers depend on it.

## Operational Commands

- **Build**: `npm run build`
- **Check plugin contract**: `npm run check`
- **Format**: `npm run format`
- **Lint**: `npm run lint`
- **Test**: `npm run test`
- **CI parity**: `npm run ci`

## Known Caveats

- Maps are hardcoded to string keys.
- Datetime literals are not currently supported as Go const values.
- The generator trusts validated, flattened VDL IR for most semantic correctness checks and keeps validation focused on Go-specific output constraints and current SDK limitations.
- `temp/` contains historical reference material but is not the current implementation source of truth.
