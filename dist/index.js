"use strict";
var __defProp = Object.defineProperty;
var __defProps = Object.defineProperties;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __propIsEnum = Object.prototype.propertyIsEnumerable;
var __typeError = (msg) => {
  throw TypeError(msg);
};
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp.call(b, prop))
      __defNormalProp(a, prop, b[prop]);
  if (__getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(b)) {
      if (__propIsEnum.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    }
  return a;
};
var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var __accessCheck = (obj, member, msg) => member.has(obj) || __typeError("Cannot " + msg);
var __privateGet = (obj, member, getter) => (__accessCheck(obj, member, "read from private field"), getter ? getter.call(obj) : member.get(obj));
var __privateAdd = (obj, member, value) => member.has(obj) ? __typeError("Cannot add the same private member more than once") : member instanceof WeakSet ? member.add(obj) : member.set(obj, value);

// src/index.ts
var index_exports = {};
__export(index_exports, {
  generate: () => generate2
});
module.exports = __toCommonJS(index_exports);

// node_modules/@varavel/vdl-plugin-sdk/dist/core/define-plugin.js
function definePlugin(handler) {
  return handler;
}
__name(definePlugin, "definePlugin");

// src/shared/errors.ts
var _GenerationError = class _GenerationError extends Error {
  constructor(message, position) {
    super(message);
    this.name = "GenerationError";
    this.position = position;
  }
};
__name(_GenerationError, "GenerationError");
var GenerationError = _GenerationError;
function fail(message, position) {
  throw new GenerationError(message, position);
}
__name(fail, "fail");
function expectValue(value, message, position) {
  if (value === null || value === void 0) {
    throw new GenerationError(message, position);
  }
  return value;
}
__name(expectValue, "expectValue");
function toPluginOutputError(error) {
  if (error instanceof GenerationError) {
    return {
      message: error.message,
      position: error.position
    };
  }
  if (error instanceof Error) {
    return {
      message: error.message
    };
  }
  return {
    message: "An unknown generation error occurred."
  };
}
__name(toPluginOutputError, "toPluginOutputError");

// node_modules/@varavel/vdl-plugin-sdk/dist/node_modules/es-toolkit/dist/array/compact.js
function compact(arr) {
  const result = [];
  for (let i = 0; i < arr.length; i++) {
    const item = arr[i];
    if (item) result.push(item);
  }
  return result;
}
__name(compact, "compact");

// node_modules/@varavel/gen/dist/index.js
var _a;
var Generator = (_a = class {
  constructor() {
    this.chunks = [];
    this.indentLevel = 0;
    this.indentUnit = "  ";
    this.atStartOfLine = true;
  }
  /**
  * Uses spaces for one indent level.
  *
  * Example: `withSpaces(2)` makes each level equal to two spaces.
  */
  withSpaces(spaces) {
    this.indentUnit = " ".repeat(Math.max(0, spaces));
    return this;
  }
  /**
  * Uses one tab character for each indent level.
  */
  withTabs() {
    this.indentUnit = "	";
    return this;
  }
  /**
  * Moves one indentation level deeper for future writes.
  */
  indent() {
    this.indentLevel++;
    return this;
  }
  /**
  * Moves one indentation level up for future writes.
  *
  * If already at zero, it stays at zero.
  */
  dedent() {
    if (this.indentLevel > 0) this.indentLevel--;
    return this;
  }
  /**
  * Writes text exactly as given.
  *
  * It does not add indentation or newlines.
  */
  raw(content) {
    if (content.length === 0) return this;
    this.chunks.push(content);
    this.atStartOfLine = content.endsWith("\n");
    return this;
  }
  /**
  * Writes exactly one newline character.
  */
  break() {
    this.chunks.push("\n");
    this.atStartOfLine = true;
    return this;
  }
  /**
  * Writes text on the current line.
  *
  * It adds indentation only when writing at the start of a line.
  */
  inline(content) {
    if (content.length === 0) return this;
    const sublines = content.split("\n");
    for (let index = 0; index < sublines.length; index++) {
      var _sublines$index;
      const subline = (_sublines$index = sublines[index]) !== null && _sublines$index !== void 0 ? _sublines$index : "";
      if (index > 0) {
        this.chunks.push("\n");
        this.atStartOfLine = true;
      }
      if (subline.length > 0) {
        if (this.atStartOfLine) this.chunks.push(this.indentUnit.repeat(this.indentLevel));
        this.chunks.push(subline);
        this.atStartOfLine = false;
      }
    }
    if (content.endsWith("\n")) this.atStartOfLine = true;
    return this;
  }
  /**
  * Same as `inline` but adds one newline at the end of the content.
  */
  line(content) {
    this.inline(content);
    this.break();
    return this;
  }
  /**
  * Runs a callback one level deeper, then restores the previous level.
  */
  block(run) {
    this.indent();
    try {
      run();
    } finally {
      this.dedent();
    }
    return this;
  }
  /**
  * Returns all generated content as a single string.
  */
  toString() {
    return this.chunks.join("");
  }
}, __name(_a, "Generator"), _a);
function newGenerator() {
  return new Generator();
}
__name(newGenerator, "newGenerator");

// node_modules/@varavel/vdl-plugin-sdk/dist/utils/ir/get-annotation.js
function getAnnotation(annotations, name) {
  if (!annotations) return void 0;
  return annotations.find((anno) => anno.name === name);
}
__name(getAnnotation, "getAnnotation");

// node_modules/@varavel/vdl-plugin-sdk/dist/utils/ir/get-annotation-arg.js
function getAnnotationArg(annotations, name) {
  const anno = getAnnotation(annotations, name);
  return anno === null || anno === void 0 ? void 0 : anno.argument;
}
__name(getAnnotationArg, "getAnnotationArg");

// node_modules/@varavel/vdl-plugin-sdk/dist/utils/strings/words.js
var ACRONYM_TO_CAPITALIZED_WORD_BOUNDARY_RE = /([A-Z]+)([A-Z][a-z])/g;
var LOWERCASE_OR_DIGIT_TO_UPPERCASE_BOUNDARY_RE = /([a-z0-9])([A-Z])/g;
var NON_ALPHANUMERIC_SEQUENCE_RE = /[^A-Za-z0-9]+/g;
var WHITESPACE_SEQUENCE_RE = /\s+/;
function words(str) {
  const normalized = str.replace(ACRONYM_TO_CAPITALIZED_WORD_BOUNDARY_RE, "$1 $2").replace(LOWERCASE_OR_DIGIT_TO_UPPERCASE_BOUNDARY_RE, "$1 $2").replace(NON_ALPHANUMERIC_SEQUENCE_RE, " ").trim();
  return normalized.length === 0 ? [] : normalized.split(WHITESPACE_SEQUENCE_RE);
}
__name(words, "words");

// node_modules/@varavel/vdl-plugin-sdk/dist/utils/strings/pascal-case.js
function capitalize(word) {
  return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
}
__name(capitalize, "capitalize");
function pascalCase(str) {
  return words(str).map(capitalize).join("");
}
__name(pascalCase, "pascalCase");

// node_modules/@varavel/vdl-plugin-sdk/dist/utils/ir/unwrap-literal.js
function unwrapLiteral(value) {
  return unwrapLiteralValue(value);
}
__name(unwrapLiteral, "unwrapLiteral");
function unwrapLiteralValue(value) {
  switch (value.kind) {
    case "string":
      return value.stringValue;
    case "int":
      return value.intValue;
    case "float":
      return value.floatValue;
    case "bool":
      return value.boolValue;
    case "object": {
      var _value$objectEntries;
      const resolvedObject = {};
      const entries = (_value$objectEntries = value.objectEntries) !== null && _value$objectEntries !== void 0 ? _value$objectEntries : [];
      for (const entry of entries) resolvedObject[entry.key] = unwrapLiteralValue(entry.value);
      return resolvedObject;
    }
    case "array":
      var _value$arrayItems;
      return ((_value$arrayItems = value.arrayItems) !== null && _value$arrayItems !== void 0 ? _value$arrayItems : []).map((item) => unwrapLiteralValue(item));
    default:
      return null;
  }
}
__name(unwrapLiteralValue, "unwrapLiteralValue");

// src/shared/comments.ts
var DEFAULT_DEPRECATED_MESSAGE = "This symbol is deprecated and should not be used in new code.";
function writeDocComment(g, options) {
  const lines = buildDocCommentLines(options);
  if (lines.length === 0) return;
  for (const line of lines) {
    g.line(`// ${line}`.trim());
  }
}
__name(writeDocComment, "writeDocComment");
function buildDocCommentLines(options) {
  var _a4, _b, _c;
  const lines = (_c = (_b = (_a4 = options.doc) != null ? _a4 : options.fallback) == null ? void 0 : _b.split("\n")) != null ? _c : [];
  const deprecatedMessage = getDeprecatedMessage(options.annotations);
  if (!deprecatedMessage) return lines;
  if (lines.length === 0) return [`Deprecated: ${deprecatedMessage}`];
  return [...lines, "", `Deprecated: ${deprecatedMessage}`];
}
__name(buildDocCommentLines, "buildDocCommentLines");
function getDeprecatedMessage(annotations) {
  if (!getAnnotation(annotations, "deprecated")) {
    return void 0;
  }
  const argument = getAnnotationArg(annotations, "deprecated");
  if (argument) {
    const unwrapped = unwrapLiteral(argument);
    if (typeof unwrapped === "string" && unwrapped.trim().length > 0) {
      return unwrapped;
    }
  }
  return DEFAULT_DEPRECATED_MESSAGE;
}
__name(getDeprecatedMessage, "getDeprecatedMessage");

// node_modules/@varavel/vdl-plugin-sdk/dist/_virtual/_@oxc-project_runtime@0.115.0/helpers/checkPrivateRedeclaration.js
function _checkPrivateRedeclaration(e, t) {
  if (t.has(e)) throw new TypeError("Cannot initialize the same private elements twice on an object");
}
__name(_checkPrivateRedeclaration, "_checkPrivateRedeclaration");

// node_modules/@varavel/vdl-plugin-sdk/dist/_virtual/_@oxc-project_runtime@0.115.0/helpers/classPrivateFieldInitSpec.js
function _classPrivateFieldInitSpec(e, t, a) {
  _checkPrivateRedeclaration(e, t), t.set(e, a);
}
__name(_classPrivateFieldInitSpec, "_classPrivateFieldInitSpec");

// node_modules/@varavel/vdl-plugin-sdk/dist/_virtual/_@oxc-project_runtime@0.115.0/helpers/assertClassBrand.js
function _assertClassBrand(e, t, n) {
  if ("function" == typeof e ? e === t : e.has(t)) return arguments.length < 3 ? t : n;
  throw new TypeError("Private element is not present on this object");
}
__name(_assertClassBrand, "_assertClassBrand");

// node_modules/@varavel/vdl-plugin-sdk/dist/_virtual/_@oxc-project_runtime@0.115.0/helpers/classPrivateFieldGet2.js
function _classPrivateFieldGet2(s, a) {
  return s.get(_assertClassBrand(s, a));
}
__name(_classPrivateFieldGet2, "_classPrivateFieldGet2");

