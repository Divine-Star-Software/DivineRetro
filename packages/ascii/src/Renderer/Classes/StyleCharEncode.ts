import { ASCIIMapping, StyleObject } from "../ASCIIMapping";

const baseNumber = 0b1000000000000000 >>> 0;
const baseChar = String.fromCharCode(baseNumber);
export class StyleCharEncode {
  private _data = 0;

  // Bit masks and shifts
  private static readonly FG_COLOR_MASK = 0b0000000000111111; // bits 0-5
  private static readonly BG_COLOR_MASK = 0b0000111111000000; // bits 6-11
  private static readonly BOLD_FLAG_MASK = 0b0001000000000000; // bit 12
  private static readonly DIM_FLAG_MASK = 0b0010000000000000; // bit 13
  private static readonly BLINKING_FLAG_MASK = 0b0100000000000000; // bit 14
  private static readonly STYLE_CHAR_FLAG_MASK = 0b1000000000000000; // bit 15

  private static readonly FG_COLOR_SHIFT = 0;
  private static readonly BG_COLOR_SHIFT = 6;

  isStyleChar(data: string): boolean {
    if (ASCIIMapping.asciiRecord[data] !== undefined) return false;
    return data.charCodeAt(0) >= baseNumber;
  }

  setChar(data: string): this {
    const code = data.charCodeAt(0);
    return this.setData(code);
  }

  getChar(): string {
    return String.fromCharCode(this.getData());
  }

  setData(data: number): this {
    this._data = (data | StyleCharEncode.STYLE_CHAR_FLAG_MASK) >>> 0;
    return this;
  }

  getData(): number {
    return this._data >>> 0;
  }

  setCharColor(colorIndex: number): void {
    if (colorIndex < 0 || colorIndex > 63) {
      throw new Error("Invalid color index. Must be between 0 and 63.");
    }
    // Clear bits 0-5 and set new color index
    this._data =
      (this._data & ~StyleCharEncode.FG_COLOR_MASK) |
      (colorIndex << StyleCharEncode.FG_COLOR_SHIFT);
  }

  getCharColor(): number {
    return (
      (this._data & StyleCharEncode.FG_COLOR_MASK) >>>
      StyleCharEncode.FG_COLOR_SHIFT
    );
  }

  setBackgroundColor(colorIndex: number): void {
    if (colorIndex < 0 || colorIndex > 63) {
      throw new Error("Invalid color index. Must be between 0 and 63.");
    }
    // Clear bits 6-11 and set new background color index
    this._data =
      (this._data & ~StyleCharEncode.BG_COLOR_MASK) |
      (colorIndex << StyleCharEncode.BG_COLOR_SHIFT);
  }

  getBackgroundColor(): number {
    return (
      (this._data & StyleCharEncode.BG_COLOR_MASK) >>>
      StyleCharEncode.BG_COLOR_SHIFT
    );
  }

  setBold(isBold: boolean): void {
    if (isBold) {
      this._data |= StyleCharEncode.BOLD_FLAG_MASK;
    } else {
      this._data &= ~StyleCharEncode.BOLD_FLAG_MASK;
    }
  }

  isBold(): boolean {
    return (this._data & StyleCharEncode.BOLD_FLAG_MASK) !== 0;
  }

  setDim(isDim: boolean): void {
    if (isDim) {
      this._data |= StyleCharEncode.DIM_FLAG_MASK;
    } else {
      this._data &= ~StyleCharEncode.DIM_FLAG_MASK;
    }
  }

  isDim(): boolean {
    return (this._data & StyleCharEncode.DIM_FLAG_MASK) !== 0;
  }

  setBlinking(isBlinking: boolean): void {
    if (isBlinking) {
      this._data |= StyleCharEncode.BLINKING_FLAG_MASK;
    } else {
      this._data &= ~StyleCharEncode.BLINKING_FLAG_MASK;
    }
  }

  isBlinking(): boolean {
    return (this._data & StyleCharEncode.BLINKING_FLAG_MASK) !== 0;
  }

  encodeStyle(style: Partial<StyleObject>) {
    this.setData(0);
    if (style.fg) this.setCharColor(style.fg);
    if (style.bg) this.setBackgroundColor(style.bg);

    this.setDim(Boolean(style.dim));
    this.setBlinking(Boolean(style.blinking));
    this.setBold(Boolean(style.bright));

    return this.getChar();
  }
}
