import { Chunk } from "./Classes/Chunk";
import { WorldSpaces } from "./WorldSpace";

export class WorldDataRegister {
  static worlds = new Map<string, Chunk[]>();

  static getChunk(world: string, x: number, y: number): Chunk | false {
    const chunks = this.worlds.get(world);
    if (!chunks) return false;
    const chunk = chunks[WorldSpaces.getChunkIndexXY(x, y)];
    if (!chunk) return false;
    return chunk;
  }
  static setChunk(world: string, x: number, y: number, chunk: Chunk) {
    let chunks = this.worlds.get(world);
    if (!chunks) {
      chunks = [];
      this.worlds.set(world, chunks);
    }
    chunks[WorldSpaces.getChunkIndexXY(x, y)] = chunk;
  }
}
