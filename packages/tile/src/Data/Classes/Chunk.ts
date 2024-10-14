import { Vec2Array } from "@amodx/math";
import { ChunkLayer, ChunkLayerData } from "./ChunkLayer";

export interface ChunkData {
  position: Vec2Array;
  layers: Record<number, ChunkLayerData>;
}

export class Chunk implements ChunkData {
  layers: Record<number, ChunkLayer>;
  position: Vec2Array;
  static Create(data: Partial<ChunkData>): ChunkData {
    return {
      layers: data.layers ? data.layers : [],
      position: data.position ? data.position : [0, 0],
    };
  }

  constructor(data: ChunkData) {
    this.layers = Object.fromEntries(
      Object.keys(data.layers).map((_) => [
        _,
        new ChunkLayer(data.layers[Number(_)]),
      ])
    ) as Record<number, ChunkLayer>;
    this.position = data.position;
  }

  addLayer(layer: number) {
    this.layers[layer] = new ChunkLayer(
      ChunkLayer.Create({
        layerId: layer,
      })
    );
    return true;
  }

  toJSON(): ChunkData {
    return {
      layers: Object.fromEntries(
        Object.keys(this.layers).map((_) => [
          _,
          this.layers[Number(_)].toJSON(),
        ])
      ),
      position: [...this.position],
    };
  }
}
