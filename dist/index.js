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

// node_modules/@varavel/vdl-plugin-sdk/dist/types-hJ-3ZrlX.js
function hydrateAnnotation(input) {
  return {
    position: hydratePosition(input.position),
    name: input.name,
    argument: input.argument ? hydrateLiteralValue(input.argument) : input.argument
  };
}
__name(hydrateAnnotation, "hydrateAnnotation");
function hydrateConstantDef(input) {
  return {
    position: hydratePosition(input.position),
    name: input.name,
    doc: input.doc ? input.doc : input.doc,
    annotations: input.annotations.map((el) => hydrateAnnotation(el)),
    typeRef: hydrateTypeRef(input.typeRef),
    value: hydrateLiteralValue(input.value)
  };
}
__name(hydrateConstantDef, "hydrateConstantDef");
function hydrateEnumDef(input) {
  return {
    position: hydratePosition(input.position),
    name: input.name,
    doc: input.doc ? input.doc : input.doc,
    annotations: input.annotations.map((el) => hydrateAnnotation(el)),
    enumType: input.enumType,
    members: input.members.map((el) => hydrateEnumMember(el))
  };
}
__name(hydrateEnumDef, "hydrateEnumDef");
function hydrateEnumMember(input) {
  return {
    position: hydratePosition(input.position),
    name: input.name,
    value: hydrateLiteralValue(input.value),
    doc: input.doc ? input.doc : input.doc,
    annotations: input.annotations.map((el) => hydrateAnnotation(el))
  };
}
__name(hydrateEnumMember, "hydrateEnumMember");
function hydrateField(input) {
  return {
    position: hydratePosition(input.position),
    name: input.name,
    doc: input.doc ? input.doc : input.doc,
    optional: input.optional,
    annotations: input.annotations.map((el) => hydrateAnnotation(el)),
    typeRef: hydrateTypeRef(input.typeRef)
  };
}
__name(hydrateField, "hydrateField");
function hydrateIrSchema(input) {
  return {
    entryPoint: input.entryPoint,
    constants: input.constants.map((el) => hydrateConstantDef(el)),
    enums: input.enums.map((el) => hydrateEnumDef(el)),
    types: input.types.map((el) => hydrateTypeDef(el)),
    docs: input.docs.map((el) => hydrateTopLevelDoc(el))
  };
}
__name(hydrateIrSchema, "hydrateIrSchema");
function hydrateLiteralValue(input) {
  return {
    position: hydratePosition(input.position),
    kind: input.kind,
    stringValue: input.stringValue ? input.stringValue : input.stringValue,
    intValue: input.intValue ? input.intValue : input.intValue,
    floatValue: input.floatValue ? input.floatValue : input.floatValue,
    boolValue: input.boolValue ? input.boolValue : input.boolValue,
    objectEntries: input.objectEntries ? input.objectEntries.map((el) => hydrateObjectEntry(el)) : input.objectEntries,
    arrayItems: input.arrayItems ? input.arrayItems.map((el) => hydrateLiteralValue(el)) : input.arrayItems
  };
}
__name(hydrateLiteralValue, "hydrateLiteralValue");
function hydrateObjectEntry(input) {
  return {
    position: hydratePosition(input.position),
    key: input.key,
    value: hydrateLiteralValue(input.value)
  };
}
__name(hydrateObjectEntry, "hydrateObjectEntry");
function hydratePosition(input) {
  return {
    file: input.file,
    line: input.line,
    column: input.column
  };
}
__name(hydratePosition, "hydratePosition");
function hydrateTopLevelDoc(input) {
  return {
    position: hydratePosition(input.position),
    content: input.content
  };
}
__name(hydrateTopLevelDoc, "hydrateTopLevelDoc");
function hydrateTypeDef(input) {
  return {
    position: hydratePosition(input.position),
    name: input.name,
    doc: input.doc ? input.doc : input.doc,
    annotations: input.annotations.map((el) => hydrateAnnotation(el)),
    typeRef: hydrateTypeRef(input.typeRef)
  };
}
__name(hydrateTypeDef, "hydrateTypeDef");
function hydrateTypeRef(input) {
  return {
    kind: input.kind,
    primitiveName: input.primitiveName ? input.primitiveName : input.primitiveName,
    typeName: input.typeName ? input.typeName : input.typeName,
    enumName: input.enumName ? input.enumName : input.enumName,
    enumType: input.enumType ? input.enumType : input.enumType,
    arrayType: input.arrayType ? hydrateTypeRef(input.arrayType) : input.arrayType,
    arrayDims: input.arrayDims ? input.arrayDims : input.arrayDims,
    mapType: input.mapType ? hydrateTypeRef(input.mapType) : input.mapType,
    objectFields: input.objectFields ? input.objectFields.map((el) => hydrateField(el)) : input.objectFields
  };
}
__name(hydrateTypeRef, "hydrateTypeRef");

// node_modules/@varavel/vdl-plugin-sdk/dist/index.js
function definePlugin(handler) {
  return handler;
}
__name(definePlugin, "definePlugin");

// node_modules/@varavel/vdl-plugin-sdk/dist/chunk-pbuEa-1d.js
var __defProp2 = Object.defineProperty;
var __exportAll = /* @__PURE__ */ __name((all, no_symbols) => {
  let target = {};
  for (var name in all) __defProp2(target, name, {
    get: all[name],
    enumerable: true
  });
  if (!no_symbols) __defProp2(target, Symbol.toStringTag, { value: "Module" });
  return target;
}, "__exportAll");

