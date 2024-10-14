const degreesMap: { [key: number]: number } = {
  0: 0,
  1: 90,
  2: 180,
  3: 270,
};
const rotationMap: { [key: number]: number } = {
  0: 0,
  90: 1,
  180: 2,
  270: 3,
};

/**
 * Tile State Encoding
 * 8-bit number
 * - 4 bits - rotation states (bits 0-3)
 *     0 - 0 degrees
 *     1 - 90 degrees
 *     2 - 180 degrees
 *     3 - 270 degrees
 * - 1 bit - flip vertically (bit 4)
 * - 1 bit - flip horizontally (bit 5)
 * - 1 bit - blend mode (bit 6)
 */
export class TileStateDataEncode {
  private _data: number = 0;

  // Constants for bit manipulation
  private static readonly ROTATION_MASK: number = 0x000F; // Lower 4 bits for rotation
  private static readonly ROTATION_SHIFT: number = 0;

  private static readonly FLIP_VERTICAL_MASK: number = 0x0010; // Bit 4
  private static readonly FLIP_VERTICAL_SHIFT: number = 4;

  private static readonly FLIP_HORIZONTAL_MASK: number = 0x0020; // Bit 5
  private static readonly FLIP_HORIZONTAL_SHIFT: number = 5;

  private static readonly BLEND_MODE_MASK: number = 0x0040; // Bit 6
  private static readonly BLEND_MODE_SHIFT: number = 6;

  /**
   * Sets the entire 16-bit data.
   * @param data A number representing the 16-bit data.
   * @returns The current instance for chaining.
   */
  setData(data: number): this {
    this._data = (data >>> 0) & 0xffff;
    return this;
  }

  /**
   * Retrieves the entire 16-bit data.
   * @returns The 16-bit data as a number.
   */
  getData(): number {
    return this._data >>> 0;
  }

  /**
   * Sets the rotation state.
   * @param value A number between 0 and 3 representing the rotation state.
   *              0 - 0 degrees, 1 - 90 degrees, 2 - 180 degrees, 3 - 270 degrees.
   * @returns The current instance for chaining.
   * @throws Error if the value is outside the range 0-3.
   */
  setRotation(value: number): this {
    if (value < 0 || value > 3) {
      throw new RangeError("Rotation value must be between 0 and 3.");
    }

    // Clear the rotation bits
    this._data &= ~TileStateDataEncode.ROTATION_MASK;

    // Set the new rotation value
    this._data |=
      (value << TileStateDataEncode.ROTATION_SHIFT) &
      TileStateDataEncode.ROTATION_MASK;

    return this;
  }

  /**
   * Retrieves the rotation state.
   * @returns A number between 0 and 3 representing the rotation state.
   */
  getRotation(): number {
    return (
      (this._data & TileStateDataEncode.ROTATION_MASK) >>>
      TileStateDataEncode.ROTATION_SHIFT
    );
  }

  /**
   * (Optional) Sets the rotation based on degrees.
   * @param degrees The rotation in degrees (0, 90, 180, 270).
   * @returns The current instance for chaining.
   * @throws Error if degrees are not one of the accepted values.
   */
  setRotationDegrees(degrees: number): this {
    const rotation = rotationMap[degrees];
    if (rotation === undefined) {
      throw new RangeError(
        "Degrees must be one of the following: 0, 90, 180, 270."
      );
    }

    return this.setRotation(rotation);
  }

  /**
   * (Optional) Retrieves the rotation in degrees.
   * @returns The rotation in degrees (0, 90, 180, 270).
   */
  getRotationDegrees(): number {
    const rotation = this.getRotation();
    return degreesMap[rotation] ?? 0;
  }

  /**
   * Sets the flip vertically flag (bit 4).
   * @param value A boolean where true means flipped and false means not flipped.
   * @returns The current instance for chaining.
   */
  setFlipVertical(value: boolean): this {
    if (value) {
      this._data |= TileStateDataEncode.FLIP_VERTICAL_MASK; // Set bit
    } else {
      this._data &= ~TileStateDataEncode.FLIP_VERTICAL_MASK; // Clear bit
    }
    return this;
  }

  /**
   * Retrieves the flip vertically flag.
   * @returns A boolean where true means flipped and false means not flipped.
   */
  getFlipVertical(): boolean {
    return (this._data & TileStateDataEncode.FLIP_VERTICAL_MASK) !== 0;
  }

  /**
   * Sets the flip horizontally flag (bit 5).
   * @param value A boolean where true means flipped and false means not flipped.
   * @returns The current instance for chaining.
   */
  setFlipHorizontal(value: boolean): this {
    if (value) {
      this._data |= TileStateDataEncode.FLIP_HORIZONTAL_MASK; // Set bit
    } else {
      this._data &= ~TileStateDataEncode.FLIP_HORIZONTAL_MASK; // Clear bit
    }
    return this;
  }

  /**
   * Retrieves the flip horizontally flag.
   * @returns A boolean where true means flipped and false means not flipped.
   */
  getFlipHorizontal(): boolean {
    return (this._data & TileStateDataEncode.FLIP_HORIZONTAL_MASK) !== 0;
  }

  /**
   * Sets the blend mode flag (bit 6).
   * @param multiply A boolean where true means multiply mode and false means mix mode.
   * @returns The current instance for chaining.
   */
  setBlendMode(multiply: boolean): this {
    if (multiply) {
      this._data |= TileStateDataEncode.BLEND_MODE_MASK; // Set bit
    } else {
      this._data &= ~TileStateDataEncode.BLEND_MODE_MASK; // Clear bit
    }
    return this;
  }

  /**
   * Retrieves the blend mode flag.
   * @returns A boolean where true means multiply mode and false means mix mode.
   */
  getBlendMode(): boolean {
    return (this._data & TileStateDataEncode.BLEND_MODE_MASK) !== 0;
  }
}
