/**
 * Char Data Encoding
 * 32 bit number
 * - first 16 bits is the tile texture index
 * - next 16 bits is the color index
 *   - 4 bits r
 *   - 4 bits g
 *   - 4 bits b
 *   - 4 bits a
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
    // Mask to ensure only the first 16 bits are modified
    this._data = (this._data & 0x0000FFFF) | ((id & 0xFFFF) << 16);
    return this;
  }

  getTexture(): number {
    // Extract the first 16 bits (right shift by 16)
    return (this._data >>> 16) & 0xFFFF;
  }

  setColorR(value: number) {
    // Mask to ensure only the 4 bits for Red channel are modified
    this._data = (this._data & 0xFFFFFF0F) | ((value & 0xF) << 12);
    return this;
  }

  getColorR(): number {
    // Extract the 4 bits for Red (bits 12-15)
    return (this._data >>> 12) & 0xF;
  }

  setColorG(value: number) {
    // Mask to ensure only the 4 bits for Green channel are modified
    this._data = (this._data & 0xFFFFF0FF) | ((value & 0xF) << 8);
    return this;
  }

  getColorG(): number {
    // Extract the 4 bits for Green (bits 8-11)
    return (this._data >>> 8) & 0xF;
  }

  setColorB(value: number) {
    // Mask to ensure only the 4 bits for Blue channel are modified
    this._data = (this._data & 0xFFFF0FFF) | ((value & 0xF) << 4);
    return this;
  }

  getColorB(): number {
    // Extract the 4 bits for Blue (bits 4-7)
    return (this._data >>> 4) & 0xF;
  }

  setColorA(value: number) {
    // Mask to ensure only the 4 bits for Alpha channel are modified
    this._data = (this._data & 0xFFFFFFF0) | (value & 0xF);
    return this;
  }

  getColorA(): number {
    // Extract the 4 bits for Alpha (bits 0-3)
    return this._data & 0xF;
  }
}
