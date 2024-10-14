import { Flat2DIndex, Vec2Array } from "@amodx/math";
import { AnimatedTileData } from "./Texture.types";

export class TextureAnimation {

  animatedFrameOffset: Vec2Array = [0, 0];
  framesBounds: Flat2DIndex;

  private _frameIndex = 0;
  private _frameTimer = 0;

  constructor(public data: AnimatedTileData) {
    console.warn(data);
    const size: Vec2Array = [
      Math.floor(
        (data.framesRange[1][0] - data.framesRange[0][0]) / data.frameSize[0]
      )||1,
      Math.floor(
        (data.framesRange[1][1] - data.framesRange[0][1]) / data.frameSize[1]
      )||1,
    ];


    this.framesBounds = Flat2DIndex.GetXYOrder();
    this.framesBounds.setBounds(...size);


  }

  update(deltaTime: number) {
    this._frameTimer += deltaTime;

    while (this._frameTimer >= this.data.frameLength[this._frameIndex]) {
      this._frameTimer -= this.data.frameLength[this._frameIndex];

      this._frameIndex++;

      if (this._frameIndex >= this.data.frameOrder.length) {
        this._frameIndex = 0;
      }

      const frame = this.data.frameOrder[this._frameIndex];
      const position = this.framesBounds.getXY(frame);

      this.animatedFrameOffset[0] = position[0] * this.data.frameSize[0] ;
      this.animatedFrameOffset[1] = position[1] * this.data.frameSize[1] ;
    }
  }
}