// node_modules/@varavel/vdl-plugin-sdk/dist/node_modules/ohash/dist/shared/ohash.D__AXeF1.js
function serialize(o) {
  return typeof o == "string" ? `'${o}'` : new c().serialize(o);
}
__name(serialize, "serialize");
var c = /* @__PURE__ */ (function() {
  var _t = /* @__PURE__ */ new WeakMap();
  const _o = class _o {
    constructor() {
      _classPrivateFieldInitSpec(this, _t, /* @__PURE__ */ new Map());
    }
    compare(t, r2) {
      const e = typeof t, n = typeof r2;
      return e === "string" && n === "string" ? t.localeCompare(r2) : e === "number" && n === "number" ? t - r2 : String.prototype.localeCompare.call(this.serialize(t, true), this.serialize(r2, true));
    }
    serialize(t, r2) {
      if (t === null) return "null";
      switch (typeof t) {
        case "string":
          return r2 ? t : `'${t}'`;
        case "bigint":
          return `${t}n`;
        case "object":
          return this.$object(t);
        case "function":
          return this.$function(t);
      }
      return String(t);
    }
    serializeObject(t) {
      const r2 = Object.prototype.toString.call(t);
      if (r2 !== "[object Object]") return this.serializeBuiltInType(r2.length < 10 ? `unknown:${r2}` : r2.slice(8, -1), t);
      const e = t.constructor, n = e === Object || e === void 0 ? "" : e.name;
      if (n !== "" && globalThis[n] === e) return this.serializeBuiltInType(n, t);
      if (typeof t.toJSON == "function") {
        const i = t.toJSON();
        return n + (i !== null && typeof i == "object" ? this.$object(i) : `(${this.serialize(i)})`);
      }
      return this.serializeObjectEntries(n, Object.entries(t));
    }
    serializeBuiltInType(t, r2) {
      const e = this["$" + t];
      if (e) return e.call(this, r2);
      if (typeof (r2 === null || r2 === void 0 ? void 0 : r2.entries) == "function") return this.serializeObjectEntries(t, r2.entries());
      throw new Error(`Cannot serialize ${t}`);
    }
    serializeObjectEntries(t, r2) {
      const e = Array.from(r2).sort((i, a) => this.compare(i[0], a[0]));
      let n = `${t}{`;
      for (let i = 0; i < e.length; i++) {
        const [a, l2] = e[i];
        n += `${this.serialize(a, true)}:${this.serialize(l2)}`, i < e.length - 1 && (n += ",");
      }
      return n + "}";
    }
    $object(t) {
      let r2 = _classPrivateFieldGet2(_t, this).get(t);
      return r2 === void 0 && (_classPrivateFieldGet2(_t, this).set(t, `#${_classPrivateFieldGet2(_t, this).size}`), r2 = this.serializeObject(t), _classPrivateFieldGet2(_t, this).set(t, r2)), r2;
    }
    $function(t) {
      const r2 = Function.prototype.toString.call(t);
      return r2.slice(-15) === "[native code] }" ? `${t.name || ""}()[native]` : `${t.name}(${t.length})${r2.replace(/\s*\n\s*/g, "")}`;
    }
    $Array(t) {
      let r2 = "[";
      for (let e = 0; e < t.length; e++) r2 += this.serialize(t[e]), e < t.length - 1 && (r2 += ",");
      return r2 + "]";
    }
    $Date(t) {
      try {
        return `Date(${t.toISOString()})`;
      } catch (_unused) {
        return "Date(null)";
      }
    }
    $ArrayBuffer(t) {
      return `ArrayBuffer[${new Uint8Array(t).join(",")}]`;
    }
    $Set(t) {
      return `Set${this.$Array(Array.from(t).sort((r2, e) => this.compare(r2, e)))}`;
    }
    $Map(t) {
      return this.serializeObjectEntries("Map", t.entries());
    }
  };
  __name(_o, "o");
  let o = _o;
  for (const s of [
    "Error",
    "RegExp",
    "URL"
  ]) o.prototype["$" + s] = function(t) {
    return `${s}(${t})`;
  };
  for (const s of [
    "Int8Array",
    "Uint8Array",
    "Uint8ClampedArray",
    "Int16Array",
    "Uint16Array",
    "Int32Array",
    "Uint32Array",
    "Float32Array",
    "Float64Array"
  ]) o.prototype["$" + s] = function(t) {
    return `${s}[${t.join(",")}]`;
  };
  for (const s of ["BigInt64Array", "BigUint64Array"]) o.prototype["$" + s] = function(t) {
    return `${s}[${t.join("n,")}${t.length > 0 ? "n" : ""}]`;
  };
  return o;
})();

// node_modules/@varavel/vdl-plugin-sdk/dist/node_modules/ohash/dist/crypto/js/index.js
var z = [
  1779033703,
  -1150833019,
  1013904242,
  -1521486534,
  1359893119,
  -1694144372,
  528734635,
  1541459225
];
var R = [
  1116352408,
  1899447441,
  -1245643825,
  -373957723,
  961987163,
  1508970993,
  -1841331548,
  -1424204075,
  -670586216,
  310598401,
  607225278,
  1426881987,
  1925078388,
  -2132889090,
  -1680079193,
  -1046744716,
  -459576895,
  -272742522,
  264347078,
  604807628,
  770255983,
  1249150122,
  1555081692,
  1996064986,
  -1740746414,
  -1473132947,
  -1341970488,
  -1084653625,
  -958395405,
  -710438585,
  113926993,
  338241895,
  666307205,
  773529912,
  1294757372,
  1396182291,
  1695183700,
  1986661051,
  -2117940946,
  -1838011259,
  -1564481375,
  -1474664885,
  -1035236496,
  -949202525,
  -778901479,
  -694614492,
  -200395387,
  275423344,
  430227734,
  506948616,
  659060556,
  883997877,
  958139571,
  1322822218,
  1537002063,
  1747873779,
  1955562222,
  2024104815,
  -2067236844,
  -1933114872,
  -1866530822,
  -1538233109,
  -1090935817,
  -965641998
];
var S = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_";
var r = [];
var _a2;
var k = (_a2 = class {
  constructor() {
    this._data = new l();
    this._hash = new l([...z]);
    this._nDataBytes = 0;
    this._minBufferSize = 0;
  }
  finalize(e) {
    e && this._append(e);
    const s = this._nDataBytes * 8, t = this._data.sigBytes * 8;
    return this._data.words[t >>> 5] |= 128 << 24 - t % 32, this._data.words[(t + 64 >>> 9 << 4) + 14] = Math.floor(s / 4294967296), this._data.words[(t + 64 >>> 9 << 4) + 15] = s, this._data.sigBytes = this._data.words.length * 4, this._process(), this._hash;
  }
  _doProcessBlock(e, s) {
    const t = this._hash.words;
    let i = t[0], o = t[1], a = t[2], c2 = t[3], h = t[4], g = t[5], f = t[6], y = t[7];
    for (let n = 0; n < 64; n++) {
      if (n < 16) r[n] = e[s + n] | 0;
      else {
        const d = r[n - 15], j = (d << 25 | d >>> 7) ^ (d << 14 | d >>> 18) ^ d >>> 3, B = r[n - 2], x = (B << 15 | B >>> 17) ^ (B << 13 | B >>> 19) ^ B >>> 10;
        r[n] = j + r[n - 7] + x + r[n - 16];
      }
      const m = h & g ^ ~h & f, p = i & o ^ i & a ^ o & a, u = (i << 30 | i >>> 2) ^ (i << 19 | i >>> 13) ^ (i << 10 | i >>> 22), b = (h << 26 | h >>> 6) ^ (h << 21 | h >>> 11) ^ (h << 7 | h >>> 25), w = y + b + m + R[n] + r[n], M = u + p;
      y = f, f = g, g = h, h = c2 + w | 0, c2 = a, a = o, o = i, i = w + M | 0;
    }
    t[0] = t[0] + i | 0, t[1] = t[1] + o | 0, t[2] = t[2] + a | 0, t[3] = t[3] + c2 | 0, t[4] = t[4] + h | 0, t[5] = t[5] + g | 0, t[6] = t[6] + f | 0, t[7] = t[7] + y | 0;
  }
  _append(e) {
    typeof e == "string" && (e = l.fromUtf8(e)), this._data.concat(e), this._nDataBytes += e.sigBytes;
  }
  _process(e) {
    let s, t = this._data.sigBytes / 64;
    e ? t = Math.ceil(t) : t = Math.max((t | 0) - this._minBufferSize, 0);
    const i = t * 16, o = Math.min(i * 4, this._data.sigBytes);
    if (i) {
      for (let a = 0; a < i; a += 16) this._doProcessBlock(this._data.words, a);
      s = this._data.words.splice(0, i), this._data.sigBytes -= o;
    }
    return new l(s, o);
  }
}, __name(_a2, "k"), _a2);
var _a3;
var l = (_a3 = class {
  constructor(e, s) {
    e = this.words = e || [], this.sigBytes = s === void 0 ? e.length * 4 : s;
  }
  static fromUtf8(e) {
    const s = unescape(encodeURIComponent(e)), t = s.length, i = [];
    for (let o = 0; o < t; o++) i[o >>> 2] |= (s.charCodeAt(o) & 255) << 24 - o % 4 * 8;
    return new _a3(i, t);
  }
  toBase64() {
    const e = [];
    for (let s = 0; s < this.sigBytes; s += 3) {
      const t = this.words[s >>> 2] >>> 24 - s % 4 * 8 & 255, i = this.words[s + 1 >>> 2] >>> 24 - (s + 1) % 4 * 8 & 255, o = this.words[s + 2 >>> 2] >>> 24 - (s + 2) % 4 * 8 & 255, a = t << 16 | i << 8 | o;
      for (let c2 = 0; c2 < 4 && s * 8 + c2 * 6 < this.sigBytes * 8; c2++) e.push(S.charAt(a >>> 6 * (3 - c2) & 63));
    }
    return e.join("");
  }
  concat(e) {
    if (this.words[this.sigBytes >>> 2] &= 4294967295 << 32 - this.sigBytes % 4 * 8, this.words.length = Math.ceil(this.sigBytes / 4), this.sigBytes % 4) for (let s = 0; s < e.sigBytes; s++) {
      const t = e.words[s >>> 2] >>> 24 - s % 4 * 8 & 255;
      this.words[this.sigBytes + s >>> 2] |= t << 24 - (this.sigBytes + s) % 4 * 8;
    }
    else for (let s = 0; s < e.sigBytes; s += 4) this.words[this.sigBytes + s >>> 2] = e.words[s >>> 2];
    this.sigBytes += e.sigBytes;
  }
}, __name(_a3, "l"), _a3);
function digest(_) {
  return new k().finalize(_).toBase64();
}
__name(digest, "digest");

// node_modules/@varavel/vdl-plugin-sdk/dist/node_modules/ohash/dist/index.js
function hash(input) {
  return digest(serialize(input));
}
__name(hash, "hash");

// node_modules/@varavel/vdl-plugin-sdk/dist/utils/crypto/index.js
function hash2(input) {
  return hash(input);
}
__name(hash2, "hash");

// src/shared/go-types/resolve.ts
function resolveNonTypeRef(typeRef, context, position, visited = /* @__PURE__ */ new Set()) {
  if (typeRef.kind !== "type") {
    return typeRef;
  }
  const typeName = expectValue(
    typeRef.typeName,
    "Encountered a named type reference without a type name.",
    position
  );
  if (visited.has(typeName)) {
    fail(
      `Detected a type cycle while resolving ${JSON.stringify(typeName)}.`,
      position
    );
  }
  const typeDef = expectValue(
    context.typeDefsByVdlName.get(typeName),
    `Unknown VDL type reference ${JSON.stringify(typeName)}.`,
    position
  );
  visited.add(typeName);
  return resolveNonTypeRef(typeDef.typeRef, context, typeDef.position, visited);
}
__name(resolveNonTypeRef, "resolveNonTypeRef");

