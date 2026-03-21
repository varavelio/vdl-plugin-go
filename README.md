# vdl-plugin-go

A VDL code generation plugin that transforms a VDL schema into Go source files ready to compile.

## Overview

- Converts VDL types, enums, and constants into idiomatic Go code.
- Optionally emits schema metadata (`metadata.go`) for runtime introspection.
- Optionally generates strict JSON validation logic (`strict`) for objects and enums.

At a high level, the pipeline is:

1. Resolve and validate plugin options.
2. Build generation context (indexes, Go names, collision checks).
3. Emit Go files in a fixed order.

## Usage

### Configuration with `vdl.config.vdl`

Base configuration example:

```vdl
const config = {
  version 1
  plugins [
    {
      src "varavelio/vdl-plugin-go@{version}"
      schema "./schema.vdl"
      outDir "./vdl"
      options {
        package "vdl"
        strict "true"
      }
    }
  ]
}
```

## Configuration Options

| Option            | Type      | Default  | Description                                                                                      | Example                   |
| ----------------- | --------- | -------- | ------------------------------------------------------------------------------------------------ | ------------------------- |
| `package`         | `string`  | `"vdl"`  | Generated Go package name. Must be a lowercase Go identifier and not a Go keyword.               | `package "gen"`           |
| `genConsts`       | `boolean` | `"true"` | Controls emission of `constants.go`. If `false`, top-level constants are not emitted.            | `genConsts "false"`       |
| `genMeta`         | `boolean` | `"true"` | Controls emission of `metadata.go` with schema metadata.                                         | `genMeta "false"`         |
| `strict`          | `boolean` | `"true"` | Enables strict JSON validation where applicable (objects and enums, including relevant aliases). | `strict "false"`          |
| `genPointerUtils` | `boolean` | `"true"` | Controls emission of `pointers.go` with generic helper functions `Ptr`, `Val`, and `Or`.         | `genPointerUtils "false"` |

## Generation Behavior

### Determinism

For the same input, the generator is designed to produce the same output: stable stage order and stable file emission order.

### Error Handling

- Option errors (for example, invalid `package`) are returned as plugin errors.
- Modeling and generation failures are also returned as structured errors.
- Unexpected failures are captured and converted to plugin error format.

### `strict` Mode (JSON)

When `strict = true`:

- **Objects**: generates `UnmarshalJSON` logic that validates required fields by actual JSON field presence (not Go zero values).
- **Nested validation**: recursively validates nested objects/arrays/maps and builds contextual error paths.
- **Enums**: generates JSON validation that rejects out-of-set values.
- **Aliases**: emits strict helpers when an alias wraps behavior that requires it (for example, object/enum behavior).

When `strict = "false"`, strict JSON helper methods are not emitted.

## Generated Files

The generator emits files in this fixed orchestration order:

1. `enums.go`
2. `types.go`
3. `constants.go`
4. `metadata.go`
5. `pointers.go`

Each file is emitted only when applicable:

- `enums.go`: when enums exist in the schema.
- `types.go`: when types exist in the schema.
- `constants.go`: when constants exist in the schema and `genConsts = true`.
- `metadata.go`: when `genMeta = true`.
- `pointers.go`: when `genPointerUtils = true`.

Typical file contents:

- `types.go`: Go structs/aliases, JSON tags, `Get<Field>` and `Get<Field>Or` getters, strict helpers where applicable.
- `enums.go`: enum type, member constants, list, `String()`, `IsValid()`, and strict JSON helpers when `strict = true`.
- `constants.go`: `const` for eligible values and `var` for composite values that cannot be represented as Go constants.
- `pointers.go`: generic pointer helper functions `Ptr`, `Val`, and `Or`.
- `metadata.go`: `VDLMetadata` and supporting metadata types for schema/type/enum/constant introspection and annotations.

## Local Development

Main repository scripts (`package.json`):

```bash
npm run build
npm run check
npm run format
npm run lint
npm run test
npm run ci
```

## Testing

- Unit tests: `npm run test:unit`
- End-to-end tests: `npm run test:e2e`
- Full suite: `npm run test`

E2E tests run `npx vdl generate` against fixtures, snapshot generated `.go` output, and then compile (or run) generated code.

## License

This project is released under the MIT License. See [LICENSE](LICENSE).
