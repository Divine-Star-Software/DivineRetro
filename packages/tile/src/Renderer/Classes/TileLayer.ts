import { Flat2DIndex } from "@amodx/math";
import { TileRenderer } from "../TileRenderer";
import { BuildTileGeometry } from "../Functions/BuildTileGeometry";
import { EntityTool } from "./EntityTool";
import { EntityInstance } from "./EntityInstance";
import { TileDataEncode } from "./TileDataEncode";
import { EngineSettings } from "../../Settings/EngineSettings";
import { WorldSpaces } from "../../Data/WorldSpace";
import { DataTool } from "../../Data/DataTool";

export class TileLayer {
  private tileData: Uint32Array;

  tiles: EntityInstance[] = [];
  bufferIndex: Flat2DIndex;
  entityTool: EntityTool;
  tileDataEncoder = new TileDataEncode();

  dataTool = new DataTool();
  constructor(public renderer: TileRenderer, public layerId: number) {
    const mesh = BuildTileGeometry(renderer.scene, renderer.tilesMaterial);
    mesh.alwaysSelectAsActiveMesh = true;
    const entityTool = new EntityTool(mesh);
    this.bufferIndex = Flat2DIndex.GetXYOrder();

    const cols = EngineSettings.chunkTileSize[0] + 2;

    const rows = EngineSettings.chunkTileSize[1] + 2;

    this.bufferIndex.setBounds(cols, rows);

    const maxTiles = rows * cols;
    entityTool.setInstanceAmount(maxTiles);

    this.tileData = new Uint32Array(maxTiles);

    entityTool.addBuffer("faceData", this.tileData as any, 1);
    for (let col = 0; col < cols; col++) {
      for (let row = 0; row < rows; row++) {
        const index = this.bufferIndex.getIndexXY(col, row);
        const entity = entityTool.getInstance()!;
        if (!entity) break;
        this.tiles[index] = entity;
        entity.scale.setAll(1);
      }
    }

    entityTool.update();
    this.entityTool = entityTool;
  }

  render() {
    const meterSize = EngineSettings.tileMeterSize;
    const cols = EngineSettings.chunkTileSize[0] + 2;
    const rows = EngineSettings.chunkTileSize[1] + 2;

    const tilePosition = WorldSpaces.getTilePosition(
      this.renderer.camera.position.x * EngineSettings.pixelSize,
      this.renderer.camera.position.y * EngineSettings.pixelSize
    );
    const tileX = tilePosition.x - 1;
    const tileY = tilePosition.y - 1;

    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const tile = this.tiles[this.bufferIndex.getIndexXY(col, row)];
        if (!tile) continue; // Changed from break to continue to avoid exiting the loop

        tile.position.x = (tileX + col) * meterSize[0];
        tile.position.y = 0;
        tile.position.z = (tileY + row) * meterSize[1];

        const loadIn = this.dataTool
          .setPosition(tileX + col, tileY + row)
          .setLayer(this.layerId)
          .loadIn();
        if (!loadIn) {
          this.tileData[tile.index] = 0;
          continue;
        }

        this.tileData[tile.index] = this.tileDataEncoder
          .setData(this.tileData[tile.index])
          .setTexture(this.dataTool.getTextureId())
          .getData();
      }
    }

    this.entityTool.update();
    // this.entityTool.mesh.thinInstanceBufferUpdated("matrix");
    //  this.entityTool.mesh.thinInstanceBufferUpdated("faceData");
  }
}
