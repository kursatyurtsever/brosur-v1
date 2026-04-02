const DPI = 96;
const INCH_PER_MM = 0.0393701;

export const mmToPx = (mm: number): number => {
  return mm * INCH_PER_MM * DPI;
};