import { EngineSettings } from "../../Settings/EngineSettings";

export interface ChunkLayerData {
  tiles: Uint16Array;
  textures: Uint16Array;
  tileStates: Uint16Array;
  states: Uint16Array;
  colors: Uint16Array;
}

export class ChunkLayer implements ChunkLayerData {
  tiles: Uint16Array;
  tileStates: Uint16Array;
  textures: Uint16Array;
  states: Uint16Array;
  colors: Uint16Array;
  static Create(data: Partial<ChunkLayerData>): ChunkLayer {
    const maxTiles =
      EngineSettings.chunkTileSize[0] * EngineSettings.chunkTileSize[1];

    return new ChunkLayer({
      tiles: data.tiles ? data.tiles : new Uint16Array(maxTiles),
      tileStates: data.tileStates ? data.tileStates : new Uint16Array(maxTiles),
      textures: data.textures ? data.textures : new Uint16Array(maxTiles),
      states: data.states ? data.states : new Uint16Array(maxTiles),
      colors: data.colors ? data.colors : new Uint16Array(maxTiles),
    });
  }
  constructor(data: ChunkLayerData) {
    this.tiles = data.tiles;
    this.tileStates = data.tileStates;
    this.textures = data.textures;
    this.states = data.states;

    this.colors = data.colors;
  }

  toJSON(): ChunkLayerData {
    return {
      tiles: this.tiles,
      tileStates: this.tileStates,
      textures: this.textures,
      states: this.states,
      colors: this.colors,
    };
  }
}
