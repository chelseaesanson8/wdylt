/**
 * A tiny "seeded" random number generator. Same seed in, same numbers out,
 * so a stamp's ink speckles or a book stack's widths look hand-made but
 * don't jump around every time the screen re-renders.
 */
export function seededRandom(seed: number) {
  let a = Math.floor(seed) * 2654435761 + 1;
  return function next() {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** A random number between min and max. */
export function between(rand: () => number, min: number, max: number) {
  return min + rand() * (max - min);
}
