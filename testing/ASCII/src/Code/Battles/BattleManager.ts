import { DivineStar } from "../DivineStar";
import { EntityInterface } from "../Entites/Entity.interface";
import { BattleCursorEntity } from "../Entites/Types/Battles/BattleCursorEntity";
import type { FearFormEntity } from "../Entites/Types/FearForms/FearFormEntity";
import { cloneData } from "../Helper/Helper";
import { FearForm, FearFormBattleSet } from "../meta/FearmForms/FearForm.types";

export class BattleManager {
  battleActive: boolean = false;
  currentFearForms: Record<
    number,
    {
      alive: boolean;
      id: number;
      row: number;
      col: number;
      entity: FearFormEntity;
      data: FearForm;
    }
  > = {};
  battleCursor: BattleCursorEntity | undefined;

  formMap: Record<number, number[]> = [];

  currentBattleSet: FearFormBattleSet = {};

  constructor(public DS: DivineStar) {}

  _createBattleCursor() {
    this.battleCursor = <BattleCursorEntity>(
      this.DS.entityManager.createNewEntity(
        "battle",
        {},
        `BattleCursorEntity`,
        "",
        0,
        0
      )
    );
  }

  _reMapFormMap() {
    for (const row of Object.keys(this.formMap)) {
      const rowID = parseInt(row);
      for (const formId of this.formMap[rowID]) {
        const form = this.currentFearForms[formId];
        if (!form.alive) {
          const index = this.formMap[rowID].indexOf(form.id);
          this.formMap[rowID].splice(index, 1);
        }
      }
    }
    let numRows = 0;
    for (const row of Object.keys(this.formMap)) {
      const rowID = parseInt(row);
      if (this.formMap[rowID].length == 0) {
        delete this.formMap[rowID];
      } else {
        this.formMap[numRows] = this.formMap[rowID];
        numRows++;
      }
    }
  }

  async _placeAndInitFearForms() {
    let k = 0;
    let rowCount = 0;
    let currentRow = 3;
    let currentCollumn = 3;
    let tallest = 0;
    let rowSpacing = 1;
    let collumnSpacing = 2;
    this.formMap[0] = [];

    //   console.log(this.currentBattleSet);
    //  this.DS.dsCom.DIE;
    for (const fomrsCats of Object.keys(this.currentBattleSet)) {
      for (const forms of this.currentBattleSet[fomrsCats]) {
        for (let i = 0; i < forms.num; i++) {
          const newForm = <FearForm>(
            cloneData(this.DS.fearFormManager.getFearForm(fomrsCats, forms.id))
          );
          const entity = <FearFormEntity>(
            this.DS.entityManager.createNewEntity(
              "battle",
              newForm,
              `FearFormEntity`,
              "",
              currentCollumn,
              currentRow
            )
          );
          this.currentFearForms[k] = {
            alive: true,
            id: k,
            row: currentRow,
            col: currentCollumn,
            data: newForm,
            entity: entity,
          };
          this.formMap[rowCount].push(k);

          if (newForm.boundingBox.height > tallest) {
            tallest = newForm.boundingBox.height;
          }

          currentCollumn += newForm.boundingBox.width;

          if (
            currentCollumn + collumnSpacing >
            SCREENWIDTH - newForm.boundingBox.width
          ) {
            currentRow += tallest + rowSpacing;
            tallest = 0;
            currentCollumn = 3;
            rowCount++;
            this.formMap[rowCount] ? true : (this.formMap[rowCount] = []);
          } else {
            currentCollumn += collumnSpacing;
          }

          k++;
        }
      }
    }
  }

  async enterBattle(battleSet: FearFormBattleSet) {
    this.battleActive = true;
    this.DS.player.active = false;
    if (SOUNDENABLED) {
       this.DS.audioManager.playSong("battle-music-1", true);
       await this.DS.renderer.asyncSleep(100);
    }

    this.currentBattleSet = battleSet;
    this.DS.battleDrawer.active = false;

    if (this.DS.menuSceneManager.rightMenuDrawer.active) {
      this.DS.menuSceneManager.rightMenuDrawer.popIn();
    }

    await this.DS.screenTranistions.doScreenWipe("wipe-2");
    this.DS.engine.activeSceneTypes = "battle";
    this.DS.battleSceneManager.setActiveSceneMeta("transitions");
    this.DS.battleSceneManager.setActiveScene(
      "transitions",
      "transition-frame"
    );

    setTimeout(async () => {
      this.DS.menuSceneManager.setActiveSceneMeta("right-battle-menu");
      this.DS.menuSceneManager.rightMenuDrawer.setActiveMenuScene(
        "right-battle-menu",
        "bump"
      );
      await Promise.all([
        this.DS.screenTranistions.doScreenTransition(
          "battle",
          this.DS.battleSceneManager.activeScene,
          this.DS.battleSceneManager.getScene("title-card"),
          "up"
        ),
        this.DS.menuSceneManager.rightMenuDrawer.popOut(),
        this.DS.screenTranistions.doScreenTransition(
          "bottom-menu",
          this.DS.menuSceneManager.bottomMenuDrawer.activeScene,
          this.DS.menuSceneManager
            .setActiveSceneMeta("bottom-menu")
            .getScene("2"),
          "up"
        ),
      ]);

      this.DS.menuSceneManager.rightMenuDrawer.setActiveMenuScene(
        "right-battle-menu",
        "bump"
      );
      //   this.DS.menuSceneManager.setActiveScene("right-battle-menu","bump");
      setTimeout(async () => {
        this.DS.battleSceneManager.setActiveSceneMeta("over-world-1");

        await await Promise.all([
          this.DS.screenTranistions.doScreenTransition(
            "battle",
            this.DS.battleSceneManager.activeScene,
            this.DS.battleSceneManager.getScene("1"),
            "down"
          ),
          this.DS.screenTranistions.doScreenTransition(
            "right-menu",
            this.DS.menuSceneManager.rightMenuDrawer.activeScene,
            this.DS.menuSceneManager.getScene("1"),
            "up"
          ),
          this.DS.menuSceneManager.bottomRightMenuDrawer.popDown(),
        ]);
        this.DS.screenTranistions.doScreenTransition(
          "bottom-right-menu",
          this.DS.menuSceneManager.bottomRightMenuDrawer.activeScene,
          this.DS.menuSceneManager
            .setActiveSceneMeta("bottom-right-menu")
            .getScene("2"),
          "up"
        );
        await this._placeAndInitFearForms();
        this._createBattleCursor();
        //    this.DS.menuSceneManager.rightMenuDrawer.setActiveMenuScene("right-battle-menu","1");
        this.DS.player.active = true;
        this.DS.player.canControl = false;
        this.DS.battleDrawer.active = true;
      }, 3500);
    }, 1000);
  }
}
