import { Flat2DIndex, Vec2Array, Vector2Like } from "@amodx/math";
import { EngineSettings } from "../Settings/EngineSettings";

export class WorldSpaces {
  private static _position = Vector2Like.Create();

  static chunkTileIndex = Flat2DIndex.GetXYOrder();

  // Translate tile position to world position
  static getWorldPosition(x: number, y: number) {
    this._position.x = EngineSettings.tileMeterSize[0] * x;
    this._position.y = EngineSettings.tileMeterSize[1] * y;
    return this._position;
  }

  // Translate world position to tile position
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



  // Get tile's relative position inside the chunk
  static getTilePositionArray(position: Vec2Array): Vec2Array {
    return [
      ((position[0] % EngineSettings.chunkTileSize[0]) +
        EngineSettings.chunkTileSize[0]) %
        EngineSettings.chunkTileSize[0],
      ((position[1] % EngineSettings.chunkTileSize[1]) +
        EngineSettings.chunkTileSize[1]) %
        EngineSettings.chunkTileSize[1],
    ];
  }

  static getTilePositionVec3(position: Vector2Like): Vector2Like {
    this._position.x =
      ((position.x % EngineSettings.chunkTileSize[0]) +
        EngineSettings.chunkTileSize[0]) %
      EngineSettings.chunkTileSize[0];
    this._position.y =
      ((position.y % EngineSettings.chunkTileSize[1]) +
        EngineSettings.chunkTileSize[1]) %
      EngineSettings.chunkTileSize[1];
    return this._position;
  }

  static getTilePositionXY(x: number, y: number): Vector2Like {
    this._position.x =
      ((x % EngineSettings.chunkTileSize[0]) +
        EngineSettings.chunkTileSize[0]) %
      EngineSettings.chunkTileSize[0];
    this._position.y =
      ((y % EngineSettings.chunkTileSize[1]) +
        EngineSettings.chunkTileSize[1]) %
      EngineSettings.chunkTileSize[1];
    return this._position;
  }

  // Get tile's relative index inside the chunk
  static getTileIndexArray(position: Vec2Array): number {
    const tilePos = this.getTilePositionArray(position);
    return this.chunkTileIndex.getIndexXY(tilePos[0], tilePos[1]);
  }

  static getTileIndexVec3(position: Vector2Like): number {
    const tilePos = this.getTilePositionVec3(position);
    return this.chunkTileIndex.getIndexXY(tilePos.x, tilePos.y);
  }

  static getTileIndexXY(x: number, y: number): number {
    const tilePos = this.getTilePositionXY(x, y);
    return this.chunkTileIndex.getIndexXY(tilePos.x, tilePos.y);
  }
}

// Initialize chunkTileIndex bounds
WorldSpaces.chunkTileIndex.setBounds(
  EngineSettings.chunkTileSize[0],
  EngineSettings.chunkTileSize[1]
);
