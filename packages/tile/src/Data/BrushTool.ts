import { TileManager } from "../Tiles/TileManager";
import { Chunk } from "./Classes/Chunk";
import { DataTool } from "./DataTool";
import { WorldDataRegister } from "./WorldDataRegister";
import { TileTextureIndex } from "../Textures/TileTextureIndex";
import { ColorDataEncode } from "./Classes/ColorDataEncode";
import { RawTileData, TileRoatations } from "../Tiles/Tiles.types";
import { TileStateDataEncode } from "./Classes/TileStateDataEncode";
import { WorldSpaces } from "./WorldSpace";

export class BrushTool {
  x: number;
  y: number;
  layer: number = 0;
  world: string = "main";
  colorData = new ColorDataEncode();
  stateData = new TileStateDataEncode();

  _dataTool = new DataTool();

  private _state: number;
  private _textureId: number;
  private _tileId: number;
  private _color: number;
  private _tileState: number = 0;

  setWorld(id: string) {
    this.world = id;
    WorldDataRegister.setWrold(id);
    return this;
  }
  setPosition(x: number, y: number) {
    this.x = x;
    this.y = y;
    return this;
  }

  paintRaw(raw: RawTileData) {
    this._getOrAddChunk();
    this._dataTool.setRawTileData(raw);
    this._dataTool.commit();
  }

  private _getOrAddChunk() {
    if (
      !this._dataTool
        .setWorld(this.world)
        .setPosition(this.x, this.y)
        .setLayer(this.layer)
        .loadIn()
    ) {
      let chunk = WorldDataRegister.getChunk(this.x, this.y);
      if (!chunk) {
        const chunkPos = WorldSpaces.getChunkPositionXY(this.x, this.y);
        console.log(chunkPos.x, chunkPos.y, this.x, this.y);
        chunk = new Chunk(
          Chunk.Create({
            position: [chunkPos.x, chunkPos.y],
          })
        );
        chunk.addLayer(this.layer);
        WorldDataRegister.setChunk(this.world, this.x, this.y, chunk);
      } else {
        chunk.addLayer(this.layer);
      }

      this._dataTool.loadIn();
    }
  }
  paint() {
    this._getOrAddChunk();
    this._dataTool.setColorData(this._color);
    this._dataTool.setStateData(this._state);
    this._dataTool.setTileId(this._tileId);

    this._dataTool.setTileStateData(this._tileState);
    this._dataTool.setTextureId(this._textureId);
    this._dataTool.commit();

    return this;
  }

  erase() {
    if (
      !this._dataTool.setWorld(this.world).setPosition(this.x, this.y).loadIn()
    )
      return this;

    this._dataTool.setTileId(0);
    this._dataTool.commit();
    return this;
  }

  setLayer(layer: number) {
    this.layer = layer;
    return this;
  }

  setRotation(rotation: TileRoatations) {
    this._tileState = this.stateData
      .setData(this._tileState)
      .setRotation(rotation)
      .getData();

    return this;
  }

  setFlipX(flipX: boolean) {
    this._tileState = this.stateData
      .setData(this._tileState)
      .setFlipHorizontal(flipX)
      .getData();
    return this;
  }
  setFlipY(flipY: boolean) {
    this._tileState = this.stateData
      .setData(this._tileState)
      .setFlipVertical(flipY)
      .getData();
    return this;
  }
  setTileId(id: string) {
    this._tileId = TileManager.tilePalette.getNumberId(id);
    return this;
  }
  setTextureId(id: string, tileX: number, tileY: number) {
    this._textureId = TileTextureIndex.getIndex(id, tileX, tileY);
    return this;
  }

  setStateData(value: number) {
    this._state = value;
    return this;
  }

  setColorData(
    r: number = 255,
    g: number = 255,
    b: number = 255,
    a: number = 255
  ) {
    this._color = this.colorData
      .setData(0)
      .setColorR(r)
      .setColorG(g)
      .setColorB(b)
      .setColorA(a)
      .getData();
    return this;
  }
}