// src/shared/go-literals/scalar.ts
function resolveScalarTarget(typeRef, context, position) {
  const resolved = resolveNonTypeRef(typeRef, context, position);
  if (resolved.kind === "primitive") {
    return resolved.primitiveName === "datetime" ? void 0 : { primitiveName: resolved.primitiveName };
  }
  if (resolved.kind === "enum") {
    return {
      enumDescriptor: resolveDirectEnumDescriptor(resolved, context, position)
    };
  }
  return void 0;
}
__name(resolveScalarTarget, "resolveScalarTarget");
function resolveDirectEnumDescriptor(typeRef, context, position) {
  const enumName = expectValue(
    typeRef.enumName,
    "Encountered an enum reference without an enum name.",
    position
  );
  return expectValue(
    context.enumDescriptorsByVdlName.get(enumName),
    `Unknown VDL enum reference ${JSON.stringify(enumName)}.`,
    position
  );
}
__name(resolveDirectEnumDescriptor, "resolveDirectEnumDescriptor");
function renderDirectEnumExpression(enumDescriptor, literal, position) {
  const member = enumDescriptor.memberByValue.get(hash2(literal));
  if (!member) {
    fail(
      `Invalid literal for ${JSON.stringify(enumDescriptor.def.name)} enum. Expected one of its declared members.`,
      position
    );
  }
  return member.constName;
}
__name(renderDirectEnumExpression, "renderDirectEnumExpression");
function renderRawScalarLiteral(literal, target, position) {
  if (target.enumDescriptor) {
    return renderEnumScalarLiteral(target.enumDescriptor, literal, position);
  }
  switch (target.primitiveName) {
    case "string":
      if (literal.kind !== "string") {
        fail("Expected a string literal for a string type.", position);
      }
      return JSON.stringify(literal.stringValue);
    case "int":
      if (literal.kind !== "int") {
        fail("Expected an int literal for an int type.", position);
      }
      return String(literal.intValue);
    case "float":
      if (literal.kind !== "float" && literal.kind !== "int") {
        fail("Expected a float or int literal for a float type.", position);
      }
      return String(
        literal.kind === "float" ? literal.floatValue : literal.intValue
      );
    case "bool":
      if (literal.kind !== "bool") {
        fail("Expected a bool literal for a bool type.", position);
      }
      return String(literal.boolValue);
    case "datetime":
    case void 0:
      fail(
        "Datetime literals are not supported by the current VDL plugin SDK.",
        position
      );
  }
}
__name(renderRawScalarLiteral, "renderRawScalarLiteral");
function renderEnumScalarLiteral(enumDescriptor, literal, position) {
  if (!enumDescriptor.memberByValue.has(hash2(literal))) {
    fail(
      `Invalid literal for ${JSON.stringify(enumDescriptor.def.name)} enum. Expected one of its declared members.`,
      position
    );
  }
  if (enumDescriptor.def.enumType === "string") {
    if (literal.kind !== "string") {
      fail("Expected a string literal for a string enum value.", position);
    }
    return JSON.stringify(literal.stringValue);
  }
  if (literal.kind !== "int") {
    fail("Expected an int literal for an int enum value.", position);
  }
  return String(literal.intValue);
}
__name(renderEnumScalarLiteral, "renderEnumScalarLiteral");

// src/shared/go-literals/const.ts
function renderConstInitializer(typeRef, literal, context, position) {
  const scalarTarget = resolveScalarTarget(typeRef, context, position);
  if (!scalarTarget) {
    fail("Tried to render a non-constant value as a Go const.", position);
  }
  if (typeRef.kind === "enum") {
    return renderDirectEnumExpression(
      expectValue(
        scalarTarget.enumDescriptor,
        "Missing enum descriptor while rendering an enum literal.",
        position
      ),
      literal,
      position
    );
  }
  return renderRawScalarLiteral(literal, scalarTarget, position);
}
__name(renderConstInitializer, "renderConstInitializer");

// node_modules/@varavel/vdl-plugin-sdk/dist/utils/strings/limit-blank-lines.js
var cache = /* @__PURE__ */ new Map();
function limitBlankLines(str, maxConsecutive = 0) {
  const limit = Math.max(0, maxConsecutive);
  let regex = cache.get(limit);
  if (!regex) {
    regex = new RegExp(`(\\r?\\n\\s*){${limit + 2},}`, "g");
    cache.set(limit, regex);
  }
  return str.replace(regex, "\n".repeat(limit + 1));
}
__name(limitBlankLines, "limitBlankLines");

// src/shared/naming.ts
var GO_KEYWORDS = /* @__PURE__ */ new Set([
  "break",
  "case",
  "chan",
  "const",
  "continue",
  "default",
  "defer",
  "else",
  "fallthrough",
  "for",
  "func",
  "go",
  "goto",
  "if",
  "import",
  "interface",
  "map",
  "package",
  "range",
  "return",
  "select",
  "struct",
  "switch",
  "type",
  "var"
]);
var GO_PACKAGE_RE = /^[a-z_][a-z0-9_]*$/;
function isGoKeyword(value) {
  return GO_KEYWORDS.has(value);
}
__name(isGoKeyword, "isGoKeyword");
function isValidGoPackageName(value) {
  return GO_PACKAGE_RE.test(value) && !isGoKeyword(value);
}
__name(isValidGoPackageName, "isValidGoPackageName");
function toGoTypeName(value) {
  return escapeGoIdentifier(pascalCase(value));
}
__name(toGoTypeName, "toGoTypeName");
function toGoConstName(value) {
  return escapeGoIdentifier(pascalCase(value));
}
__name(toGoConstName, "toGoConstName");
function toGoFieldName(value) {
  return escapeGoIdentifier(pascalCase(value));
}
__name(toGoFieldName, "toGoFieldName");
function toGoEnumMemberName(value) {
  return escapeGoIdentifier(pascalCase(value));
}
__name(toGoEnumMemberName, "toGoEnumMemberName");
function toInlineTypeName(parentTypeName, fieldName) {
  return `${parentTypeName}${toGoFieldName(fieldName)}`;
}
__name(toInlineTypeName, "toInlineTypeName");
function escapeGoIdentifier(value) {
  return isGoKeyword(value) ? `${value}_` : value;
}
__name(escapeGoIdentifier, "escapeGoIdentifier");

// src/shared/go-types/render.ts
function renderPrimitiveGoType(primitiveName, position) {
  switch (primitiveName) {
    case "string":
      return "string";
    case "int":
      return "int64";
    case "float":
      return "float64";
    case "bool":
      return "bool";
    case "datetime":
      return "time.Time";
    default:
      fail(
        "Encountered a primitive type reference without a valid primitive name.",
        position
      );
  }
}
__name(renderPrimitiveGoType, "renderPrimitiveGoType");
function renderGoType(typeRef, context, inlineTypeGoName, position) {
  var _a4;
  switch (typeRef.kind) {
    case "primitive":
      return renderPrimitiveGoType(typeRef.primitiveName, position);
    case "type": {
      const typeName = expectValue(
        typeRef.typeName,
        "Encountered a named type reference without a type name.",
        position
      );
      return expectValue(
        context.typeGoNamesByVdlName.get(typeName),
        `Unknown VDL type reference ${JSON.stringify(typeName)}.`,
        position
      );
    }
    case "enum": {
      const enumName = expectValue(
        typeRef.enumName,
        "Encountered an enum reference without an enum name.",
        position
      );
      return expectValue(
        context.enumGoNamesByVdlName.get(enumName),
        `Unknown VDL enum reference ${JSON.stringify(enumName)}.`,
        position
      );
    }
    case "array":
      return `${"[]".repeat((_a4 = typeRef.arrayDims) != null ? _a4 : 1)}${renderGoType(expectValue(typeRef.arrayType, "Encountered an array type reference without an element type.", position), context, inlineTypeGoName, position)}`;
    case "map":
      return `map[string]${renderGoType(expectValue(typeRef.mapType, "Encountered a map type reference without a value type.", position), context, inlineTypeGoName, position)}`;
    case "object":
      return expectValue(
        inlineTypeGoName,
        "Encountered an inline object without a generated Go type name.",
        position
      );
    default:
      fail(
        `Unsupported VDL type kind ${JSON.stringify(typeRef.kind)}.`,
        position
      );
  }
}
__name(renderGoType, "renderGoType");
function renderAnonymousGoTypeExpression(typeRef, context, position, inlineTypeGoName) {
  var _a4, _b;
  switch (typeRef.kind) {
    case "primitive":
      return renderPrimitiveGoType(typeRef.primitiveName, position);
    case "type":
    case "enum":
      return renderGoType(typeRef, context, void 0, position);
    case "array":
      return `${"[]".repeat((_a4 = typeRef.arrayDims) != null ? _a4 : 1)}${renderAnonymousGoTypeExpression(expectValue(typeRef.arrayType, "Encountered an array type reference without an element type.", position), context, position, inlineTypeGoName)}`;
    case "map":
      return `map[string]${renderAnonymousGoTypeExpression(expectValue(typeRef.mapType, "Encountered a map type reference without a value type.", position), context, position, inlineTypeGoName)}`;
    case "object": {
      if (inlineTypeGoName) {
        return inlineTypeGoName;
      }
      const parts = ((_b = typeRef.objectFields) != null ? _b : []).map((field) => {
        const fieldType = renderAnonymousGoTypeExpression(
          field.typeRef,
          context,
          field.position
        );
        const jsonTag = field.optional ? `json:${JSON.stringify(`${field.name},omitempty`)}` : `json:${JSON.stringify(field.name)}`;
        return `${toGoFieldName(field.name)} ${field.optional ? `*${fieldType}` : fieldType} \`${jsonTag}\``;
      });
      return `struct { ${parts.join("; ")} }`;
    }
    default:
      fail(
        `Unsupported VDL type kind ${JSON.stringify(typeRef.kind)}.`,
        position
      );
  }
}
__name(renderAnonymousGoTypeExpression, "renderAnonymousGoTypeExpression");
function renderAnonymousGoTypeExpressionPretty(typeRef, context, position, inlineTypeGoName) {
  var _a4, _b;
  switch (typeRef.kind) {
    case "primitive":
      return renderPrimitiveGoType(typeRef.primitiveName, position);
    case "type":
    case "enum":
      return renderGoType(typeRef, context, void 0, position);
    case "array":
      return `${"[]".repeat((_a4 = typeRef.arrayDims) != null ? _a4 : 1)}${renderAnonymousGoTypeExpressionPretty(expectValue(typeRef.arrayType, "Encountered an array type reference without an element type.", position), context, position, inlineTypeGoName)}`;
    case "map":
      return `map[string]${renderAnonymousGoTypeExpressionPretty(expectValue(typeRef.mapType, "Encountered a map type reference without a value type.", position), context, position, inlineTypeGoName)}`;
    case "object": {
      if (inlineTypeGoName) {
        return inlineTypeGoName;
      }
      const fields = (_b = typeRef.objectFields) != null ? _b : [];
      if (fields.length === 0) {
        return "struct {}";
      }
      const lines = fields.map((field) => {
        const fieldType = renderAnonymousGoTypeExpressionPretty(
          field.typeRef,
          context,
          field.position
        );
        const jsonTag = field.optional ? `json:${JSON.stringify(`${field.name},omitempty`)}` : `json:${JSON.stringify(field.name)}`;
        const fieldDecl = `${toGoFieldName(field.name)} ${field.optional ? `*${fieldType}` : fieldType} \`${jsonTag}\``;
        return indentMultiline(fieldDecl);
      });
      return `struct {
${lines.join("\n")}
}`;
    }
    default:
      fail(
        `Unsupported VDL type kind ${JSON.stringify(typeRef.kind)}.`,
        position
      );
  }
}
__name(renderAnonymousGoTypeExpressionPretty, "renderAnonymousGoTypeExpressionPretty");
function indentMultiline(value) {
  return value.split("\n").map((line) => `	${line}`).join("\n");
}
__name(indentMultiline, "indentMultiline");

