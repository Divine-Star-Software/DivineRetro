import { ConsoleColors, StyleObject } from "@divineretro/ascii/Renderer/ASCIIMapping";
import type { DivineStar } from "../DivineStar";
import {
  BattleScene,
  LevelScene,
  SceneInterface,
  SceneTypes,
} from "../meta/Scene/Scene.types";
import { direction } from "../meta/Util.types";
type ScreenTransitionTypes = "wipe-1" | "wipe-2";

const red = StyleObject.New({ fg: ConsoleColors.Red });

const dimRed = StyleObject.New({ fg: ConsoleColors.Red, dim: true });

export class ScreenTransitions {
  constructor(public DS: DivineStar) {}

  async doScreenTransition(
    type: SceneTypes,
    scene1: SceneInterface,
    scene2: SceneInterface,
    direction: direction
  ) {
    this.DS.entityManager.deleteAllEntitiesOnScene(type);
    if (type == "battle") {
      this.DS.entityManager.deleteAllEntitiesOnScene("level");
    }
    if (type == "level" || type == "battle") {
      this.DS.engine.sceneTransitiong = true;
      this.DS.player.active = false;
    }

    const scene1Data = <string[]>scene1.screenStates["1"];
    const scene2Data = <string[]>scene2.screenStates["1"];
    const newScene = this._sealSceneForTransition(
      direction,
      scene1Data,
      scene2Data
    );

    if (type == "level" || type == "battle") {
      if (scene2.rawText["1"].styleMap != "-1") {
        StyleObject.Copy(
          this.DS.engine._activeStyleObject,
          scene2.styleMap[scene2.rawText["1"].styleMap]
        );
      } else {
        StyleObject.Clear(this.DS.engine._activeStyleObject);
      }

      /*   this.DS.renderer.defineMessageStyle(
        "Raw",
        this.DS.engine._activeStyleObject
      ); */
    }

    if (type == "right-menu") {
      /*     this.DS.renderer.defineMessageStyle(
        "Info",
        scene2.styleMap[scene2.rawText["1"].styleMap]
      ); */
    }
    if (type == "bottom-menu") {
      /*     this.DS.renderer.defineMessageStyle(
        "Warning",
        scene2.styleMap[scene2.rawText["1"].styleMap]
      ); */
    }
    if (type == "bottom-right-menu") {
      /*      this.DS.renderer.defineMessageStyle(
        "Error",
        scene2.styleMap[scene2.rawText["1"].styleMap]
      ); */
    }

    await this._doSceneTransition(type, direction, newScene, scene2);

    if (type == "level" || type == "battle") {
      this.DS.engine.sceneTransitiong = false;
      if (type == "level") {
        this.DS.player.active = true;
      }
    }
    return true;
  }

  async _doSceneTransition(
    type: SceneTypes,
    direction: direction,
    newSceneString: string[],
    newScene: SceneInterface
  ) {
    if (type == "level" || type == "battle") {
      this.DS.engine.currentWorldData = newSceneString;
    }
    if (type == "right-menu") {
      this.DS.menuSceneManager.rightMenuDrawer.currentMenuData = newSceneString;
    }
    if (type == "bottom-menu") {
      this.DS.menuSceneManager.bottomMenuDrawer.currentMenuData =
        newSceneString;
    }
    if (type == "bottom-right-menu") {
      this.DS.menuSceneManager.bottomRightMenuDrawer.currentMenuData =
        newSceneString;
    }
    if (direction == "left") {
      await this._transitionLeft(type);
    }
    if (direction == "right") {
      await this._transitionRight(type);
    }
    if (direction == "up") {
      await this._transitionUp(type);
    }
    if (direction == "down") {
      await this._transitionDown(type);
    }

    if (type == "level") {
      this.DS.levelManager.setActiveScene(
        this.DS.levelManager.activeMeta.id,
        newScene.id
      );
    }
    if (type == "battle") {
      this.DS.battleSceneManager.setActiveScene(
        this.DS.battleSceneManager.activeMeta.id,
        newScene.id
      );
    }
    if (type == "right-menu") {
      this.DS.menuSceneManager.rightMenuDrawer.setActiveMenuScene(
        this.DS.menuSceneManager.activeMeta.id,
        newScene.id
      );
      this.DS.menuSceneManager.rightMenuDrawer.currentRow = 0;
    }
    if (type == "bottom-menu") {
      this.DS.menuSceneManager.bottomMenuDrawer.setActiveMenuScene(
        this.DS.menuSceneManager.activeMeta.id,
        newScene.id
      );
      this.DS.menuSceneManager.bottomMenuDrawer.currentRow = 0;
    }
    if (type == "bottom-right-menu") {
      this.DS.menuSceneManager.bottomRightMenuDrawer.setActiveMenuScene(
        this.DS.menuSceneManager.activeMeta.id,
        newScene.id
      );
      this.DS.menuSceneManager.bottomRightMenuDrawer.currentRow = 0;
    }
    if (type == "level" || type == "battle") {
      this.DS.engine.currentWorldRow = 0;
      this.DS.engine.currentWorldCollumn = 0;
    }
  }

