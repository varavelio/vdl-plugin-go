import { describe, expect, it } from "vitest";

import {
  isValidGoPackageName,
  splitIdentifierWords,
  toCamelCase,
  toGoConstName,
  toGoJsonName,
  toGoTypeName,
  toPascalCase,
} from "./naming";

describe("naming", () => {
  it("splits mixed identifiers into stable words", () => {
    expect(splitIdentifierWords("defaultUserID")).toEqual([
      "default",
      "User",
      "ID",
    ]);
    expect(splitIdentifierWords("api_version")).toEqual(["api", "version"]);
    expect(splitIdentifierWords("HTTPServerURL")).toEqual([
      "HTTP",
      "Server",
      "URL",
    ]);
  });

  it("renders PascalCase and camelCase identifiers", () => {
    expect(toPascalCase("defaultUserID")).toBe("DefaultUserID");
    expect(toPascalCase("api_version")).toBe("ApiVersion");
    expect(toCamelCase("default_user_id")).toBe("defaultUserId");
  });

  it("preserves discoverable Go names for constants and types", () => {
    expect(toGoConstName("defaultUserID")).toBe("DefaultUserID");
    expect(toGoConstName("API_VERSION")).toBe("API_VERSION");
    expect(toGoTypeName("user_profile")).toBe("UserProfile");
  });

  it("escapes Go keywords in JSON names and validates package names", () => {
    expect(toGoJsonName("package")).toBe("package_");
    expect(isValidGoPackageName("vdl")).toBe(true);
    expect(isValidGoPackageName("generated_api")).toBe(true);
    expect(isValidGoPackageName("Generated")).toBe(false);
    expect(isValidGoPackageName("package")).toBe(false);
  });
});