// src/shared/go-literals/render.ts
function renderTypedValueExpressionPretty(typeRef, literal, context, position, namedTypeGoName) {
  switch (typeRef.kind) {
    case "primitive":
      return renderRawScalarLiteral(
        literal,
        { primitiveName: typeRef.primitiveName },
        position
      );
    case "enum":
      return renderDirectEnumExpression(
        resolveDirectEnumDescriptor(typeRef, context, position),
        literal,
        position
      );
    case "array":
    case "map":
    case "object":
      return renderCompositeLiteralPretty({
        typeRef,
        literal,
        context,
        position,
        namedTypeGoName
      });
    case "type": {
      const goType = renderGoType(typeRef, context, void 0, position);
      const resolved = resolveNonTypeRef(typeRef, context, position);
      if (resolved.kind === "primitive" || resolved.kind === "enum") {
        const scalarTarget = resolveScalarTarget(typeRef, context, position);
        if (!scalarTarget) {
          fail(
            "Expected a scalar target while rendering a named scalar type.",
            position
          );
        }
        return `${goType}(${renderRawScalarLiteral(literal, scalarTarget, position)})`;
      }
      return renderCompositeLiteralPretty({
        typeRef: resolved,
        literal,
        context,
        position,
        namedTypeGoName: goType,
        typeExpression: goType
      });
    }
    default:
      fail(
        `Unsupported literal rendering for type kind ${JSON.stringify(typeRef.kind)}.`,
        position
      );
  }
}
__name(renderTypedValueExpressionPretty, "renderTypedValueExpressionPretty");
function renderCompositeLiteralPretty(options) {
  var _a4;
  const typeExpression = (_a4 = options.typeExpression) != null ? _a4 : renderAnonymousGoTypeExpressionPretty(
    options.typeRef,
    options.context,
    options.position,
    options.namedTypeGoName
  );
  switch (options.typeRef.kind) {
    case "array":
      return renderArrayLiteralPretty({
        typeExpression,
        typeRef: options.typeRef,
        literal: options.literal,
        context: options.context,
        position: options.position,
        namedTypeGoName: options.namedTypeGoName
      });
    case "map":
      return renderMapLiteralPretty({
        typeExpression,
        typeRef: options.typeRef,
        literal: options.literal,
        context: options.context,
        position: options.position,
        namedTypeGoName: options.namedTypeGoName
      });
    case "object":
      return renderObjectLiteralPretty({
        typeExpression,
        typeRef: options.typeRef,
        literal: options.literal,
        context: options.context,
        position: options.position,
        namedTypeGoName: options.namedTypeGoName
      });
    default:
      fail(
        "Expected a composite VDL type while rendering a composite Go literal.",
        options.position
      );
  }
}
__name(renderCompositeLiteralPretty, "renderCompositeLiteralPretty");
function renderArrayLiteralPretty(options) {
  var _a4, _b, _c;
  if (options.literal.kind !== "array") {
    fail("Expected an array literal for a VDL array type.", options.position);
  }
  const elementType = ((_a4 = options.typeRef.arrayDims) != null ? _a4 : 1) === 1 ? expectValue(
    options.typeRef.arrayType,
    "Encountered an invalid array type while rendering a literal.",
    options.position
  ) : {
    kind: "array",
    arrayType: expectValue(
      options.typeRef.arrayType,
      "Encountered an invalid array type while rendering a literal.",
      options.position
    ),
    arrayDims: ((_b = options.typeRef.arrayDims) != null ? _b : 1) - 1
  };
  const items = ((_c = options.literal.arrayItems) != null ? _c : []).map(
    (item) => renderTypedValueExpressionPretty(
      elementType,
      item,
      options.context,
      item.position,
      options.namedTypeGoName
    )
  );
  return renderBlockLiteral(options.typeExpression, items);
}
__name(renderArrayLiteralPretty, "renderArrayLiteralPretty");
function renderMapLiteralPretty(options) {
  var _a4;
  if (options.literal.kind !== "object") {
    fail("Expected an object literal for a VDL map type.", options.position);
  }
  const valueType = expectValue(
    options.typeRef.mapType,
    "Encountered an invalid map type while rendering a literal.",
    options.position
  );
  const entries = ((_a4 = options.literal.objectEntries) != null ? _a4 : []).map(
    (entry) => `${JSON.stringify(entry.key)}: ${renderTypedValueExpressionPretty(valueType, entry.value, options.context, entry.position, options.namedTypeGoName)}`
  );
  return renderBlockLiteral(options.typeExpression, entries);
}
__name(renderMapLiteralPretty, "renderMapLiteralPretty");
function renderObjectLiteralPretty(options) {
  var _a4, _b;
  if (options.literal.kind !== "object") {
    fail("Expected an object literal for a VDL object type.", options.position);
  }
  const fields = (_a4 = options.typeRef.objectFields) != null ? _a4 : [];
  const entryByName = new Map(
    ((_b = options.literal.objectEntries) != null ? _b : []).map((entry) => [entry.key, entry])
  );
  const entries = [];
  for (const field of fields) {
    const entry = entryByName.get(field.name);
    if (!entry) {
      continue;
    }
    const childTypeGoName = options.namedTypeGoName ? toInlineTypeName(options.namedTypeGoName, field.name) : void 0;
    const renderedValue = renderTypedValueExpressionPretty(
      field.typeRef,
      entry.value,
      options.context,
      entry.position,
      childTypeGoName
    );
    if (!field.optional) {
      entries.push(`${toGoFieldName(field.name)}: ${renderedValue}`);
      continue;
    }
    if (options.context.options.genPointerUtils === false) {
      const valueType = renderAnonymousGoTypeExpression(
        field.typeRef,
        options.context,
        entry.position,
        childTypeGoName
      );
      entries.push(
        `${toGoFieldName(field.name)}: func() *${valueType} { value := ${renderedValue}; return &value }()`
      );
      continue;
    }
    entries.push(`${toGoFieldName(field.name)}: Ptr(${renderedValue})`);
  }
  return renderBlockLiteral(options.typeExpression, entries);
}
__name(renderObjectLiteralPretty, "renderObjectLiteralPretty");
function renderBlockLiteral(typeExpression, entries) {
  if (entries.length === 0) {
    return `${typeExpression}{}`;
  }
  const body = entries.map((entry) => indentBlock(entry)).join(",\n");
  return `${typeExpression}{
${body},
}`;
}
__name(renderBlockLiteral, "renderBlockLiteral");
function indentBlock(value) {
  return value.split("\n").map((line) => `	${line}`).join("\n");
}
__name(indentBlock, "indentBlock");

// src/shared/go-types/const-eligibility.ts
function isConstEligibleType(typeRef, context, position) {
  const resolved = resolveNonTypeRef(typeRef, context, position);
  if (resolved.kind === "enum") {
    return true;
  }
  return resolved.kind === "primitive" && resolved.primitiveName !== "datetime";
}
__name(isConstEligibleType, "isConstEligibleType");

// src/shared/render/go-file.ts
function renderGoFile(options) {
  const g = newGenerator().withTabs();
  const body = options.body.trim();
  const imports = getStandardImports(body);
  g.line(`package ${options.packageName}`);
  if (imports.length > 0) {
    g.break();
    g.line("import (");
    g.block(() => {
      for (const importPath of imports) {
        g.line(JSON.stringify(importPath));
      }
    });
    g.line(")");
  }
  if (body.length > 0) {
    g.break();
    g.raw(body);
    g.break();
  }
  return limitBlankLines(g.toString(), 1);
}
__name(renderGoFile, "renderGoFile");
function getStandardImports(body) {
  const code = stripCommentsAndStrings(body);
  const imports = [];
  if (code.includes("json.")) {
    imports.push("encoding/json");
  }
  if (code.includes("fmt.")) {
    imports.push("fmt");
  }
  if (code.includes("time.")) {
    imports.push("time");
  }
  return imports.sort((left, right) => left.localeCompare(right));
}
__name(getStandardImports, "getStandardImports");
function stripCommentsAndStrings(body) {
  return body.replace(/`[^`]*`/g, "``").replace(/"(?:\\.|[^"\\])*"/g, '""').replace(/\/\/.*$/gm, "");
}
__name(stripCommentsAndStrings, "stripCommentsAndStrings");

// src/stages/emit/files/constants.ts
function generateConstantsFile(context) {
  if (!context.options.genConsts || context.constantDescriptors.length === 0) {
    return void 0;
  }
  const g = newGenerator().withTabs();
  for (const constant of context.constantDescriptors) {
    writeDocComment(g, {
      doc: constant.def.doc,
      annotations: constant.def.annotations,
      fallback: `${constant.goName} holds a generated VDL constant.`
    });
    if (isConstEligibleType(constant.typeRef, context, constant.def.position)) {
      renderConstDeclaration(g, constant.goName, constant, context);
    } else {
      const valueExpression = renderTypedValueExpressionPretty(
        constant.typeRef,
        constant.def.value,
        context,
        constant.def.position
      );
      g.line(`var ${constant.goName} = ${valueExpression}`);
    }
    g.break();
  }
  return {
    path: "constants.go",
    content: renderGoFile({
      packageName: context.options.packageName,
      body: g.toString()
    })
  };
}
__name(generateConstantsFile, "generateConstantsFile");
function renderConstDeclaration(g, goName, constant, context) {
  if (constant.typeRef.kind === "type") {
    g.line(
      `const ${goName} ${renderGoType(constant.typeRef, context, void 0, constant.def.position)} = ${renderConstInitializer(constant.typeRef, constant.def.value, context, constant.def.position)}`
    );
    return;
  }
  g.line(
    `const ${goName} = ${renderConstInitializer(constant.typeRef, constant.def.value, context, constant.def.position)}`
  );
}
__name(renderConstDeclaration, "renderConstDeclaration");

// src/stages/emit/files/enums-render.ts
function renderEnum(g, enumDescriptor, strict) {
  writeDocComment(g, {
    doc: enumDescriptor.def.doc,
    annotations: enumDescriptor.def.annotations,
    fallback: `${enumDescriptor.goName} defines a generated enum.`
  });
  g.line(
    `type ${enumDescriptor.goName} ${enumDescriptor.def.enumType === "string" ? "string" : "int"}`
  );
  g.break();
  g.line(
    `// ${enumDescriptor.goName} constants define the declared values of ${enumDescriptor.goName}.`
  );
  g.line("const (");
  g.block(() => {
    for (const member of enumDescriptor.members) {
      writeDocComment(g, {
        doc: member.def.doc,
        annotations: member.def.annotations
      });
      g.line(
        `${member.constName} ${enumDescriptor.goName} = ${renderEnumMemberLiteral(enumDescriptor, member)}`
      );
    }
  });
  g.line(")");
  g.break();
  g.line(
    `// ${enumDescriptor.listGoName} contains every valid ${enumDescriptor.goName} value.`
  );
  g.line(`var ${enumDescriptor.listGoName} = []${enumDescriptor.goName}{`);
  g.block(() => {
    for (const member of enumDescriptor.members) {
      g.line(`${member.constName},`);
    }
  });
  g.line("}");
  g.break();
  renderEnumStringMethod(g, enumDescriptor);
  g.break();
  renderEnumIsValidMethod(g, enumDescriptor);
  if (strict) {
    g.break();
    renderEnumMarshalJSONMethod(g, enumDescriptor);
    g.break();
    renderEnumUnmarshalJSONMethod(g, enumDescriptor);
  }
}
__name(renderEnum, "renderEnum");
function renderEnumMemberLiteral(enumDescriptor, member) {
  if (enumDescriptor.def.enumType === "string") {
    return JSON.stringify(member.def.value.stringValue);
  }
  return String(member.def.value.intValue);
}
__name(renderEnumMemberLiteral, "renderEnumMemberLiteral");
function renderEnumStringMethod(g, enumDescriptor) {
  g.line(
    `// String returns a readable representation of ${enumDescriptor.goName}.`
  );
  g.line(`func (e ${enumDescriptor.goName}) String() string {`);
  g.block(() => {
    if (enumDescriptor.def.enumType === "string") {
      g.line("return string(e)");
      return;
    }
    g.line("switch e {");
    g.block(() => {
      for (const member of enumDescriptor.members) {
        g.line(`case ${member.constName}:`);
        g.block(() => {
          g.line(`return ${JSON.stringify(member.def.name)}`);
        });
      }
    });
    g.line("}");
    g.line(
      `return fmt.Sprintf(${JSON.stringify(`${enumDescriptor.goName}(%d)`)}, e)`
    );
  });
  g.line("}");
}
__name(renderEnumStringMethod, "renderEnumStringMethod");
function renderEnumIsValidMethod(g, enumDescriptor) {
  g.line(
    `// IsValid reports whether the value belongs to ${enumDescriptor.goName}.`
  );
  g.line(`func (e ${enumDescriptor.goName}) IsValid() bool {`);
  g.block(() => {
    g.line("switch e {");
    g.block(() => {
      g.line(
        `case ${enumDescriptor.members.map((member) => member.constName).join(", ")}:`
      );
      g.block(() => {
        g.line("return true");
      });
    });
    g.line("}");
    g.line("return false");
  });
  g.line("}");
}
__name(renderEnumIsValidMethod, "renderEnumIsValidMethod");
function renderEnumMarshalJSONMethod(g, enumDescriptor) {
  g.line(
    `// MarshalJSON encodes ${enumDescriptor.goName} and rejects values outside the declared enum set.`
  );
  g.line(`func (e ${enumDescriptor.goName}) MarshalJSON() ([]byte, error) {`);
  g.block(() => {
    g.line("if !e.IsValid() {");
    g.block(() => {
      if (enumDescriptor.def.enumType === "string") {
        g.line(
          `return nil, fmt.Errorf(${JSON.stringify(`cannot marshal invalid value %q for ${enumDescriptor.goName} enum`)}, string(e))`
        );
        return;
      }
      g.line(
        `return nil, fmt.Errorf(${JSON.stringify(`cannot marshal invalid value %d for ${enumDescriptor.goName} enum`)}, int(e))`
      );
    });
    g.line("}");
    if (enumDescriptor.def.enumType === "string") {
      g.line("return json.Marshal(string(e))");
      return;
    }
    g.line("return json.Marshal(int(e))");
  });
  g.line("}");
}
__name(renderEnumMarshalJSONMethod, "renderEnumMarshalJSONMethod");
function renderEnumUnmarshalJSONMethod(g, enumDescriptor) {
  g.line(
    `// UnmarshalJSON decodes ${enumDescriptor.goName} and rejects values outside the declared enum set.`
  );
  g.line(
    `func (e *${enumDescriptor.goName}) UnmarshalJSON(data []byte) error {`
  );
  g.block(() => {
    if (enumDescriptor.def.enumType === "string") {
      g.line("var value string");
      g.line("if err := json.Unmarshal(data, &value); err != nil {");
      g.block(() => {
        g.line("return err");
      });
      g.line("}");
      g.line(`candidate := ${enumDescriptor.goName}(value)`);
      g.line("if !candidate.IsValid() {");
      g.block(() => {
        g.line(
          `return fmt.Errorf(${JSON.stringify(`invalid value %q for ${enumDescriptor.goName} enum`)}, value)`
        );
      });
      g.line("}");
      g.line("*e = candidate");
      g.line("return nil");
      return;
    }
    g.line("var value int");
    g.line("if err := json.Unmarshal(data, &value); err != nil {");
    g.block(() => {
      g.line("return err");
    });
    g.line("}");
    g.line(`candidate := ${enumDescriptor.goName}(value)`);
    g.line("if !candidate.IsValid() {");
    g.block(() => {
      g.line(
        `return fmt.Errorf(${JSON.stringify(`invalid value %d for ${enumDescriptor.goName} enum`)}, value)`
      );
    });
    g.line("}");
    g.line("*e = candidate");
    g.line("return nil");
  });
  g.line("}");
}
__name(renderEnumUnmarshalJSONMethod, "renderEnumUnmarshalJSONMethod");

