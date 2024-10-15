import type { DivineStar } from "../../../DivineStar";
import { probability } from "../../../Helper/Helper";
import { FearForm } from "../../../meta/FearmForms/FearForm.types";
import { SceneTypes } from "../../../meta/Scene/Scene.types";
import { direction } from "../../../meta/Util.types";
import { EntityInterface } from "../../Entity.interface";
declare const DS: DivineStar;

//Harmless passive creatures
export class FearFormEntity implements EntityInterface {
  drawText = "";
  active = true;
  draw = true;

  constructor(
    public data: FearForm,
    public id: string,
    public type: string,
    public x: number,
    public y: number,
    public sceneType: SceneTypes
  ) {
    this.drawText = data.animations[data.activeAnimation][0].animText;

    DS.animationHelper.preprocessStyleKeyFrames(data.animations);
  }

  $draw() {
    if (!this.active || !this.draw) return;

    DS.renderer.showAt(this.drawText, this.y, this.x);
  }

  $run() {}

  $destroy() {}
}
