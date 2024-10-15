import { ConsoleColors, StyleObject } from "@divineretro/ascii/Renderer/ASCIIMapping";
import type { DivineStar } from "../../../DivineStar";
import type { EntityInterface } from "../../../Entites/Entity.interface";
import { SceneTypes } from "../../../meta/Scene/Scene.types";

type MenuOptions = {
  id: string;
  row: number;
  col: number;
  text: string;
  //This will be auto made with the defined active style
  activeText: string[];
  selectedText: string[];
  processedText: string[];
  trueLength: number;
  active: boolean;
};
type MenuScreens = Record<string, Record<string, MenuOptions>>;
declare const DS: DivineStar;

export class RightBattleMenu implements EntityInterface {
  tickInterval = 1;
  tickCount = 0;

  animateDown = false;
  currentAnimateDownOptionCount = 0;
  currentAnimateDownOptionMax: number;
  animateIn = true;
  currentAnimRow = RIGHTMENUHEIGHT - 3;
  active = true;
  draw = true;
  collumn = SCREENWIDTH + 3;
  canMove = true;

  menuTop = "┌──────────────────────────┐";
  menuBottom = "└──────────────────────────┘";
  messageCap = "┣──────────────────────────┫";
  barLength = this.messageCap.length;
  currentRow = 2;

  boxStyle = StyleObject.New({
    bg: ConsoleColors.Blue,
    fg: ConsoleColors.Black,
    dim: true,
  });
  style = StyleObject.New({ fg: ConsoleColors.Blue });
  activeStyle = StyleObject.New({
    fg: ConsoleColors.Black,
    bg: ConsoleColors.Blue,
    dim: true,
  });
  selectedStyle = StyleObject.New({
    fg: ConsoleColors.Black,
    bg: ConsoleColors.Blue,
    bright: true,
  });

  activeScreen = "root";
  activeOptionNum = 0;
  selectedOptionNum = -1;
  menus: MenuScreens = {
    root: {
      attack: {
        id: "attack",
        row: 3,
        col: this.collumn,
        text: "Use Force",
        processedText: [""],
        selectedText: [""],
        activeText: [""],
        trueLength: 0,
        active: false,
      },
      spells: {
        id: "spells",
        row: 5,
        col: this.collumn,
        text: "Cast Spell",
        processedText: [""],
        selectedText: [""],
        activeText: [""],
        trueLength: 0,
        active: false,
      },
      items: {
        id: "items",
        row: 7,
        col: this.collumn,
        text: "Use Item",
        processedText: [""],
        selectedText: [""],
        activeText: [""],
        trueLength: 0,
        active: false,
      },
      flee: {
        id: "flee",
        row: 9,
        col: this.collumn,
        text: "Try To Flee",
        processedText: [""],
        selectedText: [""],
        activeText: [""],
        trueLength: 0,
        active: false,
      },
      equip: {
        id: "equip",
        row: 11,
        col: this.collumn,
        text: "Equip",
        processedText: [""],
        selectedText: [""],
        activeText: [""],
        trueLength: 0,
        active: false,
      },
      fearForm: {
        id: "fearForm",
        row: 13,
        col: this.collumn,
        text: "View Fear Form Info",
        processedText: [""],
        selectedText: [""],
        activeText: [""],
        trueLength: 0,
        active: false,
      },
      options: {
        id: "options",
        row: 15,
        col: this.collumn,
        text: "Options",
        processedText: [""],
        selectedText: [""],
        activeText: [""],
        trueLength: 0,
        active: false,
      },
    },
  };
  optionMap: Record<string, Record<number, string>> = {};

  constructor(
    public data: any,
    public id: string,
    public type: string,
    public x: number,
    public y: number,
    public sceneType: SceneTypes = "right-menu"
  ) {
    this._styleText();
    this._buildOptionMap();
    this.currentAnimateDownOptionMax = Object.keys(this.menus["root"]).length;
    this._setUpControls();
  }

  _buildOptionMap() {
    for (const optionScreenKey of Object.keys(this.menus)) {
      this.optionMap[optionScreenKey] = {};
      let count = 0;
      for (const optionKey of Object.keys(this.menus[optionScreenKey])) {
        this.optionMap[optionScreenKey][count] =
          this.menus[optionScreenKey][optionKey].id;
        count++;
      }
    }
  }

  _setUpControls() {
    const self = this;
    DS.menuSceneManager.addKeyControl("right-menu", "up", async () => {
      if (!this.canMove) return;
      DS.audioManager.playSFX("blip-1");
      if (this.activeOptionNum != 0) {
        this.activeOptionNum--;
      } else {
        this.activeOptionNum =
          Object.keys(this.optionMap[this.activeScreen]).length - 1;
      }
    });
    DS.menuSceneManager.addKeyControl("right-menu", "down", async () => {
      if (!this.canMove) return;
      DS.audioManager.playSFX("blip-1");
      if (
        this.activeOptionNum !=
        Object.keys(this.optionMap[this.activeScreen]).length - 1
      ) {
        this.activeOptionNum++;
      } else {
        this.activeOptionNum = 0;
      }
    });
    DS.menuSceneManager.addCharControl("right-menu", "z", () => {
      if (!this.canMove) return;
      DS.audioManager.playSFX("select");
      this._doOption();
    });
    DS.menuSceneManager.addCharControl("right-menu", "x", () => {
      if (!this.canMove) return;
      DS.audioManager.playSFX("cancel");
    });
  }