// src/stages/emit/files/enums.ts
function generateEnumsFile(context) {
  if (context.enumDescriptors.length === 0) {
    return void 0;
  }
  const g = newGenerator().withTabs();
  for (const enumDescriptor of context.enumDescriptors) {
    renderEnum(g, enumDescriptor, context.options.strict);
    g.break();
  }
  return {
    path: "enums.go",
    content: renderGoFile({
      packageName: context.options.packageName,
      body: g.toString()
    })
  };
}
__name(generateEnumsFile, "generateEnumsFile");

// src/stages/emit/files/pointers.ts
function generatePointersFile(context) {
  if (context.options.genPointerUtils === false) {
    return void 0;
  }
  const g = newGenerator().withTabs();
  g.line("// Ptr returns a pointer to the provided value.");
  g.line("func Ptr[T any](value T) *T {");
  g.block(() => {
    g.line("return &value");
  });
  g.line("}");
  g.break();
  g.line(
    "// Val dereferences a pointer or returns the zero value when it is nil."
  );
  g.line("func Val[T any](pointer *T) T {");
  g.block(() => {
    g.line("if pointer == nil {");
    g.block(() => {
      g.line("var zero T");
      g.line("return zero");
    });
    g.line("}");
    g.line("return *pointer");
  });
  g.line("}");
  g.break();
  g.line(
    "// Or dereferences a pointer or returns the provided default when it is nil."
  );
  g.line("func Or[T any](pointer *T, defaultValue T) T {");
  g.block(() => {
    g.line("if pointer == nil {");
    g.block(() => {
      g.line("return defaultValue");
    });
    g.line("}");
    g.line("return *pointer");
  });
  g.line("}");
  return {
    path: "pointers.go",
    content: renderGoFile({
      packageName: context.options.packageName,
      body: g.toString()
    })
  };
}
__name(generatePointersFile, "generatePointersFile");

