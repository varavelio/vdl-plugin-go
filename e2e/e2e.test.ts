import { execSync } from "node:child_process";
import { existsSync, readdirSync, readFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { describe, expect, it } from "vitest";

// Find all test cases dinamically by reading the "fixtures" directory
const fixturesDir = resolve(__dirname, "fixtures");
const fixtures = readdirSync(fixturesDir, { withFileTypes: true })
  .filter((dirent) => dirent.isDirectory())
  .map((dirent) => dirent.name);

describe("E2E: VDL to Go", () => {
  it.each(fixtures)("compiles fixture: %s", (fixtureName) => {
    const fixturePath = join(fixturesDir, fixtureName);
    const outDir = join(fixturePath, "gen");
    const mainPath = join(fixturePath, "main.go");

    // Execute the VDL generator
    execSync("npx vdl generate", { cwd: fixturePath, stdio: "pipe" });

    // Read all generated .go files alphabetically
    const generatedFiles = readdirSync(outDir)
      .filter((f) => f.endsWith(".go"))
      .sort();

    expect(generatedFiles.length).toBeGreaterThan(0);

    // Compare each generated file against its snapshot
    for (const file of generatedFiles) {
      const content = readFileSync(join(outDir, file), "utf-8");
      expect(content).toMatchSnapshot(file);
    }

    // Check specific test logic if main.go exists, otherwise ensure generated code
    // at least compiles without running it.
    if (existsSync(mainPath)) {
      execSync("go run main.go", { cwd: fixturePath, stdio: "inherit" });
    } else {
      execSync("go build ./...", { cwd: outDir, stdio: "pipe" });
    }
  });
});
