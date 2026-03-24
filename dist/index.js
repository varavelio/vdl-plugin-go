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

// node_modules/@varavel/vdl-plugin-sdk/dist/types-DqmMLTFd.js
var EnumValueType = {
  String: "string",
  Int: "int",
  values() {
    return ["string", "int"];
  },
  parse(json) {
    const input = _vdl$1.parseJson(json);
    const error = EnumValueType.validate(input);
    if (error !== null) throw new Error(error);
    return EnumValueType.hydrate(input);
  },
  validate(input, path = "EnumValueType") {
    if (!_vdl$1.arrayIncludes(EnumValueType.values(), input)) return `${path}: invalid value "${String(input)}" for EnumValueType enum`;
    return null;
  },
  hydrate(input) {
    return input;
  }
};
var LiteralKind = {
  String: "string",
  Int: "int",
  Float: "float",
  Bool: "bool",
  Object: "object",
  Array: "array",
  values() {
    return [
      "string",
      "int",
      "float",
      "bool",
      "object",
      "array"
    ];
  },
  parse(json) {
    const input = _vdl$1.parseJson(json);
    const error = LiteralKind.validate(input);
    if (error !== null) throw new Error(error);
    return LiteralKind.hydrate(input);
  },
  validate(input, path = "LiteralKind") {
    if (!_vdl$1.arrayIncludes(LiteralKind.values(), input)) return `${path}: invalid value "${String(input)}" for LiteralKind enum`;
    return null;
  },
  hydrate(input) {
    return input;
  }
};
var PrimitiveType = {
  String: "string",
  Int: "int",
  Float: "float",
  Bool: "bool",
  Datetime: "datetime",
  values() {
    return [
      "string",
      "int",
      "float",
      "bool",
      "datetime"
    ];
  },
  parse(json) {
    const input = _vdl$1.parseJson(json);
    const error = PrimitiveType.validate(input);
    if (error !== null) throw new Error(error);
    return PrimitiveType.hydrate(input);
  },
  validate(input, path = "PrimitiveType") {
    if (!_vdl$1.arrayIncludes(PrimitiveType.values(), input)) return `${path}: invalid value "${String(input)}" for PrimitiveType enum`;
    return null;
  },
  hydrate(input) {
    return input;
  }
};
var TypeKind = {
  Primitive: "primitive",
  Type: "type",
  Enum: "enum",
  Array: "array",
  Map: "map",
  Object: "object",
  values() {
    return [
      "primitive",
      "type",
      "enum",
      "array",
      "map",
      "object"
    ];
  },
  parse(json) {
    const input = _vdl$1.parseJson(json);
    const error = TypeKind.validate(input);
    if (error !== null) throw new Error(error);
    return TypeKind.hydrate(input);
  },
  validate(input, path = "TypeKind") {
    if (!_vdl$1.arrayIncludes(TypeKind.values(), input)) return `${path}: invalid value "${String(input)}" for TypeKind enum`;
    return null;
  },
  hydrate(input) {
    return input;
  }
};
var _vdl$1 = {
  parseJson(json) {
    try {
      return JSON.parse(json);
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      throw new Error(`Invalid JSON input: ${message}`);
    }
  },
  arrayIncludes(values, value) {
    for (let index = 0; index < values.length; index += 1) if (values[index] === value) return true;
    return false;
  }
};
var Annotation = {
  parse(json) {
    const input = _vdl.parseJson(json);
    const error = Annotation.validate(input);
    if (error !== null) throw new Error(error);
    return Annotation.hydrate(input);
  },
  validate(input, path = "Annotation") {
    if (!_vdl.isRecord(input)) return `${path}: expected object, got ${_vdl.describeValue(input)}`;
    const record0 = input;
    const fieldPath0_0 = `${path}.position`;
    if (!_vdl.hasOwn(record0, "position") || record0["position"] === void 0) return `${fieldPath0_0}: required field is missing`;
    {
      const error = Position.validate(record0["position"], fieldPath0_0);
      if (error !== null) return error;
    }
    const fieldPath0_1 = `${path}.name`;
    if (!_vdl.hasOwn(record0, "name") || record0["name"] === void 0) return `${fieldPath0_1}: required field is missing`;
    if (typeof record0["name"] !== "string") return `${fieldPath0_1}: expected string, got ${_vdl.describeValue(record0["name"])}`;
    const fieldPath0_2 = `${path}.argument`;
    if (_vdl.hasOwn(record0, "argument") && record0["argument"] !== void 0) {
      const error = LiteralValue.validate(record0["argument"], fieldPath0_2);
      if (error !== null) return error;
    }
    return null;
  },
  hydrate(input) {
    return _vdl.withOptional({
      position: Position.hydrate(input.position),
      name: input.name
    }, "argument", input.argument === void 0 ? void 0 : LiteralValue.hydrate(input.argument));
  }
};
var ConstantDef = {
  parse(json) {
    const input = _vdl.parseJson(json);
    const error = ConstantDef.validate(input);
    if (error !== null) throw new Error(error);
    return ConstantDef.hydrate(input);
  },
  validate(input, path = "ConstantDef") {
    if (!_vdl.isRecord(input)) return `${path}: expected object, got ${_vdl.describeValue(input)}`;
    const record0 = input;
    const fieldPath0_0 = `${path}.position`;
    if (!_vdl.hasOwn(record0, "position") || record0["position"] === void 0) return `${fieldPath0_0}: required field is missing`;
    {
      const error = Position.validate(record0["position"], fieldPath0_0);
      if (error !== null) return error;
    }
    const fieldPath0_1 = `${path}.name`;
    if (!_vdl.hasOwn(record0, "name") || record0["name"] === void 0) return `${fieldPath0_1}: required field is missing`;
    if (typeof record0["name"] !== "string") return `${fieldPath0_1}: expected string, got ${_vdl.describeValue(record0["name"])}`;
    const fieldPath0_2 = `${path}.doc`;
    if (_vdl.hasOwn(record0, "doc") && record0["doc"] !== void 0) {
      if (typeof record0["doc"] !== "string") return `${fieldPath0_2}: expected string, got ${_vdl.describeValue(record0["doc"])}`;
    }
    const fieldPath0_3 = `${path}.annotations`;
    if (!_vdl.hasOwn(record0, "annotations") || record0["annotations"] === void 0) return `${fieldPath0_3}: required field is missing`;
    if (!Array.isArray(record0["annotations"])) return `${fieldPath0_3}: expected array, got ${_vdl.describeValue(record0["annotations"])}`;
    for (let index1 = 0; index1 < record0["annotations"].length; index1 += 1) {
      const itemPath1 = `${fieldPath0_3}[${index1}]`;
      {
        const error = Annotation.validate(record0["annotations"][index1], itemPath1);
        if (error !== null) return error;
      }
    }
    const fieldPath0_4 = `${path}.value`;
    if (!_vdl.hasOwn(record0, "value") || record0["value"] === void 0) return `${fieldPath0_4}: required field is missing`;
    {
      const error = LiteralValue.validate(record0["value"], fieldPath0_4);
      if (error !== null) return error;
    }
    return null;
  },
  hydrate(input) {
    return _vdl.withOptional({
      position: Position.hydrate(input.position),
      name: input.name,
      annotations: input.annotations.map((item1) => Annotation.hydrate(item1)),
      value: LiteralValue.hydrate(input.value)
    }, "doc", input.doc === void 0 ? void 0 : input.doc);
  }
};
var EnumDef = {
  parse(json) {
    const input = _vdl.parseJson(json);
    const error = EnumDef.validate(input);
    if (error !== null) throw new Error(error);
    return EnumDef.hydrate(input);
  },
  validate(input, path = "EnumDef") {
    if (!_vdl.isRecord(input)) return `${path}: expected object, got ${_vdl.describeValue(input)}`;
    const record0 = input;
    const fieldPath0_0 = `${path}.position`;
    if (!_vdl.hasOwn(record0, "position") || record0["position"] === void 0) return `${fieldPath0_0}: required field is missing`;
    {
      const error = Position.validate(record0["position"], fieldPath0_0);
      if (error !== null) return error;
    }
    const fieldPath0_1 = `${path}.name`;
    if (!_vdl.hasOwn(record0, "name") || record0["name"] === void 0) return `${fieldPath0_1}: required field is missing`;
    if (typeof record0["name"] !== "string") return `${fieldPath0_1}: expected string, got ${_vdl.describeValue(record0["name"])}`;
    const fieldPath0_2 = `${path}.doc`;
    if (_vdl.hasOwn(record0, "doc") && record0["doc"] !== void 0) {
      if (typeof record0["doc"] !== "string") return `${fieldPath0_2}: expected string, got ${_vdl.describeValue(record0["doc"])}`;
    }
    const fieldPath0_3 = `${path}.annotations`;
    if (!_vdl.hasOwn(record0, "annotations") || record0["annotations"] === void 0) return `${fieldPath0_3}: required field is missing`;
    if (!Array.isArray(record0["annotations"])) return `${fieldPath0_3}: expected array, got ${_vdl.describeValue(record0["annotations"])}`;
    for (let index1 = 0; index1 < record0["annotations"].length; index1 += 1) {
      const itemPath1 = `${fieldPath0_3}[${index1}]`;
      {
        const error = Annotation.validate(record0["annotations"][index1], itemPath1);
        if (error !== null) return error;
      }
    }
    const fieldPath0_4 = `${path}.enumType`;
    if (!_vdl.hasOwn(record0, "enumType") || record0["enumType"] === void 0) return `${fieldPath0_4}: required field is missing`;
    {
      const error = EnumValueType.validate(record0["enumType"], fieldPath0_4);
      if (error !== null) return error;
    }
    const fieldPath0_5 = `${path}.members`;
    if (!_vdl.hasOwn(record0, "members") || record0["members"] === void 0) return `${fieldPath0_5}: required field is missing`;
    if (!Array.isArray(record0["members"])) return `${fieldPath0_5}: expected array, got ${_vdl.describeValue(record0["members"])}`;
    for (let index1 = 0; index1 < record0["members"].length; index1 += 1) {
      const itemPath1 = `${fieldPath0_5}[${index1}]`;
      {
        const error = EnumMember.validate(record0["members"][index1], itemPath1);
        if (error !== null) return error;
      }
    }
    return null;
  },
  hydrate(input) {
    return _vdl.withOptional({
      position: Position.hydrate(input.position),
      name: input.name,
      annotations: input.annotations.map((item1) => Annotation.hydrate(item1)),
      enumType: EnumValueType.hydrate(input.enumType),
      members: input.members.map((item1) => EnumMember.hydrate(item1))
    }, "doc", input.doc === void 0 ? void 0 : input.doc);
  }
};
var EnumMember = {
  parse(json) {
    const input = _vdl.parseJson(json);
    const error = EnumMember.validate(input);
    if (error !== null) throw new Error(error);
    return EnumMember.hydrate(input);
  },
  validate(input, path = "EnumMember") {
    if (!_vdl.isRecord(input)) return `${path}: expected object, got ${_vdl.describeValue(input)}`;
    const record0 = input;
    const fieldPath0_0 = `${path}.position`;
    if (!_vdl.hasOwn(record0, "position") || record0["position"] === void 0) return `${fieldPath0_0}: required field is missing`;
    {
      const error = Position.validate(record0["position"], fieldPath0_0);
      if (error !== null) return error;
    }
    const fieldPath0_1 = `${path}.name`;
    if (!_vdl.hasOwn(record0, "name") || record0["name"] === void 0) return `${fieldPath0_1}: required field is missing`;
    if (typeof record0["name"] !== "string") return `${fieldPath0_1}: expected string, got ${_vdl.describeValue(record0["name"])}`;
    const fieldPath0_2 = `${path}.value`;
    if (!_vdl.hasOwn(record0, "value") || record0["value"] === void 0) return `${fieldPath0_2}: required field is missing`;
    {
      const error = LiteralValue.validate(record0["value"], fieldPath0_2);
      if (error !== null) return error;
    }
    const fieldPath0_3 = `${path}.doc`;
    if (_vdl.hasOwn(record0, "doc") && record0["doc"] !== void 0) {
      if (typeof record0["doc"] !== "string") return `${fieldPath0_3}: expected string, got ${_vdl.describeValue(record0["doc"])}`;
    }
    const fieldPath0_4 = `${path}.annotations`;
    if (!_vdl.hasOwn(record0, "annotations") || record0["annotations"] === void 0) return `${fieldPath0_4}: required field is missing`;
    if (!Array.isArray(record0["annotations"])) return `${fieldPath0_4}: expected array, got ${_vdl.describeValue(record0["annotations"])}`;
    for (let index1 = 0; index1 < record0["annotations"].length; index1 += 1) {
      const itemPath1 = `${fieldPath0_4}[${index1}]`;
      {
        const error = Annotation.validate(record0["annotations"][index1], itemPath1);
        if (error !== null) return error;
      }
    }
    return null;
  },
  hydrate(input) {
    return _vdl.withOptional({
      position: Position.hydrate(input.position),
      name: input.name,
      value: LiteralValue.hydrate(input.value),
      annotations: input.annotations.map((item1) => Annotation.hydrate(item1))
    }, "doc", input.doc === void 0 ? void 0 : input.doc);
  }
};
var Field = {
  parse(json) {
    const input = _vdl.parseJson(json);
    const error = Field.validate(input);
    if (error !== null) throw new Error(error);
    return Field.hydrate(input);
  },
  validate(input, path = "Field") {
    if (!_vdl.isRecord(input)) return `${path}: expected object, got ${_vdl.describeValue(input)}`;
    const record0 = input;
    const fieldPath0_0 = `${path}.position`;
    if (!_vdl.hasOwn(record0, "position") || record0["position"] === void 0) return `${fieldPath0_0}: required field is missing`;
    {
      const error = Position.validate(record0["position"], fieldPath0_0);
      if (error !== null) return error;
    }
    const fieldPath0_1 = `${path}.name`;
    if (!_vdl.hasOwn(record0, "name") || record0["name"] === void 0) return `${fieldPath0_1}: required field is missing`;
    if (typeof record0["name"] !== "string") return `${fieldPath0_1}: expected string, got ${_vdl.describeValue(record0["name"])}`;
    const fieldPath0_2 = `${path}.doc`;
    if (_vdl.hasOwn(record0, "doc") && record0["doc"] !== void 0) {
      if (typeof record0["doc"] !== "string") return `${fieldPath0_2}: expected string, got ${_vdl.describeValue(record0["doc"])}`;
    }
    const fieldPath0_3 = `${path}.optional`;
    if (!_vdl.hasOwn(record0, "optional") || record0["optional"] === void 0) return `${fieldPath0_3}: required field is missing`;
    if (typeof record0["optional"] !== "boolean") return `${fieldPath0_3}: expected boolean, got ${_vdl.describeValue(record0["optional"])}`;
    const fieldPath0_4 = `${path}.annotations`;
    if (!_vdl.hasOwn(record0, "annotations") || record0["annotations"] === void 0) return `${fieldPath0_4}: required field is missing`;
    if (!Array.isArray(record0["annotations"])) return `${fieldPath0_4}: expected array, got ${_vdl.describeValue(record0["annotations"])}`;
    for (let index1 = 0; index1 < record0["annotations"].length; index1 += 1) {
      const itemPath1 = `${fieldPath0_4}[${index1}]`;
      {
        const error = Annotation.validate(record0["annotations"][index1], itemPath1);
        if (error !== null) return error;
      }
    }
    const fieldPath0_5 = `${path}.typeRef`;
    if (!_vdl.hasOwn(record0, "typeRef") || record0["typeRef"] === void 0) return `${fieldPath0_5}: required field is missing`;
    {
      const error = TypeRef.validate(record0["typeRef"], fieldPath0_5);
      if (error !== null) return error;
    }
    return null;
  },
  hydrate(input) {
    return _vdl.withOptional({
      position: Position.hydrate(input.position),
      name: input.name,
      optional: input.optional,
      annotations: input.annotations.map((item1) => Annotation.hydrate(item1)),
      typeRef: TypeRef.hydrate(input.typeRef)
    }, "doc", input.doc === void 0 ? void 0 : input.doc);
  }
};
var IrSchema = {
  parse(json) {
    const input = _vdl.parseJson(json);
    const error = IrSchema.validate(input);
    if (error !== null) throw new Error(error);
    return IrSchema.hydrate(input);
  },
  validate(input, path = "IrSchema") {
    if (!_vdl.isRecord(input)) return `${path}: expected object, got ${_vdl.describeValue(input)}`;
    const record0 = input;
    const fieldPath0_0 = `${path}.entryPoint`;
    if (!_vdl.hasOwn(record0, "entryPoint") || record0["entryPoint"] === void 0) return `${fieldPath0_0}: required field is missing`;
    if (typeof record0["entryPoint"] !== "string") return `${fieldPath0_0}: expected string, got ${_vdl.describeValue(record0["entryPoint"])}`;
    const fieldPath0_1 = `${path}.constants`;
    if (!_vdl.hasOwn(record0, "constants") || record0["constants"] === void 0) return `${fieldPath0_1}: required field is missing`;
    if (!Array.isArray(record0["constants"])) return `${fieldPath0_1}: expected array, got ${_vdl.describeValue(record0["constants"])}`;
    for (let index1 = 0; index1 < record0["constants"].length; index1 += 1) {
      const itemPath1 = `${fieldPath0_1}[${index1}]`;
      {
        const error = ConstantDef.validate(record0["constants"][index1], itemPath1);
        if (error !== null) return error;
      }
    }
    const fieldPath0_2 = `${path}.enums`;
    if (!_vdl.hasOwn(record0, "enums") || record0["enums"] === void 0) return `${fieldPath0_2}: required field is missing`;
    if (!Array.isArray(record0["enums"])) return `${fieldPath0_2}: expected array, got ${_vdl.describeValue(record0["enums"])}`;
    for (let index1 = 0; index1 < record0["enums"].length; index1 += 1) {
      const itemPath1 = `${fieldPath0_2}[${index1}]`;
      {
        const error = EnumDef.validate(record0["enums"][index1], itemPath1);
        if (error !== null) return error;
      }
    }
    const fieldPath0_3 = `${path}.types`;
    if (!_vdl.hasOwn(record0, "types") || record0["types"] === void 0) return `${fieldPath0_3}: required field is missing`;
    if (!Array.isArray(record0["types"])) return `${fieldPath0_3}: expected array, got ${_vdl.describeValue(record0["types"])}`;
    for (let index1 = 0; index1 < record0["types"].length; index1 += 1) {
      const itemPath1 = `${fieldPath0_3}[${index1}]`;
      {
        const error = TypeDef.validate(record0["types"][index1], itemPath1);
        if (error !== null) return error;
      }
    }
    const fieldPath0_4 = `${path}.docs`;
    if (!_vdl.hasOwn(record0, "docs") || record0["docs"] === void 0) return `${fieldPath0_4}: required field is missing`;
    if (!Array.isArray(record0["docs"])) return `${fieldPath0_4}: expected array, got ${_vdl.describeValue(record0["docs"])}`;
    for (let index1 = 0; index1 < record0["docs"].length; index1 += 1) {
      const itemPath1 = `${fieldPath0_4}[${index1}]`;
      {
        const error = TopLevelDoc.validate(record0["docs"][index1], itemPath1);
        if (error !== null) return error;
      }
    }
    return null;
  },
  hydrate(input) {
    return {
      entryPoint: input.entryPoint,
      constants: input.constants.map((item1) => ConstantDef.hydrate(item1)),
      enums: input.enums.map((item1) => EnumDef.hydrate(item1)),
      types: input.types.map((item1) => TypeDef.hydrate(item1)),
      docs: input.docs.map((item1) => TopLevelDoc.hydrate(item1))
    };
  }
};
var LiteralValue = {
  parse(json) {
    const input = _vdl.parseJson(json);
    const error = LiteralValue.validate(input);
    if (error !== null) throw new Error(error);
    return LiteralValue.hydrate(input);
  },
  validate(input, path = "LiteralValue") {
    if (!_vdl.isRecord(input)) return `${path}: expected object, got ${_vdl.describeValue(input)}`;
    const record0 = input;
    const fieldPath0_0 = `${path}.position`;
    if (!_vdl.hasOwn(record0, "position") || record0["position"] === void 0) return `${fieldPath0_0}: required field is missing`;
    {
      const error = Position.validate(record0["position"], fieldPath0_0);
      if (error !== null) return error;
    }
    const fieldPath0_1 = `${path}.kind`;
    if (!_vdl.hasOwn(record0, "kind") || record0["kind"] === void 0) return `${fieldPath0_1}: required field is missing`;
    {
      const error = LiteralKind.validate(record0["kind"], fieldPath0_1);
      if (error !== null) return error;
    }
    const fieldPath0_2 = `${path}.stringValue`;
    if (_vdl.hasOwn(record0, "stringValue") && record0["stringValue"] !== void 0) {
      if (typeof record0["stringValue"] !== "string") return `${fieldPath0_2}: expected string, got ${_vdl.describeValue(record0["stringValue"])}`;
    }
    const fieldPath0_3 = `${path}.intValue`;
    if (_vdl.hasOwn(record0, "intValue") && record0["intValue"] !== void 0) {
      if (typeof record0["intValue"] !== "number" || !Number.isFinite(record0["intValue"])) return `${fieldPath0_3}: expected number, got ${_vdl.describeValue(record0["intValue"])}`;
    }
    const fieldPath0_4 = `${path}.floatValue`;
    if (_vdl.hasOwn(record0, "floatValue") && record0["floatValue"] !== void 0) {
      if (typeof record0["floatValue"] !== "number" || !Number.isFinite(record0["floatValue"])) return `${fieldPath0_4}: expected number, got ${_vdl.describeValue(record0["floatValue"])}`;
    }
    const fieldPath0_5 = `${path}.boolValue`;
    if (_vdl.hasOwn(record0, "boolValue") && record0["boolValue"] !== void 0) {
      if (typeof record0["boolValue"] !== "boolean") return `${fieldPath0_5}: expected boolean, got ${_vdl.describeValue(record0["boolValue"])}`;
    }
    const fieldPath0_6 = `${path}.objectEntries`;
    if (_vdl.hasOwn(record0, "objectEntries") && record0["objectEntries"] !== void 0) {
      if (!Array.isArray(record0["objectEntries"])) return `${fieldPath0_6}: expected array, got ${_vdl.describeValue(record0["objectEntries"])}`;
      for (let index1 = 0; index1 < record0["objectEntries"].length; index1 += 1) {
        const itemPath1 = `${fieldPath0_6}[${index1}]`;
        {
          const error = ObjectEntry.validate(record0["objectEntries"][index1], itemPath1);
          if (error !== null) return error;
        }
      }
    }
    const fieldPath0_7 = `${path}.arrayItems`;
    if (_vdl.hasOwn(record0, "arrayItems") && record0["arrayItems"] !== void 0) {
      if (!Array.isArray(record0["arrayItems"])) return `${fieldPath0_7}: expected array, got ${_vdl.describeValue(record0["arrayItems"])}`;
      for (let index1 = 0; index1 < record0["arrayItems"].length; index1 += 1) {
        const itemPath1 = `${fieldPath0_7}[${index1}]`;
        {
          const error = LiteralValue.validate(record0["arrayItems"][index1], itemPath1);
          if (error !== null) return error;
        }
      }
    }
    return null;
  },
  hydrate(input) {
    return _vdl.withOptional(_vdl.withOptional(_vdl.withOptional(_vdl.withOptional(_vdl.withOptional(_vdl.withOptional({
      position: Position.hydrate(input.position),
      kind: LiteralKind.hydrate(input.kind)
    }, "stringValue", input.stringValue === void 0 ? void 0 : input.stringValue), "intValue", input.intValue === void 0 ? void 0 : input.intValue), "floatValue", input.floatValue === void 0 ? void 0 : input.floatValue), "boolValue", input.boolValue === void 0 ? void 0 : input.boolValue), "objectEntries", input.objectEntries === void 0 ? void 0 : input.objectEntries.map((item1) => ObjectEntry.hydrate(item1))), "arrayItems", input.arrayItems === void 0 ? void 0 : input.arrayItems.map((item1) => LiteralValue.hydrate(item1)));
  }
};
var ObjectEntry = {
  parse(json) {
    const input = _vdl.parseJson(json);
    const error = ObjectEntry.validate(input);
    if (error !== null) throw new Error(error);
    return ObjectEntry.hydrate(input);
  },
  validate(input, path = "ObjectEntry") {
    if (!_vdl.isRecord(input)) return `${path}: expected object, got ${_vdl.describeValue(input)}`;
    const record0 = input;
    const fieldPath0_0 = `${path}.position`;
    if (!_vdl.hasOwn(record0, "position") || record0["position"] === void 0) return `${fieldPath0_0}: required field is missing`;
    {
      const error = Position.validate(record0["position"], fieldPath0_0);
      if (error !== null) return error;
    }
    const fieldPath0_1 = `${path}.key`;
    if (!_vdl.hasOwn(record0, "key") || record0["key"] === void 0) return `${fieldPath0_1}: required field is missing`;
    if (typeof record0["key"] !== "string") return `${fieldPath0_1}: expected string, got ${_vdl.describeValue(record0["key"])}`;
    const fieldPath0_2 = `${path}.value`;
    if (!_vdl.hasOwn(record0, "value") || record0["value"] === void 0) return `${fieldPath0_2}: required field is missing`;
    {
      const error = LiteralValue.validate(record0["value"], fieldPath0_2);
      if (error !== null) return error;
    }
    return null;
  },
  hydrate(input) {
    return {
      position: Position.hydrate(input.position),
      key: input.key,
      value: LiteralValue.hydrate(input.value)
    };
  }
};
var Position = {
  parse(json) {
    const input = _vdl.parseJson(json);
    const error = Position.validate(input);
    if (error !== null) throw new Error(error);
    return Position.hydrate(input);
  },
  validate(input, path = "Position") {
    if (!_vdl.isRecord(input)) return `${path}: expected object, got ${_vdl.describeValue(input)}`;
    const record0 = input;
    const fieldPath0_0 = `${path}.file`;
    if (!_vdl.hasOwn(record0, "file") || record0["file"] === void 0) return `${fieldPath0_0}: required field is missing`;
    if (typeof record0["file"] !== "string") return `${fieldPath0_0}: expected string, got ${_vdl.describeValue(record0["file"])}`;
    const fieldPath0_1 = `${path}.line`;
    if (!_vdl.hasOwn(record0, "line") || record0["line"] === void 0) return `${fieldPath0_1}: required field is missing`;
    if (typeof record0["line"] !== "number" || !Number.isFinite(record0["line"])) return `${fieldPath0_1}: expected number, got ${_vdl.describeValue(record0["line"])}`;
    const fieldPath0_2 = `${path}.column`;
    if (!_vdl.hasOwn(record0, "column") || record0["column"] === void 0) return `${fieldPath0_2}: required field is missing`;
    if (typeof record0["column"] !== "number" || !Number.isFinite(record0["column"])) return `${fieldPath0_2}: expected number, got ${_vdl.describeValue(record0["column"])}`;
    return null;
  },
  hydrate(input) {
    return {
      file: input.file,
      line: input.line,
      column: input.column
    };
  }
};
var TopLevelDoc = {
  parse(json) {
    const input = _vdl.parseJson(json);
    const error = TopLevelDoc.validate(input);
    if (error !== null) throw new Error(error);
    return TopLevelDoc.hydrate(input);
  },
  validate(input, path = "TopLevelDoc") {
    if (!_vdl.isRecord(input)) return `${path}: expected object, got ${_vdl.describeValue(input)}`;
    const record0 = input;
    const fieldPath0_0 = `${path}.position`;
    if (!_vdl.hasOwn(record0, "position") || record0["position"] === void 0) return `${fieldPath0_0}: required field is missing`;
    {
      const error = Position.validate(record0["position"], fieldPath0_0);
      if (error !== null) return error;
    }
    const fieldPath0_1 = `${path}.content`;
    if (!_vdl.hasOwn(record0, "content") || record0["content"] === void 0) return `${fieldPath0_1}: required field is missing`;
    if (typeof record0["content"] !== "string") return `${fieldPath0_1}: expected string, got ${_vdl.describeValue(record0["content"])}`;
    return null;
  },
  hydrate(input) {
    return {
      position: Position.hydrate(input.position),
      content: input.content
    };
  }
};
var TypeDef = {
  parse(json) {
    const input = _vdl.parseJson(json);
    const error = TypeDef.validate(input);
    if (error !== null) throw new Error(error);
    return TypeDef.hydrate(input);
  },
  validate(input, path = "TypeDef") {
    if (!_vdl.isRecord(input)) return `${path}: expected object, got ${_vdl.describeValue(input)}`;
    const record0 = input;
    const fieldPath0_0 = `${path}.position`;
    if (!_vdl.hasOwn(record0, "position") || record0["position"] === void 0) return `${fieldPath0_0}: required field is missing`;
    {
      const error = Position.validate(record0["position"], fieldPath0_0);
      if (error !== null) return error;
    }
    const fieldPath0_1 = `${path}.name`;
    if (!_vdl.hasOwn(record0, "name") || record0["name"] === void 0) return `${fieldPath0_1}: required field is missing`;
    if (typeof record0["name"] !== "string") return `${fieldPath0_1}: expected string, got ${_vdl.describeValue(record0["name"])}`;
    const fieldPath0_2 = `${path}.doc`;
    if (_vdl.hasOwn(record0, "doc") && record0["doc"] !== void 0) {
      if (typeof record0["doc"] !== "string") return `${fieldPath0_2}: expected string, got ${_vdl.describeValue(record0["doc"])}`;
    }
    const fieldPath0_3 = `${path}.annotations`;
    if (!_vdl.hasOwn(record0, "annotations") || record0["annotations"] === void 0) return `${fieldPath0_3}: required field is missing`;
    if (!Array.isArray(record0["annotations"])) return `${fieldPath0_3}: expected array, got ${_vdl.describeValue(record0["annotations"])}`;
    for (let index1 = 0; index1 < record0["annotations"].length; index1 += 1) {
      const itemPath1 = `${fieldPath0_3}[${index1}]`;
      {
        const error = Annotation.validate(record0["annotations"][index1], itemPath1);
        if (error !== null) return error;
      }
    }
    const fieldPath0_4 = `${path}.typeRef`;
    if (!_vdl.hasOwn(record0, "typeRef") || record0["typeRef"] === void 0) return `${fieldPath0_4}: required field is missing`;
    {
      const error = TypeRef.validate(record0["typeRef"], fieldPath0_4);
      if (error !== null) return error;
    }
    return null;
  },
  hydrate(input) {
    return _vdl.withOptional({
      position: Position.hydrate(input.position),
      name: input.name,
      annotations: input.annotations.map((item1) => Annotation.hydrate(item1)),
      typeRef: TypeRef.hydrate(input.typeRef)
    }, "doc", input.doc === void 0 ? void 0 : input.doc);
  }
};
var TypeRef = {
  parse(json) {
    const input = _vdl.parseJson(json);
    const error = TypeRef.validate(input);
    if (error !== null) throw new Error(error);
    return TypeRef.hydrate(input);
  },
  validate(input, path = "TypeRef") {
    if (!_vdl.isRecord(input)) return `${path}: expected object, got ${_vdl.describeValue(input)}`;
    const record0 = input;
    const fieldPath0_0 = `${path}.kind`;
    if (!_vdl.hasOwn(record0, "kind") || record0["kind"] === void 0) return `${fieldPath0_0}: required field is missing`;
    {
      const error = TypeKind.validate(record0["kind"], fieldPath0_0);
      if (error !== null) return error;
    }
    const fieldPath0_1 = `${path}.primitiveName`;
    if (_vdl.hasOwn(record0, "primitiveName") && record0["primitiveName"] !== void 0) {
      const error = PrimitiveType.validate(record0["primitiveName"], fieldPath0_1);
      if (error !== null) return error;
    }
    const fieldPath0_2 = `${path}.typeName`;
    if (_vdl.hasOwn(record0, "typeName") && record0["typeName"] !== void 0) {
      if (typeof record0["typeName"] !== "string") return `${fieldPath0_2}: expected string, got ${_vdl.describeValue(record0["typeName"])}`;
    }
    const fieldPath0_3 = `${path}.enumName`;
    if (_vdl.hasOwn(record0, "enumName") && record0["enumName"] !== void 0) {
      if (typeof record0["enumName"] !== "string") return `${fieldPath0_3}: expected string, got ${_vdl.describeValue(record0["enumName"])}`;
    }
    const fieldPath0_4 = `${path}.enumType`;
    if (_vdl.hasOwn(record0, "enumType") && record0["enumType"] !== void 0) {
      const error = EnumValueType.validate(record0["enumType"], fieldPath0_4);
      if (error !== null) return error;
    }
    const fieldPath0_5 = `${path}.arrayType`;
    if (_vdl.hasOwn(record0, "arrayType") && record0["arrayType"] !== void 0) {
      const error = TypeRef.validate(record0["arrayType"], fieldPath0_5);
      if (error !== null) return error;
    }
    const fieldPath0_6 = `${path}.arrayDims`;
    if (_vdl.hasOwn(record0, "arrayDims") && record0["arrayDims"] !== void 0) {
      if (typeof record0["arrayDims"] !== "number" || !Number.isFinite(record0["arrayDims"])) return `${fieldPath0_6}: expected number, got ${_vdl.describeValue(record0["arrayDims"])}`;
    }
    const fieldPath0_7 = `${path}.mapType`;
    if (_vdl.hasOwn(record0, "mapType") && record0["mapType"] !== void 0) {
      const error = TypeRef.validate(record0["mapType"], fieldPath0_7);
      if (error !== null) return error;
    }
    const fieldPath0_8 = `${path}.objectFields`;
    if (_vdl.hasOwn(record0, "objectFields") && record0["objectFields"] !== void 0) {
      if (!Array.isArray(record0["objectFields"])) return `${fieldPath0_8}: expected array, got ${_vdl.describeValue(record0["objectFields"])}`;
      for (let index1 = 0; index1 < record0["objectFields"].length; index1 += 1) {
        const itemPath1 = `${fieldPath0_8}[${index1}]`;
        {
          const error = Field.validate(record0["objectFields"][index1], itemPath1);
          if (error !== null) return error;
        }
      }
    }
    return null;
  },
  hydrate(input) {
    return _vdl.withOptional(_vdl.withOptional(_vdl.withOptional(_vdl.withOptional(_vdl.withOptional(_vdl.withOptional(_vdl.withOptional(_vdl.withOptional({ kind: TypeKind.hydrate(input.kind) }, "primitiveName", input.primitiveName === void 0 ? void 0 : PrimitiveType.hydrate(input.primitiveName)), "typeName", input.typeName === void 0 ? void 0 : input.typeName), "enumName", input.enumName === void 0 ? void 0 : input.enumName), "enumType", input.enumType === void 0 ? void 0 : EnumValueType.hydrate(input.enumType)), "arrayType", input.arrayType === void 0 ? void 0 : TypeRef.hydrate(input.arrayType)), "arrayDims", input.arrayDims === void 0 ? void 0 : input.arrayDims), "mapType", input.mapType === void 0 ? void 0 : TypeRef.hydrate(input.mapType)), "objectFields", input.objectFields === void 0 ? void 0 : input.objectFields.map((item1) => Field.hydrate(item1)));
  }
};
var _vdl = {
  parseJson(json) {
    try {
      return JSON.parse(json);
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      throw new Error(`Invalid JSON input: ${message}`);
    }
  },
  recordEntries(record) {
    const entries = [];
    for (const key in record) if (Object.prototype.hasOwnProperty.call(record, key)) {
      const value = record[key];
      entries.push([key, value]);
    }
    return entries;
  },
  mapRecord(record, mapValue) {
    const output = {};
    for (const key in record) if (Object.prototype.hasOwnProperty.call(record, key)) {
      const value = record[key];
      output[key] = mapValue(value);
    }
    return output;
  },
  withOptional(record, key, value) {
    const mutable = record;
    if (value !== void 0) mutable[key] = value;
    return record;
  },
  isRecord(value) {
    return typeof value === "object" && value !== null && !Array.isArray(value) && !(value instanceof Date);
  },
  hasOwn(record, key) {
    return Object.prototype.hasOwnProperty.call(record, key);
  },
  describeValue(value) {
    if (value === null) return "null";
    if (Array.isArray(value)) return "array";
    if (value instanceof Date) return "Date";
    return typeof value;
  },
  isValidDateInput(value) {
    if (value instanceof Date) return !Number.isNaN(value.getTime());
    if (typeof value !== "string") return false;
    return !Number.isNaN(new Date(value).getTime());
  },
  hydrateDateInput(value) {
    return value instanceof Date ? new Date(value.getTime()) : new Date(value);
  }
};

