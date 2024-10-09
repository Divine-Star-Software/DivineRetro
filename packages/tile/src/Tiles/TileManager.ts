import { StringPalette } from "../Classes/StringPalette";
import { TilesData } from "./Tiles.types";

export class TileManager {
  static tilePalette = new StringPalette();
  static tiles: TilesData[] = [];

  static registerTiles(...data: TilesData[]) {
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
