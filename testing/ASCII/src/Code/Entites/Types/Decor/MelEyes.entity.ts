import { ConsoleColors, StyleObject } from "@divineretro/ascii/Renderer/ASCIIMapping";
import type { DivineStar } from "../../../DivineStar";
import { SceneTypes } from "../../../meta/Scene/Scene.types";
import { EntityInterface } from "../../Entity.interface";

declare const DS: DivineStar;

const brightCyan = StyleObject.New({ fg: ConsoleColors.Cyan, bright: true });
const dimCyan = StyleObject.New({ fg: ConsoleColors.Cyan, dim: true });

export class MelEyesEntity implements EntityInterface {
  tickInterval = 1;
  tickCount = 0;

  collumn = 0;
  currentEye = 0;
  eyeNum = 5;

  draw = true;

  eyeOne = "";
  eyeTwo = "";

  constructor(
    public data: any,
    public id: string,
    public type: string,
    public x: number,
    public y: number,
    public sceneType: SceneTypes
  ) {
    if (type == "bottom-bar" || type == "bottom-right-bar") {
      this.eyeOne = <string>DS.renderer.stylize("0", dimCyan);
      this.eyeTwo = <string>DS.renderer.stylize("0", brightCyan);

      this.y = this.y += SCREENHEIGHT + 1;
      if (type == "bottom-right-bar") {
        this.collumn = SCREENWIDTH + 3;
      }
    } else {
      this.collumn = SCREENWIDTH + 3;
      this.eyeOne = <string>DS.renderer.stylize("00", dimCyan);
      this.eyeTwo = <string>DS.renderer.stylize("00", brightCyan);
    }
  }

  $draw() {
    for (let i = 0; i < this.eyeNum; i++) {
      let show = this.eyeOne;
      if (i == this.currentEye) {
        show = this.eyeTwo;
      }
      DS.renderer.showAt(show, this.y + i,this.collumn + this.x,);
    }
  }

  _runTick() {
    if (this.currentEye > this.eyeNum - 1) {
      this.currentEye = 0;
    } else {
      this.currentEye++;
    }
  }

  $run() {
    if (this.tickCount == 0) {
      this._runTick();

      this.tickCount = this.tickInterval;
    } else {
      this.tickCount--;
    }
  }

  $destroy() {}
}
