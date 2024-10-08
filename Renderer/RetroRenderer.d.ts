import type { Scene } from "@babylonjs/core/scene";
import { Flat2DIndex } from "@amodx/math";
import { EntityInstance } from "./Classes/EntityInstance";
import { EntityTool } from "./Classes/EntityTool";
import { TileDataEncode } from "./Classes/TileDataEncode";
import { ShaderMaterial } from "@babylonjs/core";
export declare class RetroRender {
    scene: Scene;
    rows: number;
    cols: number;
    bufferIndex: Flat2DIndex;
    charTiles: EntityInstance[];
    entityTool: EntityTool;
    tileDataEncode: TileDataEncode;
    tilesMaterial: ShaderMaterial;
    constructor(scene: Scene, rows: number, cols: number);
}
