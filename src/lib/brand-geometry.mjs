// Geometry for the Epoch peak mark (vectorized from the owner's logo) and the three kit marks.
// Shared by the Astro components and scripts/gen-brand.mjs so screen and print stay identical.

// Peak mark, in source coordinates. Bounding box: x 205..611, y 82..300.
export const MARK_PATHS = [
  "M205 300 L440 82 L611 300 L427 143 Z",
  "M261 286 C 300 248 362 205 426 176 C 384 212 324 258 261 286 Z",
];
export const MARK_VIEWBOX = "205 82 406 218";

// EPOCH wordmark as uniform strokes (stroke-width 13.5), cap height 338..412.
export const WORDMARK_STROKES = [
  "M151 344.75 H82 V405.25 H151 M82 375 H146", // E
  "M219 412 V344.75 H252 a19 19 0 0 1 0 38 H219", // P
  "M443 375 a51 30.25 0 1 0 -102 0 a51 30.25 0 1 0 102 0", // O
  "M590 357 A 50 30.25 0 1 0 590 393", // C
  "M655.75 338 V412 M729.25 338 V412 M655.75 375 H729.25", // H
];
export const WORDMARK_VIEWBOX = "75 331 661 88";

let fuelId = 0;
// Kit marks on a 24-unit grid (3.6). Order is always Ride, Fuel, Optimize.
export const ICONS = {
  // The Paceline: three forward chevrons, lead one solid.
  ride: (variant, color) => {
    const sw = variant === "solid" ? 2.75 : 1.75;
    const lead = `<path d="M11 4.5h4l7.5 7.5L15 19.5h-4l7.5-7.5z" fill="${color}"/>`;
    if (variant === "solid") {
      return `<path d="M1 4.5h3.2l7.5 7.5-7.5 7.5H1l7.5-7.5z" fill="${color}"/><path d="M6 4.5h3.2l7.5 7.5-7.5 7.5H6l7.5-7.5z" fill="${color}" opacity="1"/>${lead}`;
    }
    return `<g fill="none" stroke="${color}" stroke-width="${sw}" stroke-linecap="square" stroke-linejoin="miter"><path d="M2 5.5L8.5 12 2 18.5"/><path d="M7 5.5l6.5 6.5L7 18.5"/></g>${lead}`;
  },
  // The Horizon Drop: a droplet cut by a horizontal line at the E-bar height; lower third solid.
  fuel: (variant, color) => {
    const drop = "M12 3.5c0 0-5.25 6.6-5.25 10.1a5.25 5.25 0 0 0 10.5 0C17.25 10.1 12 3.5 12 3.5z";
    const sw = variant === "solid" ? 2.5 : 1.75;
    const id = `fc-${variant}-${(fuelId = (fuelId + 1) % 1000)}`;
    return `<defs><clipPath id="${id}"><rect x="0" y="14" width="24" height="10"/></clipPath></defs>` +
      (variant === "solid"
        ? `<path d="${drop}" fill="${color}"/><rect x="3.5" y="12.5" width="17" height="1.6" fill="${color}"/>`
        : `<path d="${drop}" fill="none" stroke="${color}" stroke-width="${sw}" stroke-linejoin="round"/><path d="${drop}" fill="${color}" clip-path="url(#${id})"/><path d="M3.5 13.25h17" stroke="${color}" stroke-width="${sw}" stroke-linecap="square"/>`);
  },
  // The Ridge Line: an elevation profile climbing in three steps to a summit dot.
  optimize: (variant, color) => {
    const sw = variant === "solid" ? 2.75 : 1.75;
    return `<path d="M2 19.5l4.5-5.5 2.5 2.5 4.5-6.5 2.5 2.5 4.25-6.25" fill="none" stroke="${color}" stroke-width="${sw}" stroke-linecap="square" stroke-linejoin="miter"/><circle cx="20.5" cy="5" r="2" fill="${color}"/>`;
  },
};
