import { RawTileData, TileData } from "Tiles/Tiles.types";
import { Chunk } from "./Classes/Chunk";
import { ChunkLayer } from "./Classes/ChunkLayer";
import { World } from "./Classes/World";
import { WorldDataRegister } from "./WorldDataRegister";
import { WorldSpaces } from "./WorldSpace";

export class DataTool {
  x: number;
  y: number;
  layer: number = 0;
  worldId: string = "main";

  private _state: number;
  private _tileState: number;
  private _tileId: number;
  private _textureId: number;
  private _color: number;
  private _tileIndex: number;

  private _layer: ChunkLayer;
  private _chunk: Chunk;

  setWorld(id: string) {
    this.worldId = id;

    WorldDataRegister.setWrold(id)
    return this;
  }
  setPosition(x: number, y: number) {
    this.x = x;
    this.y = y;
    return this;
  }

  setLayer(layer: number) {
    this.layer = layer;
    return this;
  }

  loadIn() {
    const chunk = WorldDataRegister.getChunk(this.x, this.y);
    if (!chunk) return false;
    const layer = chunk.layers[this.layer];
    if (!layer) return false;
    this._chunk = chunk;
    this._layer = layer;
    this._tileIndex = WorldSpaces.getTileIndexXY(this.x, this.y);
    this._tileId = this._layer.tiles[this._tileIndex];
    this._tileState = this._layer.tileStates[this._tileIndex];
    this._textureId = this._layer.textures[this._tileIndex];
    this._color = this._layer.colors[this._tileIndex];
    this._state = this._layer.states[this._tileIndex];
    return true;
  }

  commit() {
    this._layer.tiles[this._tileIndex] = this._tileId;
    this._layer.tileStates[this._tileIndex] = this._tileState;
    this._layer.textures[this._tileIndex] = this._textureId;
    this._layer.colors[this._tileIndex] = this._color;
    this._layer.states[this._tileIndex] = this._state;
  }

  getTextureId() {
    return this._textureId;
  }

  setTextureId(id: number) {
    this._textureId = id;
  }
  getTileId() {
    return this._tileId;
  }
  setTileId(id: number) {
    this._tileId = id;
  }

  getStateData() {
    return this._state;
  }
  setStateData(value: number) {
    this._state = value;
  }

  getTileStateData() {
    return this._tileState;
  }
  setTileStateData(value: number) {
    this._tileState = value;
  }

  getColorData() {
    return this._color;
  }
  setColorData(value: number) {
    this._color = value;
  }

  getRawTileData(): RawTileData {
    return [
      this._tileId,
      this._tileState,
      this._textureId,
      this._state,
      this._color,
    ];
  }
  setRawTileData(data: RawTileData) {
    this._tileId = data[0];
    this._tileState = data[1];
    this._textureId = data[2];
    this._state = data[3];
    this._color = data[4];
  }
}
