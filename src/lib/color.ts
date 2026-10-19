/**
 * Apple-style palette (system colors), deliberately without purple/indigo.
 * `light` shades are dark enough for large text on white; `dark` shades are
 * the bright system colors used on black sections.
 */
export const palette = {
  blue: { base: "#0071e3", light: "#0066cc", dark: "#2997ff" },
  cyan: { base: "#32ade6", light: "#0a7ea8", dark: "#64d2ff" },
  green: { base: "#34c759", light: "#1d7f37", dark: "#30d158" },
  yellow: { base: "#ffcc00", light: "#a05a00", dark: "#ffd60a" },
  orange: { base: "#ff9500", light: "#c44900", dark: "#ff9f0a" },
  pink: { base: "#ff2d55", light: "#d70f4f", dark: "#ff375f" },
} as const;

export type Hue = keyof typeof palette;

/** Hue order around the wheel from blue to pink, skipping purple. */
export const spectrum: Hue[] = ["blue", "cyan", "green", "yellow", "orange", "pink"];

/** Bright spectrum for black backgrounds. */
export const spectrumDark = spectrum.map((h) => palette[h].dark);
/** Text-safe spectrum for light backgrounds (no yellow: too light on white). */
export const spectrumLight = ["blue", "cyan", "green", "orange", "pink"].map((h) => palette[h as Hue].light);

const hexToRgb = (hex: string) => [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16));
const rgbToHex = (rgb: number[]) => `#${rgb.map((v) => Math.round(v).toString(16).padStart(2, "0")).join("")}`;

/**
 * Colour at t ∈ [0, 1] along a list of stops. Only neighbouring stops are mixed,
 * so a blue → … → pink list never passes through purple.
 */
export function sample(stops: readonly string[], t: number) {
  const x = Math.min(Math.max(t, 0), 1) * (stops.length - 1);
  const i = Math.min(Math.floor(x), stops.length - 2);
  const f = x - i;
  const [a, b] = [hexToRgb(stops[i]), hexToRgb(stops[i + 1])];
  return rgbToHex(a.map((v, k) => v + (b[k] - v) * f));
}

/** Cycle through hues for lists (projects, roles…). */
export const hueAt = (i: number, order: Hue[] = ["blue", "green", "orange", "pink", "cyan", "yellow"]) =>
  order[i % order.length];

export const withAlpha = (hex: string, a: number) => {
  const [r, g, b] = hexToRgb(hex);
  return `rgba(${r}, ${g}, ${b}, ${a})`;
};