// src/stages/emit/files/types-schema.ts
function renderNamedTypeSchemaSupport(g, descriptor, context) {
  if (!context.options.strict) {
    return false;
  }
  if (descriptor.kind === "object") {
    if (!namedTypeNeedsStrictObjectSupport(descriptor, context)) {
      return false;
    }
    renderPreObjectType(g, descriptor, context);
    g.break();
    renderPreObjectValidateMethod(g, descriptor, context);
    g.break();
    renderPreObjectTransformMethod(g, descriptor, context);
    g.break();
    renderObjectUnmarshalJSONMethod(g, descriptor);
    return true;
  }
  const strictBehavior = resolveStrictAliasBehavior(
    descriptor.typeRef,
    context,
    descriptor.position
  );
  if (strictBehavior === "enum") {
    renderAliasMarshalJSONMethod(g, descriptor, context);
    g.break();
    renderAliasUnmarshalJSONMethod(g, descriptor, context);
    return true;
  }
  if (strictBehavior === "object") {
    renderAliasUnmarshalJSONMethod(g, descriptor, context);
    return true;
  }
  return false;
}
__name(renderNamedTypeSchemaSupport, "renderNamedTypeSchemaSupport");
function renderPreObjectType(g, descriptor, context) {
  const preTypeName = toPreTypeName(descriptor.goName);
  g.line(
    `// ${preTypeName} mirrors ${descriptor.goName} during strict JSON decoding.`
  );
  g.line(`type ${preTypeName} struct {`);
  g.block(() => {
    for (const field of descriptor.fields) {
      const jsonTag = field.def.optional ? `json:${JSON.stringify(`${field.jsonName},omitempty`)}` : `json:${JSON.stringify(field.jsonName)}`;
      g.line(
        `${field.goName} ${renderPreFieldGoType(field, context)} \`${jsonTag}\``
      );
    }
  });
  g.line("}");
}
__name(renderPreObjectType, "renderPreObjectType");
function renderPreObjectValidateMethod(g, descriptor, context) {
  const preTypeName = toPreTypeName(descriptor.goName);
  g.line(
    `// validate reports whether ${preTypeName} satisfies strict JSON requirements.`
  );
  g.line(`func (p *${preTypeName}) validate(parentPath string) error {`);
  g.block(() => {
    for (const field of descriptor.fields) {
      const needsNestedValidation = typeRefNeedsStrictTraversal(
        field.def.typeRef,
        context,
        field.def.position
      );
      if (!field.def.optional || needsNestedValidation) {
        const fieldPathVar = `vdlPath${field.goName}`;
        renderFieldPathAssignment(
          g,
          fieldPathVar,
          "parentPath",
          field.jsonName
        );
        if (!field.def.optional) {
          g.line(`if p.${field.goName} == nil {`);
          g.block(() => {
            g.line(
              `return fmt.Errorf(${JSON.stringify("field %s is required")}, ${fieldPathVar})`
            );
          });
          g.line("}");
        }
        if (needsNestedValidation) {
          g.line(`if p.${field.goName} != nil {`);
          g.block(() => {
            renderValidationForType(g, {
              context,
              depth: 0,
              pathExpression: fieldPathVar,
              position: field.def.position,
              sourceExpression: `p.${field.goName}`,
              sourceIsPointer: true,
              typeRef: field.def.typeRef
            });
          });
          g.line("}");
        }
        if (field !== descriptor.fields[descriptor.fields.length - 1]) {
          g.break();
        }
      }
    }
    g.line("return nil");
  });
  g.line("}");
}
__name(renderPreObjectValidateMethod, "renderPreObjectValidateMethod");
function renderPreObjectTransformMethod(g, descriptor, context) {
  const preTypeName = toPreTypeName(descriptor.goName);
  g.line(`// transform converts ${preTypeName} to ${descriptor.goName}.`);
  g.line(`func (p *${preTypeName}) transform() ${descriptor.goName} {`);
  g.block(() => {
    for (const field of descriptor.fields) {
      renderFieldTransform(g, field, context);
      if (field !== descriptor.fields[descriptor.fields.length - 1]) {
        g.break();
      }
    }
    if (descriptor.fields.length > 0) {
      g.break();
    }
    g.line(`return ${descriptor.goName}{`);
    g.block(() => {
      for (const field of descriptor.fields) {
        g.line(`${field.goName}: trans${field.goName},`);
      }
    });
    g.line("}");
  });
  g.line("}");
}
__name(renderPreObjectTransformMethod, "renderPreObjectTransformMethod");
function renderObjectUnmarshalJSONMethod(g, descriptor) {
  const preTypeName = toPreTypeName(descriptor.goName);
  g.line(
    `// UnmarshalJSON decodes ${descriptor.goName} while requiring every non-optional JSON field.`
  );
  g.line(`func (x *${descriptor.goName}) UnmarshalJSON(data []byte) error {`);
  g.block(() => {
    g.line(`var pre ${preTypeName}`);
    g.line("if err := json.Unmarshal(data, &pre); err != nil {");
    g.block(() => {
      g.line("return err");
    });
    g.line("}");
    g.line('if err := pre.validate(""); err != nil {');
    g.block(() => {
      g.line("return err");
    });
    g.line("}");
    g.line("*x = pre.transform()");
    g.line("return nil");
  });
  g.line("}");
}
__name(renderObjectUnmarshalJSONMethod, "renderObjectUnmarshalJSONMethod");
function renderAliasMarshalJSONMethod(g, descriptor, context) {
  const underlyingType = renderGoType(
    descriptor.typeRef,
    context,
    void 0,
    descriptor.position
  );
  g.line(
    `// MarshalJSON encodes ${descriptor.goName} using its underlying strict JSON representation.`
  );
  g.line(`func (x ${descriptor.goName}) MarshalJSON() ([]byte, error) {`);
  g.block(() => {
    g.line(`return json.Marshal(${underlyingType}(x))`);
  });
  g.line("}");
}
__name(renderAliasMarshalJSONMethod, "renderAliasMarshalJSONMethod");
function renderAliasUnmarshalJSONMethod(g, descriptor, context) {
  const underlyingType = renderGoType(
    descriptor.typeRef,
    context,
    void 0,
    descriptor.position
  );
  g.line(
    `// UnmarshalJSON decodes ${descriptor.goName} using its underlying strict JSON representation.`
  );
  g.line(`func (x *${descriptor.goName}) UnmarshalJSON(data []byte) error {`);
  g.block(() => {
    g.line(`var value ${underlyingType}`);
    g.line("if err := json.Unmarshal(data, &value); err != nil {");
    g.block(() => {
      g.line("return err");
    });
    g.line("}");
    g.line(`*x = ${descriptor.goName}(value)`);
    g.line("return nil");
  });
  g.line("}");
}
__name(renderAliasUnmarshalJSONMethod, "renderAliasUnmarshalJSONMethod");
function namedTypeNeedsStrictObjectSupport(descriptor, context) {
  return typeRefNeedsStrictTraversal(
    descriptor.typeRef,
    context,
    descriptor.position
  );
}
__name(namedTypeNeedsStrictObjectSupport, "namedTypeNeedsStrictObjectSupport");
function typeRefNeedsStrictTraversal(typeRef, context, position, visited = /* @__PURE__ */ new Set()) {
  var _a4;
  switch (typeRef.kind) {
    case "primitive":
    case "enum":
      return false;
    case "array":
      return typeRef.arrayType ? typeRefNeedsStrictTraversal(
        typeRef.arrayType,
        context,
        position,
        visited
      ) : false;
    case "map":
      return typeRef.mapType ? typeRefNeedsStrictTraversal(
        typeRef.mapType,
        context,
        position,
        visited
      ) : false;
    case "object": {
      const fields = (_a4 = typeRef.objectFields) != null ? _a4 : [];
      if (fields.some((field) => !field.optional)) {
        return true;
      }
      return fields.some(
        (field) => typeRefNeedsStrictTraversal(
          field.typeRef,
          context,
          field.position,
          visited
        )
      );
    }
    case "type": {
      const typeName = expectValue(
        typeRef.typeName,
        "Encountered a named type reference without a type name.",
        position
      );
      if (visited.has(typeName)) {
        return false;
      }
      visited.add(typeName);
      return typeRefNeedsStrictTraversal(
        getReferencedTypeDef(typeName, context, position).typeRef,
        context,
        position,
        visited
      );
    }
    default:
      return false;
  }
}
__name(typeRefNeedsStrictTraversal, "typeRefNeedsStrictTraversal");
function renderPreFieldGoType(field, context) {
  return `*${renderPreTypeExpression(field.def.typeRef, context, field.def.position, field.inlineTypeGoName)}`;
}
__name(renderPreFieldGoType, "renderPreFieldGoType");
function renderPreTypeExpression(typeRef, context, position, inlineTypeGoName) {
  var _a4;
  if (!typeRefNeedsStrictTraversal(typeRef, context, position)) {
    return renderGoType(typeRef, context, inlineTypeGoName, position);
  }
  switch (typeRef.kind) {
    case "primitive":
    case "enum":
      return renderGoType(typeRef, context, inlineTypeGoName, position);
    case "array":
      return `${"[]".repeat((_a4 = typeRef.arrayDims) != null ? _a4 : 1)}${renderPreTypeExpression(expectValue(typeRef.arrayType, "Encountered an array type reference without an element type.", position), context, position, inlineTypeGoName)}`;
    case "map":
      return `map[string]${renderPreTypeExpression(expectValue(typeRef.mapType, "Encountered a map type reference without a value type.", position), context, position, inlineTypeGoName)}`;
    case "object":
      return toPreTypeName(
        expectValue(
          inlineTypeGoName,
          "Encountered an inline object without a generated Go type name.",
          position
        )
      );
    case "type": {
      const typeName = expectValue(
        typeRef.typeName,
        "Encountered a named type reference without a type name.",
        position
      );
      const typeDef = getReferencedTypeDef(typeName, context, position);
      if (typeDef.typeRef.kind === "object") {
        return toPreTypeName(getTypeGoName(typeName, context, position));
      }
      return renderPreTypeExpression(
        typeDef.typeRef,
        context,
        typeDef.position,
        inlineTypeGoName
      );
    }
    default:
      return renderGoType(typeRef, context, inlineTypeGoName, position);
  }
}
__name(renderPreTypeExpression, "renderPreTypeExpression");
function renderValidationForType(g, options) {
  if (!typeRefNeedsStrictTraversal(
    options.typeRef,
    options.context,
    options.position
  )) {
    return;
  }
  const resolved = options.typeRef.kind === "type" ? resolveNonTypeRef(options.typeRef, options.context, options.position) : options.typeRef;
  switch (resolved.kind) {
    case "object":
      g.line(
        `if err := ${options.sourceExpression}.validate(${options.pathExpression}); err != nil {`
      );
      g.block(() => {
        g.line("return err");
      });
      g.line("}");
      return;
    case "array": {
      const itemTypeRef = getArrayItemTypeRef(resolved, options.position);
      const rangeSource = options.sourceIsPointer ? `*${options.sourceExpression}` : options.sourceExpression;
      const indexName = `vdlIndex${String(options.depth)}`;
      const itemName = `vdlItem${String(options.depth)}`;
      const itemPathName = `vdlItemPath${String(options.depth)}`;
      g.line(`for ${indexName}, ${itemName} := range ${rangeSource} {`);
      g.block(() => {
        renderIndexPathAssignment(
          g,
          itemPathName,
          options.pathExpression,
          indexName
        );
        renderValidationForType(g, __spreadProps(__spreadValues({}, options), {
          depth: options.depth + 1,
          pathExpression: itemPathName,
          sourceExpression: itemName,
          sourceIsPointer: false,
          typeRef: itemTypeRef
        }));
      });
      g.line("}");
      return;
    }
    case "map": {
      const rangeSource = options.sourceIsPointer ? `*${options.sourceExpression}` : options.sourceExpression;
      const valueTypeRef = expectValue(
        resolved.mapType,
        "Encountered a map type reference without a value type.",
        options.position
      );
      const keyName = `vdlKey${String(options.depth)}`;
      const valueName = `vdlValue${String(options.depth)}`;
      const valuePathName = `vdlValuePath${String(options.depth)}`;
      g.line(`for ${keyName}, ${valueName} := range ${rangeSource} {`);
      g.block(() => {
        renderMapKeyPathAssignment(
          g,
          valuePathName,
          options.pathExpression,
          keyName
        );
        renderValidationForType(g, __spreadProps(__spreadValues({}, options), {
          depth: options.depth + 1,
          pathExpression: valuePathName,
          sourceExpression: valueName,
          sourceIsPointer: false,
          typeRef: valueTypeRef
        }));
      });
      g.line("}");
      return;
    }
    default:
      return;
  }
}
__name(renderValidationForType, "renderValidationForType");
function renderFieldTransform(g, field, context) {
  const tempName = `trans${field.goName}`;
  const needsStrictTransform = typeRefNeedsStrictTraversal(
    field.def.typeRef,
    context,
    field.def.position
  );
  g.line(`var ${tempName} ${field.goType}`);
  if (field.def.optional) {
    if (!needsStrictTransform) {
      g.line(`${tempName} = p.${field.goName}`);
      return;
    }
    const valueName = `value${field.goName}`;
    const valueType = renderGoType(
      field.def.typeRef,
      context,
      field.inlineTypeGoName,
      field.def.position
    );
    g.line(`if p.${field.goName} != nil {`);
    g.block(() => {
      g.line(`var ${valueName} ${valueType}`);
      renderTransformIntoValue(g, {
        context,
        depth: 0,
        destinationExpression: valueName,
        destinationType: valueType,
        inlineTypeGoName: field.inlineTypeGoName,
        position: field.def.position,
        sourceExpression: `p.${field.goName}`,
        sourceIsPointer: true,
        typeRef: field.def.typeRef
      });
      g.line(`${tempName} = &${valueName}`);
    });
    g.line("}");
    return;
  }
  renderTransformIntoValue(g, {
    context,
    depth: 0,
    destinationExpression: tempName,
    destinationType: field.goType,
    inlineTypeGoName: field.inlineTypeGoName,
    position: field.def.position,
    sourceExpression: `p.${field.goName}`,
    sourceIsPointer: true,
    typeRef: field.def.typeRef
  });
}
__name(renderFieldTransform, "renderFieldTransform");
function renderTransformIntoValue(g, options) {
  if (!typeRefNeedsStrictTraversal(
    options.typeRef,
    options.context,
    options.position
  )) {
    const valueExpression = options.sourceIsPointer ? `*${options.sourceExpression}` : options.sourceExpression;
    g.line(`${options.destinationExpression} = ${valueExpression}`);
    return;
  }
  const resolved = options.typeRef.kind === "type" ? resolveNonTypeRef(options.typeRef, options.context, options.position) : options.typeRef;
  switch (resolved.kind) {
    case "object":
      g.line(
        `${options.destinationExpression} = ${options.destinationType}(${options.sourceExpression}.transform())`
      );
      return;
    case "array":
      renderArrayTransformIntoValue(g, __spreadProps(__spreadValues({}, options), {
        typeRef: resolved
      }));
      return;
    case "map":
      renderMapTransformIntoValue(g, __spreadProps(__spreadValues({}, options), {
        typeRef: resolved
      }));
      return;
    default:
      return;
  }
}
__name(renderTransformIntoValue, "renderTransformIntoValue");
function renderArrayTransformIntoValue(g, options) {
  const itemTypeRef = getArrayItemTypeRef(options.typeRef, options.position);
  const rangeSource = options.sourceIsPointer ? `*${options.sourceExpression}` : options.sourceExpression;
  const itemDestinationType = renderGoType(
    itemTypeRef,
    options.context,
    options.inlineTypeGoName,
    options.position
  );
  const indexName = `vdlIndex${String(options.depth)}`;
  const itemName = `vdlItem${String(options.depth)}`;
  const transformedName = `vdlTransformed${String(options.depth)}`;
  g.line(
    `${options.destinationExpression} = make(${options.destinationType}, len(${rangeSource}))`
  );
  g.line(`for ${indexName}, ${itemName} := range ${rangeSource} {`);
  g.block(() => {
    if (!typeRefNeedsStrictTraversal(
      itemTypeRef,
      options.context,
      options.position
    )) {
      g.line(`${options.destinationExpression}[${indexName}] = ${itemName}`);
      return;
    }
    g.line(`var ${transformedName} ${itemDestinationType}`);
    renderTransformIntoValue(g, __spreadProps(__spreadValues({}, options), {
      depth: options.depth + 1,
      destinationExpression: transformedName,
      destinationType: itemDestinationType,
      sourceExpression: itemName,
      sourceIsPointer: false,
      typeRef: itemTypeRef
    }));
    g.line(
      `${options.destinationExpression}[${indexName}] = ${transformedName}`
    );
  });
  g.line("}");
}
__name(renderArrayTransformIntoValue, "renderArrayTransformIntoValue");
function renderMapTransformIntoValue(g, options) {
  const rangeSource = options.sourceIsPointer ? `*${options.sourceExpression}` : options.sourceExpression;
  const valueTypeRef = expectValue(
    options.typeRef.mapType,
    "Encountered a map type reference without a value type.",
    options.position
  );
  const valueDestinationType = renderGoType(
    valueTypeRef,
    options.context,
    options.inlineTypeGoName,
    options.position
  );
  const keyName = `vdlKey${String(options.depth)}`;
  const valueName = `vdlValue${String(options.depth)}`;
  const transformedName = `vdlTransformed${String(options.depth)}`;
  g.line(
    `${options.destinationExpression} = make(${options.destinationType}, len(${rangeSource}))`
  );
  g.line(`for ${keyName}, ${valueName} := range ${rangeSource} {`);
  g.block(() => {
    if (!typeRefNeedsStrictTraversal(
      valueTypeRef,
      options.context,
      options.position
    )) {
      g.line(`${options.destinationExpression}[${keyName}] = ${valueName}`);
      return;
    }
    g.line(`var ${transformedName} ${valueDestinationType}`);
    renderTransformIntoValue(g, __spreadProps(__spreadValues({}, options), {
      depth: options.depth + 1,
      destinationExpression: transformedName,
      destinationType: valueDestinationType,
      sourceExpression: valueName,
      sourceIsPointer: false,
      typeRef: valueTypeRef
    }));
    g.line(`${options.destinationExpression}[${keyName}] = ${transformedName}`);
  });
  g.line("}");
}
__name(renderMapTransformIntoValue, "renderMapTransformIntoValue");
function resolveStrictAliasBehavior(typeRef, context, position, visited = /* @__PURE__ */ new Set()) {
  switch (typeRef.kind) {
    case "enum":
      return "enum";
    case "object":
      return typeRefNeedsStrictTraversal(typeRef, context, position) ? "object" : void 0;
    case "type": {
      const typeName = expectValue(
        typeRef.typeName,
        "Encountered a named type reference without a type name.",
        position
      );
      if (visited.has(typeName)) {
        return void 0;
      }
      visited.add(typeName);
      return resolveStrictAliasBehavior(
        getReferencedTypeDef(typeName, context, position).typeRef,
        context,
        position,
        visited
      );
    }
    case "primitive":
    case "array":
    case "map":
      return void 0;
    default:
      return void 0;
  }
}
__name(resolveStrictAliasBehavior, "resolveStrictAliasBehavior");
function getReferencedTypeDef(typeName, context, position) {
  return expectValue(
    context.typeDefsByVdlName.get(typeName),
    `Unknown VDL type reference ${JSON.stringify(typeName)}.`,
    position
  );
}
__name(getReferencedTypeDef, "getReferencedTypeDef");
function getTypeGoName(typeName, context, position) {
  return expectValue(
    context.typeGoNamesByVdlName.get(typeName),
    `Unknown VDL type reference ${JSON.stringify(typeName)}.`,
    position
  );
}
__name(getTypeGoName, "getTypeGoName");
function getArrayItemTypeRef(typeRef, position) {
  var _a4, _b;
  return ((_a4 = typeRef.arrayDims) != null ? _a4 : 1) === 1 ? expectValue(
    typeRef.arrayType,
    "Encountered an array type reference without an element type.",
    position
  ) : {
    kind: "array",
    arrayDims: ((_b = typeRef.arrayDims) != null ? _b : 1) - 1,
    arrayType: expectValue(
      typeRef.arrayType,
      "Encountered an array type reference without an element type.",
      position
    )
  };
}
__name(getArrayItemTypeRef, "getArrayItemTypeRef");
function toPreTypeName(goName) {
  return `pre${goName}`;
}
__name(toPreTypeName, "toPreTypeName");
function renderFieldPathAssignment(g, variableName, parentExpression, fieldName) {
  g.line(`${variableName} := ${JSON.stringify(fieldName)}`);
  g.line(`if ${parentExpression} != "" {`);
  g.block(() => {
    g.line(
      `${variableName} = ${parentExpression} + ${JSON.stringify(`.${fieldName}`)}`
    );
  });
  g.line("}");
}
__name(renderFieldPathAssignment, "renderFieldPathAssignment");
function renderIndexPathAssignment(g, variableName, parentExpression, indexName) {
  g.line(
    `${variableName} := fmt.Sprintf(${JSON.stringify("%s[%d]")}, ${parentExpression}, ${indexName})`
  );
}
__name(renderIndexPathAssignment, "renderIndexPathAssignment");
function renderMapKeyPathAssignment(g, variableName, parentExpression, keyName) {
  g.line(
    `${variableName} := fmt.Sprintf(${JSON.stringify("%s[%q]")}, ${parentExpression}, ${keyName})`
  );
}
__name(renderMapKeyPathAssignment, "renderMapKeyPathAssignment");

