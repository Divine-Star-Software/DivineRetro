import { Vec2Array } from "@amodx/math";

export type TileRendererLayerData = {
  id: number;
  tileStartOffset: Vec2Array;
  tileSize: Vec2Array;
  readWorldData?: boolean;
  worldLayer: number;
  worldDataClamp?: number;
  zPosition?: number;
  renderGroup?: 0 | 1 | 2 | 3;
};
