import { Vec4Array } from "@amodx/math";

export type TilesTypeData = {
  id: string;
  properties: Record<string, any>;
};

export type TileRoatations = 0 | 1 | 2 | 3;

export type TileData = {
  texture: string;
  tileY: number;
  tileX: number;
  rotation: TileRoatations;
  state?: number;
  tileType?: string;
  color?: Vec4Array;
};

export type TilePatternData = {
  id: string;
  defaultPattern: string | number;
  patterns: Record<string | number, TileData[][]>;
};