  async _transitionLeft(type: SceneTypes) {
    this.DS.engine.currentWorldCollumn = SCREENWIDTH + 2;
    for (
      let i = this.DS.engine.currentWorldCollumn;
      this.DS.engine.currentWorldCollumn > 0;
      i--
    ) {
      this.DS.engine.currentWorldCollumn--;
      await this.DS.renderer.asyncSleep(30);
    }
  }
  async _transitionRight(type: SceneTypes) {
    this.DS.engine.currentWorldCollumn = 0;
    for (let i = 0; i < SCREENWIDTH; i++) {
      this.DS.engine.currentWorldCollumn++;
      await this.DS.renderer.asyncSleep(30);
    }
  }
  async _transitionUp(type: SceneTypes) {
    if (type == "battle" || type == "level") {
      this.DS.engine.currentWorldRow = SCREENHEIGHT + 1;
      for (let i = this.DS.engine.currentWorldRow; i > 1; i--) {
        this.DS.engine.currentWorldRow--;
        await this.DS.renderer.asyncSleep(60);
      }
    }
    if (type == "right-menu") {
      this.DS.menuSceneManager.rightMenuDrawer.currentRow = RIGHTMENUHEIGHT - 2;

      for (
        let i = this.DS.menuSceneManager.rightMenuDrawer.currentRow;
        i > 1;
        i--
      ) {
        this.DS.menuSceneManager.rightMenuDrawer.currentRow--;
        await this.DS.renderer.asyncSleep(60);
      }
    }
    if (type == "bottom-menu") {
      this.DS.menuSceneManager.bottomMenuDrawer.currentRow = BOTTOMMENUHEIGHT;

      for (
        let i = this.DS.menuSceneManager.bottomMenuDrawer.currentRow;
        i > 0;
        i--
      ) {
        this.DS.menuSceneManager.bottomMenuDrawer.currentRow--;
        await this.DS.renderer.asyncSleep(60);
      }
    }
    if (type == "bottom-right-menu") {
      this.DS.menuSceneManager.bottomRightMenuDrawer.currentRow =
        BOTTOMRIGHTMENUHEIGHT - 2;

      for (
        let i = this.DS.menuSceneManager.bottomRightMenuDrawer.currentRow;
        i > 1;
        i--
      ) {
        this.DS.menuSceneManager.bottomRightMenuDrawer.currentRow--;
        await this.DS.renderer.asyncSleep(60);
      }
    }
  }
  async _transitionDown(type: SceneTypes) {
    if (type == "battle" || type == "level") {
      this.DS.engine.currentWorldRow = 0;
      for (let i = 0; i < SCREENHEIGHT; i++) {
        this.DS.engine.currentWorldRow++;
        await this.DS.renderer.asyncSleep(60);
      }
    }
    if (type == "right-menu") {
      this.DS.menuSceneManager.rightMenuDrawer.currentRow = 0;
      for (let i = 0; i < RIGHTMENUHEIGHT; i++) {
        this.DS.menuSceneManager.rightMenuDrawer.currentRow++;
        await this.DS.renderer.asyncSleep(60);
      }
    }
  }

