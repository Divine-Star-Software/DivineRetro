import { BuildTileTexture } from "./Functions/BuildTileTexture";
import { BuildTileMaterial } from "./Functions/BuildTileMaterial";
import { TileDataEncode } from "./Classes/TileDataEncode";
export class RetroRender {
    scene;
    rows;
    cols;
    bufferIndex;
    charTiles = [];
    entityTool;
    tileDataEncode = new TileDataEncode();
    tilesMaterial;
    constructor(scene, rows, cols) {
        this.scene = scene;
        this.rows = rows;
        this.cols = cols;
        const texture = BuildTileTexture(scene, "");
        const material = BuildTileMaterial(scene, texture);
        this.tilesMaterial = material;
    }
}
