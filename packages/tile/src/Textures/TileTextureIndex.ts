import { Flat2DIndex, Flat3DIndex } from "@amodx/math";

export class TileTextureIndex {
  private static tilesCount = 1;

  private static indexes = new Map<string, Flat2DIndex>([
    ["blank", Flat2DIndex.GetXYOrder()],
  ]);

  
  private static startingIndexes = new Map<string, number>([["blank", 0]]);


  static registerTexture(id: string, tilesWidth: number, tilesHeight: number) {
    const index = Flat2DIndex.GetXYOrder();
    this.indexes.set(id, index);
    index.setBounds(tilesWidth, tilesHeight);
    this.startingIndexes.set(id, this.tilesCount);
    this.tilesCount += index.size;
    return index;
  }

  static getIndex(id: string, tileX: number, tileY: number) {
    const index = this.indexes.get(id)!;
    return this.startingIndexes.get(id)! + index.getIndexXY(tileX, tileY);
  }
}