// src/stages/emit/files/types-named-types.ts
function renderNamedType(g, descriptor, context) {
  const fallback = descriptor.inline ? `${descriptor.goName} represents the inline object declared at ${descriptor.path}.` : descriptor.kind === "object" ? `${descriptor.goName} represents a VDL object.` : `${descriptor.goName} declares a VDL type alias.`;
  writeDocComment(g, {
    doc: descriptor.doc,
    annotations: descriptor.annotations,
    fallback
  });
  if (descriptor.kind === "object") {
    renderStructType(g, descriptor);
    g.break();
    if (renderNamedTypeSchemaSupport(g, descriptor, context)) {
      g.break();
    }
    renderGetters(g, descriptor.fields, descriptor.goName);
    return;
  }
  g.line(
    `type ${descriptor.goName} ${renderGoType(descriptor.typeRef, context, void 0, descriptor.position)}`
  );
  if (renderNamedTypeSchemaSupport(g, descriptor, context)) {
    g.break();
  }
}
__name(renderNamedType, "renderNamedType");
function renderStructType(g, descriptor) {
  g.line(`type ${descriptor.goName} struct {`);
  g.block(() => {
    for (const field of descriptor.fields) {
      writeDocComment(g, {
        doc: field.def.doc,
        annotations: field.def.annotations
      });
      const jsonTag = field.def.optional ? `json:${JSON.stringify(`${field.jsonName},omitempty`)}` : `json:${JSON.stringify(field.jsonName)}`;
      g.line(`${field.goName} ${field.goType} \`${jsonTag}\``);
    }
  });
  g.line("}");
}
__name(renderStructType, "renderStructType");
function renderGetters(g, fields, receiverType) {
  for (const field of fields) {
    const valueType = stripPointer(field.goType);
    const getterFallback = field.def.optional ? `Get${field.goName} returns the ${field.goName} field. It returns the zero value when the receiver or field is nil.` : `Get${field.goName} returns the ${field.goName} field. It returns the zero value when the receiver is nil.`;
    const getterOrFallback = field.def.optional ? `Get${field.goName}Or returns the ${field.goName} field. It returns defaultValue when the receiver or field is nil.` : `Get${field.goName}Or returns the ${field.goName} field. It returns defaultValue when the receiver is nil.`;
    g.line(`// ${getterFallback}`);
    g.line(`func (x *${receiverType}) Get${field.goName}() ${valueType} {`);
    g.block(() => {
      if (field.def.optional) {
        g.line(`if x != nil && x.${field.goName} != nil {`);
        g.block(() => {
          g.line(`return *x.${field.goName}`);
        });
        g.line("}");
        g.line(`var zero ${valueType}`);
        g.line("return zero");
      } else {
        g.line("if x != nil {");
        g.block(() => {
          g.line(`return x.${field.goName}`);
        });
        g.line("}");
        g.line(`var zero ${field.goType}`);
        g.line("return zero");
      }
    });
    g.line("}");
    g.break();
    g.line(`// ${getterOrFallback}`);
    g.line(
      `func (x *${receiverType}) Get${field.goName}Or(defaultValue ${valueType}) ${valueType} {`
    );
    g.block(() => {
      if (field.def.optional) {
        g.line(`if x != nil && x.${field.goName} != nil {`);
        g.block(() => {
          g.line(`return *x.${field.goName}`);
        });
        g.line("}");
        g.line("return defaultValue");
      } else {
        g.line("if x != nil {");
        g.block(() => {
          g.line(`return x.${field.goName}`);
        });
        g.line("}");
        g.line("return defaultValue");
      }
    });
    g.line("}");
    if (field !== fields[fields.length - 1]) {
      g.break();
    }
  }
}
__name(renderGetters, "renderGetters");
function stripPointer(typeName) {
  return typeName.startsWith("*") ? typeName.slice(1) : typeName;
}
__name(stripPointer, "stripPointer");

// src/stages/emit/files/types.ts
function generateTypesFile(context) {
  if (context.namedTypes.length === 0) {
    return void 0;
  }
  const g = newGenerator().withTabs();
  for (const namedType of context.namedTypes) {
    renderNamedType(g, namedType, context);
    g.break();
  }
  return {
    path: "types.go",
    content: renderGoFile({
      packageName: context.options.packageName,
      body: g.toString()
    })
  };
}
__name(generateTypesFile, "generateTypesFile");

// src/stages/emit/generate-files.ts
function generateFiles(context) {
  return compact([
    generateEnumsFile(context),
    generateTypesFile(context),
    generateConstantsFile(context),
    generatePointersFile(context)
  ]);
}
__name(generateFiles, "generateFiles");

// src/stages/model/constants.ts
function populateConstantDescriptors(context, packageScopeSymbols) {
  var _a4;
  const errors = [];
  const typeByConstantName = new Map(
    context.schema.types.filter((typeDef) => typeDef.name.startsWith("$Const")).map((typeDef) => [typeDef.name.slice("$Const".length), typeDef.typeRef])
  );
  for (const constantDef of context.schema.constants) {
    const inferred = (_a4 = typeByConstantName.get(constantDef.name)) != null ? _a4 : inferTypeRefFromLiteral(constantDef.value);
    if (!inferred) {
      errors.push({
        message: `Could not infer a Go-compatible type for constant ${JSON.stringify(constantDef.name)}.`,
        position: constantDef.position
      });
      continue;
    }
    const descriptor = {
      def: constantDef,
      goName: toGoConstName(constantDef.name),
      typeRef: inferred
    };
    context.constantDescriptors.push(descriptor);
    const symbolError = packageScopeSymbols.reserve(
      descriptor.goName,
      `constant ${constantDef.name}`,
      constantDef.position
    );
    if (symbolError) {
      errors.push(symbolError);
    }
  }
  return errors;
}
__name(populateConstantDescriptors, "populateConstantDescriptors");
function inferTypeRefFromLiteral(literal) {
  var _a4, _b;
  switch (literal.kind) {
    case "string":
      return { kind: "primitive", primitiveName: "string" };
    case "int":
      return { kind: "primitive", primitiveName: "int" };
    case "float":
      return { kind: "primitive", primitiveName: "float" };
    case "bool":
      return { kind: "primitive", primitiveName: "bool" };
    case "array": {
      const items = (_a4 = literal.arrayItems) != null ? _a4 : [];
      const firstItem = items[0];
      if (!firstItem) {
        return void 0;
      }
      const itemType = inferTypeRefFromLiteral(firstItem);
      if (!itemType) {
        return void 0;
      }
      for (const item of items.slice(1)) {
        const candidate = inferTypeRefFromLiteral(item);
        if (!candidate || !typeRefsMatch(itemType, candidate)) {
          return void 0;
        }
      }
      return { kind: "array", arrayDims: 1, arrayType: itemType };
    }
    case "object": {
      const objectFields = [];
      for (const entry of getEffectiveObjectEntries(
        (_b = literal.objectEntries) != null ? _b : []
      )) {
        const fieldType = inferTypeRefFromLiteral(entry.value);
        if (!fieldType) {
          return void 0;
        }
        objectFields.push({
          annotations: [],
          name: entry.key,
          optional: false,
          position: entry.position,
          typeRef: fieldType
        });
      }
      return { kind: "object", objectFields };
    }
    default:
      return void 0;
  }
}
__name(inferTypeRefFromLiteral, "inferTypeRefFromLiteral");
function getEffectiveObjectEntries(entries) {
  const entryByKey = /* @__PURE__ */ new Map();
  for (const entry of entries) {
    entryByKey.set(entry.key, entry);
  }
  return [...entryByKey.values()];
}
__name(getEffectiveObjectEntries, "getEffectiveObjectEntries");
function typeRefsMatch(left, right) {
  var _a4, _b, _c, _d;
  if (left.kind !== right.kind) {
    return false;
  }
  switch (left.kind) {
    case "primitive":
      return left.primitiveName === right.primitiveName;
    case "type":
      return left.typeName === right.typeName;
    case "enum":
      return left.enumName === right.enumName && left.enumType === right.enumType;
    case "array":
      if (!left.arrayType || !right.arrayType) {
        return false;
      }
      return ((_a4 = left.arrayDims) != null ? _a4 : 1) === ((_b = right.arrayDims) != null ? _b : 1) && typeRefsMatch(left.arrayType, right.arrayType);
    case "map":
      if (!left.mapType || !right.mapType) {
        return false;
      }
      return typeRefsMatch(left.mapType, right.mapType);
    case "object": {
      const leftFields = (_c = left.objectFields) != null ? _c : [];
      const rightFields = (_d = right.objectFields) != null ? _d : [];
      if (leftFields.length !== rightFields.length) {
        return false;
      }
      return leftFields.every((field, index) => {
        const otherField = rightFields[index];
        return otherField !== void 0 && field.name === otherField.name && field.optional === otherField.optional && typeRefsMatch(field.typeRef, otherField.typeRef);
      });
    }
    default:
      return false;
  }
}
__name(typeRefsMatch, "typeRefsMatch");

