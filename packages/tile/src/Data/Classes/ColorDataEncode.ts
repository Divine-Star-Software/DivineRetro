/**
 * Color Data Encoding
 * 16-bit number
 * - Bits 12-15: Red (4 bits)
 * - Bits 8-11: Green (4 bits)
 * - Bits 4-7: Blue (4 bits)
 * - Bits 0-3: Alpha (4 bits)
 */
export class ColorDataEncode {
  private _data = 0;

  /**
   * Sets the entire 16-bit data.
   * @param data A number representing the 16-bit color data.
   */
  setData(data: number): this {
    this._data = data >>> 0 & 0xFFFF; // Ensure only 16 bits are stored
    return this;
  }

  /**
   * Retrieves the entire 16-bit data.
   * @returns A number representing the 16-bit color data.
   */
  getData(): number {
    return this._data >>> 0;
  }

  /**
   * Sets the Red channel (bits 12-15).
   * @param value A number between 0 and 15.
   */
  setColorR(value: number): this {
    this._data = (this._data & ~(0xF << 12)) | ((value & 0xF) << 12);
    return this;
  }

  /**
   * Gets the Red channel value (bits 12-15).
   * @returns A number between 0 and 15.
   */
  getColorR(): number {
    return (this._data >>> 12) & 0xF;
  }

  /**
   * Sets the Green channel (bits 8-11).
   * @param value A number between 0 and 15.
   */
  setColorG(value: number): this {
    this._data = (this._data & ~(0xF << 8)) | ((value & 0xF) << 8);
    return this;
  }

  /**
   * Gets the Green channel value (bits 8-11).
   * @returns A number between 0 and 15.
   */
  getColorG(): number {
    return (this._data >>> 8) & 0xF;
  }

  /**
   * Sets the Blue channel (bits 4-7).
   * @param value A number between 0 and 15.
   */
  setColorB(value: number): this {
    this._data = (this._data & ~(0xF << 4)) | ((value & 0xF) << 4);
    return this;
  }

  /**
   * Gets the Blue channel value (bits 4-7).
   * @returns A number between 0 and 15.
   */
  getColorB(): number {
    return (this._data >>> 4) & 0xF;
  }

  /**
   * Sets the Alpha channel (bits 0-3).
   * @param value A number between 0 and 15.
   */
  setColorA(value: number): this {
    this._data = (this._data & ~0xF) | (value & 0xF);
    return this;
  }

  /**
   * Gets the Alpha channel value (bits 0-3).
   * @returns A number between 0 and 15.
   */
  getColorA(): number {
    return this._data & 0xF;
  }
}
