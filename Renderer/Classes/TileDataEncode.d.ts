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
export declare class TileDataEncode {
    private _data;
    setData(data: number): this;
    getData(): number;
    setTexture(id: number): this;
    getTexture(): number;
    setColorR(value: number): this;
    getColorR(): number;
    setColorG(value: number): this;
    getColorG(): number;
    setColorB(value: number): this;
    getColorB(): number;
    setColorA(value: number): this;
    getColorA(): number;
}