// node_modules/@varavel/vdl-plugin-sdk/dist/index.js
function definePlugin(handler) {
  return handler;
}
__name(definePlugin, "definePlugin");

// node_modules/@varavel/vdl-plugin-sdk/dist/chunk-YKewjYmz.js
var __create = Object.create;
var __defProp2 = Object.defineProperty;
var __getOwnPropDesc2 = Object.getOwnPropertyDescriptor;
var __getOwnPropNames2 = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp2 = Object.prototype.hasOwnProperty;
var __commonJSMin = /* @__PURE__ */ __name((cb, mod) => () => (mod || cb((mod = { exports: {} }).exports, mod), mod.exports), "__commonJSMin");
var __exportAll = /* @__PURE__ */ __name((all, no_symbols) => {
  let target = {};
  for (var name in all) __defProp2(target, name, {
    get: all[name],
    enumerable: true
  });
  if (!no_symbols) __defProp2(target, Symbol.toStringTag, { value: "Module" });
  return target;
}, "__exportAll");
var __copyProps2 = /* @__PURE__ */ __name((to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") for (var keys = __getOwnPropNames2(from), i = 0, n = keys.length, key; i < n; i++) {
    key = keys[i];
    if (!__hasOwnProp2.call(to, key) && key !== except) __defProp2(to, key, {
      get: ((k2) => from[k2]).bind(null, key),
      enumerable: !(desc = __getOwnPropDesc2(from, key)) || desc.enumerable
    });
  }
  return to;
}, "__copyProps");
var __toESM = /* @__PURE__ */ __name((mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps2(isNodeMode || !mod || !mod.__esModule ? __defProp2(target, "default", {
  value: mod,
  enumerable: true
}) : target, mod)), "__toESM");
var __require = /* @__PURE__ */ ((x) => typeof require !== "undefined" ? require : typeof Proxy !== "undefined" ? new Proxy(x, { get: /* @__PURE__ */ __name((a, b) => (typeof require !== "undefined" ? require : a)[b], "get") }) : x)(function(x) {
  if (typeof require !== "undefined") return require.apply(this, arguments);
  throw Error('Calling `require` for "' + x + "\" in an environment that doesn't expose the `require` function. See https://rolldown.rs/in-depth/bundling-cjs#require-external-modules for more details.");
});