  _sealSceneForTransition(
    direction: direction,
    sceneArray1: string[],
    sceneArray2: string[]
  ) {
    let newScene: string[] = [];
    let index;
    switch (direction) {
      case "up":
        //scene 1 is bottom scene
        //sccene 2 is top scene
        newScene = sceneArray2.concat(sceneArray1);
        break;
      case "down":
        //scne 2 is top scene
        //scene 2 is bottom scene
        newScene = sceneArray1.concat(sceneArray2);
        break;
      case "left":
        //scene 1 is the right scnee
        //scene 2 is the left scene
        index = 0;
        for (const sceneString of sceneArray2) {
          const newString = sceneString.concat(sceneArray1[index]);
          newScene.push(newString);
          index++;
        }
        break;
      case "right":
        //scene 1 is the right scnee
        //scene 2 is the left scene
        index = 0;
        for (const sceneString of sceneArray1) {
          const newString = sceneString.concat(sceneArray2[index]);
          newScene.push(newString);
          index++;
        }
        break;

      default:
        break;
    }
    return newScene;
  }

  async doScreenWipe(type: ScreenTransitionTypes) {
    this.DS.entityManager.deleteAllEntitiesOnScene("level");
    switch (type) {
      case "wipe-1":
        await this._doWipe1();
        break;
      case "wipe-2":
        await this._doWipe2();
        break;
    }
  }

  async _doWipe1() {
    this.DS.engine.sceneTransitiong = true;

    await this._runWipe1(SCREENHEIGHT + 1, SCREENWIDTH + 32);
    await this._runWipe1(SCREENHEIGHT + 1, SCREENWIDTH + 32);
    this.DS.engine.sceneTransitiong = false;
  }

  async _runWipe1(rows: number, cols: number): Promise<any> {
    for (let i = cols; i >= 0; i--) {
      let row = rows;
      let col = i;
      do {
        if (row >= 0 && col >= 1 && col < SCREENWIDTH + 1) {
          this.DS.renderer.showAt("*", row, col);
          await this.DS.renderer.asyncSleep(1);
        }
        row--;
        col--;
      } while (row >= 2);
    }
  }

  async _doWipe2() {
    this.DS.engine.sceneTransitiong = true;

    await this._runWipe2(
      <string>this.DS.renderer.stylize("[0]", red),
      SCREENHEIGHT + 2,
      SCREENWIDTH - 2
    );
    await this._runWipe2_2(
      <string>this.DS.renderer.stylize("[0]", dimRed),
      SCREENHEIGHT + 2,
      SCREENWIDTH - 2
    );
    /*     await this._runWipe2(
      <string>this.DS.dsCom.BRIGHT.black("[0]"),
      SCREENHEIGHT + 2,
      SCREENWIDTH - 2
    );
    await this._runWipe2_2(
      <string>this.DS.dsCom.CLEAR.red("[0]"),
      SCREENHEIGHT + 2,
      SCREENWIDTH - 2
    ); */
    this.DS.engine.sceneTransitiong = false;
  }

  async _runWipe2(text: string, rows: number, cols: number): Promise<any> {
    for (let i = cols; i > 1; i -= 3) {
      for (let j = 2; j < rows; j++) {
        this.DS.renderer.showAt(text, j, i);
        await this.DS.renderer.asyncSleep(2);
      }
    }
  }

  async _runWipe2_2(text: string, rows: number, cols: number): Promise<any> {
    for (let i = 1; i < cols; i += 3) {
      for (let j = 2; j < rows; j++) {
        this.DS.renderer.showAt(text, j, i);
        await this.DS.renderer.asyncSleep(2);
      }
    }
  }
}
