/**
 * Converts millimeters to pixels based on a given DPI.
 * @param mm - The value in millimeters.
 * @param dpi - The dots per inch (default is 96).
 * @returns The value in pixels.
 */
export const mmToPx = (mm: number, dpi = 96): number => {
  const inches = mm / 25.4;
  return inches * dpi;
};

/**
 * Converts pixels to millimeters based on a given DPI.
 * @param px - The value in pixels.
 * @param dpi - The dots per inch (default is 96).
 * @returns The value in millimeters.
 */
export const pxToMm = (px: number, dpi = 96): number => {
  const inches = px / dpi;
  return inches * 25.4;
};
