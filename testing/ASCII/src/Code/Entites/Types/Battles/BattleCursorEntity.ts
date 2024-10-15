import type { DivineStar } from "../../../DivineStar";
import { SceneTypes } from "../../../meta/Scene/Scene.types";
import { EntityInterface } from "../../Entity.interface";
import {
  ConsoleColors,
  StyleObject,
} from "@divineretro/ascii/Renderer/ASCIIMapping";
declare const DS: DivineStar;

//Harmless passive creatures
export class BattleCursorEntity implements EntityInterface {
  drawText = "[";
  active = false;
  draw = true;
  width = 0;
  height = 0;

  barStyle = StyleObject.New({ dim: true, fg: ConsoleColors.Cyan });

  barTopLeft = "┌";
  barTopRight = "┐";
  barBottomRight = "┘";
  barBottomLeft = "└";
  barMiddle = "│";

  selectedEntityID: number = 0;

  currentRow = 0;
  currentCollumn = 0;

  constructor(
    public data: any,
    public id: string,
    public type: string,
    public x: number,
    public y: number,
    public sceneType: SceneTypes
  ) {
    this._setUpControls();
    this._stylize();
  }

  setCursorOn(row: number, id: number) {
    const form =
      DS.battleManager.currentFearForms[DS.battleManager.formMap[row][id]];
    this.x = form.col - 2;
    this.y = form.row;
    this.width = form.data.boundingBox.width + 2;
    this.height = form.data.boundingBox.height + 2;
    this.selectedEntityID = form.id;
    return true;
  }

  _stylize() {
    this.barTopLeft = DS.renderer.stylize(this.barTopLeft, this.barStyle);
    this.barTopRight = DS.renderer.stylize(this.barTopRight, this.barStyle);
    this.barBottomRight = DS.renderer.stylize(
      this.barBottomRight,
      this.barStyle
    );
    this.barBottomLeft = DS.renderer.stylize(this.barBottomLeft, this.barStyle);
    this.barMiddle = DS.renderer.stylize(this.barMiddle, this.barStyle);
  }

  _setUpControls() {
    const self = this;
    DS.menuSceneManager.addKeyControl("battle-cursor", "up", () => {
      if (!self.active) return;
      if (this.currentRow - 1 == -1) {
        this.currentRow = Object.keys(DS.battleManager.formMap).length - 1;
      } else if (
        DS.battleManager.formMap[self.currentRow - 1][self.currentCollumn]
      ) {
        this.currentRow--;
      }
      self.setCursorOn(self.currentRow, self.currentCollumn);
    });
    DS.menuSceneManager.addKeyControl("battle-cursor", "down", () => {
      if (!self.active) return;
      if (this.currentRow >= Object.keys(DS.battleManager.formMap).length - 1) {
        this.currentRow = 0;
      } else if (
        DS.battleManager.formMap[self.currentRow + 1][self.currentCollumn]
      ) {
        this.currentRow++;
      }
      self.setCursorOn(self.currentRow, self.currentCollumn);
    });
    DS.menuSceneManager.addKeyControl("battle-cursor", "left", () => {
      if (!self.active) return;
      if (this.currentCollumn - 1 == -1) {
        if (DS.battleManager.formMap[self.currentRow + 1]) {
          this.currentRow++;
          this.currentCollumn =
            DS.battleManager.formMap[self.currentRow].length;
        } else if (
          this.currentRow >=
          Object.keys(DS.battleManager.formMap).length - 1
        ) {
          this.currentRow = 0;
          this.currentCollumn =
            DS.battleManager.formMap[self.currentRow].length;
        }
      }
      if (this.currentCollumn == 1) {
        this.currentCollumn = 0;
      }

      if (DS.battleManager.formMap[self.currentRow][self.currentCollumn - 1]) {
        this.currentCollumn--;
      }
      self.setCursorOn(self.currentRow, self.currentCollumn);
    });
    DS.menuSceneManager.addKeyControl("battle-cursor", "right", () => {
      if (!self.active) return;
      if (
        this.currentCollumn ==
        DS.battleManager.formMap[self.currentRow].length - 1
      ) {
        if (DS.battleManager.formMap[self.currentRow + 1]) {
          this.currentRow++;
          this.currentCollumn = 0;
        } else if (
          this.currentRow >=
          Object.keys(DS.battleManager.formMap).length - 1
        ) {
          this.currentRow = 0;
          this.currentCollumn = 0;
        }
      } else if (
        DS.battleManager.formMap[self.currentRow][self.currentCollumn + 1]
      ) {
        this.currentCollumn++;
      }
      self.setCursorOn(self.currentRow, self.currentCollumn);
    });
    DS.menuSceneManager.addCharControl("battle-cursor", "z", () => {
      if (!self.active) return;
      DS.renderer.showAt(String(this.selectedEntityID), 5, 80);
    });
    DS.menuSceneManager.addCharControl("battle-cursor", "x", () => {
      if (!self.active) return;
    });
  }

  $draw() {
    if (!this.active || !this.draw) return;

    for (let i = this.y - 1; i < this.y - 1 + this.height; i++) {
      if (i == this.y - 1) {
        DS.renderer.showAt(this.barTopLeft, i, this.x);
        DS.renderer.showAt(this.barTopRight, i, this.x + this.width);
        continue;
      }
      if (i == this.y - 1 + this.height - 1) {
        DS.renderer.showAt(this.barBottomLeft, i, this.x);
        DS.renderer.showAt(this.barBottomRight, i, this.x + this.width);
        continue;
      }

      DS.renderer.showAt(this.barMiddle, i, this.x);
      DS.renderer.showAt(this.barMiddle, i, this.x + this.width);
    }
  }

  $run() {}

  $destroy() {}
}
