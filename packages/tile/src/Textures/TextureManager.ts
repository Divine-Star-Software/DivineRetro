import { StringPalette } from "../Classes/StringPalette";
import { TileTextureData } from "./Texture.types";

export class TextureManager {
  static tileTexturePalette = new StringPalette();
  static tilesTextures: TileTextureData[] = [];

  static registerTiles(...data: TileTextureData[]) {
    for (const tile of data) {
      this.tileTexturePalette.register(tile.id);
      this.tilesTextures[this.tileTexturePalette.getNumberId(tile.id)] = tile;
    }
  }
}
TextureManager.registerTiles({
  id: "blank",
  src: "",
});
