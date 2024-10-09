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
    this.bufferIndex.setBounds(this.rows, this.cols);

    const maxTiles = this.rows * this.cols;
    entityTool.setInstanceAmount(maxTiles);

    this.charData = new Uint32Array(maxTiles);

    entityTool.addBuffer("faceData", this.charData as any, 1);

    const pixelSize = 0.001;
    const meterSize = [8 * pixelSize, 16 * pixelSize];

    const startX = -meterSize[0] * cols;
    const startZ = -meterSize[1];
    for (let col = 0; col < cols; col++) {
      for (let row = 0; row < rows; row++) {
        const index = this.bufferIndex.getIndexXY(row, col);
        const entity = entityTool.getInstance()!;
        if (!entity) break;
        this.charTiles[index] = entity;
        entity.position.x = startX + col * meterSize[0];
        entity.position.y = 0;
        entity.position.z = startZ - row * meterSize[1];
        entity.scale.setAll(1);
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
      const index = this.bufferIndex.getIndexXY(row, col);
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
      /*     if (this.charDataEncode.isBold()) {
        t.setData(   this.charDataEncode
          .setChar(ASCIIMapping.getCharCodeAt(char))
          .getData())
        console.log(
          char,
      //   this.styleCharEncode.isDim(),
      //    this.styleCharEncode.isBold(),
          this.charDataEncode.isDim(),
          this.charDataEncode.isBold(),
t.isBold()
        );
      } */
      /*   t.setData(this.charDataEncode.getData());
        if(t.isBold()) {
          console.log(t.getData())
        } */
      this.charData[index] = this.charDataEncode
        .setChar(ASCIIMapping.getCharCodeAt(char))
        .getData();

      col++;
    }
    this.charDataEncode.setData(0);
    return this;
  }

  setCharAt(charCode: number, row: number, column: number) {
    const index = this.bufferIndex.getIndexXY(row, column);
    this.charData[index] = this.charDataEncode
      .setData(this.charData[index])
      .setChar(charCode)
      .getData();
  }
}
