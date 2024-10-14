import { Vector3Like } from "@amodx/math";
import { Chunk } from "./Classes/Chunk";
import { World, WorldData } from "./Classes/World";
import { WorldSpaces } from "./WorldSpace";

export class WorldDataRegister {
  static worlds = new Map<string, World>();

  static activeWorld: World | null = null;
  static createWorld(data: WorldData) {
    this.worlds.set(data.id, new World(data));
  }
  static setWrold(worldId: string) {
    const world = this.worlds.get(worldId);
    if (!world) throw new Error(`World with ${worldId} id does not exist`);
    this.activeWorld = world;
  }
  static getChunk(x: number, y: number): Chunk | false {
    if (!this.activeWorld) throw new Error(`A world must be set.`);
    const chunkPos = WorldSpaces.getChunkPositionXY(x, y);
    const chunk =
      this.activeWorld.chunks[Vector3Like.HashXYZ(chunkPos.x, chunkPos.y, 0)];
    if (!chunk) return false;
    return chunk;
  }
  static setChunk(worldId: string, x: number, y: number, chunk: Chunk) {
    let world = this.worlds.get(worldId);
    if (!world) {
      throw new Error(`World with ${worldId} does not exist`);
    }

    const chunkPos = WorldSpaces.getChunkPositionXY(x, y);
    world.chunks[Vector3Like.HashXYZ(chunkPos.x, chunkPos.y, 0)] = chunk;
  }
}
