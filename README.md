<p align="center">
  <img
    src="https://raw.githubusercontent.com/varavelio/vdl/9cb8432f972f986ba91ffa1e4fe82220a8aa373f/assets/png/vdl.png"
    alt="VDL logo"
    width="130"
  />
</p>

<h1 align="center">VDL Golang Plugin</h1>

<p align="center">
  Generate Go <strong>types</strong>, <strong>enums</strong>, <strong>constants</strong>, and <strong>pointer helpers</strong> from VDL.
</p>

<p align="center">
  <a href="https://varavel.com">
    <img src="https://cdn.jsdelivr.net/gh/varavelio/brand@1.0.0/dist/badges/project.svg" alt="A Varavel project"/>
  </a>
  <a href="https://varavel.com/vdl">
    <img src="https://cdn.jsdelivr.net/gh/varavelio/brand@1.0.0/dist/badges/vdl-plugin.svg" alt="VDL Plugin"/>
  </a>
</p>

This plugin is focused on data models only.

## Quick Start

1. Add the plugin to your `vdl.config.vdl`:

```vdl
const config = {
  version 1
  plugins [
    {
      src "varavelio/vdl-plugin-go@v0.1.2"
      schema "./schema.vdl"
      outDir "./gen"
    }
  ]
}
```

2. Run your normal VDL generation command:

```bash
vdl generate
```

3. Check the generated files in `./gen`.

Depending on your schema and options, you may get:

- `types.go`
- `enums.go`
- `constants.go`
- `pointers.go`

## Plugin Options

All options are optional.

| Option            | Type      | Default  | What it changes                                                                                 |
| ----------------- | --------- | -------- | ----------------------------------------------------------------------------------------------- |
| `package`         | `string`  | `"vdl"`  | Sets the Go package name used in generated files. It must be a valid lowercase Go package name. |
| `genConsts`       | `boolean` | `"true"` | Generates `constants.go` when your schema has constants.                                        |
| `strict`          | `boolean` | `"true"` | Adds stricter JSON validation for objects and enums.                                            |
| `genPointerUtils` | `boolean` | `"true"` | Generates `pointers.go` with `Ptr`, `Val`, and `Or` helper functions.                           |

Example with all options:

```vdl
const config = {
  version 1
  plugins [
    {
      src "varavelio/vdl-plugin-go@v0.1.2"
      schema "./schema.vdl"
      outDir "./gen"
      options {
        package "gen"
        genConsts "true"
        strict "true"
        genPointerUtils "true"
      }
    }
  ]
}
```

## What You Get

- VDL object types become Go structs.
- VDL enums become Go enum-like types with helpers such as `String()` and `IsValid()`.
- VDL constants become Go constants or variables, depending on what Go allows.
- Optional fields are generated as pointers.
- `datetime` values are generated as `time.Time`.

## Strict Mode

When `strict` is enabled:

- Required JSON fields must actually be present.
- Invalid enum values are rejected.
- Nested objects, arrays, and maps are validated too.

If you want simpler generated code with less runtime validation, set `strict "false"`.

## Pointer Helpers

When `genPointerUtils` is enabled, the plugin generates `pointers.go` with:

- `Ptr(...)` to create pointers easily
- `Val(...)` to safely read a pointer value
- `Or(...)` to provide a fallback value

This is especially useful for optional fields.

## License

This plugin is released under the MIT License. See [LICENSE](LICENSE).
