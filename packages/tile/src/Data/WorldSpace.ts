import { Flat2DIndex, Vec2Array, Vector2Like } from "@amodx/math";
import { EngineSettings } from "../Settings/EngineSettings";

export class WorldSpaces {
  private static _position = Vector2Like.Create();

  static index = Flat2DIndex.GetXYOrder();
  static worldSize = Vector2Like.Create(); // Number of tiles in the world
  static chunkWorldSize = Vector2Like.Create(); // Number of chunks in the world

  static setWorldSize(x: number, y: number) {
    this.worldSize.x = x;
    this.worldSize.y = y;

    // Compute the number of chunks in the world based on chunk size
    this.chunkWorldSize.x = Math.ceil(x / EngineSettings.chunkTileSize[0]);
    this.chunkWorldSize.y = Math.ceil(y / EngineSettings.chunkTileSize[1]);
  }

  //translate tile positon to world positon
  static getWorldPosition(x: number, y: number) {
    this._position.x = EngineSettings.tileMeterSize[0] * x;
    this._position.y = EngineSettings.tileMeterSize[1] * y;
    return this._position;
  }
  //translate world positon to tile positon
  static getTilePosition(x: number, y: number) {
    this._position.x = Math.floor(x / EngineSettings.tileMeterSize[0]);
    this._position.y = Math.floor(y / EngineSettings.tileMeterSize[1]);

    return this._position;
  }
  // Get the chunk position given a world position (array format)
  static getChunkPositionArray(position: Vec2Array): Vec2Array {
    return [
      Math.floor(position[0] / EngineSettings.chunkMeterSize[0]),
      Math.floor(position[1] / EngineSettings.chunkMeterSize[1]),
    ];
  }

  // Get the chunk position given a Vector2Like
  static getChunkPositionVec3(position: Vector2Like): Vector2Like {
    this._position.x = Math.floor(position.x / EngineSettings.chunkTileSize[0]);
    this._position.y = Math.floor(position.y / EngineSettings.chunkTileSize[1]);
    return this._position;
  }

  // Get the chunk position given x, y coordinates
  static getChunkPositionXY(x: number, y: number): Vector2Like {
    this._position.x = Math.floor(x / EngineSettings.chunkTileSize[0]);
    this._position.y = Math.floor(y / EngineSettings.chunkTileSize[1]);
    return this._position;
  }

  // Get the chunk's world space index
  static getChunkIndexArray(position: Vec2Array): number {
    const chunkPos = this.getChunkPositionArray(position);
    return chunkPos[0] + chunkPos[1] * this.chunkWorldSize.x;
  }

  static getChunkIndexVec3(position: Vector2Like): number {
    const chunkPos = this.getChunkPositionVec3(position);
    return chunkPos.x + chunkPos.y * this.chunkWorldSize.x;
  }

  static getChunkIndexXY(x: number, y: number): number {
    const chunkPos = this.getChunkPositionXY(x, y);
    return chunkPos.x + chunkPos.y * this.chunkWorldSize.x;
  }

  // Get tile's relative position inside the chunk
  static getTilePositionArray(position: Vec2Array): Vec2Array {
    return [
      position[0] % EngineSettings.chunkTileSize[0],
      position[1] % EngineSettings.chunkTileSize[1],
    ];
  }

  static getTilePositionVec3(position: Vector2Like): Vector2Like {
    this._position.x = position.x % EngineSettings.chunkTileSize[0];
    this._position.y = position.y % EngineSettings.chunkTileSize[1];
    return this._position;
  }

  static getTilePositionXY(x: number, y: number): Vector2Like {
    this._position.x = x % EngineSettings.chunkTileSize[0];
    this._position.y = y % EngineSettings.chunkTileSize[1];
    return this._position;
  }

  // Get tile's relative index inside the chunk
  static getTileIndexArray(position: Vec2Array): number {
    const tilePos = this.getTilePositionArray(position);
    return this.index.getIndexXY(tilePos[0], tilePos[1]);
  }

  static getTileIndexVec3(position: Vector2Like): number {
    const tilePos = this.getTilePositionVec3(position);
    return this.index.getIndexXY(tilePos.x, tilePos.y);
  }

  static getTileIndexXY(x: number, y: number): number {
    const tilePos = this.getTilePositionXY(x, y);
    return this.index.getIndexXY(tilePos.x, tilePos.y);
  }
}
WorldSpaces.index.setBounds(
  EngineSettings.chunkTileSize[0],
  EngineSettings.chunkTileSize[1]
);
WorldSpaces.setWorldSize(32 * 3, 32 * 3);
