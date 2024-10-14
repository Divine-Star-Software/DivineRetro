/**
 * Color Data Encoding
 * 32-bit number
 * - Bits 24-31: Red (8 bits)
 * - Bits 16-23: Green (8 bits)
 * - Bits 8-15: Blue (8 bits)
 * - Bits 0-7: Alpha (8 bits)
 */
export class ColorDataEncode {
  private _data = 0;

  /**
   * Sets the entire 32-bit data.
   * @param data A number representing the 32-bit color data.
   */
  setData(data: number): this {
    this._data = data >>> 0 & 0xFFFFFFFF; // Ensure only 32 bits are stored
    return this;
  }

  /**
   * Retrieves the entire 32-bit data.
   * @returns A number representing the 32-bit color data.
   */
  getData(): number {
    return this._data >>> 0;
  }

  /**
   * Sets the Red channel (bits 24-31).
   * @param value A number between 0 and 255.
   */
  setColorR(value: number): this {
    this._data = (this._data & ~(0xFF << 24)) | ((value & 0xFF) << 24);
    return this;
  }

  /**
   * Gets the Red channel value (bits 24-31).
   * @returns A number between 0 and 255.
   */
  getColorR(): number {
    return (this._data >>> 24) & 0xFF;
  }

  /**
   * Sets the Green channel (bits 16-23).
   * @param value A number between 0 and 255.
   */
  setColorG(value: number): this {
    this._data = (this._data & ~(0xFF << 16)) | ((value & 0xFF) << 16);
    return this;
  }

  /**
   * Gets the Green channel value (bits 16-23).
   * @returns A number between 0 and 255.
   */
  getColorG(): number {
    return (this._data >>> 16) & 0xFF;
  }

  /**
   * Sets the Blue channel (bits 8-15).
   * @param value A number between 0 and 255.
   */
  setColorB(value: number): this {
    this._data = (this._data & ~(0xFF << 8)) | ((value & 0xFF) << 8);
    return this;
  }

  /**
   * Gets the Blue channel value (bits 8-15).
   * @returns A number between 0 and 255.
   */
  getColorB(): number {
    return (this._data >>> 8) & 0xFF;
  }

  /**
   * Sets the Alpha channel (bits 0-7).
   * @param value A number between 0 and 255.
   */
  setColorA(value: number): this {
    this._data = (this._data & ~0xFF) | (value & 0xFF);
    return this;
  }

  /**
   * Gets the Alpha channel value (bits 0-7).
   * @returns A number between 0 and 255.
   */
  getColorA(): number {
    return this._data & 0xFF;
  }
}
