import { ChunkLayer, ChunkLayerData } from "./ChunkLayer";

export interface ChunkData {
  layers: ChunkLayerData[];
}

export class Chunk implements ChunkData {
  layers: ChunkLayer[];
  static Create(data: Partial<ChunkData>): ChunkData {
    return {
      layers: data.layers ? data.layers : [],
    };
  }

  constructor(data: ChunkData) {
    this.layers = data.layers.map((_) => new ChunkLayer(_));
  }

  addLayer(layer: number) {
    if (this.layers[layer]) return false;
    this.layers[layer] = new ChunkLayer(ChunkLayer.Create({}));
    return true;
  }

  toJSON(): ChunkData {
    return {
      layers: this.layers.map((_) => _.toJSON()),
    };
  }
}
