// Manifold geometry keeps polygons, sides, and its markers as prototype getters, which
// Object.assign skips. Forwarders stay non-enumerable, as on the source, so spreads and
// postMessage neither convert the mesh nor try to clone functions.
export function copyGeometry(target: object, source: object): void {
  const seen = new Set<PropertyKey>();
  for (
    let level: object | null = source;
    level !== null && level !== Object.prototype;
    level = Object.getPrototypeOf(level)
  ) {
    for (const key of Reflect.ownKeys(level)) {
      if (key === 'constructor' || seen.has(key)) continue;
      seen.add(key);
      const desc = Object.getOwnPropertyDescriptor(level, key);
      if (!desc) continue;
      if (desc.get || desc.set) {
        forwardAccessor(target, source, key, desc);
      } else if (level === source && desc.enumerable) {
        Reflect.set(target, key, desc.value);
      } else if (typeof desc.value === 'function' && !(key in target)) {
        Object.defineProperty(target, key, {
          configurable: true,
          enumerable: false,
          writable: true,
          value: (...args: unknown[]) => Reflect.apply(desc.value, source, args),
        });
      }
    }
  }
}

function forwardAccessor(
  target: object,
  source: object,
  key: PropertyKey,
  desc: PropertyDescriptor,
): void {
  const forward: PropertyDescriptor = { configurable: true, enumerable: false };
  if (desc.get) forward.get = () => Reflect.get(source, key);
  if (desc.set) forward.set = (value: unknown) => Reflect.set(source, key, value);
  Object.defineProperty(target, key, forward);
}
