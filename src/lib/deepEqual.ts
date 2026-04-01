
// A simple deep-equal function for comparing objects.
// A simple deep-equal function for comparing objects.
export function deepEqual(a: unknown, b: unknown): boolean {
  if (a === b) return true;

  if (a && b && typeof a === 'object' && typeof b === 'object') {
    const a_ = a as Record<string, unknown>;
    const b_ = b as Record<string, unknown>;
    
    const keys1 = Object.keys(a_);
    const keys2 = Object.keys(b_);

    if (keys1.length !== keys2.length) return false;

    for (const key of keys1) {
      if (!keys2.includes(key) || !deepEqual(a_[key], b_[key])) {
        return false;
      }
    }

    return true;
  }

  return false;
}