// node_modules/@varavel/vdl-plugin-sdk/dist/utils/index.js
function at$1(arr, indices) {
  const result = new Array(indices.length);
  const length = arr.length;
  for (let i = 0; i < indices.length; i++) {
    let index = indices[i];
    index = Number.isInteger(index) ? index : Math.trunc(index) || 0;
    if (index < 0) index += length;
    result[i] = arr[index];
  }
  return result;
}
__name(at$1, "at$1");
function chunk$1(arr, size) {
  if (!Number.isInteger(size) || size <= 0) throw new Error("Size must be an integer greater than zero.");
  const chunkLength = Math.ceil(arr.length / size);
  const result = Array(chunkLength);
  for (let index = 0; index < chunkLength; index++) {
    const start = index * size;
    const end = start + size;
    result[index] = arr.slice(start, end);
  }
  return result;
}
__name(chunk$1, "chunk$1");
function compact$1(arr) {
  const result = [];
  for (let i = 0; i < arr.length; i++) {
    const item = arr[i];
    if (item) result.push(item);
  }
  return result;
}
__name(compact$1, "compact$1");
function countBy$3(arr, mapper) {
  const result = {};
  for (let i = 0; i < arr.length; i++) {
    var _result$key;
    const item = arr[i];
    const key = mapper(item, i, arr);
    result[key] = ((_result$key = result[key]) !== null && _result$key !== void 0 ? _result$key : 0) + 1;
  }
  return result;
}
__name(countBy$3, "countBy$3");
function difference$1(firstArr, secondArr) {
  const secondSet = new Set(secondArr);
  return firstArr.filter((item) => !secondSet.has(item));
}
__name(difference$1, "difference$1");
function differenceBy$1(firstArr, secondArr, mapper) {
  const mappedSecondSet = new Set(secondArr.map((item) => mapper(item)));
  return firstArr.filter((item) => {
    return !mappedSecondSet.has(mapper(item));
  });
}
__name(differenceBy$1, "differenceBy$1");
function differenceWith$1(firstArr, secondArr, areItemsEqual) {
  return firstArr.filter((firstItem) => {
    return secondArr.every((secondItem) => {
      return !areItemsEqual(firstItem, secondItem);
    });
  });
}
__name(differenceWith$1, "differenceWith$1");
function drop$1(arr, itemsCount) {
  itemsCount = Math.max(itemsCount, 0);
  return arr.slice(itemsCount);
}
__name(drop$1, "drop$1");
function dropRight$1(arr, itemsCount) {
  itemsCount = Math.min(-itemsCount, 0);
  if (itemsCount === 0) return arr.slice();
  return arr.slice(0, itemsCount);
}
__name(dropRight$1, "dropRight$1");
function dropRightWhile$1(arr, canContinueDropping) {
  for (let i = arr.length - 1; i >= 0; i--) if (!canContinueDropping(arr[i], i, arr)) return arr.slice(0, i + 1);
  return [];
}
__name(dropRightWhile$1, "dropRightWhile$1");
function dropWhile$1(arr, canContinueDropping) {
  const dropEndIndex = arr.findIndex((item, index, arr2) => !canContinueDropping(item, index, arr2));
  if (dropEndIndex === -1) return [];
  return arr.slice(dropEndIndex);
}
__name(dropWhile$1, "dropWhile$1");
function flatten$1(arr, depth = 1) {
  const result = [];
  const flooredDepth = Math.floor(depth);
  const recursive = /* @__PURE__ */ __name((arr2, currentDepth) => {
    for (let i = 0; i < arr2.length; i++) {
      const item = arr2[i];
      if (Array.isArray(item) && currentDepth < flooredDepth) recursive(item, currentDepth + 1);
      else result.push(item);
    }
  }, "recursive");
  recursive(arr, 0);
  return result;
}
__name(flatten$1, "flatten$1");
function flatMap$1(arr, iteratee, depth = 1) {
  return flatten$1(arr.map((item, index) => iteratee(item, index, arr)), depth);
}
__name(flatMap$1, "flatMap$1");
function flattenDeep$1(arr) {
  return flatten$1(arr, Infinity);
}
__name(flattenDeep$1, "flattenDeep$1");
function flatMapDeep$1(arr, iteratee) {
  return flattenDeep$1(arr.map((item, index) => iteratee(item, index, arr)));
}
__name(flatMapDeep$1, "flatMapDeep$1");
function groupBy$1(arr, getKeyFromItem) {
  const result = {};
  for (let i = 0; i < arr.length; i++) {
    const item = arr[i];
    const key = getKeyFromItem(item, i, arr);
    if (!Object.hasOwn(result, key)) result[key] = [];
    result[key].push(item);
  }
  return result;
}
__name(groupBy$1, "groupBy$1");
function head$1(arr) {
  return arr[0];
}
__name(head$1, "head$1");
function initial$1(arr) {
  return arr.slice(0, -1);
}
__name(initial$1, "initial$1");
function intersection$1(firstArr, secondArr) {
  const secondSet = new Set(secondArr);
  return firstArr.filter((item) => secondSet.has(item));
}
__name(intersection$1, "intersection$1");
function intersectionBy$1(firstArr, secondArr, mapper) {
  const result = [];
  const mappedSecondSet = new Set(secondArr.map(mapper));
  for (let i = 0; i < firstArr.length; i++) {
    const item = firstArr[i];
    const mappedItem = mapper(item);
    if (mappedSecondSet.has(mappedItem)) {
      result.push(item);
      mappedSecondSet.delete(mappedItem);
    }
  }
  return result;
}
__name(intersectionBy$1, "intersectionBy$1");
function intersectionWith$1(firstArr, secondArr, areItemsEqual) {
  return firstArr.filter((firstItem) => {
    return secondArr.some((secondItem) => {
      return areItemsEqual(firstItem, secondItem);
    });
  });
}
__name(intersectionWith$1, "intersectionWith$1");
function isSubset$1(superset, subset) {
  return difference$1(subset, superset).length === 0;
}
__name(isSubset$1, "isSubset$1");
function isSubsetWith$1(superset, subset, areItemsEqual) {
  return differenceWith$1(subset, superset, areItemsEqual).length === 0;
}
__name(isSubsetWith$1, "isSubsetWith$1");
function keyBy$3(arr, getKeyFromItem) {
  const result = {};
  for (let i = 0; i < arr.length; i++) {
    const item = arr[i];
    const key = getKeyFromItem(item, i, arr);
    result[key] = item;
  }
  return result;
}
__name(keyBy$3, "keyBy$3");
function last$1(arr) {
  return arr[arr.length - 1];
}
__name(last$1, "last$1");
function maxBy$1(items, getValue) {
  if (items.length === 0) return;
  let maxElement = items[0];
  let max = getValue(maxElement, 0, items);
  for (let i = 1; i < items.length; i++) {
    const element = items[i];
    const value = getValue(element, i, items);
    if (value > max) {
      max = value;
      maxElement = element;
    }
  }
  return maxElement;
}
__name(maxBy$1, "maxBy$1");
function minBy$1(items, getValue) {
  if (items.length === 0) return;
  let minElement = items[0];
  let min = getValue(minElement, 0, items);
  for (let i = 1; i < items.length; i++) {
    const element = items[i];
    const value = getValue(element, i, items);
    if (value < min) {
      min = value;
      minElement = element;
    }
  }
  return minElement;
}
__name(minBy$1, "minBy$1");
function compareValues(a, b, order) {
  if (a < b) return order === "asc" ? -1 : 1;
  if (a > b) return order === "asc" ? 1 : -1;
  return 0;
}
__name(compareValues, "compareValues");
function orderBy$1(arr, criteria, orders) {
  return arr.slice().sort((a, b) => {
    const ordersLength = orders.length;
    for (let i = 0; i < criteria.length; i++) {
      const order = ordersLength > i ? orders[i] : orders[ordersLength - 1];
      const criterion = criteria[i];
      const criterionIsFunction = typeof criterion === "function";
      const result = compareValues(criterionIsFunction ? criterion(a) : a[criterion], criterionIsFunction ? criterion(b) : b[criterion], order);
      if (result !== 0) return result;
    }
    return 0;
  });
}
__name(orderBy$1, "orderBy$1");
function partition$1(arr, isInTruthy) {
  const truthy = [];
  const falsy = [];
  for (let i = 0; i < arr.length; i++) {
    const item = arr[i];
    if (isInTruthy(item, i, arr)) truthy.push(item);
    else falsy.push(item);
  }
  return [truthy, falsy];
}
__name(partition$1, "partition$1");
function sortBy$1(arr, criteria) {
  return orderBy$1(arr, criteria, ["asc"]);
}
__name(sortBy$1, "sortBy$1");
function tail$1(arr) {
  return arr.slice(1);
}
__name(tail$1, "tail$1");
function isSymbol(value) {
  return typeof value === "symbol" || value instanceof Symbol;
}
__name(isSymbol, "isSymbol");
function toNumber(value) {
  if (isSymbol(value)) return NaN;
  return Number(value);
}
__name(toNumber, "toNumber");
function toFinite(value) {
  if (!value) return value === 0 ? value : 0;
  value = toNumber(value);
  if (value === Infinity || value === -Infinity) return (value < 0 ? -1 : 1) * Number.MAX_VALUE;
  return value === value ? value : 0;
}
__name(toFinite, "toFinite");
function toInteger(value) {
  const finite = toFinite(value);
  const remainder = finite % 1;
  return remainder ? finite - remainder : finite;
}
__name(toInteger, "toInteger");
function take$1(arr, count, guard) {
  count = guard || count === void 0 ? 1 : toInteger(count);
  return arr.slice(0, count);
}
__name(take$1, "take$1");
function takeRight$1(arr, count, guard) {
  count = guard || count === void 0 ? 1 : toInteger(count);
  if (count <= 0 || arr.length === 0) return [];
  return arr.slice(-count);
}
__name(takeRight$1, "takeRight$1");
function takeRightWhile$1(arr, shouldContinueTaking) {
  for (let i = arr.length - 1; i >= 0; i--) if (!shouldContinueTaking(arr[i], i, arr)) return arr.slice(i + 1);
  return arr.slice();
}
__name(takeRightWhile$1, "takeRightWhile$1");
function takeWhile$1(arr, shouldContinueTaking) {
  const result = [];
  for (let i = 0; i < arr.length; i++) {
    const item = arr[i];
    if (!shouldContinueTaking(item, i, arr)) break;
    result.push(item);
  }
  return result;
}
__name(takeWhile$1, "takeWhile$1");
function toFilled$1(arr, value, start = 0, end = arr.length) {
  const length = arr.length;
  const finalStart = Math.max(start >= 0 ? start : length + start, 0);
  const finalEnd = Math.min(end >= 0 ? end : length + end, length);
  const newArr = arr.slice();
  for (let i = finalStart; i < finalEnd; i++) newArr[i] = value;
  return newArr;
}
__name(toFilled$1, "toFilled$1");
function uniq$1(arr) {
  return [...new Set(arr)];
}
__name(uniq$1, "uniq$1");
function union$1(arr1, arr2) {
  return uniq$1(arr1.concat(arr2));
}
__name(union$1, "union$1");
function uniqBy$1(arr, mapper) {
  const map = /* @__PURE__ */ new Map();
  for (let i = 0; i < arr.length; i++) {
    const item = arr[i];
    const key = mapper(item, i, arr);
    if (!map.has(key)) map.set(key, item);
  }
  return Array.from(map.values());
}
__name(uniqBy$1, "uniqBy$1");
function unionBy$1(arr1, arr2, mapper) {
  return uniqBy$1(arr1.concat(arr2), mapper);
}
__name(unionBy$1, "unionBy$1");
function uniqWith$1(arr, areItemsEqual) {
  const result = [];
  for (let i = 0; i < arr.length; i++) {
    const item = arr[i];
    if (result.every((v) => !areItemsEqual(v, item))) result.push(item);
  }
  return result;
}
__name(uniqWith$1, "uniqWith$1");
function unionWith$1(arr1, arr2, areItemsEqual) {
  return uniqWith$1(arr1.concat(arr2), areItemsEqual);
}
__name(unionWith$1, "unionWith$1");
function unzip$1(zipped) {
  let maxLen = 0;
  for (let i = 0; i < zipped.length; i++) if (zipped[i].length > maxLen) maxLen = zipped[i].length;
  const result = new Array(maxLen);
  for (let i = 0; i < maxLen; i++) {
    result[i] = new Array(zipped.length);
    for (let j = 0; j < zipped.length; j++) result[i][j] = zipped[j][i];
  }
  return result;
}
__name(unzip$1, "unzip$1");
function unzipWith$1(target, iteratee) {
  const maxLength = Math.max(...target.map((innerArray) => innerArray.length));
  const result = new Array(maxLength);
  for (let i = 0; i < maxLength; i++) {
    const group = new Array(target.length);
    for (let j = 0; j < target.length; j++) group[j] = target[j][i];
    result[i] = iteratee(...group);
  }
  return result;
}
__name(unzipWith$1, "unzipWith$1");
function windowed$1(arr, size, step = 1, { partialWindows = false } = {}) {
  if (size <= 0 || !Number.isInteger(size)) throw new Error("Size must be a positive integer.");
  if (step <= 0 || !Number.isInteger(step)) throw new Error("Step must be a positive integer.");
  const result = [];
  const end = partialWindows ? arr.length : arr.length - size + 1;
  for (let i = 0; i < end; i += step) result.push(arr.slice(i, i + size));
  return result;
}
__name(windowed$1, "windowed$1");
function without$1(array, ...values) {
  return difference$1(array, values);
}
__name(without$1, "without$1");
function xor$1(arr1, arr2) {
  return difference$1(union$1(arr1, arr2), intersection$1(arr1, arr2));
}
__name(xor$1, "xor$1");
function xorBy$1(arr1, arr2, mapper) {
  return differenceBy$1(unionBy$1(arr1, arr2, mapper), intersectionBy$1(arr1, arr2, mapper), mapper);
}
__name(xorBy$1, "xorBy$1");
function xorWith$1(arr1, arr2, areElementsEqual) {
  return differenceWith$1(unionWith$1(arr1, arr2, areElementsEqual), intersectionWith$1(arr1, arr2, areElementsEqual), areElementsEqual);
}
__name(xorWith$1, "xorWith$1");
function zip$1(...arrs) {
  let rowCount = 0;
  for (let i = 0; i < arrs.length; i++) if (arrs[i].length > rowCount) rowCount = arrs[i].length;
  const columnCount = arrs.length;
  const result = Array(rowCount);
  for (let i = 0; i < rowCount; ++i) {
    const row = Array(columnCount);
    for (let j = 0; j < columnCount; ++j) row[j] = arrs[j][i];
    result[i] = row;
  }
  return result;
}
__name(zip$1, "zip$1");
function zipObject$1(keys, values) {
  const result = {};
  for (let i = 0; i < keys.length; i++) result[keys[i]] = values[i];
  return result;
}
__name(zipObject$1, "zipObject$1");
function zipWith$1(arr1, ...rest) {
  const arrs = [arr1, ...rest.slice(0, -1)];
  const combine = rest[rest.length - 1];
  const maxIndex = Math.max(...arrs.map((arr) => arr.length));
  const result = Array(maxIndex);
  for (let i = 0; i < maxIndex; i++) result[i] = combine(...arrs.map((arr) => arr[i]), i);
  return result;
}
__name(zipWith$1, "zipWith$1");
var at = at$1;
var chunk = chunk$1;
var compact = compact$1;
var countBy$2 = countBy$3;
var difference = difference$1;
var differenceBy = differenceBy$1;
var differenceWith = differenceWith$1;
var drop = drop$1;
var dropRight = dropRight$1;
var dropRightWhile = dropRightWhile$1;
var dropWhile = dropWhile$1;
var flatMap = flatMap$1;
var flatMapDeep = flatMapDeep$1;
var flatten = flatten$1;
var flattenDeep = flattenDeep$1;
var groupBy = groupBy$1;
var head = head$1;
var initial = initial$1;
var intersection = intersection$1;
var intersectionBy = intersectionBy$1;
var intersectionWith = intersectionWith$1;
var isSubset = isSubset$1;
var isSubsetWith = isSubsetWith$1;
var keyBy$2 = keyBy$3;
var last = last$1;
var maxBy = maxBy$1;
var minBy = minBy$1;
var orderBy = orderBy$1;
var partition = partition$1;
var sortBy = sortBy$1;
var tail = tail$1;
var take = take$1;
var takeRight = takeRight$1;
var takeRightWhile = takeRightWhile$1;
var takeWhile = takeWhile$1;
var toFilled = toFilled$1;
var union = union$1;
var unionBy = unionBy$1;
var unionWith = unionWith$1;
var uniq = uniq$1;
var uniqBy = uniqBy$1;
var uniqWith = uniqWith$1;
var unzip = unzip$1;
var unzipWith = unzipWith$1;
var windowed = windowed$1;
var without = without$1;
var xor = xor$1;
var xorBy = xorBy$1;
var xorWith = xorWith$1;
var zip = zip$1;
var zipObject = zipObject$1;
var zipWith = zipWith$1;
var arrays_exports = /* @__PURE__ */ __exportAll({
  at: /* @__PURE__ */ __name(() => at, "at"),
  chunk: /* @__PURE__ */ __name(() => chunk, "chunk"),
  compact: /* @__PURE__ */ __name(() => compact, "compact"),
  countBy: /* @__PURE__ */ __name(() => countBy$2, "countBy"),
  difference: /* @__PURE__ */ __name(() => difference, "difference"),
  differenceBy: /* @__PURE__ */ __name(() => differenceBy, "differenceBy"),
  differenceWith: /* @__PURE__ */ __name(() => differenceWith, "differenceWith"),
  drop: /* @__PURE__ */ __name(() => drop, "drop"),
  dropRight: /* @__PURE__ */ __name(() => dropRight, "dropRight"),
  dropRightWhile: /* @__PURE__ */ __name(() => dropRightWhile, "dropRightWhile"),
  dropWhile: /* @__PURE__ */ __name(() => dropWhile, "dropWhile"),
  flatMap: /* @__PURE__ */ __name(() => flatMap, "flatMap"),
  flatMapDeep: /* @__PURE__ */ __name(() => flatMapDeep, "flatMapDeep"),
  flatten: /* @__PURE__ */ __name(() => flatten, "flatten"),
  flattenDeep: /* @__PURE__ */ __name(() => flattenDeep, "flattenDeep"),
  groupBy: /* @__PURE__ */ __name(() => groupBy, "groupBy"),
  head: /* @__PURE__ */ __name(() => head, "head"),
  initial: /* @__PURE__ */ __name(() => initial, "initial"),
  intersection: /* @__PURE__ */ __name(() => intersection, "intersection"),
  intersectionBy: /* @__PURE__ */ __name(() => intersectionBy, "intersectionBy"),
  intersectionWith: /* @__PURE__ */ __name(() => intersectionWith, "intersectionWith"),
  isSubset: /* @__PURE__ */ __name(() => isSubset, "isSubset"),
  isSubsetWith: /* @__PURE__ */ __name(() => isSubsetWith, "isSubsetWith"),
  keyBy: /* @__PURE__ */ __name(() => keyBy$2, "keyBy"),
  last: /* @__PURE__ */ __name(() => last, "last"),
  maxBy: /* @__PURE__ */ __name(() => maxBy, "maxBy"),
  minBy: /* @__PURE__ */ __name(() => minBy, "minBy"),
  orderBy: /* @__PURE__ */ __name(() => orderBy, "orderBy"),
  partition: /* @__PURE__ */ __name(() => partition, "partition"),
  sortBy: /* @__PURE__ */ __name(() => sortBy, "sortBy"),
  tail: /* @__PURE__ */ __name(() => tail, "tail"),
  take: /* @__PURE__ */ __name(() => take, "take"),
  takeRight: /* @__PURE__ */ __name(() => takeRight, "takeRight"),
  takeRightWhile: /* @__PURE__ */ __name(() => takeRightWhile, "takeRightWhile"),
  takeWhile: /* @__PURE__ */ __name(() => takeWhile, "takeWhile"),
  toFilled: /* @__PURE__ */ __name(() => toFilled, "toFilled"),
  union: /* @__PURE__ */ __name(() => union, "union"),
  unionBy: /* @__PURE__ */ __name(() => unionBy, "unionBy"),
  unionWith: /* @__PURE__ */ __name(() => unionWith, "unionWith"),
  uniq: /* @__PURE__ */ __name(() => uniq, "uniq"),
  uniqBy: /* @__PURE__ */ __name(() => uniqBy, "uniqBy"),
  uniqWith: /* @__PURE__ */ __name(() => uniqWith, "uniqWith"),
  unzip: /* @__PURE__ */ __name(() => unzip, "unzip"),
  unzipWith: /* @__PURE__ */ __name(() => unzipWith, "unzipWith"),
  windowed: /* @__PURE__ */ __name(() => windowed, "windowed"),
  without: /* @__PURE__ */ __name(() => without, "without"),
  xor: /* @__PURE__ */ __name(() => xor, "xor"),
  xorBy: /* @__PURE__ */ __name(() => xorBy, "xorBy"),
  xorWith: /* @__PURE__ */ __name(() => xorWith, "xorWith"),
  zip: /* @__PURE__ */ __name(() => zip, "zip"),
  zipObject: /* @__PURE__ */ __name(() => zipObject, "zipObject"),
  zipWith: /* @__PURE__ */ __name(() => zipWith, "zipWith")
});
function _checkPrivateRedeclaration(e, t) {
  if (t.has(e)) throw new TypeError("Cannot initialize the same private elements twice on an object");
}
__name(_checkPrivateRedeclaration, "_checkPrivateRedeclaration");
function _classPrivateFieldInitSpec(e, t, a) {
  _checkPrivateRedeclaration(e, t), t.set(e, a);
}
__name(_classPrivateFieldInitSpec, "_classPrivateFieldInitSpec");
function _assertClassBrand(e, t, n) {
  if ("function" == typeof e ? e === t : e.has(t)) return arguments.length < 3 ? t : n;
  throw new TypeError("Private element is not present on this object");
}
__name(_assertClassBrand, "_assertClassBrand");
function _classPrivateFieldGet2(s, a) {
  return s.get(_assertClassBrand(s, a));
}
__name(_classPrivateFieldGet2, "_classPrivateFieldGet2");
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
var _a;
var k = (_a = class {
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
}, __name(_a, "k"), _a);
var _a2;
var l = (_a2 = class {
  constructor(e, s) {
    e = this.words = e || [], this.sigBytes = s === void 0 ? e.length * 4 : s;
  }
  static fromUtf8(e) {
    const s = unescape(encodeURIComponent(e)), t = s.length, i = [];
    for (let o = 0; o < t; o++) i[o >>> 2] |= (s.charCodeAt(o) & 255) << 24 - o % 4 * 8;
    return new _a2(i, t);
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
}, __name(_a2, "l"), _a2);
function digest(_) {
  return new k().finalize(_).toBase64();
}
__name(digest, "digest");
function hash$1(input) {
  return digest(serialize(input));
}
__name(hash$1, "hash$1");
var crypto_exports = /* @__PURE__ */ __exportAll({ hash: /* @__PURE__ */ __name(() => hash, "hash") });
function hash(input) {
  return hash$1(input);
}
__name(hash, "hash");
function partial$1(func, ...partialArgs) {
  return partialImpl(func, placeholderSymbol$1, ...partialArgs);
}
__name(partial$1, "partial$1");
function partialImpl(func, placeholder, ...partialArgs) {
  const partialed = /* @__PURE__ */ __name(function(...providedArgs) {
    let providedArgsIndex = 0;
    const substitutedArgs = partialArgs.slice().map((arg) => arg === placeholder ? providedArgs[providedArgsIndex++] : arg);
    const remainingArgs = providedArgs.slice(providedArgsIndex);
    return func.apply(this, substitutedArgs.concat(remainingArgs));
  }, "partialed");
  if (func.prototype) partialed.prototype = Object.create(func.prototype);
  return partialed;
}
__name(partialImpl, "partialImpl");
var placeholderSymbol$1 = /* @__PURE__ */ Symbol("partial.placeholder");
partial$1.placeholder = placeholderSymbol$1;
function partialRight$1(func, ...partialArgs) {
  return partialRightImpl(func, placeholderSymbol, ...partialArgs);
}
__name(partialRight$1, "partialRight$1");
function partialRightImpl(func, placeholder, ...partialArgs) {
  const partialedRight = /* @__PURE__ */ __name(function(...providedArgs) {
    const placeholderLength = partialArgs.filter((arg) => arg === placeholder).length;
    const rangeLength = Math.max(providedArgs.length - placeholderLength, 0);
    const remainingArgs = providedArgs.slice(0, rangeLength);
    let providedArgsIndex = rangeLength;
    const substitutedArgs = partialArgs.slice().map((arg) => arg === placeholder ? providedArgs[providedArgsIndex++] : arg);
    return func.apply(this, remainingArgs.concat(substitutedArgs));
  }, "partialedRight");
  if (func.prototype) partialedRight.prototype = Object.create(func.prototype);
  return partialedRight;
}
__name(partialRightImpl, "partialRightImpl");
var placeholderSymbol = /* @__PURE__ */ Symbol("partialRight.placeholder");
partialRight$1.placeholder = placeholderSymbol;
function getAnnotation(annotations, name) {
  if (!annotations) return void 0;
  return annotations.find((anno) => anno.name === name);
}
__name(getAnnotation, "getAnnotation");
function getAnnotationArg(annotations, name) {
  const anno = getAnnotation(annotations, name);
  return anno === null || anno === void 0 ? void 0 : anno.argument;
}
__name(getAnnotationArg, "getAnnotationArg");
var ACRONYM_TO_CAPITALIZED_WORD_BOUNDARY_RE = /([A-Z]+)([A-Z][a-z])/g;
var LOWERCASE_OR_DIGIT_TO_UPPERCASE_BOUNDARY_RE = /([a-z0-9])([A-Z])/g;
var NON_ALPHANUMERIC_SEQUENCE_RE = /[^A-Za-z0-9]+/g;
var WHITESPACE_SEQUENCE_RE = /\s+/;
function words(str) {
  const normalized = str.replace(ACRONYM_TO_CAPITALIZED_WORD_BOUNDARY_RE, "$1 $2").replace(LOWERCASE_OR_DIGIT_TO_UPPERCASE_BOUNDARY_RE, "$1 $2").replace(NON_ALPHANUMERIC_SEQUENCE_RE, " ").trim();
  return normalized.length === 0 ? [] : normalized.split(WHITESPACE_SEQUENCE_RE);
}
__name(words, "words");
function capitalize$1(word) {
  return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
}
__name(capitalize$1, "capitalize$1");
function pascalCase(str) {
  return words(str).map(capitalize$1).join("");
}
__name(pascalCase, "pascalCase");
function hoistAnonymousTypes(schema, nameFn) {
  const output = IrSchema.hydrate(schema);
  const usedNames = new Set(output.types.map((typeDef) => typeDef.name));
  const flatTypes = [];
  for (const typeDef of output.types) {
    const hoisted = [];
    typeDef.typeRef = visitTypeRef(typeDef.typeRef, [typeDef.name], typeDef.name, typeDef.position, hoisted, usedNames, nameFn, false);
    flatTypes.push(typeDef, ...hoisted);
  }
  output.types = flatTypes;
  return output;
}
__name(hoistAnonymousTypes, "hoistAnonymousTypes");
function visitField(field, parts, parentName, hoisted, usedNames, nameFn) {
  field.typeRef = visitTypeRef(field.typeRef, [...parts, field.name], parentName, field.position, hoisted, usedNames, nameFn, true);
  return field;
}
__name(visitField, "visitField");
function visitTypeRef(typeRef, parts, parentName, position, hoisted, usedNames, nameFn, shouldHoistObject) {
  switch (typeRef.kind) {
    case "array":
      if (typeRef.arrayType) typeRef.arrayType = visitTypeRef(typeRef.arrayType, [...parts, "Item"], parentName, position, hoisted, usedNames, nameFn, true);
      return typeRef;
    case "map":
      if (typeRef.mapType) typeRef.mapType = visitTypeRef(typeRef.mapType, [...parts, "Value"], parentName, position, hoisted, usedNames, nameFn, true);
      return typeRef;
    case "object":
      var _typeRef$objectFields;
      if (shouldHoistObject) return hoistObject(typeRef, parts, parentName, position, hoisted, usedNames, nameFn);
      typeRef.objectFields = (_typeRef$objectFields = typeRef.objectFields) === null || _typeRef$objectFields === void 0 ? void 0 : _typeRef$objectFields.map((field) => visitField(field, parts, parentName, hoisted, usedNames, nameFn));
      return typeRef;
    default:
      return typeRef;
  }
}
__name(visitTypeRef, "visitTypeRef");
function hoistObject(typeRef, parts, parentName, position, hoisted, usedNames, nameFn) {
  var _nameFn, _typeRef$objectFields2;
  const defaultName = pascalCase(parts.join(" "));
  const baseName = ((_nameFn = nameFn === null || nameFn === void 0 ? void 0 : nameFn({
    parts: [...parts],
    parentName,
    defaultName
  })) !== null && _nameFn !== void 0 ? _nameFn : defaultName).trim();
  if (baseName === "") throw new Error(`hoistAnonymousTypes could not generate a name for '${parts.join(".")}'.`);
  const name = makeUniqueName(baseName, usedNames);
  const generated = {
    position: copyPosition(position),
    name,
    annotations: [],
    typeRef: {
      kind: "object",
      objectFields: []
    }
  };
  hoisted.push(generated);
  generated.typeRef.objectFields = (_typeRef$objectFields2 = typeRef.objectFields) === null || _typeRef$objectFields2 === void 0 ? void 0 : _typeRef$objectFields2.map((field) => visitField(field, parts, name, hoisted, usedNames, nameFn));
  return {
    kind: "type",
    typeName: name
  };
}
__name(hoistObject, "hoistObject");
function makeUniqueName(baseName, usedNames) {
  if (!usedNames.has(baseName)) {
    usedNames.add(baseName);
    return baseName;
  }
  let index = 2;
  let name = `${baseName}${index}`;
  while (usedNames.has(name)) {
    index += 1;
    name = `${baseName}${index}`;
  }
  usedNames.add(name);
  return name;
}
__name(makeUniqueName, "makeUniqueName");
function copyPosition(position) {
  return {
    file: position.file,
    line: position.line,
    column: position.column
  };
}
__name(copyPosition, "copyPosition");
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
var ir_exports = /* @__PURE__ */ __exportAll({
  getAnnotation: /* @__PURE__ */ __name(() => getAnnotation, "getAnnotation"),
  getAnnotationArg: /* @__PURE__ */ __name(() => getAnnotationArg, "getAnnotationArg"),
  hoistAnonymousTypes: /* @__PURE__ */ __name(() => hoistAnonymousTypes, "hoistAnonymousTypes"),
  unwrapLiteral: /* @__PURE__ */ __name(() => unwrapLiteral, "unwrapLiteral")
});
function attempt$1(func) {
  try {
    return [null, func()];
  } catch (error) {
    return [error, null];
  }
}
__name(attempt$1, "attempt$1");
function invariant$1(condition, message) {
  if (condition) return;
  if (typeof message === "string") throw new Error(message);
  throw message;
}
__name(invariant$1, "invariant$1");
var assert = invariant$1;
var attempt = attempt$1;
var invariant = invariant$1;
var misc_exports = /* @__PURE__ */ __exportAll({
  assert: /* @__PURE__ */ __name(() => assert, "assert"),
  attempt: /* @__PURE__ */ __name(() => attempt, "attempt"),
  invariant: /* @__PURE__ */ __name(() => invariant, "invariant")
});
function getOptionArray(options, key, defaultValue = [], separator = ",") {
  const value = options === null || options === void 0 ? void 0 : options[key];
  if (value === void 0) return defaultValue;
  const trimmedValue = value.trim();
  if (trimmedValue === "") return [];
  return trimmedValue.split(separator).map((item) => item.trim()).filter((item) => item.length > 0);
}
__name(getOptionArray, "getOptionArray");
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
function getOptionEnum(options, key, allowedValues, defaultValue) {
  const value = options === null || options === void 0 ? void 0 : options[key];
  if (value === void 0) return defaultValue;
  const trimmedValue = value.trim();
  if (trimmedValue === "") return defaultValue;
  return allowedValues.includes(trimmedValue) ? trimmedValue : defaultValue;
}
__name(getOptionEnum, "getOptionEnum");
function getOptionNumber(options, key, defaultValue) {
  const value = options === null || options === void 0 ? void 0 : options[key];
  if (value === void 0) return defaultValue;
  const trimmedValue = value.trim();
  if (trimmedValue === "") return defaultValue;
  const parsedValue = Number(trimmedValue);
  return Number.isFinite(parsedValue) ? parsedValue : defaultValue;
}
__name(getOptionNumber, "getOptionNumber");
function getOptionString(options, key, defaultValue) {
  const value = options === null || options === void 0 ? void 0 : options[key];
  return value === void 0 ? defaultValue : value;
}
__name(getOptionString, "getOptionString");
var options_exports = /* @__PURE__ */ __exportAll({
  getOptionArray: /* @__PURE__ */ __name(() => getOptionArray, "getOptionArray"),
  getOptionBool: /* @__PURE__ */ __name(() => getOptionBool, "getOptionBool"),
  getOptionEnum: /* @__PURE__ */ __name(() => getOptionEnum, "getOptionEnum"),
  getOptionNumber: /* @__PURE__ */ __name(() => getOptionNumber, "getOptionNumber"),
  getOptionString: /* @__PURE__ */ __name(() => getOptionString, "getOptionString")
});
function capitalize(word) {
  return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
}
__name(capitalize, "capitalize");
function camelCase(str) {
  const parts = words(str);
  if (parts.length === 0) return "";
  return parts.map((part, index) => index === 0 ? part.toLowerCase() : capitalize(part)).join("");
}
__name(camelCase, "camelCase");
function ownKeys(object, enumerableOnly) {
  var keys = Object.keys(object);
  if (Object.getOwnPropertySymbols) {
    var symbols = Object.getOwnPropertySymbols(object);
    enumerableOnly && (symbols = symbols.filter(function(sym) {
      return Object.getOwnPropertyDescriptor(object, sym).enumerable;
    })), keys.push.apply(keys, symbols);
  }
  return keys;
}
__name(ownKeys, "ownKeys");
function _objectSpread(target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = null != arguments[i] ? arguments[i] : {};
    i % 2 ? ownKeys(Object(source), true).forEach(function(key) {
      _defineProperty(target, key, source[key]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function(key) {
      Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
    });
  }
  return target;
}
__name(_objectSpread, "_objectSpread");
function _defineProperty(obj, key, value) {
  key = _toPropertyKey(key);
  if (key in obj) Object.defineProperty(obj, key, {
    value,
    enumerable: true,
    configurable: true,
    writable: true
  });
  else obj[key] = value;
  return obj;
}
__name(_defineProperty, "_defineProperty");
function _toPropertyKey(arg) {
  var key = _toPrimitive(arg, "string");
  return typeof key === "symbol" ? key : String(key);
}
__name(_toPropertyKey, "_toPropertyKey");
function _toPrimitive(input, hint) {
  if (typeof input !== "object" || input === null) return input;
  var prim = input[Symbol.toPrimitive];
  if (prim !== void 0) {
    var res = prim.call(input, hint || "default");
    if (typeof res !== "object") return res;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (hint === "string" ? String : Number)(input);
}
__name(_toPrimitive, "_toPrimitive");
var dedent$1 = createDedent({});
function createDedent(options) {
  dedent2.withOptions = (newOptions) => createDedent(_objectSpread(_objectSpread({}, options), newOptions));
  return dedent2;
  function dedent2(strings, ...values) {
    const raw = typeof strings === "string" ? [strings] : strings.raw;
    const { alignValues = false, escapeSpecialCharacters = Array.isArray(strings), trimWhitespace = true } = options;
    let result = "";
    for (let i = 0; i < raw.length; i++) {
      let next = raw[i];
      if (escapeSpecialCharacters) next = next.replace(/\\\n[ \t]*/g, "").replace(/\\`/g, "`").replace(/\\\$/g, "$").replace(/\\\{/g, "{");
      result += next;
      if (i < values.length) {
        const value = alignValues ? alignValue(values[i], result) : values[i];
        result += value;
      }
    }
    const lines = result.split("\n");
    let mindent = null;
    for (const l2 of lines) {
      const m = l2.match(/^(\s+)\S+/);
      if (m) {
        const indent = m[1].length;
        if (!mindent) mindent = indent;
        else mindent = Math.min(mindent, indent);
      }
    }
    if (mindent !== null) {
      const m = mindent;
      result = lines.map((l2) => l2[0] === " " || l2[0] === "	" ? l2.slice(m) : l2).join("\n");
    }
    if (trimWhitespace) result = result.trim();
    if (escapeSpecialCharacters) result = result.replace(/\\n/g, "\n").replace(/\\t/g, "	").replace(/\\r/g, "\r").replace(/\\v/g, "\v").replace(/\\b/g, "\b").replace(/\\f/g, "\f").replace(/\\0/g, "\0").replace(/\\x([\da-fA-F]{2})/g, (_, h) => String.fromCharCode(parseInt(h, 16))).replace(/\\u\{([\da-fA-F]{1,6})\}/g, (_, h) => String.fromCodePoint(parseInt(h, 16))).replace(/\\u([\da-fA-F]{4})/g, (_, h) => String.fromCharCode(parseInt(h, 16)));
    if (typeof Bun !== "undefined") result = result.replace(/\\u(?:\{([\da-fA-F]{1,6})\}|([\da-fA-F]{4}))/g, (_, braced, unbraced) => {
      var _ref;
      const hex = (_ref = braced !== null && braced !== void 0 ? braced : unbraced) !== null && _ref !== void 0 ? _ref : "";
      return String.fromCodePoint(parseInt(hex, 16));
    });
    return result;
  }
  __name(dedent2, "dedent");
}
__name(createDedent, "createDedent");
function alignValue(value, precedingText) {
  if (typeof value !== "string" || !value.includes("\n")) return value;
  const indentMatch = precedingText.slice(precedingText.lastIndexOf("\n") + 1).match(/^(\s+)/);
  if (indentMatch) {
    const indent = indentMatch[1];
    return value.replace(/\n/g, `
${indent}`);
  }
  return value;
}
__name(alignValue, "alignValue");
function dedent(input) {
  return dedent$1(input);
}
__name(dedent, "dedent");
function ensurePrefix(str, prefix) {
  if (str.startsWith(prefix)) return str;
  return prefix + str;
}
__name(ensurePrefix, "ensurePrefix");
function ensureSuffix(str, suffix) {
  if (str.endsWith(suffix)) return str;
  return str + suffix;
}
__name(ensureSuffix, "ensureSuffix");
function kebabCase(str, upperCase2 = false) {
  return words(str).map((part) => upperCase2 ? part.toUpperCase() : part.toLowerCase()).join("-");
}
__name(kebabCase, "kebabCase");
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
function lowerCase(str) {
  return words(str).map((part) => part.toLowerCase()).join(" ");
}
__name(lowerCase, "lowerCase");
function toLength(value) {
  if (!Number.isFinite(value)) return;
  return Math.trunc(value);
}
__name(toLength, "toLength");
function createPadding(length, chars) {
  if (length <= 0) return "";
  const paddingCharacters = Array.from(chars);
  if (paddingCharacters.length === 0) return "";
  const result = [];
  while (result.length < length) result.push(...paddingCharacters);
  return result.slice(0, length).join("");
}
__name(createPadding, "createPadding");
function getPaddingTargetLength(str, length) {
  const currentLength = Array.from(str).length;
  const targetLength = toLength(length);
  if (targetLength === void 0 || targetLength <= currentLength) return;
  return {
    currentLength,
    targetLength
  };
}
__name(getPaddingTargetLength, "getPaddingTargetLength");
function buildPadding(length, chars) {
  return createPadding(length, chars !== null && chars !== void 0 ? chars : " ");
}
__name(buildPadding, "buildPadding");
function pad(str, length, chars) {
  const target = getPaddingTargetLength(str, length);
  if (target === void 0) return str;
  const totalPadding = target.targetLength - target.currentLength;
  const leftPaddingLength = Math.floor(totalPadding / 2);
  const rightPaddingLength = totalPadding - leftPaddingLength;
  const leftPadding = buildPadding(leftPaddingLength, chars);
  const rightPadding = buildPadding(rightPaddingLength, chars);
  if (leftPaddingLength > 0 && leftPadding.length === 0) return str;
  if (rightPaddingLength > 0 && rightPadding.length === 0) return str;
  return `${leftPadding}${str}${rightPadding}`;
}
__name(pad, "pad");
function padLeft(str, length, chars) {
  const target = getPaddingTargetLength(str, length);
  if (target === void 0) return str;
  const padding = buildPadding(target.targetLength - target.currentLength, chars);
  return padding.length === 0 ? str : `${padding}${str}`;
}
__name(padLeft, "padLeft");
function padRight(str, length, chars) {
  const target = getPaddingTargetLength(str, length);
  if (target === void 0) return str;
  const padding = buildPadding(target.targetLength - target.currentLength, chars);
  return padding.length === 0 ? str : `${str}${padding}`;
}
__name(padRight, "padRight");
var import_pluralize = /* @__PURE__ */ __toESM((/* @__PURE__ */ __commonJSMin(((exports, module2) => {
  (function(root, pluralize2) {
    if (typeof __require === "function" && typeof exports === "object" && typeof module2 === "object") module2.exports = pluralize2();
    else if (typeof define === "function" && define.amd) define(function() {
      return pluralize2();
    });
    else root.pluralize = pluralize2();
  })(exports, function() {
    var pluralRules = [];
    var singularRules = [];
    var uncountables = {};
    var irregularPlurals = {};
    var irregularSingles = {};
    function sanitizeRule(rule) {
      if (typeof rule === "string") return new RegExp("^" + rule + "$", "i");
      return rule;
    }
    __name(sanitizeRule, "sanitizeRule");
    function restoreCase(word, token) {
      if (word === token) return token;
      if (word === word.toLowerCase()) return token.toLowerCase();
      if (word === word.toUpperCase()) return token.toUpperCase();
      if (word[0] === word[0].toUpperCase()) return token.charAt(0).toUpperCase() + token.substr(1).toLowerCase();
      return token.toLowerCase();
    }
    __name(restoreCase, "restoreCase");
    function interpolate(str, args) {
      return str.replace(/\$(\d{1,2})/g, function(match, index) {
        return args[index] || "";
      });
    }
    __name(interpolate, "interpolate");
    function replace(word, rule) {
      return word.replace(rule[0], function(match, index) {
        var result = interpolate(rule[1], arguments);
        if (match === "") return restoreCase(word[index - 1], result);
        return restoreCase(match, result);
      });
    }
    __name(replace, "replace");
    function sanitizeWord(token, word, rules) {
      if (!token.length || uncountables.hasOwnProperty(token)) return word;
      var len = rules.length;
      while (len--) {
        var rule = rules[len];
        if (rule[0].test(word)) return replace(word, rule);
      }
      return word;
    }
    __name(sanitizeWord, "sanitizeWord");
    function replaceWord(replaceMap, keepMap, rules) {
      return function(word) {
        var token = word.toLowerCase();
        if (keepMap.hasOwnProperty(token)) return restoreCase(word, token);
        if (replaceMap.hasOwnProperty(token)) return restoreCase(word, replaceMap[token]);
        return sanitizeWord(token, word, rules);
      };
    }
    __name(replaceWord, "replaceWord");
    function checkWord(replaceMap, keepMap, rules, bool) {
      return function(word) {
        var token = word.toLowerCase();
        if (keepMap.hasOwnProperty(token)) return true;
        if (replaceMap.hasOwnProperty(token)) return false;
        return sanitizeWord(token, token, rules) === token;
      };
    }
    __name(checkWord, "checkWord");
    function pluralize2(word, count, inclusive) {
      var pluralized = count === 1 ? pluralize2.singular(word) : pluralize2.plural(word);
      return (inclusive ? count + " " : "") + pluralized;
    }
    __name(pluralize2, "pluralize");
    pluralize2.plural = replaceWord(irregularSingles, irregularPlurals, pluralRules);
    pluralize2.isPlural = checkWord(irregularSingles, irregularPlurals, pluralRules);
    pluralize2.singular = replaceWord(irregularPlurals, irregularSingles, singularRules);
    pluralize2.isSingular = checkWord(irregularPlurals, irregularSingles, singularRules);
    pluralize2.addPluralRule = function(rule, replacement) {
      pluralRules.push([sanitizeRule(rule), replacement]);
    };
    pluralize2.addSingularRule = function(rule, replacement) {
      singularRules.push([sanitizeRule(rule), replacement]);
    };
    pluralize2.addUncountableRule = function(word) {
      if (typeof word === "string") {
        uncountables[word.toLowerCase()] = true;
        return;
      }
      pluralize2.addPluralRule(word, "$0");
      pluralize2.addSingularRule(word, "$0");
    };
    pluralize2.addIrregularRule = function(single, plural) {
      plural = plural.toLowerCase();
      single = single.toLowerCase();
      irregularSingles[single] = plural;
      irregularPlurals[plural] = single;
    };
    [
      ["I", "we"],
      ["me", "us"],
      ["he", "they"],
      ["she", "they"],
      ["them", "them"],
      ["myself", "ourselves"],
      ["yourself", "yourselves"],
      ["itself", "themselves"],
      ["herself", "themselves"],
      ["himself", "themselves"],
      ["themself", "themselves"],
      ["is", "are"],
      ["was", "were"],
      ["has", "have"],
      ["this", "these"],
      ["that", "those"],
      ["echo", "echoes"],
      ["dingo", "dingoes"],
      ["volcano", "volcanoes"],
      ["tornado", "tornadoes"],
      ["torpedo", "torpedoes"],
      ["genus", "genera"],
      ["viscus", "viscera"],
      ["stigma", "stigmata"],
      ["stoma", "stomata"],
      ["dogma", "dogmata"],
      ["lemma", "lemmata"],
      ["schema", "schemata"],
      ["anathema", "anathemata"],
      ["ox", "oxen"],
      ["axe", "axes"],
      ["die", "dice"],
      ["yes", "yeses"],
      ["foot", "feet"],
      ["eave", "eaves"],
      ["goose", "geese"],
      ["tooth", "teeth"],
      ["quiz", "quizzes"],
      ["human", "humans"],
      ["proof", "proofs"],
      ["carve", "carves"],
      ["valve", "valves"],
      ["looey", "looies"],
      ["thief", "thieves"],
      ["groove", "grooves"],
      ["pickaxe", "pickaxes"],
      ["passerby", "passersby"]
    ].forEach(function(rule) {
      return pluralize2.addIrregularRule(rule[0], rule[1]);
    });
    [
      [/s?$/i, "s"],
      [/[^\u0000-\u007F]$/i, "$0"],
      [/([^aeiou]ese)$/i, "$1"],
      [/(ax|test)is$/i, "$1es"],
      [/(alias|[^aou]us|t[lm]as|gas|ris)$/i, "$1es"],
      [/(e[mn]u)s?$/i, "$1s"],
      [/([^l]ias|[aeiou]las|[ejzr]as|[iu]am)$/i, "$1"],
      [/(alumn|syllab|vir|radi|nucle|fung|cact|stimul|termin|bacill|foc|uter|loc|strat)(?:us|i)$/i, "$1i"],
      [/(alumn|alg|vertebr)(?:a|ae)$/i, "$1ae"],
      [/(seraph|cherub)(?:im)?$/i, "$1im"],
      [/(her|at|gr)o$/i, "$1oes"],
      [/(agend|addend|millenni|dat|extrem|bacteri|desiderat|strat|candelabr|errat|ov|symposi|curricul|automat|quor)(?:a|um)$/i, "$1a"],
      [/(apheli|hyperbat|periheli|asyndet|noumen|phenomen|criteri|organ|prolegomen|hedr|automat)(?:a|on)$/i, "$1a"],
      [/sis$/i, "ses"],
      [/(?:(kni|wi|li)fe|(ar|l|ea|eo|oa|hoo)f)$/i, "$1$2ves"],
      [/([^aeiouy]|qu)y$/i, "$1ies"],
      [/([^ch][ieo][ln])ey$/i, "$1ies"],
      [/(x|ch|ss|sh|zz)$/i, "$1es"],
      [/(matr|cod|mur|sil|vert|ind|append)(?:ix|ex)$/i, "$1ices"],
      [/\b((?:tit)?m|l)(?:ice|ouse)$/i, "$1ice"],
      [/(pe)(?:rson|ople)$/i, "$1ople"],
      [/(child)(?:ren)?$/i, "$1ren"],
      [/eaux$/i, "$0"],
      [/m[ae]n$/i, "men"],
      ["thou", "you"]
    ].forEach(function(rule) {
      return pluralize2.addPluralRule(rule[0], rule[1]);
    });
    [
      [/s$/i, ""],
      [/(ss)$/i, "$1"],
      [/(wi|kni|(?:after|half|high|low|mid|non|night|[^\w]|^)li)ves$/i, "$1fe"],
      [/(ar|(?:wo|[ae])l|[eo][ao])ves$/i, "$1f"],
      [/ies$/i, "y"],
      [/\b([pl]|zomb|(?:neck|cross)?t|coll|faer|food|gen|goon|group|lass|talk|goal|cut)ies$/i, "$1ie"],
      [/\b(mon|smil)ies$/i, "$1ey"],
      [/\b((?:tit)?m|l)ice$/i, "$1ouse"],
      [/(seraph|cherub)im$/i, "$1"],
      [/(x|ch|ss|sh|zz|tto|go|cho|alias|[^aou]us|t[lm]as|gas|(?:her|at|gr)o|[aeiou]ris)(?:es)?$/i, "$1"],
      [/(analy|diagno|parenthe|progno|synop|the|empha|cri|ne)(?:sis|ses)$/i, "$1sis"],
      [/(movie|twelve|abuse|e[mn]u)s$/i, "$1"],
      [/(test)(?:is|es)$/i, "$1is"],
      [/(alumn|syllab|vir|radi|nucle|fung|cact|stimul|termin|bacill|foc|uter|loc|strat)(?:us|i)$/i, "$1us"],
      [/(agend|addend|millenni|dat|extrem|bacteri|desiderat|strat|candelabr|errat|ov|symposi|curricul|quor)a$/i, "$1um"],
      [/(apheli|hyperbat|periheli|asyndet|noumen|phenomen|criteri|organ|prolegomen|hedr|automat)a$/i, "$1on"],
      [/(alumn|alg|vertebr)ae$/i, "$1a"],
      [/(cod|mur|sil|vert|ind)ices$/i, "$1ex"],
      [/(matr|append)ices$/i, "$1ix"],
      [/(pe)(rson|ople)$/i, "$1rson"],
      [/(child)ren$/i, "$1"],
      [/(eau)x?$/i, "$1"],
      [/men$/i, "man"]
    ].forEach(function(rule) {
      return pluralize2.addSingularRule(rule[0], rule[1]);
    });
    [
      "adulthood",
      "advice",
      "agenda",
      "aid",
      "aircraft",
      "alcohol",
      "ammo",
      "analytics",
      "anime",
      "athletics",
      "audio",
      "bison",
      "blood",
      "bream",
      "buffalo",
      "butter",
      "carp",
      "cash",
      "chassis",
      "chess",
      "clothing",
      "cod",
      "commerce",
      "cooperation",
      "corps",
      "debris",
      "diabetes",
      "digestion",
      "elk",
      "energy",
      "equipment",
      "excretion",
      "expertise",
      "firmware",
      "flounder",
      "fun",
      "gallows",
      "garbage",
      "graffiti",
      "hardware",
      "headquarters",
      "health",
      "herpes",
      "highjinks",
      "homework",
      "housework",
      "information",
      "jeans",
      "justice",
      "kudos",
      "labour",
      "literature",
      "machinery",
      "mackerel",
      "mail",
      "media",
      "mews",
      "moose",
      "music",
      "mud",
      "manga",
      "news",
      "only",
      "personnel",
      "pike",
      "plankton",
      "pliers",
      "police",
      "pollution",
      "premises",
      "rain",
      "research",
      "rice",
      "salmon",
      "scissors",
      "series",
      "sewage",
      "shambles",
      "shrimp",
      "software",
      "species",
      "staff",
      "swine",
      "tennis",
      "traffic",
      "transportation",
      "trout",
      "tuna",
      "wealth",
      "welfare",
      "whiting",
      "wildebeest",
      "wildlife",
      "you",
      /pok[eé]mon$/i,
      /[^aeiou]ese$/i,
      /deer$/i,
      /fish$/i,
      /measles$/i,
      /o[iu]s$/i,
      /pox$/i,
      /sheep$/i
    ].forEach(pluralize2.addUncountableRule);
    return pluralize2;
  });
})))(), 1);
function pluralize(word, count, inclusive) {
  return (0, import_pluralize.default)(word, count, inclusive);
}
__name(pluralize, "pluralize");
function snakeCase(str, upperCase2 = false) {
  return words(str).map((part) => upperCase2 ? part.toUpperCase() : part.toLowerCase()).join("_");
}
__name(snakeCase, "snakeCase");
function toTrimCharacterSet(chars) {
  const values = Array.isArray(chars) ? chars : [chars];
  const characterSet = /* @__PURE__ */ new Set();
  for (const value of values) for (const character of Array.from(value)) characterSet.add(character);
  return characterSet;
}
__name(toTrimCharacterSet, "toTrimCharacterSet");
function trimWithCharacters(str, chars, mode) {
  if (chars === void 0) switch (mode) {
    case "start":
      return str.replace(/^\s+/, "");
    case "end":
      return str.replace(/\s+$/, "");
    default:
      return str.trim();
  }
  const trimCharacters = toTrimCharacterSet(chars);
  if (trimCharacters.size === 0) return str;
  const characters = Array.from(str);
  let start = 0;
  let end = characters.length;
  if (mode === "start" || mode === "both") while (start < end && trimCharacters.has(characters[start])) start += 1;
  if (mode === "end" || mode === "both") while (end > start && trimCharacters.has(characters[end - 1])) end -= 1;
  return characters.slice(start, end).join("");
}
__name(trimWithCharacters, "trimWithCharacters");
function trim(str, chars) {
  return trimWithCharacters(str, chars, "both");
}
__name(trim, "trim");
function trimEnd(str, chars) {
  return trimWithCharacters(str, chars, "end");
}
__name(trimEnd, "trimEnd");
function trimStart(str, chars) {
  return trimWithCharacters(str, chars, "start");
}
__name(trimStart, "trimStart");
function upperCase(str) {
  return words(str).map((part) => part.toUpperCase()).join(" ");
}
__name(upperCase, "upperCase");
var strings_exports = /* @__PURE__ */ __exportAll({
  camelCase: /* @__PURE__ */ __name(() => camelCase, "camelCase"),
  dedent: /* @__PURE__ */ __name(() => dedent, "dedent"),
  ensurePrefix: /* @__PURE__ */ __name(() => ensurePrefix, "ensurePrefix"),
  ensureSuffix: /* @__PURE__ */ __name(() => ensureSuffix, "ensureSuffix"),
  kebabCase: /* @__PURE__ */ __name(() => kebabCase, "kebabCase"),
  limitBlankLines: /* @__PURE__ */ __name(() => limitBlankLines, "limitBlankLines"),
  lowerCase: /* @__PURE__ */ __name(() => lowerCase, "lowerCase"),
  pad: /* @__PURE__ */ __name(() => pad, "pad"),
  padLeft: /* @__PURE__ */ __name(() => padLeft, "padLeft"),
  padRight: /* @__PURE__ */ __name(() => padRight, "padRight"),
  pascalCase: /* @__PURE__ */ __name(() => pascalCase, "pascalCase"),
  pluralize: /* @__PURE__ */ __name(() => pluralize, "pluralize"),
  snakeCase: /* @__PURE__ */ __name(() => snakeCase, "snakeCase"),
  trim: /* @__PURE__ */ __name(() => trim, "trim"),
  trimEnd: /* @__PURE__ */ __name(() => trimEnd, "trimEnd"),
  trimStart: /* @__PURE__ */ __name(() => trimStart, "trimStart"),
  upperCase: /* @__PURE__ */ __name(() => upperCase, "upperCase"),
  words: /* @__PURE__ */ __name(() => words, "words")
});

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
function expectCondition(condition, message, position) {
  misc_exports.invariant(condition, new GenerationError(message, position));
}
__name(expectCondition, "expectCondition");
function expectValue(value, message, position) {
  expectCondition(value !== null && value !== void 0, message, position);
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

// node_modules/@varavel/gen/dist/index.js
var _a3;
var Generator = (_a3 = class {
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
}, __name(_a3, "Generator"), _a3);
function newGenerator() {
  return new Generator();
}
__name(newGenerator, "newGenerator");

// src/shared/comments.ts
var DEFAULT_DEPRECATED_MESSAGE = "This symbol is deprecated and should not be used in new code.";
function getDeprecatedMessage(annotations) {
  const deprecated = ir_exports.getAnnotation(annotations, "deprecated");
  if (!deprecated) {
    return void 0;
  }
  const argument = ir_exports.getAnnotationArg(annotations, "deprecated");
  if (argument) {
    const unwrapped = ir_exports.unwrapLiteral(argument);
    if (typeof unwrapped === "string" && unwrapped.trim().length > 0) {
      return unwrapped;
    }
  }
  return DEFAULT_DEPRECATED_MESSAGE;
}
__name(getDeprecatedMessage, "getDeprecatedMessage");
function buildDocCommentLines(options) {
  var _a4, _b, _c;
  const lines = (_c = (_b = (_a4 = options.doc) != null ? _a4 : options.fallback) == null ? void 0 : _b.split("\n")) != null ? _c : [];
  const deprecatedMessage = getDeprecatedMessage(options.annotations);
  if (!deprecatedMessage) return lines;
  if (lines.length === 0) return [`Deprecated: ${deprecatedMessage}`];
  return [...lines, "", `Deprecated: ${deprecatedMessage}`];
}
__name(buildDocCommentLines, "buildDocCommentLines");
function writeDocComment(g, lines) {
  if (lines.length === 0) return;
  for (const line of lines) {
    g.line(`// ${line}`.trim());
  }
}
__name(writeDocComment, "writeDocComment");

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

// src/shared/go-types/const-eligibility.ts
function isConstEligibleType(typeRef, context, position) {
  const resolved = resolveNonTypeRef(typeRef, context, position);
  if (resolved.kind === "enum") {
    return true;
  }
  return resolved.kind === "primitive" && resolved.primitiveName !== "datetime";
}
__name(isConstEligibleType, "isConstEligibleType");

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
  return escapeGoIdentifier(strings_exports.pascalCase(value));
}
__name(toGoTypeName, "toGoTypeName");
function toGoConstName(value) {
  return escapeGoIdentifier(strings_exports.pascalCase(value));
}
__name(toGoConstName, "toGoConstName");
function toGoFieldName(value) {
  return escapeGoIdentifier(strings_exports.pascalCase(value));
}
__name(toGoFieldName, "toGoFieldName");
function toGoEnumMemberName(value) {
  return escapeGoIdentifier(strings_exports.pascalCase(value));
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
  const member = enumDescriptor.memberByValue.get(crypto_exports.hash(literal));
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
  if (!enumDescriptor.memberByValue.has(crypto_exports.hash(literal))) {
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

// src/shared/render/go-file.ts
function renderGoFile(options) {
  var _a4, _b;
  const g = newGenerator().withTabs();
  const imports = (_b = (_a4 = options.imports) == null ? void 0 : _a4.toArray()) != null ? _b : [];
  const body = options.body.trim();
  g.line(`package ${options.packageName}`);
  if (imports.length > 0 && options.imports) {
    g.break();
    options.imports.render(g);
  }
  if (body.length > 0) {
    g.break();
    g.raw(body);
    g.break();
  }
  return strings_exports.limitBlankLines(g.toString(), 1);
}
__name(renderGoFile, "renderGoFile");

// src/shared/render/imports.ts
var _paths;
var _ImportSet = class _ImportSet {
  constructor() {
    __privateAdd(this, _paths, /* @__PURE__ */ new Set());
  }
  /**
   * Adds an import path to the set.
   *
   * @param path - The import path to add.
   */
  add(path) {
    if (path) {
      __privateGet(this, _paths).add(path);
    }
  }
  /**
   * Merges another ImportSet into this one.
   *
   * @param other - The set to merge from.
   */
  merge(other) {
    for (const path of other.toArray()) {
      this.add(path);
    }
  }
  /**
   * Returns the import paths sorted alphabetically.
   *
   * @returns An array of sorted import path strings.
   */
  toArray() {
    return [...__privateGet(this, _paths)].sort((left, right) => left.localeCompare(right));
  }
  /**
   * Renders the import set as a Go `import ( ... )` block.
   *
   * If the set is empty, this function does nothing.
   *
   * @param g - The Go code generator.
   */
  render(g) {
    const imports = this.toArray();
    if (imports.length === 0) {
      return;
    }
    g.line("import (");
    g.block(() => {
      for (const path of imports) {
        g.line(JSON.stringify(path));
      }
    });
    g.line(")");
  }
};
_paths = new WeakMap();
__name(_ImportSet, "ImportSet");
var ImportSet = _ImportSet;

// src/stages/emit/files/constants.ts
function generateConstantsFile(context) {
  if (!context.options.genConsts || context.constantDescriptors.length === 0) {
    return void 0;
  }
  const imports = new ImportSet();
  const g = newGenerator().withTabs();
  for (const constant of context.constantDescriptors) {
    writeDocComment(
      g,
      buildDocCommentLines({
        doc: constant.def.doc,
        annotations: constant.def.annotations,
        fallback: `${constant.goName} holds a generated VDL constant.`
      })
    );
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
  const body = g.toString();
  if (body.includes("time.")) imports.add("time");
  if (body.includes("json.")) imports.add("encoding/json");
  if (body.includes("fmt.")) imports.add("fmt");
  return {
    path: "constants.go",
    content: renderGoFile({
      packageName: context.options.packageName,
      imports,
      body
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
  writeDocComment(
    g,
    buildDocCommentLines({
      doc: enumDescriptor.def.doc,
      annotations: enumDescriptor.def.annotations,
      fallback: `${enumDescriptor.goName} defines a generated enum.`
    })
  );
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
      writeDocComment(
        g,
        buildDocCommentLines({
          doc: member.def.doc,
          annotations: member.def.annotations
        })
      );
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
  const imports = new ImportSet();
  const g = newGenerator().withTabs();
  for (const enumDescriptor of context.enumDescriptors) {
    renderEnum(g, enumDescriptor, context.options.strict);
    g.break();
  }
  const body = g.toString();
  if (body.includes("time.")) imports.add("time");
  if (body.includes("json.")) imports.add("encoding/json");
  if (body.includes("fmt.")) imports.add("fmt");
  return {
    path: "enums.go",
    content: renderGoFile({
      packageName: context.options.packageName,
      imports,
      body
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
  writeDocComment(
    g,
    buildDocCommentLines({
      doc: descriptor.doc,
      annotations: descriptor.annotations,
      fallback
    })
  );
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
      const commentLines = buildDocCommentLines({
        doc: field.def.doc,
        annotations: field.def.annotations
      });
      if (commentLines.length > 0) {
        writeDocComment(g, commentLines);
      }
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
  const imports = new ImportSet();
  const g = newGenerator().withTabs();
  for (const namedType of context.namedTypes) {
    renderNamedType(g, namedType, context);
    g.break();
  }
  const body = g.toString();
  if (body.includes("time.")) imports.add("time");
  if (body.includes("json.")) imports.add("encoding/json");
  if (body.includes("fmt.")) imports.add("fmt");
  return {
    path: "types.go",
    content: renderGoFile({
      packageName: context.options.packageName,
      imports,
      body
    })
  };
}
__name(generateTypesFile, "generateTypesFile");

// src/stages/emit/generate-files.ts
function generateFiles(context) {
  return arrays_exports.compact([
    generateEnumsFile(context),
    generateTypesFile(context),
    generateConstantsFile(context),
    generatePointersFile(context)
  ]);
}
__name(generateFiles, "generateFiles");

// src/stages/model/constants.ts
function populateConstantDescriptors(context, packageScopeSymbols) {
  const errors = [];
  const inferredTypeDefs = context.schema.types.filter(
    (typeDef) => typeDef.name.startsWith("$Const") && typeDef.name.length > 6
  );
  const inferredTypeByConstName = new Map(
    inferredTypeDefs.map((typeDef) => [typeDef.name.slice(6), typeDef.typeRef])
  );
  for (const constantDef of context.schema.constants) {
    const inferredType = inferredTypeByConstName.get(constantDef.name);
    let typeRef = inferredType;
    let inferenceError;
    if (!typeRef) {
      const inference = inferTypeRefFromLiteral(
        constantDef.value,
        constantDef.position
      );
      typeRef = inference.typeRef;
      inferenceError = inference.error;
    }
    if (inferenceError) {
      errors.push({
        message: `Could not infer type for constant ${JSON.stringify(constantDef.name)}: ${inferenceError}`,
        position: constantDef.position
      });
      continue;
    }
    if (!typeRef) {
      errors.push({
        message: `Could not infer type for constant ${JSON.stringify(constantDef.name)}.`,
        position: constantDef.position
      });
      continue;
    }
    const descriptor = {
      def: constantDef,
      goName: toGoConstName(constantDef.name),
      typeRef
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
function inferTypeRefFromLiteral(literal, _position) {
  var _a4, _b;
  switch (literal.kind) {
    case "string":
      return { typeRef: { kind: "primitive", primitiveName: "string" } };
    case "int":
      return { typeRef: { kind: "primitive", primitiveName: "int" } };
    case "float":
      return { typeRef: { kind: "primitive", primitiveName: "float" } };
    case "bool":
      return { typeRef: { kind: "primitive", primitiveName: "bool" } };
    case "array": {
      const items = (_a4 = literal.arrayItems) != null ? _a4 : [];
      if (items.length === 0) {
        return {
          error: "array literals cannot be empty when no declared constant type is available"
        };
      }
      const firstItem = items[0];
      if (!firstItem) {
        return { error: "encountered an undefined array item literal" };
      }
      const elementInference = inferTypeRefFromLiteral(
        firstItem,
        firstItem.position
      );
      const elementType = elementInference.typeRef;
      const elementError = elementInference.error;
      if (elementError) {
        return { error: elementError };
      }
      if (!elementType) {
        return { error: "could not infer array element type" };
      }
      for (let index = 1; index < items.length; index += 1) {
        const item = items[index];
        if (!item) {
          return { error: "encountered an undefined array item literal" };
        }
        const candidateInference = inferTypeRefFromLiteral(item, item.position);
        const candidate = candidateInference.typeRef;
        const candidateError = candidateInference.error;
        if (candidateError) {
          return { error: candidateError };
        }
        if (!candidate) {
          return { error: "could not infer array item type" };
        }
        if (!areTypeRefsEquivalent(elementType, candidate)) {
          return {
            error: `array literal item at index ${String(index)} does not match inferred element type`
          };
        }
      }
      return {
        typeRef: { kind: "array", arrayDims: 1, arrayType: elementType }
      };
    }
    case "object": {
      const entries = (_b = literal.objectEntries) != null ? _b : [];
      const fields = [];
      for (const entry of getEffectiveObjectEntries(entries)) {
        const fieldInference = inferTypeRefFromLiteral(
          entry.value,
          entry.position
        );
        const fieldType = fieldInference.typeRef;
        const fieldError = fieldInference.error;
        if (fieldError) {
          return { error: fieldError };
        }
        if (!fieldType) {
          return {
            error: `could not infer object field type for ${JSON.stringify(entry.key)}`
          };
        }
        fields.push({
          position: entry.position,
          name: entry.key,
          optional: false,
          annotations: [],
          typeRef: fieldType
        });
      }
      return { typeRef: { kind: "object", objectFields: fields } };
    }
    default:
      return { error: "unsupported literal kind" };
  }
}
__name(inferTypeRefFromLiteral, "inferTypeRefFromLiteral");
function getEffectiveObjectEntries(entries) {
  const fields = entries.map((entry) => ({
    position: entry.position,
    name: entry.key,
    optional: false,
    annotations: [],
    typeRef: { kind: "primitive", primitiveName: "string" }
  }));
  const effectiveFields = fields != null ? fields : [];
  const indexByName = new Map(
    entries.map((entry, index) => [entry.key, index])
  );
  return effectiveFields.map(
    (field) => entries[indexByName.get(field.name)]
  );
}
__name(getEffectiveObjectEntries, "getEffectiveObjectEntries");
function areTypeRefsEquivalent(left, right) {
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
      return ((_a4 = left.arrayDims) != null ? _a4 : 1) === ((_b = right.arrayDims) != null ? _b : 1) && areTypeRefsEquivalent(
        left.arrayType,
        right.arrayType
      );
    case "map":
      return areTypeRefsEquivalent(
        left.mapType,
        right.mapType
      );
    case "object": {
      const leftFields = (_c = left.objectFields) != null ? _c : [];
      const rightFields = (_d = right.objectFields) != null ? _d : [];
      if (leftFields.length !== rightFields.length) {
        return false;
      }
      for (let index = 0; index < leftFields.length; index += 1) {
        const leftField = leftFields[index];
        const rightField = rightFields[index];
        if (leftField.name !== rightField.name || leftField.optional !== rightField.optional || !areTypeRefsEquivalent(leftField.typeRef, rightField.typeRef)) {
          return false;
        }
      }
      return true;
    }
    default:
      return false;
  }
}
__name(areTypeRefsEquivalent, "areTypeRefsEquivalent");

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
      valueKey: crypto_exports.hash(member.value)
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

// src/stages/model/indexes.ts
function buildDefinitionIndexes(schema) {
  return {
    typeDefsByVdlName: new Map(
      schema.types.map((typeDef) => [typeDef.name, typeDef])
    ),
    typeGoNamesByVdlName: new Map(
      schema.types.map((typeDef) => [typeDef.name, toGoTypeName(typeDef.name)])
    ),
    enumGoNamesByVdlName: new Map(
      schema.enums.map((enumDef) => [enumDef.name, toGoTypeName(enumDef.name)])
    )
  };
}
__name(buildDefinitionIndexes, "buildDefinitionIndexes");

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
  for (const typeDef of context.schema.types) {
    appendNamedTypeDescriptor(
      context,
      buildTopLevelTypeDescriptor(typeDef, context, errors),
      context.namedTypesByGoName,
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
    parentGoName: options.parentGoName,
    annotations: [],
    position: options.fieldPosition,
    kind: "object",
    typeRef: options.typeRef,
    fields: fieldResult.fields
  };
}
__name(buildInlineTypeDescriptor, "buildInlineTypeDescriptor");
function appendNamedTypeDescriptor(context, descriptor, namedTypesByGoName, packageScopeSymbols, errors) {
  if (namedTypesByGoName.has(descriptor.goName)) {
    errors.push({
      message: `Generated Go type name ${JSON.stringify(descriptor.goName)} collides with another generated type.`,
      position: descriptor.position
    });
    return;
  }
  namedTypesByGoName.set(descriptor.goName, descriptor);
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
      namedTypesByGoName,
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
        options.namedTypesByGoName,
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
  const indexes = buildDefinitionIndexes(options.schema);
  const packageScopeSymbols = new PackageScopeSymbolTable();
  const context = {
    schema: options.schema,
    options: options.generatorOptions,
    typeDefsByVdlName: indexes.typeDefsByVdlName,
    typeGoNamesByVdlName: indexes.typeGoNamesByVdlName,
    enumGoNamesByVdlName: indexes.enumGoNamesByVdlName,
    namedTypes: [],
    namedTypesByGoName: /* @__PURE__ */ new Map(),
    enumDescriptors: [],
    enumDescriptorsByVdlName: /* @__PURE__ */ new Map(),
    constantDescriptors: []
  };
  const errors = [
    ...populateNamedTypes(context, packageScopeSymbols),
    ...populateEnumDescriptors(context, packageScopeSymbols),
    ...populateConstantDescriptors(context, packageScopeSymbols)
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

// src/stages/options/resolve.ts
function resolveGeneratorOptions(input) {
  const packageName = options_exports.getOptionString(input.options, "package", "vdl");
  const genConsts = options_exports.getOptionBool(input.options, "genConsts", true);
  const strict = options_exports.getOptionBool(input.options, "strict", true);
  const genPointerUtils = options_exports.getOptionBool(
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
