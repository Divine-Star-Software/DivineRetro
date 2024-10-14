import { Vec2Array, Vec3Array } from "@amodx/math";

export type TileTextureData = {
  id: string;
  src: string;
};

export type TileTextureIndexDAta = {
  textureBounds: Vec2Array;
  mapped: Record<string, [Vec2Array, Vec2Array]>;
};

export type AnimatedTileData = {
  textureId: string;
  frameSize: Vec2Array;
  framesRange: [start: Vec2Array, end: Vec2Array];
  frameOrder: number[];
  frameLength: number[];
};
