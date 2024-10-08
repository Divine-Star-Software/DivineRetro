
/**
Char Data Encoding
32 bit number
- first 8 bits is the char (bits 31-24)
- next 8 bits is the fg color index (bits 23-16)
- next 8 bits is the bg color index (bits 15-8)
- last 8 bits are bit flags in the order:
  - bold (bit 0)
  - dim (bit 1)
  - blinking (bit 2)
*/
export class CharDataEncode {
  private _data = 0;

  setData(data: number) {
    this._data = data >>> 0;
    return this;
  }

  getData() {
    return this._data >>> 0;
  }

  setChar(charNum: number) {
    // Clear bits 31-24 and set new charNum
    this._data &= ~(0xff << 24);
    this._data |= (charNum & 0xff) << 24;
    return this;
  }

  setCharColor(colorIndex: number) {
    // Clear bits 23-16 and set new colorIndex
    this._data &= ~(0xff << 16);
    this._data |= (colorIndex & 0xff) << 16;
    return this;
  }

  setBackgroundColor(colorIndex: number) {
    // Clear bits 15-8 and set new colorIndex
    this._data &= ~(0xff << 8);
    this._data |= (colorIndex & 0xff) << 8;
    return this;
  }

  setBold(isBold: boolean) {
    if (isBold) {
      this._data |= 1 << 0;
    } else {
      this._data &= ~(1 << 0);
    }
    return this;
  }

  setDim(isDim: boolean) {
    if (isDim) {
      this._data |= 1 << 1;
    } else {
      this._data &= ~(1 << 1);
    }
    return this;
  }

  setBlinking(isBlinking: boolean) {
    if (isBlinking) {
      this._data |= 1 << 2;
    } else {
      this._data &= ~(1 << 2);
    }
    return this;
  }

  // Getter methods to retrieve the encoded data
  getChar(): number {
    return (this._data >> 24) & 0xff;
  }

  getCharColor(): number {
    return (this._data >> 16) & 0xff;
  }

  getBackgroundColor(): number {
    return (this._data >> 8) & 0xff;
  }

  isBold(): boolean {
    return (this._data & (1 << 0)) !== 0;
  }

  isDim(): boolean {
    return (this._data & (1 << 1)) !== 0;
  }

  isBlinking(): boolean {
    return (this._data & (1 << 2)) !== 0;
  }
}
