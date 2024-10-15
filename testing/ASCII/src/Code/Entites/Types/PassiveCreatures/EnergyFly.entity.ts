import {
  ConsoleColors,
  StyleObject,
} from "@divineretro/ascii/Renderer/ASCIIMapping";
import type { DivineStar } from "../../../DivineStar";
import { probability } from "../../../Helper/Helper";
import { SceneTypes } from "../../../meta/Scene/Scene.types";
import { direction } from "../../../meta/Util.types";
import { EntityInterface } from "../../Entity.interface";
declare const DS: DivineStar;

//Harmless passive creatures
export class EnergyFlyEntity implements EntityInterface {
  tickInterval = 20;
  tickCount = 0;
  walls = ["|", "*", "_", "-", "(", ")", "=", "█"];
  entityWidth = 2;
  entityHeight = 2;

  fgColor: ConsoleColors.Cyan;
  animtionInterval = 10;
  animtationCount = 0;
  keyFrames: {
    interval: number;
    text: string;
    styleObj: Partial<StyleObject>;
  }[] = [];

  currentFrame = 0;
  maxFames = 0;

  draw = true;
  active = true;

  constructor(
    public data: any,
    public id: string,
    public type: string,
    public x: number,
    public y: number,
    public sceneType: SceneTypes
  ) {
    if (data.fgColor) {
      this.fgColor = data.fgColor;
    }

    this._setUpKeyFrames();
  }

  _setUpKeyFrames() {
    this.keyFrames = [
      {
        text: "<O>",
        styleObj: { fg: this.fgColor, dim: true },
        interval: 2,
      },
      {
        text: "<0>",
        styleObj: { fg: this.fgColor, dim: true },
        interval: 1,
      },
      {
        text: "<<>>",
        styleObj: { fg: this.fgColor, bright: true },
        interval: 6,
      },
      {
        text: "<0>",
        styleObj: { fg: this.fgColor, dim: true },
        interval: 1,
      },
      {
        text: "<O>",
        styleObj: { fg: this.fgColor, dim: true },
        interval: 2,
      },
    ];

    this.maxFames = this.keyFrames.length;
  }

  _getProbality(going: direction, value: number) {
    if (going == "left" && value > 0) {
      return 0.8;
    } else if (going == "left") {
      return 0.3;
    }

    if (going == "right" && value < 0) {
      return 0.8;
    } else if (going == "right") {
      return 0.3;
    }

    if (going == "up" && value > 0) {
      return 0.8;
    } else if (going == "up") {
      return 0.3;
    }

    if (going == "down" && value <= 0) {
      return 0.8;
    } else if (going == "down") {
      return 0.3;
    }
    return 0.3;
  }

  _playerCollide() {}

  $run() {
    if (!this.active) return;
    const xDif = this.x - DS.player.x;
    const yDif = this.y - DS.player.y;

    if (!xDif || !yDif) {
      this._playerCollide();
    }

    if (this.tickCount == 0) {
      if (probability(0.2)) {
        //do nothing
      } else {
        if (probability(this._getProbality("right", xDif))) {
          if (!this._collisionCheck("right") && this.x + 3 < SCREENWIDTH) {
            this.x++;
            return;
          }
        }
        if (probability(this._getProbality("left", xDif))) {
          if (!this._collisionCheck("left") && this.x != 1) {
            this.x--;
            return;
          }
        }
        if (probability(this._getProbality("up", yDif))) {
          if (!this._collisionCheck("up") && this.y > 2) {
            this.y--;
            return;
          }
        }
        if (probability(this._getProbality("down", yDif))) {
          if (this.y - 1 < SCREENHEIGHT) {
            if (!this._collisionCheck("down")) {
              this.y++;
              return;
            }
          }
        }
      }
    } else {
      this.tickCount--;
    }
  }

  _collisionCheck(going: "up" | "down" | "left" | "right") {
    let hitWall = false;
    let data: string[] = [];
    switch (going) {
      case "up":
        if (this.y == 2) return true;
        data = DS.engine.readWorldDataSection(
          this.y - 3,
          this.y - 3,
          this.x - 1,
          this.x + 1
        );

        break;
      case "down":
        data = DS.engine.readWorldDataSection(
          this.y - 1,
          this.y - 1,
          this.x - 1,
          this.x + 1
        );

        break;
      case "right":
        data = DS.engine.readWorldDataSection(
          this.y - 2,
          this.y + 1,
          this.x + 3,
          this.x + 3
        );

        break;
      case "left":
        data = DS.engine.readWorldDataSection(
          this.y - 2,
          this.y + 2,
          this.x - 2,
          this.x - 2
        );

        break;

      default:
        break;
    }

    for (const strings of data) {
      for (const chars of strings) {
        //   DS.dsCom.INFO.showAt(`${going} ${chars}`, { row: 0, col: 80 }).CLEAR;
        if (this.walls.indexOf(chars) > -1) {
          hitWall = true;
          //   DS.dsCom.ERROR.showAt("HIT WALL", { row: 4, col: 55 }).CLEAR;
          continue;
        }
      }
    }

    return hitWall;
  }

  $draw() {
    if (!this.draw) return;
    const frame = this.keyFrames[this.currentFrame];

    const text = DS.renderer.stylize(frame.text, frame.styleObj);
    DS.renderer.showAt(text, this.y, this.x);

    if (this.animtationCount == 0) {
      if (this.currentFrame < this.maxFames - 1) {
        this.currentFrame++;
      } else {
        this.currentFrame = 0;
      }
      const newFrame = this.keyFrames[this.currentFrame];
      this.animtationCount = newFrame.interval;
    } else {
      this.animtationCount--;
    }
  }

  $destroy() {}
}