  _doOption() {
    const id = this.optionMap[this.activeScreen][this.activeOptionNum];
    if (id == "attack") {
      this._doAttack();
    }
    if (id == "spells") {
      this._doCastSpell();
    }
    if (id == "items") {
      this._doUseItem();
    }
  }

  _doAttack() {
    this.canMove = false;
    this.selectedOptionNum = 0;
    if (DS.battleManager.battleCursor) {
      DS.battleManager.battleCursor.active = true;
    }
  }
  _doCastSpell() {}
  _doUseItem() {}

  _getMenuBoxItem(
    text: string,
    styleObj: StyleObject,
    trueLength: number
  ): string[] {
    let dataReturn: string[] = [];
    dataReturn.push(this.messageCap);
    let stringStart = `│ ${text}`;
    if (stringStart.length == trueLength - 1) {
      stringStart += "│";
    } else {
      let temp = this.barLength - trueLength - 3;
      while (temp--) {
        stringStart += " ";
      }

      stringStart += "│";
    }
    stringStart = DS.renderer.stylize(stringStart, styleObj);
    dataReturn.push(stringStart);
    dataReturn.push(this.messageCap);
    return dataReturn;
  }

  _styleText() {
    this.messageCap = DS.renderer.stylize(this.messageCap, this.style);
    this.menuTop = DS.renderer.stylize(this.menuTop, this.boxStyle);
    this.menuBottom = DS.renderer.stylize(this.menuBottom, this.boxStyle);
    for (const menuScreeKey of Object.keys(this.menus)) {
      for (const menuOptionKey of Object.keys(this.menus[menuScreeKey])) {
        const option = this.menus[menuScreeKey][menuOptionKey];
        option.trueLength = option.text.length;
        option.activeText = this._getMenuBoxItem(
          option.text,
          this.activeStyle,
          option.trueLength
        );
        option.selectedText = this._getMenuBoxItem(
          option.text,
          this.selectedStyle,
          option.trueLength
        );
        option.processedText = this._getMenuBoxItem(
          option.text,
          this.style,
          option.trueLength
        );
      }
    }
  }

  _runAnimateIn() {
    if (this.currentAnimRow > 2) {
      this.currentAnimRow -= 2;
    } else {
      this.animateIn = false;
      this.animateDown = true;
    }
  }

  _animaateIn() {
    DS.renderer.showAt(this.menuTop, this.currentAnimRow, this.collumn);
    DS.renderer.showAt(this.menuBottom, this.currentAnimRow + 1, this.collumn);
  }

  _runAnimateDown() {
    if (this.currentAnimateDownOptionCount < this.currentAnimateDownOptionMax) {
      this.currentAnimateDownOptionCount++;
    } else {
      this.animateDown = false;
    }
  }

  _animateDown() {
    let count = 0;
    let lastRow = 0;
    DS.renderer.showAt(this.menuTop, this.currentRow, this.collumn);
    for (const menuOptionKey of Object.keys(this.menus["root"])) {
      const option = this.menus["root"][menuOptionKey];
      let show: string[] = option.processedText;
      if (option.active) {
        show = option.activeText;
      }
      let k = 0;
      for (const strings of show) {
        DS.renderer.showAt(strings, option.row + k, option.col);
        k++;
      }
      lastRow = option.row;
      count++;
      if (count >= this.currentAnimateDownOptionCount) break;
    }
    DS.renderer.showAt(this.menuBottom, lastRow + 3, this.collumn);
  }

  $draw() {
    if (!this.draw || !this.active) return;
    if (this.animateIn) {
      this._animaateIn();
      return;
    }
    if (this.animateDown) {
      this._animateDown();
      return;
    }

    for (const menuScreeKey of Object.keys(this.menus)) {
      let lastRow = 0;
      DS.renderer.showAt(this.menuTop, this.currentRow, this.collumn);
      let optionCount = 0;
      for (const menuOptionKey of Object.keys(this.menus[menuScreeKey])) {
        const option = this.menus[menuScreeKey][menuOptionKey];
        let show: string[] = option.processedText;
        if (
          this.optionMap[this.activeScreen][this.activeOptionNum] == option.id
        ) {
          show = option.activeText;
        }
        if (
          this.optionMap[this.activeScreen][this.selectedOptionNum] == option.id
        ) {
          show = option.selectedText;
        }
        let k = 0;
        for (const strings of show) {
          DS.renderer.showAt(strings, option.row + k, option.col);
          k++;
        }
        optionCount++;
        lastRow = option.row;
      }
      DS.renderer.showAt(this.menuBottom, lastRow + 3, this.collumn);
    }
  }

  $run() {
    if (!this.active) return;

    if (this.tickCount == 0) {
      if (this.animateIn) {
        this._runAnimateIn();
      }
      if (this.animateDown) {
        this.tickInterval = 2;
        this._runAnimateDown();
      }
      this.tickCount = this.tickInterval;
    }
    {
      this.tickCount--;
    }
  }

  $destroy() {}
}
