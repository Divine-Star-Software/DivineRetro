import type { DivineStar } from "../../../DivineStar";
import { probability } from "../../../Helper/Helper";
import { SceneTypes } from "../../../meta/Scene/Scene.types";
import { direction } from "../../../meta/Util.types";
import { EntityInterface } from "../../Entity.interface";
declare const DS: DivineStar;

//Harmless passive creatures
export class RandomText implements EntityInterface {
  battleSceneRandomText: string[] = [
    "My power comes through the heat\nof 10,000 burning suns\nyet the crystalline fear challenges me. ",
    "Not since infinity split has something\nthis dense and dark has spawned\nin the multiverse. ",
    "I feel the fear forms pouring\nthrough the nexus\nThrough the eons they are slowing\nthe vibration of the entire universe.",
    "I shall conquer all fear with valiant light.",
    "My cosmic throne shall not be thwarted\n by these corruptions of consciousness.",
    "I shall send this being of fear\n back into the core of being.",
    `Forever and Now\nI am the mighty master of trillions.\nI weave time and space.
Yet these forms pose a threat\n to the whole balance of reality. `,
  ];

  drawText: string[] = [""];

  draw = true;

  constructor(
    public data: any,
    public id: string,
    public type: string,
    public x: number,
    public y: number,
    public sceneType: SceneTypes
  ) {
    if (data.fgColor) {
    }

    if (type == "BattleScene") {
      const randNum = (Math.random() * this.battleSceneRandomText.length) >>> 0;
      this.drawText = this.battleSceneRandomText[randNum].split("\n");
      this.y = (((SCREENHEIGHT - this.drawText.length) / 2) >>> 0) + 2;
    }
  }

  $draw() {
    if (!this.draw) return;

    let rowBuf = 0;
    for (const text of this.drawText) {
      let collumn = (((SCREENWIDTH - text.length) / 2) >>> 0) + 1;
      DS.renderer.showAt(text, this.y + rowBuf, collumn);
      rowBuf++;
    }
  }

  $run() {}

  $destroy() {}
}
