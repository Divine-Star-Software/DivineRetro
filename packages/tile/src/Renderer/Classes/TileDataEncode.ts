/**
 * Tile Data Encoding
 * // index 1
 * 32-bit number
 * - upper 16 bits (bits 16-31): Tile Texture Index
 * - lower 16 bits (bits 0-15): State Index
 *   - bits 0-3:   Rotation
 *   - bits 4-6:   Flip vertically, Flip horizontally, Blend mode
 *   - bits 7-15:  Reserved for future state data
 */
export class TileDataEncode {
  private _data = 0;

  /**
   * Sets the entire 32-bit data.
   * @param data A number representing the 32-bit data.
   * @returns The current instance for chaining.
   */
  setData(data: number): this {
    this._data = data >>> 0;
    return this;
  }

  /**
   * Retrieves the entire 32-bit data.
   * @returns The 32-bit data as a number.
   */
  getData(): number {
    return this._data >>> 0;
  }

  /**
   * Sets the texture ID in the upper 16 bits (bits 16-31).
   * @param id The texture index (0-65535).
   * @returns The current instance for chaining.
   */
  setTexture(id: number): this {
    // Texture ID in upper 16 bits
    this._data = (this._data & 0x0000ffff) | ((id & 0xffff) << 16);
    return this;
  }

  /**
   * Retrieves the texture ID from the upper 16 bits.
   * @returns The texture ID as a number (0-65535).
   */
  getTexture(): number {
    // Extract the upper 16 bits
    return (this._data >>> 16) & 0xffff;
  }

  /**
   * Sets the rotation value (bits 0-3).
   * @param value The rotation value (0-15).
   * @returns The current instance for chaining.
   */
  setRotation(value: number): this {
    // Clear rotation bits (bits 0-3) and set the new value
    this._data = (this._data & 0xfffffff0) | (value & 0xf);
    return this;
  }

  /**
   * Retrieves the rotation value (bits 0-3).
   * @returns The rotation value (0-15).
   */
  getRotation(): number {
    return this._data & 0xf;
  }

  /**
   * Sets the flip vertically flag (bit 4).
   * @param value A boolean where true means flipped vertically.
   * @returns The current instance for chaining.
   */
  setFlipVertical(value: boolean): this {
    if (value) {
      this._data |= 0x10; // Set bit 4
    } else {
      this._data &= ~0x10; // Clear bit 4
    }
    return this;
  }

  /**
   * Retrieves the flip vertically flag (bit 4).
   * @returns A boolean where true means flipped vertically.
   */
  getFlipVertical(): boolean {
    return (this._data & 0x10) !== 0;
  }

  /**
   * Sets the flip horizontally flag (bit 5).
   * @param value A boolean where true means flipped horizontally.
   * @returns The current instance for chaining.
   */
  setFlipHorizontal(value: boolean): this {
    if (value) {
      this._data |= 0x20; // Set bit 5
    } else {
      this._data &= ~0x20; // Clear bit 5
    }
    return this;
  }

  /**
   * Retrieves the flip horizontally flag (bit 5).
   * @returns A boolean where true means flipped horizontally.
   */
  getFlipHorizontal(): boolean {
    return (this._data & 0x20) !== 0;
  }

  /**
   * Sets the blend mode flag (bit 6).
   * @param multiply A boolean where true means multiply mode, false means mix mode.
   * @returns The current instance for chaining.
   */
  setBlendMode(multiply: boolean): this {
    if (multiply) {
      this._data |= 0x40; // Set bit 6
    } else {
      this._data &= ~0x40; // Clear bit 6
    }
    return this;
  }

  /**
   * Retrieves the blend mode flag (bit 6).
   * @returns A boolean where true means multiply mode, false means mix mode.
   */
  getBlendMode(): boolean {
    return (this._data & 0x40) !== 0;
  }

  /**
   * Sets the state data (bits 0-15).
   * This includes rotation, flip flags, and blend mode.
   * @param state A number representing the 16-bit state data.
   * @returns The current instance for chaining.
   */
  setState(state: number): this {
    this._data = (this._data & 0xffff0000) | (state & 0xffff);
    return this;
  }

  /**
   * Retrieves the state data (bits 0-15).
   * @returns A number representing the 16-bit state data.
   */
  getState(): number {
    return this._data & 0xffff;
  }
}