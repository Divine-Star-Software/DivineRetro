import { Flat2DIndex } from "@amodx/math";
import { RetroRender } from "../RetroRenderer";
import { EntityTool } from "./EntityTool";
import { EntityInstance } from "./EntityInstance";
import { TileDataEncode } from "./TileDataEncode";
export declare class TileLayer {
    renderer: RetroRender;
    rows: number;
    cols: number;
    private tileData;
    tiles: EntityInstance[];
    bufferIndex: Flat2DIndex;
    entityTool: EntityTool;
    tileDataEncoder: TileDataEncode;
    constructor(renderer: RetroRender, rows: number, cols: number);
    setTexture(col: number, row: number, texture: number): void;
    setColor(col: number, row: number, r?: number, g?: number, b?: number, a?: number): void;
}