// node_modules/@varavel/vdl-plugin-sdk/dist/objectSpread2-eK8xUo8N.js
function _typeof(o) {
  "@babel/helpers - typeof";
  return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(o2) {
    return typeof o2;
  } : function(o2) {
    return o2 && "function" == typeof Symbol && o2.constructor === Symbol && o2 !== Symbol.prototype ? "symbol" : typeof o2;
  }, _typeof(o);
}
__name(_typeof, "_typeof");
function toPrimitive(t, r) {
  if ("object" != _typeof(t) || !t) return t;
  var e = t[Symbol.toPrimitive];
  if (void 0 !== e) {
    var i = e.call(t, r || "default");
    if ("object" != _typeof(i)) return i;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return ("string" === r ? String : Number)(t);
}
__name(toPrimitive, "toPrimitive");
function toPropertyKey(t) {
  var i = toPrimitive(t, "string");
  return "symbol" == _typeof(i) ? i : i + "";
}
__name(toPropertyKey, "toPropertyKey");
function _defineProperty(e, r, t) {
  return (r = toPropertyKey(r)) in e ? Object.defineProperty(e, r, {
    value: t,
    enumerable: true,
    configurable: true,
    writable: true
  }) : e[r] = t, e;
}
__name(_defineProperty, "_defineProperty");
function ownKeys(e, r) {
  var t = Object.keys(e);
  if (Object.getOwnPropertySymbols) {
    var o = Object.getOwnPropertySymbols(e);
    r && (o = o.filter(function(r2) {
      return Object.getOwnPropertyDescriptor(e, r2).enumerable;
    })), t.push.apply(t, o);
  }
  return t;
}
__name(ownKeys, "ownKeys");
function _objectSpread2(e) {
  for (var r = 1; r < arguments.length; r++) {
    var t = null != arguments[r] ? arguments[r] : {};
    r % 2 ? ownKeys(Object(t), true).forEach(function(r2) {
      _defineProperty(e, r2, t[r2]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function(r2) {
      Object.defineProperty(e, r2, Object.getOwnPropertyDescriptor(t, r2));
    });
  }
  return e;
}
__name(_objectSpread2, "_objectSpread2");

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
  const output = hydrateIrSchema(schema);
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
function isPrimitive$1(value) {
  return value == null || typeof value !== "object" && typeof value !== "function";
}
__name(isPrimitive$1, "isPrimitive$1");
function isTypedArray(x) {
  return ArrayBuffer.isView(x) && !(x instanceof DataView);
}
__name(isTypedArray, "isTypedArray");
function clone$1(obj) {
  if (isPrimitive$1(obj)) return obj;
  if (Array.isArray(obj) || isTypedArray(obj) || obj instanceof ArrayBuffer || typeof SharedArrayBuffer !== "undefined" && obj instanceof SharedArrayBuffer) return obj.slice(0);
  const prototype = Object.getPrototypeOf(obj);
  if (prototype == null) return Object.assign(Object.create(prototype), obj);
  const Constructor = prototype.constructor;
  if (obj instanceof Date || obj instanceof Map || obj instanceof Set) return new Constructor(obj);
  if (obj instanceof RegExp) {
    const newRegExp = new Constructor(obj);
    newRegExp.lastIndex = obj.lastIndex;
    return newRegExp;
  }
  if (obj instanceof DataView) return new Constructor(obj.buffer.slice(0));
  if (obj instanceof Error) {
    let newError;
    if (obj instanceof AggregateError) newError = new Constructor(obj.errors, obj.message, { cause: obj.cause });
    else newError = new Constructor(obj.message, { cause: obj.cause });
    newError.stack = obj.stack;
    Object.assign(newError, obj);
    return newError;
  }
  if (typeof File !== "undefined" && obj instanceof File) return new Constructor([obj], obj.name, {
    type: obj.type,
    lastModified: obj.lastModified
  });
  if (typeof obj === "object") {
    const newObject = Object.create(prototype);
    return Object.assign(newObject, obj);
  }
  return obj;
}
__name(clone$1, "clone$1");
function getSymbols(object) {
  return Object.getOwnPropertySymbols(object).filter((symbol) => Object.prototype.propertyIsEnumerable.call(object, symbol));
}
__name(getSymbols, "getSymbols");
function getTag(value) {
  if (value == null) return value === void 0 ? "[object Undefined]" : "[object Null]";
  return Object.prototype.toString.call(value);
}
__name(getTag, "getTag");
var regexpTag = "[object RegExp]";
var stringTag = "[object String]";
var numberTag = "[object Number]";
var booleanTag = "[object Boolean]";
var argumentsTag = "[object Arguments]";
var symbolTag = "[object Symbol]";
var dateTag = "[object Date]";
var mapTag = "[object Map]";
var setTag = "[object Set]";
var arrayTag = "[object Array]";
var arrayBufferTag = "[object ArrayBuffer]";
var objectTag = "[object Object]";
var dataViewTag = "[object DataView]";
var uint8ArrayTag = "[object Uint8Array]";
var uint8ClampedArrayTag = "[object Uint8ClampedArray]";
var uint16ArrayTag = "[object Uint16Array]";
var uint32ArrayTag = "[object Uint32Array]";
var int8ArrayTag = "[object Int8Array]";
var int16ArrayTag = "[object Int16Array]";
var int32ArrayTag = "[object Int32Array]";
var float32ArrayTag = "[object Float32Array]";
var float64ArrayTag = "[object Float64Array]";
function cloneDeepWithImpl(valueToClone, keyToClone, objectToClone, stack = /* @__PURE__ */ new Map(), cloneValue = void 0) {
  const cloned = cloneValue === null || cloneValue === void 0 ? void 0 : cloneValue(valueToClone, keyToClone, objectToClone, stack);
  if (cloned !== void 0) return cloned;
  if (isPrimitive$1(valueToClone)) return valueToClone;
  if (stack.has(valueToClone)) return stack.get(valueToClone);
  if (Array.isArray(valueToClone)) {
    const result = new Array(valueToClone.length);
    stack.set(valueToClone, result);
    for (let i = 0; i < valueToClone.length; i++) result[i] = cloneDeepWithImpl(valueToClone[i], i, objectToClone, stack, cloneValue);
    if (Object.hasOwn(valueToClone, "index")) result.index = valueToClone.index;
    if (Object.hasOwn(valueToClone, "input")) result.input = valueToClone.input;
    return result;
  }
  if (valueToClone instanceof Date) return new Date(valueToClone.getTime());
  if (valueToClone instanceof RegExp) {
    const result = new RegExp(valueToClone.source, valueToClone.flags);
    result.lastIndex = valueToClone.lastIndex;
    return result;
  }
  if (valueToClone instanceof Map) {
    const result = /* @__PURE__ */ new Map();
    stack.set(valueToClone, result);
    for (const [key, value] of valueToClone) result.set(key, cloneDeepWithImpl(value, key, objectToClone, stack, cloneValue));
    return result;
  }
  if (valueToClone instanceof Set) {
    const result = /* @__PURE__ */ new Set();
    stack.set(valueToClone, result);
    for (const value of valueToClone) result.add(cloneDeepWithImpl(value, void 0, objectToClone, stack, cloneValue));
    return result;
  }
  if (typeof Buffer !== "undefined" && Buffer.isBuffer(valueToClone)) return valueToClone.subarray();
  if (isTypedArray(valueToClone)) {
    const result = new (Object.getPrototypeOf(valueToClone)).constructor(valueToClone.length);
    stack.set(valueToClone, result);
    for (let i = 0; i < valueToClone.length; i++) result[i] = cloneDeepWithImpl(valueToClone[i], i, objectToClone, stack, cloneValue);
    return result;
  }
  if (valueToClone instanceof ArrayBuffer || typeof SharedArrayBuffer !== "undefined" && valueToClone instanceof SharedArrayBuffer) return valueToClone.slice(0);
  if (valueToClone instanceof DataView) {
    const result = new DataView(valueToClone.buffer.slice(0), valueToClone.byteOffset, valueToClone.byteLength);
    stack.set(valueToClone, result);
    copyProperties(result, valueToClone, objectToClone, stack, cloneValue);
    return result;
  }
  if (typeof File !== "undefined" && valueToClone instanceof File) {
    const result = new File([valueToClone], valueToClone.name, { type: valueToClone.type });
    stack.set(valueToClone, result);
    copyProperties(result, valueToClone, objectToClone, stack, cloneValue);
    return result;
  }
  if (typeof Blob !== "undefined" && valueToClone instanceof Blob) {
    const result = new Blob([valueToClone], { type: valueToClone.type });
    stack.set(valueToClone, result);
    copyProperties(result, valueToClone, objectToClone, stack, cloneValue);
    return result;
  }
  if (valueToClone instanceof Error) {
    const result = structuredClone(valueToClone);
    stack.set(valueToClone, result);
    result.message = valueToClone.message;
    result.name = valueToClone.name;
    result.stack = valueToClone.stack;
    result.cause = valueToClone.cause;
    result.constructor = valueToClone.constructor;
    copyProperties(result, valueToClone, objectToClone, stack, cloneValue);
    return result;
  }
  if (valueToClone instanceof Boolean) {
    const result = new Boolean(valueToClone.valueOf());
    stack.set(valueToClone, result);
    copyProperties(result, valueToClone, objectToClone, stack, cloneValue);
    return result;
  }
  if (valueToClone instanceof Number) {
    const result = new Number(valueToClone.valueOf());
    stack.set(valueToClone, result);
    copyProperties(result, valueToClone, objectToClone, stack, cloneValue);
    return result;
  }
  if (valueToClone instanceof String) {
    const result = new String(valueToClone.valueOf());
    stack.set(valueToClone, result);
    copyProperties(result, valueToClone, objectToClone, stack, cloneValue);
    return result;
  }
  if (typeof valueToClone === "object" && isCloneableObject(valueToClone)) {
    const result = Object.create(Object.getPrototypeOf(valueToClone));
    stack.set(valueToClone, result);
    copyProperties(result, valueToClone, objectToClone, stack, cloneValue);
    return result;
  }
  return valueToClone;
}
__name(cloneDeepWithImpl, "cloneDeepWithImpl");
function copyProperties(target, source, objectToClone = target, stack, cloneValue) {
  const keys = [...Object.keys(source), ...getSymbols(source)];
  for (let i = 0; i < keys.length; i++) {
    const key = keys[i];
    const descriptor = Object.getOwnPropertyDescriptor(target, key);
    if (descriptor == null || descriptor.writable) target[key] = cloneDeepWithImpl(source[key], key, objectToClone, stack, cloneValue);
  }
}
__name(copyProperties, "copyProperties");
function isCloneableObject(object) {
  switch (getTag(object)) {
    case argumentsTag:
    case arrayTag:
    case arrayBufferTag:
    case dataViewTag:
    case booleanTag:
    case dateTag:
    case float32ArrayTag:
    case float64ArrayTag:
    case int8ArrayTag:
    case int16ArrayTag:
    case int32ArrayTag:
    case mapTag:
    case numberTag:
    case objectTag:
    case regexpTag:
    case setTag:
    case stringTag:
    case symbolTag:
    case uint8ArrayTag:
    case uint8ClampedArrayTag:
    case uint16ArrayTag:
    case uint32ArrayTag:
      return true;
    default:
      return false;
  }
}
__name(isCloneableObject, "isCloneableObject");
function cloneDeep$1(obj) {
  return cloneDeepWithImpl(obj, void 0, obj, /* @__PURE__ */ new Map(), void 0);
}
__name(cloneDeep$1, "cloneDeep$1");
function findKey$1(obj, predicate) {
  return Object.keys(obj).find((key) => predicate(obj[key], key, obj));
}
__name(findKey$1, "findKey$1");
function isPlainObject$1(value) {
  if (!value || typeof value !== "object") return false;
  const proto = Object.getPrototypeOf(value);
  if (!(proto === null || proto === Object.prototype || Object.getPrototypeOf(proto) === null)) return false;
  return Object.prototype.toString.call(value) === "[object Object]";
}
__name(isPlainObject$1, "isPlainObject$1");
function flattenObject$1(object, { delimiter = "." } = {}) {
  return flattenObjectImpl(object, "", delimiter);
}
__name(flattenObject$1, "flattenObject$1");
function flattenObjectImpl(object, prefix, delimiter) {
  const result = {};
  const keys = Object.keys(object);
  for (let i = 0; i < keys.length; i++) {
    const key = keys[i];
    const value = object[key];
    const prefixedKey = prefix ? `${prefix}${delimiter}${key}` : key;
    if (isPlainObject$1(value) && Object.keys(value).length > 0) {
      Object.assign(result, flattenObjectImpl(value, prefixedKey, delimiter));
      continue;
    }
    if (Array.isArray(value) && value.length > 0) {
      Object.assign(result, flattenObjectImpl(value, prefixedKey, delimiter));
      continue;
    }
    result[prefixedKey] = value;
  }
  return result;
}
__name(flattenObjectImpl, "flattenObjectImpl");
function invert$1(obj) {
  const result = {};
  const keys = Object.keys(obj);
  for (let i = 0; i < keys.length; i++) {
    const key = keys[i];
    const value = obj[key];
    result[value] = key;
  }
  return result;
}
__name(invert$1, "invert$1");
function mapKeys$1(object, getNewKey) {
  const result = {};
  const keys = Object.keys(object);
  for (let i = 0; i < keys.length; i++) {
    const key = keys[i];
    const value = object[key];
    result[getNewKey(value, key, object)] = value;
  }
  return result;
}
__name(mapKeys$1, "mapKeys$1");
function mapValues$1(object, getNewValue) {
  const result = {};
  const keys = Object.keys(object);
  for (let i = 0; i < keys.length; i++) {
    const key = keys[i];
    const value = object[key];
    result[key] = getNewValue(value, key, object);
  }
  return result;
}
__name(mapValues$1, "mapValues$1");
function isUnsafeProperty(key) {
  return key === "__proto__";
}
__name(isUnsafeProperty, "isUnsafeProperty");
function merge$1(target, source) {
  const sourceKeys = Object.keys(source);
  for (let i = 0; i < sourceKeys.length; i++) {
    const key = sourceKeys[i];
    if (isUnsafeProperty(key)) continue;
    const sourceValue = source[key];
    const targetValue = target[key];
    if (isMergeableValue(sourceValue) && isMergeableValue(targetValue)) target[key] = merge$1(targetValue, sourceValue);
    else if (Array.isArray(sourceValue)) target[key] = merge$1([], sourceValue);
    else if (isPlainObject$1(sourceValue)) target[key] = merge$1({}, sourceValue);
    else if (targetValue === void 0 || sourceValue !== void 0) target[key] = sourceValue;
  }
  return target;
}
__name(merge$1, "merge$1");
function isMergeableValue(value) {
  return isPlainObject$1(value) || Array.isArray(value);
}
__name(isMergeableValue, "isMergeableValue");
function mergeWith$1(target, source, merge2) {
  const sourceKeys = Object.keys(source);
  for (let i = 0; i < sourceKeys.length; i++) {
    const key = sourceKeys[i];
    if (isUnsafeProperty(key)) continue;
    const sourceValue = source[key];
    const targetValue = target[key];
    const merged = merge2(targetValue, sourceValue, key, target, source);
    if (merged !== void 0) target[key] = merged;
    else if (Array.isArray(sourceValue)) if (Array.isArray(targetValue)) target[key] = mergeWith$1(targetValue, sourceValue, merge2);
    else target[key] = mergeWith$1([], sourceValue, merge2);
    else if (isPlainObject$1(sourceValue)) if (isPlainObject$1(targetValue)) target[key] = mergeWith$1(targetValue, sourceValue, merge2);
    else target[key] = mergeWith$1({}, sourceValue, merge2);
    else if (targetValue === void 0 || sourceValue !== void 0) target[key] = sourceValue;
  }
  return target;
}
__name(mergeWith$1, "mergeWith$1");
function omit$1(obj, keys) {
  const result = _objectSpread2({}, obj);
  for (let i = 0; i < keys.length; i++) {
    const key = keys[i];
    delete result[key];
  }
  return result;
}
__name(omit$1, "omit$1");
function omitBy$1(obj, shouldOmit) {
  const result = {};
  const keys = Object.keys(obj);
  for (let i = 0; i < keys.length; i++) {
    const key = keys[i];
    const value = obj[key];
    if (!shouldOmit(value, key)) result[key] = value;
  }
  return result;
}
__name(omitBy$1, "omitBy$1");
function pick$1(obj, keys) {
  const result = {};
  for (let i = 0; i < keys.length; i++) {
    const key = keys[i];
    if (Object.hasOwn(obj, key)) result[key] = obj[key];
  }
  return result;
}
__name(pick$1, "pick$1");
function pickBy$1(obj, shouldPick) {
  const result = {};
  const keys = Object.keys(obj);
  for (let i = 0; i < keys.length; i++) {
    const key = keys[i];
    const value = obj[key];
    if (shouldPick(value, key)) result[key] = value;
  }
  return result;
}
__name(pickBy$1, "pickBy$1");
function toMerged$1(target, source) {
  return mergeWith$1(clone$1(target), source, /* @__PURE__ */ __name(function mergeRecursively(targetValue, sourceValue) {
    if (Array.isArray(sourceValue)) if (Array.isArray(targetValue)) return mergeWith$1(clone$1(targetValue), sourceValue, mergeRecursively);
    else return mergeWith$1([], sourceValue, mergeRecursively);
    else if (isPlainObject$1(sourceValue)) if (isPlainObject$1(targetValue)) return mergeWith$1(clone$1(targetValue), sourceValue, mergeRecursively);
    else return mergeWith$1({}, sourceValue, mergeRecursively);
  }, "mergeRecursively"));
}
__name(toMerged$1, "toMerged$1");
var clone = clone$1;
var cloneDeep = cloneDeep$1;
var findKey = findKey$1;
var flattenObject = flattenObject$1;
var invert = invert$1;
var mapKeys = mapKeys$1;
var mapValues = mapValues$1;
var merge = merge$1;
var mergeWith = mergeWith$1;
var omit = omit$1;
var omitBy = omitBy$1;
var pick = pick$1;
var pickBy = pickBy$1;
var toMerged = toMerged$1;
var objects_exports = /* @__PURE__ */ __exportAll({
  clone: /* @__PURE__ */ __name(() => clone, "clone"),
  cloneDeep: /* @__PURE__ */ __name(() => cloneDeep, "cloneDeep"),
  findKey: /* @__PURE__ */ __name(() => findKey, "findKey"),
  flattenObject: /* @__PURE__ */ __name(() => flattenObject, "flattenObject"),
  invert: /* @__PURE__ */ __name(() => invert, "invert"),
  mapKeys: /* @__PURE__ */ __name(() => mapKeys, "mapKeys"),
  mapValues: /* @__PURE__ */ __name(() => mapValues, "mapValues"),
  merge: /* @__PURE__ */ __name(() => merge, "merge"),
  mergeWith: /* @__PURE__ */ __name(() => mergeWith, "mergeWith"),
  omit: /* @__PURE__ */ __name(() => omit, "omit"),
  omitBy: /* @__PURE__ */ __name(() => omitBy, "omitBy"),
  pick: /* @__PURE__ */ __name(() => pick, "pick"),
  pickBy: /* @__PURE__ */ __name(() => pickBy, "pickBy"),
  toMerged: /* @__PURE__ */ __name(() => toMerged, "toMerged")
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
function ownKeys2(object, enumerableOnly) {
  var keys = Object.keys(object);
  if (Object.getOwnPropertySymbols) {
    var symbols = Object.getOwnPropertySymbols(object);
    enumerableOnly && (symbols = symbols.filter(function(sym) {
      return Object.getOwnPropertyDescriptor(object, sym).enumerable;
    })), keys.push.apply(keys, symbols);
  }
  return keys;
}
__name(ownKeys2, "ownKeys");
function _objectSpread(target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = null != arguments[i] ? arguments[i] : {};
    i % 2 ? ownKeys2(Object(source), true).forEach(function(key) {
      _defineProperty2(target, key, source[key]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys2(Object(source)).forEach(function(key) {
      Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
    });
  }
  return target;
}
__name(_objectSpread, "_objectSpread");
function _defineProperty2(obj, key, value) {
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
__name(_defineProperty2, "_defineProperty");
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
    for (const l of lines) {
      const m = l.match(/^(\s+)\S+/);
      if (m) {
        const indent = m[1].length;
        if (!mindent) mindent = indent;
        else mindent = Math.min(mindent, indent);
      }
    }
    if (mindent !== null) {
      const m = mindent;
      result = lines.map((l) => l[0] === " " || l[0] === "	" ? l.slice(m) : l).join("\n");
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
function kebabCase(str, upperCase2 = false) {
  return words(str).map((part) => upperCase2 ? part.toUpperCase() : part.toLowerCase()).join("-");
}
__name(kebabCase, "kebabCase");
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
  kebabCase: /* @__PURE__ */ __name(() => kebabCase, "kebabCase"),
  lowerCase: /* @__PURE__ */ __name(() => lowerCase, "lowerCase"),
  pad: /* @__PURE__ */ __name(() => pad, "pad"),
  padLeft: /* @__PURE__ */ __name(() => padLeft, "padLeft"),
  padRight: /* @__PURE__ */ __name(() => padRight, "padRight"),
  pascalCase: /* @__PURE__ */ __name(() => pascalCase, "pascalCase"),
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
  var _a2, _b, _c;
  const lines = (_c = (_b = (_a2 = options.doc) != null ? _a2 : options.fallback) == null ? void 0 : _b.split("\n")) != null ? _c : [];
  const deprecatedMessage = getDeprecatedMessage(options.annotations);
  if (!deprecatedMessage) {
    return lines;
  }
  return lines.length === 0 ? [`Deprecated: ${deprecatedMessage}`] : [...lines, "", `Deprecated: ${deprecatedMessage}`];
}
__name(buildDocCommentLines, "buildDocCommentLines");
function writeDocComment(g, lines) {
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

// src/shared/object-fields.ts
function getEffectiveObjectFields(fields = []) {
  const lastIndexByName = new Map(
    fields.map((field, index) => [field.name, index])
  );
  return fields.filter(
    (field, index) => lastIndexByName.get(field.name) === index
  );
}
__name(getEffectiveObjectFields, "getEffectiveObjectFields");

// src/shared/go-types/imports.ts
function collectImportsForTypeRef(typeRef, imports) {
  switch (typeRef.kind) {
    case "primitive":
      if (typeRef.primitiveName === "datetime") {
        imports.add("time");
      }
      return;
    case "array":
      if (typeRef.arrayType) {
        collectImportsForTypeRef(typeRef.arrayType, imports);
      }
      return;
    case "map":
      if (typeRef.mapType) {
        collectImportsForTypeRef(typeRef.mapType, imports);
      }
      return;
    case "object":
      for (const field of getEffectiveObjectFields(typeRef.objectFields)) {
        collectImportsForTypeRef(field.typeRef, imports);
      }
      return;
    case "type":
    case "enum":
      return;
    default:
      return;
  }
}
__name(collectImportsForTypeRef, "collectImportsForTypeRef");

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
  return escapeGoIdentifier(toGoPascalIdentifier(value));
}
__name(toGoTypeName, "toGoTypeName");
function toGoConstName(value) {
  return escapeGoIdentifier(toGoPascalIdentifier(value));
}
__name(toGoConstName, "toGoConstName");
function toGoFieldName(value) {
  return escapeGoIdentifier(toGoPascalIdentifier(value));
}
__name(toGoFieldName, "toGoFieldName");
function toGoEnumMemberName(value) {
  return escapeGoIdentifier(toGoPascalIdentifier(value));
}
__name(toGoEnumMemberName, "toGoEnumMemberName");
function toGoJsonName(value) {
  return value;
}
__name(toGoJsonName, "toGoJsonName");
function toInlineTypeName(parentTypeName, fieldName) {
  return `${parentTypeName}${toGoFieldName(fieldName)}`;
}
__name(toInlineTypeName, "toInlineTypeName");
function escapeGoIdentifier(value) {
  return isGoKeyword(value) ? `${value}_` : value;
}
__name(escapeGoIdentifier, "escapeGoIdentifier");
function toGoPascalIdentifier(value) {
  const candidate = strings_exports.pascalCase(value);
  if (candidate.length === 0) {
    return "X";
  }
  return /^[A-Za-z_]/.test(candidate) ? candidate : `X${candidate}`;
}
__name(toGoPascalIdentifier, "toGoPascalIdentifier");

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
  var _a2;
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
      return `${"[]".repeat((_a2 = typeRef.arrayDims) != null ? _a2 : 1)}${renderGoType(expectValue(typeRef.arrayType, "Encountered an array type reference without an element type.", position), context, inlineTypeGoName, position)}`;
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
  var _a2;
  switch (typeRef.kind) {
    case "primitive":
      return renderPrimitiveGoType(typeRef.primitiveName, position);
    case "type":
    case "enum":
      return renderGoType(typeRef, context, void 0, position);
    case "array":
      return `${"[]".repeat((_a2 = typeRef.arrayDims) != null ? _a2 : 1)}${renderAnonymousGoTypeExpression(expectValue(typeRef.arrayType, "Encountered an array type reference without an element type.", position), context, position, inlineTypeGoName)}`;
    case "map":
      return `map[string]${renderAnonymousGoTypeExpression(expectValue(typeRef.mapType, "Encountered a map type reference without a value type.", position), context, position, inlineTypeGoName)}`;
    case "object": {
      if (inlineTypeGoName) {
        return inlineTypeGoName;
      }
      const parts = getEffectiveObjectFields(typeRef.objectFields).map(
        (field) => {
          const fieldType = renderAnonymousGoTypeExpression(
            field.typeRef,
            context,
            field.position
          );
          return `${toGoFieldName(field.name)} ${field.optional ? `*${fieldType}` : fieldType}`;
        }
      );
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

// src/shared/literal-key.ts
function getLiteralValueKey(value) {
  return `${value.kind}:${JSON.stringify(ir_exports.unwrapLiteral(value))}`;
}
__name(getLiteralValueKey, "getLiteralValueKey");

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
  const member = enumDescriptor.memberByValue.get(getLiteralValueKey(literal));
  if (!member) {
    fail(
      `Invalid literal for enum ${JSON.stringify(enumDescriptor.def.name)}. Expected one of its declared members.`,
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
  if (!enumDescriptor.memberByValue.has(getLiteralValueKey(literal))) {
    fail(
      `Invalid literal for enum ${JSON.stringify(enumDescriptor.def.name)}. Expected one of its declared members.`,
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
function canEmitConst(typeRef, context, position) {
  return isConstEligibleType(typeRef, context, position);
}
__name(canEmitConst, "canEmitConst");
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

// src/shared/go-literals/metadata.ts
function renderMetadataValueExpression(value) {
  var _a2, _b;
  if (!value) {
    return "nil";
  }
  switch (value.kind) {
    case "string":
      return JSON.stringify(value.stringValue);
    case "int":
      return String(value.intValue);
    case "float":
      return String(value.floatValue);
    case "bool":
      return String(value.boolValue);
    case "array":
      return `[]any{${((_a2 = value.arrayItems) != null ? _a2 : []).map((item) => renderMetadataValueExpression(item)).join(", ")}}`;
    case "object":
      return `map[string]any{${getLastObjectEntries((_b = value.objectEntries) != null ? _b : []).map(
        (entry) => `${JSON.stringify(entry.key)}: ${renderMetadataValueExpression(entry.value)}`
      ).join(", ")}}`;
    default:
      return "nil";
  }
}
__name(renderMetadataValueExpression, "renderMetadataValueExpression");
function getLastObjectEntries(entries) {
  const lastByKey = /* @__PURE__ */ new Map();
  for (const entry of entries) {
    lastByKey.set(entry.key, entry);
  }
  return [...lastByKey.values()];
}
__name(getLastObjectEntries, "getLastObjectEntries");

// src/shared/go-literals/render.ts
function renderTypedValueExpression(typeRef, literal, context, position, namedTypeGoName) {
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
      return renderCompositeLiteral(
        renderAnonymousGoTypeExpression(
          typeRef,
          context,
          position,
          namedTypeGoName
        ),
        typeRef,
        literal,
        context,
        position,
        namedTypeGoName
      );
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
      return renderCompositeLiteral(
        goType,
        resolved,
        literal,
        context,
        position,
        goType
      );
    }
    default:
      fail(
        `Unsupported literal rendering for type kind ${JSON.stringify(typeRef.kind)}.`,
        position
      );
  }
}
__name(renderTypedValueExpression, "renderTypedValueExpression");
function renderCompositeLiteral(typeExpression, typeRef, literal, context, position, namedTypeGoName) {
  switch (typeRef.kind) {
    case "array":
      return renderArrayLiteral(
        typeExpression,
        typeRef,
        literal,
        context,
        position,
        namedTypeGoName
      );
    case "map":
      return renderMapLiteral(
        typeExpression,
        typeRef,
        literal,
        context,
        position,
        namedTypeGoName
      );
    case "object":
      return renderObjectLiteral(
        typeExpression,
        typeRef,
        literal,
        context,
        position,
        namedTypeGoName
      );
    default:
      fail(
        "Expected a composite VDL type while rendering a composite Go literal.",
        position
      );
  }
}
__name(renderCompositeLiteral, "renderCompositeLiteral");
function renderArrayLiteral(typeExpression, typeRef, literal, context, position, namedTypeGoName) {
  var _a2, _b, _c;
  if (literal.kind !== "array") {
    fail("Expected an array literal for a VDL array type.", position);
  }
  const elementType = ((_a2 = typeRef.arrayDims) != null ? _a2 : 1) === 1 ? expectValue(
    typeRef.arrayType,
    "Encountered an invalid array type while rendering a literal.",
    position
  ) : {
    kind: "array",
    arrayType: expectValue(
      typeRef.arrayType,
      "Encountered an invalid array type while rendering a literal.",
      position
    ),
    arrayDims: ((_b = typeRef.arrayDims) != null ? _b : 1) - 1
  };
  const items = ((_c = literal.arrayItems) != null ? _c : []).map(
    (item) => renderTypedValueExpression(
      elementType,
      item,
      context,
      item.position,
      namedTypeGoName
    )
  );
  return `${typeExpression}{${items.join(", ")}}`;
}
__name(renderArrayLiteral, "renderArrayLiteral");
function renderMapLiteral(typeExpression, typeRef, literal, context, position, namedTypeGoName) {
  var _a2;
  if (literal.kind !== "object") {
    fail("Expected an object literal for a VDL map type.", position);
  }
  const valueType = expectValue(
    typeRef.mapType,
    "Encountered an invalid map type while rendering a literal.",
    position
  );
  const entries = ((_a2 = literal.objectEntries) != null ? _a2 : []).map(
    (entry) => `${JSON.stringify(entry.key)}: ${renderTypedValueExpression(valueType, entry.value, context, entry.position, namedTypeGoName)}`
  );
  return `${typeExpression}{${entries.join(", ")}}`;
}
__name(renderMapLiteral, "renderMapLiteral");
function renderObjectLiteral(typeExpression, typeRef, literal, context, position, namedTypeGoName) {
  var _a2;
  if (literal.kind !== "object") {
    fail("Expected an object literal for a VDL object type.", position);
  }
  const fields = getEffectiveObjectFields(typeRef.objectFields);
  const entryByName = new Map(
    ((_a2 = literal.objectEntries) != null ? _a2 : []).map((entry) => [entry.key, entry])
  );
  const entries = [];
  for (const field of fields) {
    const entry = entryByName.get(field.name);
    if (!entry) {
      continue;
    }
    const childTypeGoName = namedTypeGoName ? toInlineTypeName(namedTypeGoName, field.name) : void 0;
    const renderedValue = renderTypedValueExpression(
      field.typeRef,
      entry.value,
      context,
      entry.position,
      childTypeGoName
    );
    if (!field.optional) {
      entries.push(`${toGoFieldName(field.name)}: ${renderedValue}`);
      continue;
    }
    if (context.options.genPointerUtils === false) {
      const valueType = renderAnonymousGoTypeExpression(
        field.typeRef,
        context,
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
  return `${typeExpression}{${entries.join(", ")}}`;
}
__name(renderObjectLiteral, "renderObjectLiteral");

// src/shared/render/go-file.ts
function renderGoFile(options) {
  var _a2, _b;
  const g = newGenerator().withTabs();
  const imports = (_b = (_a2 = options.imports) == null ? void 0 : _a2.toArray()) != null ? _b : [];
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
  return g.toString();
}
__name(renderGoFile, "renderGoFile");

// src/shared/render/imports.ts
var _paths;
var _ImportSet = class _ImportSet {
  constructor() {
    __privateAdd(this, _paths, /* @__PURE__ */ new Set());
  }
  add(path) {
    if (path) {
      __privateGet(this, _paths).add(path);
    }
  }
  merge(other) {
    for (const path of other.toArray()) {
      this.add(path);
    }
  }
  toArray() {
    return [...__privateGet(this, _paths)].sort((left, right) => left.localeCompare(right));
  }
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
  for (const constant of context.constantDescriptors) {
    collectImportsForTypeRef(constant.def.typeRef, imports);
  }
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
    if (canEmitConst(constant.def.typeRef, context, constant.def.position)) {
      renderConstDeclaration(g, constant.goName, constant.def, context);
    } else {
      g.line(
        `var ${constant.goName} = ${renderTypedValueExpression(constant.def.typeRef, constant.def.value, context, constant.def.position)}`
      );
    }
    if (constant !== context.constantDescriptors[context.constantDescriptors.length - 1]) {
      g.break();
    }
  }
  return {
    path: "constants.go",
    content: renderGoFile({
      packageName: context.options.packageName,
      imports,
      body: g.toString()
    })
  };
}
__name(generateConstantsFile, "generateConstantsFile");
function renderConstDeclaration(g, goName, constant, context) {
  if (constant.typeRef.kind === "type") {
    g.line(
      `const ${goName} ${renderGoType(constant.typeRef, context, void 0, constant.position)} = ${renderConstInitializer(constant.typeRef, constant.value, context, constant.position)}`
    );
    return;
  }
  g.line(
    `const ${goName} = ${renderConstInitializer(constant.typeRef, constant.value, context, constant.position)}`
  );
}
__name(renderConstDeclaration, "renderConstDeclaration");

// src/stages/emit/files/types-enums.ts
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
      const commentLines = buildDocCommentLines({
        doc: member.def.doc,
        annotations: member.def.annotations
      });
      if (commentLines.length > 0) {
        writeDocComment(g, commentLines);
      }
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
      g.line(
        `return nil, fmt.Errorf(${JSON.stringify(`cannot marshal invalid value for enum ${enumDescriptor.goName}`)})`
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
          `return fmt.Errorf(${JSON.stringify(`invalid value for enum ${enumDescriptor.goName}`)})`
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
        `return fmt.Errorf(${JSON.stringify(`invalid value for enum ${enumDescriptor.goName}`)})`
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
    if (enumDescriptor !== context.enumDescriptors[context.enumDescriptors.length - 1]) {
      g.break();
    }
  }
  const body = g.toString();
  if (body.includes("json.")) {
    imports.add("encoding/json");
  }
  if (body.includes("fmt.")) {
    imports.add("fmt");
  }
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

// src/stages/emit/files/metadata-annotations.ts
function writeAnnotationSetField(g, annotations) {
  if (annotations.length === 0) {
    g.line("Annotations: VDLAnnotationSet{},");
    return;
  }
  const byName = buildByNameEntries(annotations);
  g.line("Annotations: VDLAnnotationSet{");
  g.block(() => {
    g.line("List: []VDLAnnotation{");
    g.block(() => {
      for (const annotation of annotations) {
        g.line("VDLAnnotation{");
        g.block(() => {
          g.line(`Name: ${JSON.stringify(annotation.name)},`);
          g.line(
            `Value: ${renderMetadataValueExpression(annotation.argument)},`
          );
        });
        g.line("},");
      }
    });
    g.line("},");
    g.line("ByName: map[string]any{");
    g.block(() => {
      for (const [name, value] of byName) {
        g.line(`${JSON.stringify(name)}: ${value},`);
      }
    });
    g.line("},");
  });
  g.line("},");
}
__name(writeAnnotationSetField, "writeAnnotationSetField");
function buildByNameEntries(annotations) {
  const grouped = arrays_exports.groupBy(annotations, (annotation) => annotation.name);
  const byName = objects_exports.mapValues(
    grouped,
    (group) => {
      var _a2;
      return renderMetadataValueExpression((_a2 = group[group.length - 1]) == null ? void 0 : _a2.argument);
    }
  );
  return Object.keys(byName).map((name) => {
    var _a2;
    return [name, (_a2 = byName[name]) != null ? _a2 : "nil"];
  });
}
__name(buildByNameEntries, "buildByNameEntries");

// src/stages/emit/files/metadata-runtime.ts
function renderMetadataSupportTypes(g) {
  g.line("// VDLAnnotation describes a single VDL annotation entry.");
  g.line("type VDLAnnotation struct {");
  g.block(() => {
    g.line("Name string");
    g.line("Value any");
  });
  g.line("}");
  g.break();
  g.line(
    "// VDLAnnotationSet groups annotations in declaration order and by name."
  );
  g.line("type VDLAnnotationSet struct {");
  g.block(() => {
    g.line("List []VDLAnnotation");
    g.line("ByName map[string]any");
  });
  g.line("}");
  g.break();
  g.line("// Has reports whether an annotation exists in the set.");
  g.line("func (a VDLAnnotationSet) Has(name string) bool {");
  g.block(() => {
    g.line("_, ok := a.ByName[name]");
    g.line("return ok");
  });
  g.line("}");
  g.break();
  g.line(
    "// Get returns the latest value associated with the annotation name."
  );
  g.line("func (a VDLAnnotationSet) Get(name string) (any, bool) {");
  g.block(() => {
    g.line("value, ok := a.ByName[name]");
    g.line("return value, ok");
  });
  g.line("}");
  g.break();
  g.line("// VDLTypeRef describes the recursive shape of a VDL type.");
  g.line("type VDLTypeRef struct {");
  g.block(() => {
    g.line("Kind string");
    g.line("Name string");
    g.line("ArrayDims int");
    g.line("Element *VDLTypeRef");
    g.line("Fields map[string]VDLFieldMetadata");
  });
  g.line("}");
  g.break();
  g.line("// GetField looks up an object field by its generated Go name.");
  g.line(
    "func (r VDLTypeRef) GetField(name string) (VDLFieldMetadata, bool) {"
  );
  g.block(() => {
    g.line("field, ok := r.Fields[name]");
    g.line("return field, ok");
  });
  g.line("}");
  g.break();
  g.line("// VDLFieldMetadata describes a generated field.");
  g.line("type VDLFieldMetadata struct {");
  g.block(() => {
    g.line("Name string");
    g.line("JSONName string");
    g.line("Optional bool");
    g.line("Type VDLTypeRef");
    g.line("Annotations VDLAnnotationSet");
  });
  g.line("}");
  g.break();
  g.line("// VDLTypeMetadata describes a generated type.");
  g.line("type VDLTypeMetadata struct {");
  g.block(() => {
    g.line("Name string");
    g.line("Annotations VDLAnnotationSet");
    g.line("Type VDLTypeRef");
  });
  g.line("}");
  g.break();
  g.line("// GetField looks up a field by its generated Go name.");
  g.line(
    "func (m VDLTypeMetadata) GetField(name string) (VDLFieldMetadata, bool) {"
  );
  g.block(() => {
    g.line("return m.Type.GetField(name)");
  });
  g.line("}");
  g.break();
  g.line("// VDLEnumMemberMetadata describes a generated enum value.");
  g.line("type VDLEnumMemberMetadata struct {");
  g.block(() => {
    g.line("Name string");
    g.line("Value any");
    g.line("Annotations VDLAnnotationSet");
  });
  g.line("}");
  g.break();
  g.line("// VDLEnumMetadata describes a generated enum.");
  g.line("type VDLEnumMetadata struct {");
  g.block(() => {
    g.line("Name string");
    g.line("Annotations VDLAnnotationSet");
    g.line("Members map[string]VDLEnumMemberMetadata");
  });
  g.line("}");
  g.break();
  g.line(
    "// GetMember looks up an enum member by its generated Go suffix name."
  );
  g.line(
    "func (m VDLEnumMetadata) GetMember(name string) (VDLEnumMemberMetadata, bool) {"
  );
  g.block(() => {
    g.line("member, ok := m.Members[name]");
    g.line("return member, ok");
  });
  g.line("}");
  g.break();
  g.line("// VDLConstantMetadata describes a generated constant value.");
  g.line("type VDLConstantMetadata struct {");
  g.block(() => {
    g.line("Name string");
    g.line("Annotations VDLAnnotationSet");
    g.line("Type VDLTypeRef");
  });
  g.line("}");
  g.break();
  g.line(
    "// VDLSchemaMetadata collects metadata for every generated declaration."
  );
  g.line("type VDLSchemaMetadata struct {");
  g.block(() => {
    g.line("Types map[string]VDLTypeMetadata");
    g.line("Enums map[string]VDLEnumMetadata");
    g.line("Constants map[string]VDLConstantMetadata");
  });
  g.line("}");
  g.break();
  g.line("// GetType looks up a type by its generated Go name.");
  g.line(
    "func (m VDLSchemaMetadata) GetType(name string) (VDLTypeMetadata, bool) {"
  );
  g.block(() => {
    g.line("value, ok := m.Types[name]");
    g.line("return value, ok");
  });
  g.line("}");
  g.break();
  g.line("// GetEnum looks up an enum by its generated Go name.");
  g.line(
    "func (m VDLSchemaMetadata) GetEnum(name string) (VDLEnumMetadata, bool) {"
  );
  g.block(() => {
    g.line("value, ok := m.Enums[name]");
    g.line("return value, ok");
  });
  g.line("}");
  g.break();
  g.line("// GetConstant looks up a constant by its generated Go name.");
  g.line(
    "func (m VDLSchemaMetadata) GetConstant(name string) (VDLConstantMetadata, bool) {"
  );
  g.block(() => {
    g.line("value, ok := m.Constants[name]");
    g.line("return value, ok");
  });
  g.line("}");
}
__name(renderMetadataSupportTypes, "renderMetadataSupportTypes");

// src/stages/emit/files/metadata-types.ts
function writeMetadataTypeField(g, typeRef, context) {
  g.line("Type: VDLTypeRef{");
  g.block(() => {
    writeMetadataTypeRefBody(g, typeRef, context);
  });
  g.line("},");
}
__name(writeMetadataTypeField, "writeMetadataTypeField");
function writeMetadataTypeRefBody(g, typeRef, context) {
  var _a2;
  g.line(`Kind: ${JSON.stringify(typeRef.kind)},`);
  switch (typeRef.kind) {
    case "primitive":
      g.line(
        `Name: ${JSON.stringify(
          expectValue(
            typeRef.primitiveName,
            "Encountered a primitive type reference without a primitive name."
          )
        )},`
      );
      return;
    case "type": {
      const typeName = expectValue(
        typeRef.typeName,
        "Encountered a named type reference without a type name."
      );
      g.line(
        `Name: ${JSON.stringify(
          expectValue(
            context.typeGoNamesByVdlName.get(typeName),
            `Unknown VDL type reference ${JSON.stringify(typeName)}.`
          )
        )},`
      );
      return;
    }
    case "enum": {
      const enumName = expectValue(
        typeRef.enumName,
        "Encountered an enum reference without an enum name."
      );
      g.line(
        `Name: ${JSON.stringify(
          expectValue(
            context.enumGoNamesByVdlName.get(enumName),
            `Unknown VDL enum reference ${JSON.stringify(enumName)}.`
          )
        )},`
      );
      return;
    }
    case "array": {
      g.line(`ArrayDims: ${String((_a2 = typeRef.arrayDims) != null ? _a2 : 1)},`);
      g.line("Element: &VDLTypeRef{");
      g.block(() => {
        writeMetadataTypeRefBody(
          g,
          expectValue(
            typeRef.arrayType,
            "Encountered an array type reference without an element type."
          ),
          context
        );
      });
      g.line("},");
      return;
    }
    case "map": {
      g.line("Element: &VDLTypeRef{");
      g.block(() => {
        writeMetadataTypeRefBody(
          g,
          expectValue(
            typeRef.mapType,
            "Encountered a map type reference without a value type."
          ),
          context
        );
      });
      g.line("},");
      return;
    }
    case "object": {
      const fields = getEffectiveObjectFields(typeRef.objectFields);
      if (fields.length === 0) {
        g.line("Fields: nil,");
        return;
      }
      g.line("Fields: map[string]VDLFieldMetadata{");
      g.block(() => {
        for (const field of fields) {
          writeMetadataFieldEntry(g, field, context);
        }
      });
      g.line("},");
      return;
    }
    default:
      fail(`Unsupported VDL type kind ${JSON.stringify(typeRef.kind)}.`);
  }
}
__name(writeMetadataTypeRefBody, "writeMetadataTypeRefBody");
function writeMetadataFieldEntry(g, field, context) {
  const goName = toGoFieldName(field.name);
  g.line(`${JSON.stringify(goName)}: VDLFieldMetadata{`);
  g.block(() => {
    g.line(`Name: ${JSON.stringify(goName)},`);
    g.line(`JSONName: ${JSON.stringify(toGoJsonName(field.name))},`);
    g.line(`Optional: ${String(field.optional)},`);
    writeMetadataTypeField(g, field.typeRef, context);
    writeAnnotationSetField(g, field.annotations);
  });
  g.line("},");
}
__name(writeMetadataFieldEntry, "writeMetadataFieldEntry");

// src/stages/emit/files/metadata.ts
function generateMetadataFile(context) {
  if (!context.options.genMeta) {
    return void 0;
  }
  const g = newGenerator().withTabs();
  renderMetadataSupportTypes(g);
  g.break();
  g.line("// VDLMetadata exposes generated metadata for the current schema.");
  g.line("var VDLMetadata = VDLSchemaMetadata{");
  g.block(() => {
    g.line("Types: map[string]VDLTypeMetadata{");
    g.block(() => {
      for (const descriptor of context.namedTypes) {
        writeTypeMetadataEntry(g, descriptor, context);
      }
    });
    g.line("},");
    g.line("Enums: map[string]VDLEnumMetadata{");
    g.block(() => {
      for (const enumDescriptor of context.enumDescriptors) {
        writeEnumMetadataEntry(g, enumDescriptor.goName, () => {
          g.line(`Name: ${JSON.stringify(enumDescriptor.goName)},`);
          writeAnnotationSetField(g, enumDescriptor.def.annotations);
          g.line("Members: map[string]VDLEnumMemberMetadata{");
          g.block(() => {
            for (const member of enumDescriptor.members) {
              g.line(
                `${JSON.stringify(member.goName)}: VDLEnumMemberMetadata{`
              );
              g.block(() => {
                g.line(`Name: ${JSON.stringify(member.goName)},`);
                g.line(
                  `Value: ${renderMetadataValueExpression(member.def.value)},`
                );
                writeAnnotationSetField(g, member.def.annotations);
              });
              g.line("},");
            }
          });
          g.line("},");
        });
      }
    });
    g.line("},");
    g.line("Constants: map[string]VDLConstantMetadata{");
    g.block(() => {
      for (const constant of context.constantDescriptors) {
        g.line(`${JSON.stringify(constant.goName)}: VDLConstantMetadata{`);
        g.block(() => {
          g.line(`Name: ${JSON.stringify(constant.goName)},`);
          writeAnnotationSetField(g, constant.def.annotations);
          writeMetadataTypeField(g, constant.def.typeRef, context);
        });
        g.line("},");
      }
    });
    g.line("},");
  });
  g.line("}");
  return {
    path: "metadata.go",
    content: renderGoFile({
      packageName: context.options.packageName,
      body: g.toString()
    })
  };
}
__name(generateMetadataFile, "generateMetadataFile");
function writeTypeMetadataEntry(g, descriptor, context) {
  g.line(`${JSON.stringify(descriptor.goName)}: VDLTypeMetadata{`);
  g.block(() => {
    g.line(`Name: ${JSON.stringify(descriptor.goName)},`);
    writeAnnotationSetField(g, descriptor.annotations);
    writeMetadataTypeField(g, descriptor.typeRef, context);
  });
  g.line("},");
}
__name(writeTypeMetadataEntry, "writeTypeMetadataEntry");
function writeEnumMetadataEntry(g, enumGoName, writeBody) {
  g.line(`${JSON.stringify(enumGoName)}: VDLEnumMetadata{`);
  g.block(writeBody);
  g.line("},");
}
__name(writeEnumMetadataEntry, "writeEnumMetadataEntry");

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
    if (!descriptorHasRequiredFields(descriptor)) {
      return false;
    }
    renderPreObjectType(g, descriptor);
    g.break();
    renderPreObjectValidateMethod(g, descriptor);
    g.break();
    renderPreObjectTransformMethod(g, descriptor);
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
function renderPreObjectType(g, descriptor) {
  const preTypeName = toPreTypeName(descriptor.goName);
  g.line(
    `// ${preTypeName} mirrors ${descriptor.goName} during strict JSON decoding.`
  );
  g.line(`type ${preTypeName} struct {`);
  g.block(() => {
    for (const field of descriptor.fields) {
      const jsonTag = field.def.optional ? `json:${JSON.stringify(`${field.jsonName},omitempty`)}` : `json:${JSON.stringify(field.jsonName)}`;
      g.line(`${field.goName} ${renderPreFieldGoType(field)} \`${jsonTag}\``);
    }
  });
  g.line("}");
}
__name(renderPreObjectType, "renderPreObjectType");
function renderPreObjectValidateMethod(g, descriptor) {
  const preTypeName = toPreTypeName(descriptor.goName);
  g.line(
    `// validate reports whether all required JSON fields are present in ${preTypeName}.`
  );
  g.line(`func (p *${preTypeName}) validate() error {`);
  g.block(() => {
    for (const field of descriptor.fields) {
      if (field.def.optional) {
        continue;
      }
      g.line(`if p.${field.goName} == nil {`);
      g.block(() => {
        g.line(
          `return fmt.Errorf(${JSON.stringify("field %q is required")}, ${JSON.stringify(field.jsonName)})`
        );
      });
      g.line("}");
    }
    g.line("return nil");
  });
  g.line("}");
}
__name(renderPreObjectValidateMethod, "renderPreObjectValidateMethod");
function renderPreObjectTransformMethod(g, descriptor) {
  const preTypeName = toPreTypeName(descriptor.goName);
  g.line(`// transform converts ${preTypeName} to ${descriptor.goName}.`);
  g.line(`func (p *${preTypeName}) transform() ${descriptor.goName} {`);
  g.block(() => {
    g.line(`return ${descriptor.goName}{`);
    g.block(() => {
      for (const field of descriptor.fields) {
        const valueExpression = field.def.optional ? `p.${field.goName}` : `*p.${field.goName}`;
        g.line(`${field.goName}: ${valueExpression},`);
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
    g.line("if err := pre.validate(); err != nil {");
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
function descriptorHasRequiredFields(descriptor) {
  return descriptor.fields.some((field) => !field.def.optional);
}
__name(descriptorHasRequiredFields, "descriptorHasRequiredFields");
function resolveStrictAliasBehavior(typeRef, context, position, visited = /* @__PURE__ */ new Set()) {
  switch (typeRef.kind) {
    case "enum":
      return "enum";
    case "object":
      return typeRefHasRequiredFields(typeRef) ? "object" : void 0;
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
      const referencedType = getReferencedTypeRef(typeName, context, position);
      return resolveStrictAliasBehavior(
        referencedType,
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
function getReferencedTypeRef(typeName, context, position) {
  const typeDef = expectValue(
    context.typeDefsByVdlName.get(typeName),
    `Unknown VDL type reference ${JSON.stringify(typeName)}.`,
    position
  );
  return typeDef.typeRef;
}
__name(getReferencedTypeRef, "getReferencedTypeRef");
function typeRefHasRequiredFields(typeRef) {
  if (typeRef.kind !== "object") {
    return false;
  }
  return getEffectiveObjectFields(typeRef.objectFields).some(
    (field) => !field.optional
  );
}
__name(typeRefHasRequiredFields, "typeRefHasRequiredFields");
function renderPreFieldGoType(field) {
  return field.def.optional ? field.goType : `*${field.goType}`;
}
__name(renderPreFieldGoType, "renderPreFieldGoType");
function toPreTypeName(goName) {
  return `pre${goName}`;
}
__name(toPreTypeName, "toPreTypeName");

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
  for (const namedType of context.namedTypes) {
    collectImportsForTypeRef(namedType.typeRef, imports);
  }
  const g = newGenerator().withTabs();
  for (const namedType of context.namedTypes) {
    renderNamedType(g, namedType, context);
    if (namedType !== context.namedTypes[context.namedTypes.length - 1]) {
      g.break();
    }
  }
  const body = g.toString();
  if (body.includes("json.")) {
    imports.add("encoding/json");
  }
  if (body.includes("fmt.")) {
    imports.add("fmt");
  }
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
    generateMetadataFile(context),
    generatePointersFile(context)
  ]);
}
__name(generateFiles, "generateFiles");

// src/stages/model/constants.ts
function populateConstantDescriptors(context, packageScopeSymbols) {
  const errors = [];
  for (const constantDef of context.schema.constants) {
    const descriptor = {
      def: constantDef,
      goName: toGoConstName(constantDef.name)
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
  var _a2;
  const goName = (_a2 = context.enumGoNamesByVdlName.get(enumDef.name)) != null ? _a2 : enumDef.name;
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
      valueKey: getLiteralValueKey(member.value)
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
      jsonName: toGoJsonName(field.name),
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
  const namedTypesByGoName = /* @__PURE__ */ new Map();
  for (const typeDef of context.schema.types) {
    appendNamedTypeDescriptor(
      context,
      buildTopLevelTypeDescriptor(typeDef, context, errors),
      namedTypesByGoName,
      packageScopeSymbols,
      errors
    );
  }
  return errors;
}
__name(populateNamedTypes, "populateNamedTypes");
function buildTopLevelTypeDescriptor(typeDef, context, errors) {
  var _a2, _b;
  const goName = (_a2 = context.typeGoNamesByVdlName.get(typeDef.name)) != null ? _a2 : typeDef.name;
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
  var _a2;
  const goName = toInlineTypeName(options.parentGoName, options.fieldName);
  const fieldResult = buildFieldDescriptors({
    parentGoName: goName,
    fields: (_a2 = options.typeRef.objectFields) != null ? _a2 : [],
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
var RESERVED_PACKAGE_SCOPE_SYMBOLS = [
  "Ptr",
  "Val",
  "Or",
  "VDLAnnotation",
  "VDLAnnotationSet",
  "VDLTypeRef",
  "VDLFieldMetadata",
  "VDLTypeMetadata",
  "VDLEnumMemberMetadata",
  "VDLEnumMetadata",
  "VDLConstantMetadata",
  "VDLSchemaMetadata",
  "VDLMetadata"
];
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
  const genMeta = options_exports.getOptionBool(input.options, "genMeta", true);
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
      genMeta,
      strict,
      genPointerUtils
    }
  };
}
__name(resolveGeneratorOptions, "resolveGeneratorOptions");

// src/generate.ts
function generate(input) {
  const optionsResult = resolveGeneratorOptions(input);
  if (optionsResult.errors.length > 0 || !optionsResult.options) {
    return {
      errors: optionsResult.errors
    };
  }
  try {
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
