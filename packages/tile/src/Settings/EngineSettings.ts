import { Vec2Array } from "@amodx/math";

export class EngineSettings {
  static pixelSize = 0.001;
  static tilePixelSize: Vec2Array = [8, 8];
  static tileMeterSize: Vec2Array = [
    this.tilePixelSize[0] * this.pixelSize,
    this.tilePixelSize[1] * this.pixelSize,
  ];

  static chunkTileSize: Vec2Array = [32, 32];
  static chunkMeterSize: Vec2Array = [
    this.chunkTileSize[0] * this.tilePixelSize[0] * this.pixelSize,
    this.chunkTileSize[1] * this.tilePixelSize[0] * this.pixelSize,
  ];
}
