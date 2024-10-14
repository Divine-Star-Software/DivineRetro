import { Flat2DIndex, Vec2Array } from "@amodx/math";
import { TileRenderer } from "../TileRenderer";
import { BuildTileGeometry } from "../Functions/BuildTileGeometry";
import { EntityTool } from "./EntityTool";
import { EntityInstance } from "./EntityInstance";
import { TileDataEncode } from "./TileDataEncode";
import { EngineSettings } from "../../Settings/EngineSettings";
import { WorldSpaces } from "../../Data/WorldSpace";
import { DataTool } from "../../Data/DataTool";
import { ColorDataEncode } from "../../Data/Classes/ColorDataEncode";
import { TileStateDataEncode } from "../../Data/Classes/TileStateDataEncode";
import { TileRendererLayerData } from "../TileRederer.types";
import { TileTextureIndex } from "../../Textures/TileTextureIndex";

export class TileLayer {
  private tileData: Uint32Array;

  private _enabled = true;
  set enabled(value: boolean) {
    this.entityTool.mesh.setEnabled(value);
    this._enabled = value;
  }
  get enabled() {
    return this._enabled;
  }

  colorDataEncode = new ColorDataEncode();
  colorDataDencode = new ColorDataEncode();
  stataeDataEncode = new TileStateDataEncode();
  tiles: EntityInstance[] = [];
  bufferIndex: Flat2DIndex;
  entityTool: EntityTool;
  tileDataEncoder = new TileDataEncode();
  dataTool = new DataTool();
  zOffset = 0;
  worldLayer = 0;
  worldDataClamp = 0;
  renderingGroupId = 0;
  constructor(
    public renderer: TileRenderer,
    public data: TileRendererLayerData
  ) {
    const mesh = BuildTileGeometry(renderer.scene);
    mesh.material = renderer.tilesMaterial;
    mesh.alwaysSelectAsActiveMesh = true;
    const entityTool = new EntityTool(mesh);
    this.bufferIndex = Flat2DIndex.GetXYOrder();
    this.worldLayer = data.worldLayer;
    if (data.renderGroup !== undefined)
      mesh.renderingGroupId = data.renderGroup;

    this.renderingGroupId = data.renderGroup || 0;

    if (data.zPosition) {
      this.zOffset = data.zPosition;
    }
    if (data.worldDataClamp) {
      this.worldDataClamp = data.worldDataClamp;
    }

    const [cols, rows] = this.data.tileSize;

    this.bufferIndex.setBounds(cols, rows);

    const maxTiles = rows * cols;
    entityTool.setInstanceAmount(maxTiles);

    this.tileData = new Uint32Array(maxTiles * 2);

    entityTool.addBuffer("tileData", this.tileData as any, 2);
    for (let col = 0; col < cols; col++) {
      for (let row = 0; row < rows; row++) {
        const index = this.bufferIndex.getIndexXY(col, row);
        const entity = entityTool.getInstance()!;
        if (!entity) break;
        this.tiles[index] = entity;
      }
    }

    entityTool.update();
    this.entityTool = entityTool;
  }

  render() {
    this.entityTool.mesh.position.z = this.zOffset;
    this.entityTool.mesh.renderingGroupId = this.renderingGroupId;
    const meterSize = EngineSettings.tileMeterSize;
    const [cols, rows] = this.data.tileSize;

    const tilePosition = WorldSpaces.getTilePosition(
      this.renderer.camera.position.x * EngineSettings.pixelSize,
      this.renderer.camera.position.y * EngineSettings.pixelSize
    );
    const tileX = tilePosition.x + this.data.tileStartOffset[0];
    const tileY = tilePosition.y + this.data.tileStartOffset[1];
    /* 
    console.log(
      tileX,
      tileY,
      this.dataTool
        .setPosition(tileX + 1, tileY + 1)
        .loadIn()
    ); */

    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const tile = this.tiles[this.bufferIndex.getIndexXY(col, row)];
        if (!tile) continue; // Changed from break to continue to avoid exiting the loop

        tile.matrix.setPosition(
          (tileX + col) * meterSize[0],
          (tileY + row) * meterSize[1],
          this.zOffset
        );

        const loadIn = this.dataTool
          .setPosition(
            !this.worldDataClamp
              ? tileX + col
              : (tileX + col) % this.worldDataClamp,
            !this.worldDataClamp
              ? tileY + row
              : (tileY + row) % this.worldDataClamp
          )
          .setLayer(this.worldLayer)
          .loadIn();
        if (!loadIn) {
          this.tileData[tile.index * 2] = 0;
          this.tileData[tile.index * 2 + 1] = 0;

          continue;
        }

        let textureIndex = this.dataTool.getTextureId();

        if (TileTextureIndex.isAnimated(textureIndex)) {
          textureIndex = TileTextureIndex.getAnimatedIndex(textureIndex);
        }

        this.colorDataDencode.setData(this.dataTool.getColorData());
        this.stataeDataEncode.setData(this.dataTool.getTileStateData());
        this.tileData[tile.index * 2] = this.tileDataEncoder
          .setData(this.tileData[tile.index * 2])
          .setFlipHorizontal(this.stataeDataEncode.getFlipHorizontal())
          .setFlipVertical(this.stataeDataEncode.getFlipVertical())
          .setRotation(this.stataeDataEncode.getRotation())
          .setTexture(textureIndex)
          .getData();
        this.tileData[tile.index * 2 + 1] = this.colorDataEncode
          .setData(this.tileData[tile.index * 2])

          .setColorR(this.colorDataDencode.getColorR())
          .setColorG(this.colorDataDencode.getColorG())
          .setColorB(this.colorDataDencode.getColorB())
          .setColorA(this.colorDataDencode.getColorA())
          .getData();
      }
    }

    this.entityTool.update();
  }
}
