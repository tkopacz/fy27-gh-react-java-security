const unsafeKeys = new Set(['__proto__', 'constructor', 'prototype']);

type JsonObject = Record<string, unknown>;

export function mergeObjectsSafely(target: JsonObject, source: JsonObject): JsonObject {
  for (const [key, value] of Object.entries(source)) {
    if (unsafeKeys.has(key)) {
      continue;
    }

    if (value && typeof value === 'object' && !Array.isArray(value) && value.constructor === Object) {
      const currentValue = (target[key] as JsonObject) || {};
      target[key] = mergeObjectsSafely(currentValue as JsonObject, value as JsonObject);
    } else {
      target[key] = value;
    }
  }
  return target;
}