// src/stages/model/enums.ts
function populateEnumDescriptors(context, packageScopeSymbols) {
  const errors = [];
  for (const enumDef of context.schema.enums) {
    const descriptor = buildEnumDescriptor(enumDef, context, errors);
    context.enumDescriptors.push(descriptor);
    context.enumDescriptorsByVdlName.set(enumDef.name, descriptor);
    const goNameError = packageScopeSymbols.reserve(
      descriptor.goName,
      `enum ${enumDef.name}`,
      enumDef.position
    );
    if (goNameError) {
      errors.push(goNameError);
    }
    const listError = packageScopeSymbols.reserve(
      descriptor.listGoName,
      `enum list ${enumDef.name}`,
      enumDef.position
    );
    if (listError) {
      errors.push(listError);
    }
    for (const member of descriptor.members) {
      const symbolError = packageScopeSymbols.reserve(
        member.constName,
        `enum member ${enumDef.name}.${member.def.name}`,
        member.def.position
      );
      if (symbolError) {
        errors.push(symbolError);
      }
    }
  }
  return errors;
}
__name(populateEnumDescriptors, "populateEnumDescriptors");
function buildEnumDescriptor(enumDef, context, errors) {
  var _a4;
  const goName = (_a4 = context.enumGoNamesByVdlName.get(enumDef.name)) != null ? _a4 : enumDef.name;
  const usedMemberNames = /* @__PURE__ */ new Set();
  const members = [];
  const memberByValue = /* @__PURE__ */ new Map();
  for (const member of enumDef.members) {
    const memberGoName = toGoEnumMemberName(member.name);
    if (usedMemberNames.has(memberGoName)) {
      errors.push({
        message: `Generated enum member name ${JSON.stringify(memberGoName)} collides within enum ${JSON.stringify(enumDef.name)}.`,
        position: member.position
      });
      continue;
    }
    usedMemberNames.add(memberGoName);
    const descriptor = {
      def: member,
      goName: memberGoName,
      constName: `${goName}${memberGoName}`,
      valueKey: hash2(member.value)
    };
    members.push(descriptor);
    if (!memberByValue.has(descriptor.valueKey)) {
      memberByValue.set(descriptor.valueKey, descriptor);
    }
  }
  return {
    def: enumDef,
    goName,
    listGoName: `${goName}List`,
    members,
    memberByValue
  };
}
__name(buildEnumDescriptor, "buildEnumDescriptor");

// src/stages/model/fields.ts
function buildFieldDescriptors(options) {
  const errors = [];
  const usedGoNames = /* @__PURE__ */ new Set();
  const descriptors = [];
  for (const field of options.fields) {
    const goName = toGoFieldName(field.name);
    if (usedGoNames.has(goName)) {
      errors.push({
        message: `Generated Go field ${JSON.stringify(goName)} collides within ${options.parentGoName}.`,
        position: field.position
      });
      continue;
    }
    usedGoNames.add(goName);
    const inlineTypeGoName = toInlineTypeName(options.parentGoName, field.name);
    const goType = renderGoType(
      field.typeRef,
      options.context,
      inlineTypeGoName,
      field.position
    );
    descriptors.push({
      def: field,
      goName,
      jsonName: field.name,
      goType: field.optional ? `*${goType}` : goType,
      inlineTypeGoName
    });
  }
  return {
    fields: descriptors,
    errors
  };
}
__name(buildFieldDescriptors, "buildFieldDescriptors");

// src/stages/model/named-types.ts
function populateNamedTypes(context, packageScopeSymbols) {
  const errors = [];
  const seenGoNames = /* @__PURE__ */ new Set();
  for (const typeDef of context.schema.types) {
    appendNamedTypeDescriptor(
      context,
      buildTopLevelTypeDescriptor(typeDef, context, errors),
      seenGoNames,
      packageScopeSymbols,
      errors
    );
  }
  return errors;
}
__name(populateNamedTypes, "populateNamedTypes");
function buildTopLevelTypeDescriptor(typeDef, context, errors) {
  var _a4, _b;
  const goName = (_a4 = context.typeGoNamesByVdlName.get(typeDef.name)) != null ? _a4 : typeDef.name;
  const fieldResult = buildFieldDescriptors({
    parentGoName: goName,
    fields: (_b = typeDef.typeRef.objectFields) != null ? _b : [],
    context
  });
  errors.push(...fieldResult.errors);
  return {
    goName,
    vdlName: typeDef.name,
    path: typeDef.name,
    inline: false,
    doc: typeDef.doc,
    annotations: typeDef.annotations,
    position: typeDef.position,
    kind: typeDef.typeRef.kind,
    typeRef: typeDef.typeRef,
    fields: fieldResult.fields
  };
}
__name(buildTopLevelTypeDescriptor, "buildTopLevelTypeDescriptor");
function buildInlineTypeDescriptor(options) {
  var _a4;
  const goName = toInlineTypeName(options.parentGoName, options.fieldName);
  const fieldResult = buildFieldDescriptors({
    parentGoName: goName,
    fields: (_a4 = options.typeRef.objectFields) != null ? _a4 : [],
    context: options.context
  });
  options.errors.push(...fieldResult.errors);
  return {
    goName,
    vdlName: options.fieldName,
    path: options.path,
    inline: true,
    annotations: [],
    position: options.fieldPosition,
    kind: "object",
    typeRef: options.typeRef,
    fields: fieldResult.fields
  };
}
__name(buildInlineTypeDescriptor, "buildInlineTypeDescriptor");
function appendNamedTypeDescriptor(context, descriptor, seenGoNames, packageScopeSymbols, errors) {
  if (seenGoNames.has(descriptor.goName)) {
    errors.push({
      message: `Generated Go type name ${JSON.stringify(descriptor.goName)} collides with another generated type.`,
      position: descriptor.position
    });
    return;
  }
  seenGoNames.add(descriptor.goName);
  context.namedTypes.push(descriptor);
  const symbolError = packageScopeSymbols.reserve(
    descriptor.goName,
    descriptor.inline ? `inline type ${descriptor.path}` : `type ${descriptor.vdlName}`,
    descriptor.position
  );
  if (symbolError) {
    errors.push(symbolError);
  }
  for (const fieldDescriptor of descriptor.fields) {
    appendInlineTypesFromTypeRef({
      context,
      parentGoName: descriptor.goName,
      parentPath: descriptor.path,
      field: fieldDescriptor.def,
      typeRef: fieldDescriptor.def.typeRef,
      seenGoNames,
      packageScopeSymbols,
      errors
    });
  }
}
__name(appendNamedTypeDescriptor, "appendNamedTypeDescriptor");
function appendInlineTypesFromTypeRef(options) {
  switch (options.typeRef.kind) {
    case "array":
      if (options.typeRef.arrayType) {
        appendInlineTypesFromTypeRef(__spreadProps(__spreadValues({}, options), {
          typeRef: options.typeRef.arrayType
        }));
      }
      return;
    case "map":
      if (options.typeRef.mapType) {
        appendInlineTypesFromTypeRef(__spreadProps(__spreadValues({}, options), {
          typeRef: options.typeRef.mapType
        }));
      }
      return;
    case "object": {
      const descriptor = buildInlineTypeDescriptor({
        parentGoName: options.parentGoName,
        path: `${options.parentPath}.${options.field.name}`,
        fieldName: options.field.name,
        fieldPosition: options.field.position,
        typeRef: options.typeRef,
        context: options.context,
        errors: options.errors
      });
      appendNamedTypeDescriptor(
        options.context,
        descriptor,
        options.seenGoNames,
        options.packageScopeSymbols,
        options.errors
      );
      return;
    }
    case "primitive":
    case "type":
    case "enum":
      return;
    default:
      return;
  }
}
__name(appendInlineTypesFromTypeRef, "appendInlineTypesFromTypeRef");

// src/stages/model/symbols.ts
var RESERVED_PACKAGE_SCOPE_SYMBOLS = ["Ptr", "Val", "Or"];
var _symbols;
var _PackageScopeSymbolTable = class _PackageScopeSymbolTable {
  constructor() {
    __privateAdd(this, _symbols, /* @__PURE__ */ new Map());
    for (const symbol of RESERVED_PACKAGE_SCOPE_SYMBOLS) {
      __privateGet(this, _symbols).set(symbol, {
        origin: "generated runtime support symbol"
      });
    }
  }
  /**
   * Attempts to reserve a Go identifier in the package scope.
   *
   * @param name - The Go identifier to reserve.
   * @param origin - A description of why the symbol is being reserved (for error reporting).
   * @param position - The VDL source position related to the symbol.
   * @returns An error if the symbol is already reserved, otherwise undefined.
   */
  reserve(name, origin, position) {
    const existing = __privateGet(this, _symbols).get(name);
    if (existing) {
      return {
        message: `Generated Go symbol ${JSON.stringify(name)} for ${origin} collides with ${existing.origin}.`,
        position
      };
    }
    __privateGet(this, _symbols).set(name, { origin, position });
    return void 0;
  }
};
_symbols = new WeakMap();
__name(_PackageScopeSymbolTable, "PackageScopeSymbolTable");
var PackageScopeSymbolTable = _PackageScopeSymbolTable;

// src/stages/model/build-context.ts
function createGeneratorContext(options) {
  const packageScopeSymbols = new PackageScopeSymbolTable();
  const context = {
    schema: options.schema,
    options: options.generatorOptions,
    typeDefsByVdlName: new Map(
      options.schema.types.map((typeDef) => [typeDef.name, typeDef])
    ),
    typeGoNamesByVdlName: new Map(
      options.schema.types.map((typeDef) => [
        typeDef.name,
        toGoTypeName(typeDef.name)
      ])
    ),
    enumGoNamesByVdlName: new Map(
      options.schema.enums.map((enumDef) => [
        enumDef.name,
        toGoTypeName(enumDef.name)
      ])
    ),
    namedTypes: [],
    enumDescriptors: [],
    enumDescriptorsByVdlName: /* @__PURE__ */ new Map(),
    constantDescriptors: []
  };
  const errors = [
    ...populateNamedTypes(context, packageScopeSymbols),
    ...populateEnumDescriptors(context, packageScopeSymbols),
    ...context.options.genConsts ? populateConstantDescriptors(context, packageScopeSymbols) : []
  ];
  if (errors.length > 0) {
    return { errors };
  }
  return {
    context,
    errors: []
  };
}
__name(createGeneratorContext, "createGeneratorContext");

// node_modules/@varavel/vdl-plugin-sdk/dist/utils/options/get-option-bool.js
function getOptionBool(options, key, defaultValue) {
  const value = options === null || options === void 0 ? void 0 : options[key];
  if (value === void 0) return defaultValue;
  switch (value.trim().toLowerCase()) {
    case "true":
    case "1":
    case "yes":
    case "on":
    case "enable":
    case "enabled":
    case "y":
      return true;
    case "false":
    case "0":
    case "no":
    case "off":
    case "disable":
    case "disabled":
    case "n":
      return false;
    default:
      return defaultValue;
  }
}
__name(getOptionBool, "getOptionBool");

// node_modules/@varavel/vdl-plugin-sdk/dist/utils/options/get-option-string.js
function getOptionString(options, key, defaultValue) {
  const value = options === null || options === void 0 ? void 0 : options[key];
  return value === void 0 ? defaultValue : value;
}
__name(getOptionString, "getOptionString");

// src/stages/options/resolve.ts
function resolveGeneratorOptions(input) {
  const packageName = getOptionString(input.options, "package", "vdl");
  const genConsts = getOptionBool(input.options, "genConsts", true);
  const strict = getOptionBool(input.options, "strict", true);
  const genPointerUtils = getOptionBool(
    input.options,
    "genPointerUtils",
    true
  );
  if (!isValidGoPackageName(packageName)) {
    return {
      errors: [
        {
          message: `Invalid Go package name ${JSON.stringify(packageName)}. Use a lowercase Go identifier.`
        }
      ]
    };
  }
  return {
    errors: [],
    options: {
      packageName,
      genConsts,
      strict,
      genPointerUtils
    }
  };
}
__name(resolveGeneratorOptions, "resolveGeneratorOptions");

// src/generate.ts
function generate(input) {
  try {
    const optionsResult = resolveGeneratorOptions(input);
    if (optionsResult.errors.length > 0 || !optionsResult.options) {
      return {
        errors: optionsResult.errors
      };
    }
    const contextResult = createGeneratorContext({
      schema: input.ir,
      generatorOptions: optionsResult.options
    });
    if (contextResult.errors.length > 0 || !contextResult.context) {
      return {
        errors: contextResult.errors
      };
    }
    return {
      files: generateFiles(contextResult.context)
    };
  } catch (error) {
    return {
      errors: [toPluginOutputError(error)]
    };
  }
}
__name(generate, "generate");

// src/index.ts
var generate2 = definePlugin((input) => generate(input));
