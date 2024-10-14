import { Flat2DIndex, Flat3DIndex, Vec2Array } from "@amodx/math";
import { TileTextureIndexDAta as TileIndexData } from "./Texture.types";
import { TextureAnimations } from "./TextureAnimations";

export class TileTextureIndex {
  private static tilesCount = 1;

  static index = Flat2DIndex.GetXYOrder();
  static _bounds = new Map<string, [start: Vec2Array, end: Vec2Array]>();

  static getIndexData(): TileIndexData {
    const bounds: TileIndexData["mapped"] = {};

    for (const [id, indexes] of this._bounds) {
      bounds[id] = this._bounds.get(id)!;
    }

    return {
      textureBounds: this.index.getBounds(),
      mapped: bounds,
    };
  }

  static setTextureTileBounds(x: number, y: number) {
    this.index.setBounds(x, y);
  }

  static registerTexture(
    id: string,
    startX: number,
    startY: number,
    endX: number,
    endY: number
  ) {
    this._bounds.set(id, [
      [startX, startY],
      [endX, endY],
    ]);
  }
  static getIndex(id: string, tileX: number, tileY: number) {
    if (id == "blank") return 0;
    const start = this._bounds.get(id)![0];

    return this.index.getIndexXY(start[0] + tileX, start[1] + tileY) + 1;
  }
  static isAnimated(index: number) {
    if(index == 0) return;
    return TextureAnimations.animatedIndex[index - 1] !== undefined;
  }

  static getAnimatedIndex(index: number) {
    const anim = TextureAnimations.animatedIndex[index - 1];
    if (!anim) return index;

    const indexPos = this.index.getXY(index - 1);

    return (
      this.index.getIndexXY(
        indexPos[0] + anim.animatedFrameOffset[0],
        indexPos[1] + anim.animatedFrameOffset[1]
      ) + 1
    );
  }
}
