import { Flat2DIndex } from "@amodx/math";
import { BuildTileGeometry } from "../Functions/BuildTileGeometry";
import { EntityTool } from "./EntityTool";
import { TileDataEncode } from "./TileDataEncode";
export class TileLayer {
    renderer;
    rows;
    cols;
    tileData;
    tiles;
    bufferIndex;
    entityTool;
    tileDataEncoder = new TileDataEncode();
    constructor(renderer, rows, cols) {
        this.renderer = renderer;
        this.rows = rows;
        this.cols = cols;
        const mesh = BuildTileGeometry(renderer.scene, renderer.tilesMaterial);
        const entityTool = new EntityTool(mesh);
        this.bufferIndex = Flat2DIndex.GetXYOrder();
        this.bufferIndex.setBounds(this.rows, this.cols);
        const maxTiles = this.rows * this.cols;
        entityTool.setInstanceAmount(maxTiles);
        this.tileData = new Uint32Array(maxTiles);
        entityTool.addBuffer("faceData", this.tileData, 1);
        const pixelSize = 0.001;
        const meterSize = [8 * pixelSize, 16 * pixelSize];
        const startX = -meterSize[0] * cols;
        const startZ = 0;
        for (let col = 0; col < cols; col++) {
            for (let row = 0; row < rows; row++) {
                const index = this.bufferIndex.getIndexXY(row, col);
                const entity = entityTool.getInstance();
                if (!entity)
                    break;
                this.tiles[index] = entity;
                entity.position.x = startX + col * meterSize[0];
                entity.position.y = 0;
                entity.position.z = startZ - row * meterSize[1];
                entity.scale.setAll(1);
            }
        }
        entityTool.update();
        this.entityTool = entityTool;
    }
    setTexture(col, row, texture) {
        const index = this.bufferIndex.getIndexXY(col, row);
        this.tileData[index] = this.tileDataEncoder
            .setData(this.tileData[index])
            .setTexture(texture)
            .getData();
    }
    setColor(col, row, r = 1, g = 1, b = 1, a = 1) {
        const index = this.bufferIndex.getIndexXY(col, row);
        this.tileData[index] = this.tileDataEncoder
            .setData(this.tileData[index])
            .setColorR(r)
            .setColorG(g)
            .setColorB(b)
            .setColorA(a)
            .getData();
    }
}
