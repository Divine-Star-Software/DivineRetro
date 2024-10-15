import type { Scene } from "@babylonjs/core/scene";
import { BuildASCIITexture } from "./Functions/BuildASCIITexture";
import { BuildASCIIMaterial } from "./Functions/BuildASCIIMaterial";
import { BuildASCIIGeometry } from "./Functions/BuildASCIIGeometry";
import { Flat2DIndex } from "@amodx/math";
import { EntityInstance } from "./Classes/EntityInstance";
import { CharDataEncode } from "./Classes/ChardataEncode";
import { EntityTool } from "./Classes/EntityTool";
import { ASCIIMapping, StyleObject } from "./ASCIIMapping";
import { StyleCharEncode } from "./Classes/StyleCharEncode";

export class ASCIIRender {
  bufferIndex: Flat2DIndex;
  textureIndex: Flat2DIndex;
  charTiles: EntityInstance[] = [];

  entityTool: EntityTool;
  charDataEncode = new CharDataEncode();
  styleCharEncode = new StyleCharEncode();
  private charData: Uint32Array;

  constructor(scene: Scene, public rows: number, public cols: number) {
    const texture = BuildASCIITexture(scene);
    const material = BuildASCIIMaterial(scene, texture);
    const entityTool = BuildASCIIGeometry(scene, material);

    this.bufferIndex = Flat2DIndex.GetXYOrder();
    this.bufferIndex.setBounds(this.cols, this.rows);
    this.textureIndex = Flat2DIndex.GetXYOrder();
    this.textureIndex.setBounds(16, 16);

    const maxTiles = this.rows * this.cols;
    entityTool.setInstanceAmount(maxTiles);

    this.charData = new Uint32Array(maxTiles);

    entityTool.addBuffer("faceData", this.charData as any, 1);

    const pixelSize = 0.001;
    const meterSize = [8 * pixelSize, 16 * pixelSize];

    const startX = cols * meterSize[0];
    const startY = rows * meterSize[1];
    for (let col = 0; col < cols; col++) {
      for (let row = 0; row < rows; row++) {
        const index = this.bufferIndex.getIndexXY(col, row);
        const entity = entityTool.getInstance()!;
        if (!entity) break;
        this.charTiles[index] = entity;
        entity.matrix.positionX = startX - col * meterSize[0];
        entity.matrix.positionY = startY - row * meterSize[1];
        entity.matrix.positionZ = 0;
      }
    }

    entityTool.update();
    this.entityTool = entityTool;
  }

  asyncSleep(time: number) {
    return new Promise((resolve) => {
      setTimeout(() => resolve(true), time);
    });
  }

  stylize(string: string, styleObject: Partial<StyleObject>) {
    //   console.log( this.styleCharEncode.encodeStyle(styleObject),styleObject)
    return this.styleCharEncode.encodeStyle(styleObject) + string;
  }

  showAt(string: string, row: number, column: number) {
    if (!string || !string.length) return this;
    let col = column;
    for (let stringCount = 0; stringCount < string.length; stringCount++) {
      const char = string[stringCount];
      if (char == "\n" || char == "\r") {
        row++;
        col = column;
        continue;
      }
      const index = this.bufferIndex.getIndexXY(col, row);
      if (this.styleCharEncode.isStyleChar(char)) {
        this.styleCharEncode.setChar(char);
        this.charDataEncode
          .setCharColor(this.styleCharEncode.getCharColor())
          .setBackgroundColor(this.styleCharEncode.getBackgroundColor())
          .setDim(this.styleCharEncode.isDim())
          .setBold(this.styleCharEncode.isBold())
          .setBlinking(this.styleCharEncode.isBlinking());

        continue;
      }

      this.charData[this.charTiles[index].index] = this.charDataEncode
        .setChar(ASCIIMapping.getCharCodeAt(char))
        .getData();

      col++;
    }
    this.charDataEncode.setData(0);
    return this;
  }
}
