import { Observable } from "@amodx/core/Observers/Observable";
import { TileData } from "@divineretro/tile/Tiles/Tiles.types";

export class WorldBuilderManager {
  static observers = {
    tileDataUpdated: new Observable(),
  };

  static selectedTiles: {
    row: number;
    col: number;
  }[] =[];
  static worldId: string = "main";
  static worldLayer: number = 0;
  static tileData: TileData = {
    texture: "blank",
    flipX: false,
    flipY: false,
    tileY: 0,
    tileX: 0,
    state: 0,
    tileType: "blank",
    rotation: 0,
    color: [255, 255, 255, 255],
  };

  static updateTileData(data: Partial<TileData>) {
    WorldBuilderManager.tileData = { ...this.tileData, ...data };
    this.observers.tileDataUpdated.notify();
  }
}
