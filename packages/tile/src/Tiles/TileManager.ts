import { StringPalette } from "../Classes/StringPalette";
import { TilesTypeData } from "./Tiles.types";

export class TileManager {
  static tilePalette = new StringPalette();
  static tiles: TilesTypeData[] = [];

  static registerTiles(...data: TilesTypeData[]) {
    for (const tile of data) {
      this.tilePalette.register(tile.id);
      this.tiles[this.tilePalette.getNumberId(tile.id)] = tile;
    }
  }
}
TileManager.registerTiles({
  id: "blank",
  properties: {},
});
