import { ConsoleColors } from "@divineretro/ascii/Renderer/ASCIIMapping";
import { ASCIIRender } from "@divineretro/ascii/Renderer/ASCIIRenderer";
import type { DivineStar } from "../DivineStar";
import { direction } from "../meta/Util.types";

type crystals = "red" | "blue" | "green" | "yellow" | "magenta" | "cyan";

type PlayerData = {
  crystals: Record<crystals, boolean>;
};

export class Player {
  playerData: PlayerData = {
    crystals: {
      red: false,
      blue: false,
      green: false,
      yellow: false,
      magenta: false,
      cyan: false,
    },
  };
  x = 23;
  y = 14;
  gravity = false;
  inAir = false;
  upKey = "\u001B\u005B\u0041";
  leftKey = "\u001B\u005B\u0044";
  rightKey = "\u001B\u005B\u0043";
  downKey = "\u001B\u005B\u0042";
  going = "down";
  doneJumping = true;
  active = true;
  canControl = true;
  pt = " / \\ ";
  pm = "<{0}>";
  pb = " \\ / ";

  walls = ["|", "*", "_", "-", "(", ")", "=", "█"];
  check = false;

  constructor(public renderer: ASCIIRender, public DS: DivineStar) {
    this.setUpControls();
    this.pt = renderer.stylize(" /|\\ ", {
      fg: ConsoleColors.Purple,
      dim: true,
    });
    const blink = renderer.stylize("0", {
      blinking: true,
      fg: ConsoleColors.Cyan,
    });
    const pm1 = renderer.stylize(`<{`, {
      fg: ConsoleColors.Purple,
      bright: true,
    });
    const pm2 = renderer.stylize(`}>`, {
      fg: ConsoleColors.Purple,
      bright: true,
    });
    this.pm = `${pm1}${blink}${pm2}`;
    this.pb = renderer.stylize(" \\|/", {
      fg: ConsoleColors.Purple,
      dim: true,
    });
  }

  setUpControls(gravity = false) {
    this.DS.controlManager.onInput("a", ()=>this._goLeft());
    this.DS.controlManager.onInput("d", ()=>this._goRight());
    this.DS.controlManager.onInput("w", ()=>this._goUp());
    this.DS.controlManager.onInput("s", ()=>this._goDown());
  }

  async _goLeft() {
    if (!this.canControl || !this.active) return;
    //left
    if (this.x == 1) {
      if (await this.DS.engine.checkWorld("left", this.x, this.y)) {
        this.x = SCREENWIDTH - 4;
      }
    } else {
      if (!this._collisionCheck("left")) {
        if (!this.gravity) {
          this.x--;
          return;
        }
      }
    }
  }

  async _goRight() {
    if (!this.canControl || !this.active) return;
    //right
    if (this.x >= SCREENWIDTH - 4) {
      if (await this.DS.engine.checkWorld("right", this.x, this.y)) {
        this.x = 1;
      }
    } else {
      if (!this._collisionCheck("right")) {
        if (!this.gravity) {
          this.x++;
          return;
        }
      }
    }
  }

  async _goUp() {
    if (!this.canControl || !this.active) return;
    if (this.y == 1) {
      if (await this.DS.engine.checkWorld("up", this.x, this.y)) {
        this.y = 15;
      }
    } else {
      if (!this._collisionCheck("up") && !this.inAir && this.doneJumping) {
        if (!this.gravity) {
          this.y--;
          return;
        }
      }
    }
  }

  async _goDown() {
    if (!this.canControl || !this.active) return;
    //down
    if (this.y >= SCREENHEIGHT - 2) {
      if (await this.DS.engine.checkWorld("down", this.x, this.y)) {
        this.y = 1;
      }
    } else {
      if (!this._collisionCheck("down")) {
        if (!this.gravity) {
          this.y++;
          return;
        }
      }
    }
  }

  playerGetCrystal(crystal: crystals) {
    this.playerData.crystals[crystal] = true;
    const anims =
      this.DS.levelManager.scenes["overworld"].scene["cyrstal-alter"]
        .animations[crystal];

    let color: ConsoleColors = ConsoleColors.Blue;
    switch (crystal) {
      case "blue":
        color = ConsoleColors.Blue;
        break;
      case "red":
        color = ConsoleColors.Red;
        break;
      case "yellow":
        color = ConsoleColors.Yellow;
        break;
      case "green":
        color = ConsoleColors.Green;
        break;
      case "cyan":
        color = ConsoleColors.Cyan;
        break;
      case "magenta":
        color = ConsoleColors.Purple;
        break;
    }

    for (const anim of anims) {
      anim.style.fg = color;
    }
    anims[0].style.dim = true;
    anims[0].style.bright = false;
    anims[1].style.bright = true;
    anims[2].style.dim = true;
    anims[2].style.bright = false;
  }

  _collisionCheck(going: "up" | "down" | "left" | "right") {
    let hitWall = false;
    let data: string[] = [];
    switch (going) {
      case "up":
        data = this.DS.engine.readWorldDataSection(
          this.y - 2,
          this.y - 2,
          this.x - 1,
          this.x + 4
        );

        break;
      case "down":
        data = this.DS.engine.readWorldDataSection(
          this.y + 2,
          this.y + 2,
          this.x - 1,
          this.x + 4
        );

        break;
      case "right":
        data = this.DS.engine.readWorldDataSection(
          this.y - 1,
          this.y + 2,
          this.x + 4,
          this.x + 4
        );

        break;
      case "left":
        data = this.DS.engine.readWorldDataSection(
          this.y - 1,
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
        if (this.walls.indexOf(chars) > -1) {
          hitWall = true;
          //  this.dsLog.ERROR.showAt("HIT WALL", { row: 4, col: 55 }).CLEAR;
          continue;
        }
      }
    }

    //  this.dsCom.INFO.showAt(data, { row: 3, col: 55 }).CLEAR;

    return hitWall;
  }

  $draw() {
    if (!this.active) return;
    const pos = this.DS.engine.getRelativePosition(this.x, this.y);
    /*     this.dsCom.ERROR.showAt(`${this.x} ${this.y} ${this.going}`, {
      row: 4,
      col: 55,
    }).CLEAR;
 */
    /*     this.renderer.showAt(this.pt, { row: pos.y + 1, col: pos.x });
    this.renderer.rdl.cursorTo(process.stdout, pos.x, pos.y + 2);
    process.stdout.write(this.pm);
    this.renderer.rdl.cursorTo(process.stdout, pos.x, pos.y + 3);
    process.stdout.write(this.pb);
 */
    this.renderer.showAt(this.pt, pos.y + 1, pos.x);
    this.renderer.showAt(this.pm, pos.y + 2, pos.x);
    this.renderer.showAt(this.pb, pos.y + 3, pos.x);
  }
}
