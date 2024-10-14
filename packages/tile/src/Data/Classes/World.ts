import { Vec2Array } from "@amodx/math";
import { Chunk, ChunkData } from "./Chunk";

export interface WorldData {
  id: string;

  chunks: ChunkData[];
}

export class World implements WorldData {
  id: string;

  static Create(data: Partial<WorldData>): WorldData {
    return {
      id: data.id ? data.id : "main",
      chunks: data.chunks ? data.chunks : [],
    };
  }
  chunks: Chunk[] = [];

  constructor(public data: WorldData) {
    this.id = data.id;
    this.chunks = data.chunks.map((_) => new Chunk(_));
  }
}
