import { describe, expect, it } from "vitest";

import {
  isValidGoPackageName,
  toGoConstName,
  toGoEnumMemberName,
  toGoFieldName,
  toGoJsonName,
  toGoTypeName,
} from "./naming";

describe("naming", () => {
  it("normalizes Go-facing identifiers with SDK casing helpers", () => {
    expect(toGoConstName("defaultUserID")).toBe("DefaultUserId");
    expect(toGoConstName("API_VERSION")).toBe("ApiVersion");
    expect(toGoFieldName("default_user_id")).toBe("DefaultUserId");
    expect(toGoEnumMemberName("HTTPReady")).toBe("HttpReady");
    expect(toGoTypeName("user_profile")).toBe("UserProfile");
  });

  it("preserves original JSON names and validates package names", () => {
    expect(toGoJsonName("package")).toBe("package");
    expect(toGoJsonName("map")).toBe("map");
    expect(toGoJsonName("snake_case")).toBe("snake_case");
    expect(isValidGoPackageName("vdl")).toBe(true);
    expect(isValidGoPackageName("generated_api")).toBe(true);
    expect(isValidGoPackageName("Generated")).toBe(false);
    expect(isValidGoPackageName("package")).toBe(false);
  });
});
