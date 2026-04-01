

/**
 * CMYK renk modelini temsil eder.
 */
export type CMYK = { c: number; m: number; y: number; k: number };

/**
 * Bir rengin tam verisini içerir: HEX, CMYK ve opaklık.
 */
export type ColorData = {
  hex: string;
  cmyk: CMYK;
  opacity: number;
};

/**
 * Tipografi (yazı tipi, boyutu, etc.) verisini temsil eder.
 */
export type TypographyData = {
  fontFamily: string;
  fontSize: number; // in points
  fontWeight: number;
  lineHeight: number; // relative to font size
  letterSpacing: number; // in em
};

/**
 * Boşluk (padding, margin) verisini temsil eder.
 */
export type SpacingData = {
  top: number;
  right: number;
  bottom: number;
  left: number;
};

/**
 * Genel bir stil özelliğini tanımlar. Değer (value) ve global bir temadan miras alıp almadığını belirtir.
 */
export type StyleProperty<T> = {
  value: T;
  isGlobal: boolean; // true ise, bu değer global bir temadan (theme) geliyor.
};

/**
 * Bir slotun sahip olabileceği tüm stil özelliklerini toplar.
 */
export type SlotStyle = {
  background: StyleProperty<Partial<ColorData>>;
  padding: StyleProperty<Partial<SpacingData>>;
  // Gelecekte eklenebilecek diğer stil özellikleri
  // border: StyleProperty<...>;
};
