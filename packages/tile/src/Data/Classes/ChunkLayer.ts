import { EngineSettings } from "../../Settings/EngineSettings";

export interface ChunkLayerData {
  layerId: number;
  tiles: Uint16Array;
  textures: Uint16Array;
  tileStates: Uint8Array;
  states: Uint16Array;
  colors: Uint32Array;
}

export class ChunkLayer implements ChunkLayerData {
  layerId: number;
  tiles: Uint16Array;
  tileStates: Uint8Array;
  textures: Uint16Array;
  states: Uint16Array;
  colors: Uint32Array;
  static Create(data: Partial<ChunkLayerData>): ChunkLayer {
    const maxTiles =
      EngineSettings.chunkTileSize[0] * EngineSettings.chunkTileSize[1];

    return new ChunkLayer({
      layerId: data.layerId ? data.layerId : 0,
      tiles: data.tiles ? data.tiles : new Uint16Array(maxTiles),
      tileStates: data.tileStates ? data.tileStates : new Uint8Array(maxTiles),
      textures: data.textures ? data.textures : new Uint16Array(maxTiles),
      states: data.states ? data.states : new Uint16Array(maxTiles),
      colors: data.colors ? data.colors : new Uint32Array(maxTiles),
    });
  }
  constructor(data: ChunkLayerData) {
    this.layerId = data.layerId;
    this.tiles = data.tiles;
    this.tileStates = data.tileStates;
    this.textures = data.textures;
    this.states = data.states;
    this.colors = data.colors;
  }

  toJSON(): ChunkLayerData {
    return {
      layerId: this.layerId ? this.layerId : 0,
      tiles: this.tiles,
      tileStates: this.tileStates,
      textures: this.textures,
      states: this.states,
      colors: this.colors,
    };
  }
}
