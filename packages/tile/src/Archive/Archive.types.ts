import { Vec2Array } from "@amodx/math";
import { TileTextureIndexDAta } from "../Textures/Texture.types";

export interface ArchivedWorldData {
  id: string;
  chunks: ArchivedChunkData[];
  tilePalette: string[];
  tileTextureIndex: TileTextureIndexDAta;
}

export interface ArchivedChunkData {
  position: Vec2Array;
  layers: Record<number, ArchivedLayerData>;
}

export interface ArchivedLayerData {
  tiles: string|number;
  textures: string|number;
  tileStates: string|number;
  states: string|number;
  colors: string|number;
}
