import { describe, expect, it } from "vitest";
import { renderGoFile } from "./go-file";

describe("renderGoFile", () => {
  it("infers standard imports from code with aliased json", () => {
    const content = renderGoFile({
      packageName: "vdl",
      body: [
        "func decode(data []byte) error {",
        "\t_, _ = json.Marshal(data)",
        '\t_ = fmt.Sprintf("%v", data)',
        "\t_ = time.Now()",
        "\treturn nil",
        "}",
      ].join("\n"),
    });

    expect(content).toContain(
      'import (\n\tjson "encoding/json"\n\t"fmt"\n\t"time"\n)',
    );
  });

  it("uses custom jsonPackage when provided", () => {
    const content = renderGoFile({
      packageName: "vdl",
      body: [
        "func decode(data []byte) error {",
        "\treturn json.Unmarshal(data, nil)",
        "}",
      ].join("\n"),
      jsonPackage: "github.com/goccy/go-json",
    });

    expect(content).toContain('import (\n\tjson "github.com/goccy/go-json"\n)');
  });

  it("ignores import-like text inside comments and strings", () => {
    const content = renderGoFile({
      packageName: "vdl",
      body: [
        "// json.Unmarshal is mentioned here but not used.",
        'const note = "fmt.Sprintf should not trigger imports"',
        "const tag = `time.Time inside a raw string should be ignored`",
      ].join("\n"),
    });

    expect(content).not.toContain("import (");
  });
});
