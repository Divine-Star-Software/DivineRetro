/**
 * Tile Data Encoding
 * // index 1
 * 32 bit number
 * - upper 16 bits (bits 16-31): Tile Texture Index
 * - lower 16 bits (bits 0-15): Color Index
 *   - bits 12-15: Red (R)
 *   - bits 8-11:  Green (G)
 *   - bits 4-7:   Blue (B)
 *   - bits 0-3:   Alpha (A)
 * // index 2
 * 32 bit number
 * - lower 16 bits (bits 0-15): State Index
 *   - bits 0-3:   Rotation
 */
export class TileDataEncode {
  private _data = 0;

  setData(data: number) {
    this._data = data >>> 0;
    return this;
  }

  getData() {
    return this._data >>> 0;
  }

  setTexture(id: number) {
    // Texture ID in upper 16 bits
    this._data = (this._data & 0x0000ffff) | ((id & 0xffff) << 16);
    return this;
  }

  getTexture(): number {
    // Extract the upper 16 bits
    return (this._data >>> 16) & 0xffff;
  }

  setColorR(value: number) {
    // Correct mask for Red (bits 12-15)
    this._data = (this._data & 0xffff0fff) | ((value & 0xf) << 12);
    return this;
  }

  getColorR(): number {
    // Extract Red (bits 12-15)
    return (this._data >>> 12) & 0xf;
  }

  setColorG(value: number) {
    // Correct mask for Green (bits 8-11)
    this._data = (this._data & 0xfffff0ff) | ((value & 0xf) << 8);
    return this;
  }

  getColorG(): number {
    // Extract Green (bits 8-11)
    return (this._data >>> 8) & 0xf;
  }

  setColorB(value: number) {
    // Correct mask for Blue (bits 4-7)
    this._data = (this._data & 0xffffff0f) | ((value & 0xf) << 4);
    return this;
  }

  getColorB(): number {
    // Extract Blue (bits 4-7)
    return (this._data >>> 4) & 0xf;
  }

  setColorA(value: number) {
    // Correct mask for Alpha (bits 0-3)
    this._data = (this._data & 0xfffffff0) | (value & 0xf);
    return this;
  }

  getColorA(): number {
    // Extract Alpha (bits 0-3)
    return this._data & 0xf;
  }


  setRotation(value: number) {
    // Clear existing rotation bits
    this._data = (this._data & 0xfffffff0) | (value & 0xf);
    return this;
  }

  // Get Rotation (bits 0-3) from Index 2
  getRotation(): number {
    return this._data & 0xf;
  }
}
