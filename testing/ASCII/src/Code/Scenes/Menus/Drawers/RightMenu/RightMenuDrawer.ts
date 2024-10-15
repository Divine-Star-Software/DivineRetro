import {
  ConsoleColors,
  StyleObject,
} from "@divineretro/ascii/Renderer/ASCIIMapping";
import { DivineStar } from "../../../../DivineStar";
import { SceneInterface } from "../../../../meta/Scene/Scene.types";

export class RightMenuDrawer {
  activeScene: SceneInterface = {
    id: "",
    activeAnimationScreenState: "",
    activeEntityMap: "",
    entityMap: {},
    entityMapRaw: {},
    animations: {},
    styleMap: {},
    screenStateAnimationKeys: {},
    rawText: {},
    screenStates: {},
  };
  active = false;
  animating = false;

  currentBorderCollumn = 2;
  currentBorderRow = 0;

  currentMenuData: string[] = [];
  currentCollumn = 2;
  currentRow = 0;

  menuBorderMode = 0;
  baseRightBorder: string = "";
  menuBorder: string[] = [];
  menuBorder2: string[] = [];

  currentStyle = StyleObject.New({});

  constructor(public DS: DivineStar) {
    this.baseRightBorder = `
┌────────────────────────────┐                                   
│                            │                                                   
│                            │                                                   
│                            │                                                                                                   
│                            │                                                   
│                            │                                                   
│                            │                                                   
│                            │                                                   
│                            │                                                                  
│                            │                                                   
│                            │                                                   
│                            │                                                               
│                            │                                                   
│                            │                                                   
│                            │                                                   
│                            │                                                   
│                            │                                                   
│                            │                                                   
└────────────────────────────┘                                      `;
    const baseRightBorder2 = `
┌────────────────────────────┐                                   
│                            │                                                   
│                            │                                                   
│                            │                                                                                                   
│                            │                                                   
│                            │                                                   
│                            │                                                   
│                            │                                                   
│                            │                                                                  
│                            │                                                   
│                            │                                                   
│                            │                                                               
│                            │                                                   
│                            │                                                   
│                            │                                                   
│                            │                                                   
│                            │                                                   
│                            │                                                   
┣────────────────────────────┫                                      `;

    this.menuBorder = this.baseRightBorder.split("\n");
    this.menuBorder2 = baseRightBorder2.split("\n");
    let i = 0;
    for (const row of this.menuBorder) {
      this.menuBorder[i] = this.DS.renderer.stylize(row, {
        fg: ConsoleColors.Blue,
        dim: true,
      });
      this.menuBorder2[i] = this.DS.renderer.stylize(this.menuBorder2[i], {
        fg: ConsoleColors.Blue,
        dim: true,
      });
      i++;
    }
  }

  setActiveMenuScene(metaName: string, sceneId: string) {
    this.DS.menuSceneManager.setActiveSceneMeta(metaName);
    this.activeScene = this.DS.menuSceneManager.activeMeta.scene[sceneId];
    const menuData =
      this.DS.menuSceneManager.activeMeta.scene[sceneId].screenStates["1"];
    this.currentMenuData = menuData;

    StyleObject.Copy(
      this.currentStyle,
      this.activeScene.styleMap[this.activeScene.rawText["1"].styleMap]
    );

    if (this.active) {
      this._createEntites();
    }

    return this;
  }

  _createEntites() {
    if (this.activeScene.entityLocations) {
      for (const entity of this.activeScene.entityLocations[
        this.activeScene.activeEntityMap
      ]) {
        this.DS.entityManager.createNewEntity(
          "right-menu",
          entity.data.data ? entity.data.data : {},
          entity.data.entityName,
          entity.data.type,
          entity.x,
          entity.y
        );
      }
    }
  }

  async popOut() {
    this.active = true;
    this.animating = true;
    while (this.currentBorderCollumn < 50) {
      this.currentCollumn++;
      this.currentBorderCollumn++;
      await this.DS.renderer.asyncSleep(8);
    }
    this.animating = false;
  }

  async popIn() {
    this.animating = true;
    while (this.currentBorderCollumn > 2) {
      this.currentCollumn--;
      this.currentBorderCollumn--;
      await this.DS.renderer.asyncSleep(8);
    }
    this.animating = false;
    this.active = false;
  }

  $doSceneAnimations() {}

  $doSceneWorldAnimations() {}

  $run() {}

  setMenuBorderMode(modes: 0 | 1) {
    this.menuBorderMode = modes;
  }

  async $draw() {
    if (!this.active) return;

    if (this.menuBorderMode == 0) {
      for (let i = this.currentBorderRow; i < RIGHTMENUHEIGHT; i++) {
        this.DS.renderer.showAt(
          this.menuBorder[i],
          this.currentBorderRow + i,
          this.currentBorderCollumn
        );
      }
    }
    if (this.menuBorderMode == 1) {
      for (let i = this.currentBorderRow; i < RIGHTMENUHEIGHT; i++) {
        this.DS.renderer.showAt(
          this.menuBorder2[i],
          this.currentBorderRow + i,
          this.currentBorderCollumn
        );
      }
    }

    let k = 2;
    for (let i = this.currentRow; i < this.currentRow + RIGHTMENUHEIGHT; i++) {
      if (k > RIGHTMENUHEIGHT - 2) continue;
      this.DS.renderer.showAt(
        this.DS.renderer.stylize(this.currentMenuData[i], this.currentStyle),
        k,
        this.currentCollumn + 1
      );
      k++;
    }
  }
}
