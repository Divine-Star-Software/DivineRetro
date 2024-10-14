import { Vec2Array } from "@amodx/math";

export class EngineSettings {
  static pixelSize = 0.001;
  static maxPatternTiles = 2000;
  static tileSetTileSize: Vec2Array = [32, 32];
  static tileSetPixelSize: Vec2Array = [256, 256];

  static tilePixelSize: Vec2Array = [8, 8];
  static tileMeterSize: Vec2Array = [
    this.tilePixelSize[0] * this.pixelSize,
    this.tilePixelSize[1] * this.pixelSize,
  ];
  static rendererTileSize: Vec2Array = [58, 32];
  static rendererMeterSize: Vec2Array = [
    this.rendererTileSize[0] * this.tilePixelSize[0] * this.pixelSize,
    this.rendererTileSize[1] * this.tilePixelSize[0] * this.pixelSize,
  ];
  static chunkTileSize: Vec2Array = [32, 32];
  static chunkMeterSize: Vec2Array = [
    this.chunkTileSize[0] * this.tilePixelSize[0] * this.pixelSize,
    this.chunkTileSize[1] * this.tilePixelSize[0] * this.pixelSize,
  ];
}
