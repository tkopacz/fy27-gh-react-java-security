// DEMO ONLY - intentionally vulnerable
type JsonObject = Record<string, unknown>;

export function mergeObjects(target: JsonObject, source: JsonObject): JsonObject {
  for (const [key, value] of Object.entries(source)) {
    if (value && typeof value === 'object' && !Array.isArray(value)) {
      target[key] = mergeObjects((target[key] as JsonObject) || {}, value as JsonObject);
    } else {
      target[key] = value;
    }
  }
  return target;
}
