import {
  ConsoleColors,
  StyleObject,
} from "@divineretro/ascii/Renderer/ASCIIMapping";
import { DivineStar } from "../../../../DivineStar";
import { SceneInterface } from "../../../../meta/Scene/Scene.types";

export class BottomRightMenuDrawer {
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

  currentBorderCollumn = 50;
  currentBorderRow = SCREENHEIGHT + 3 - BOTTOMRIGHTMENUHEIGHT;
  //currentBorderRow = SCREENHEIGHT + 3;

  currentMenuData: string[] = [];
  currentCollumn = 2;
  currentRow = 0;
  baseBottomBorder: string = "";
  menuBorder: string[] = [];

  currentStyle = StyleObject.New({});

  animating = true;
  drawn = false;

  constructor(public DS: DivineStar) {
    this.baseBottomBorder = `│                            │                         
│                            │                                                   
│                            │                                                 
│                            │                                                   
│                            │                                                 
│                            │                                                   
│                            │                                                 
└────────────────────────────┘                                    `;

    this.menuBorder = this.baseBottomBorder.split("\n");

    let i = 0;
    for (const row of this.menuBorder) {
      this.menuBorder[i] = this.DS.renderer.stylize(row, {
        fg: ConsoleColors.Blue,
        dim: true,
      });
      i++;
    }

    //  this.DS.renderer.defineMessageStyle("Info", {});
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
    if (this.activeScene.entityLocations) {
      for (const entity of this.activeScene.entityLocations[
        this.activeScene.activeEntityMap
      ]) {
        this.DS.entityManager.createNewEntity(
          "bottom-right-menu",
          entity.data.data ? entity.data.data : {},
          entity.data.entityName,
          entity.data.type,
          entity.x,
          entity.y
        );
      }
    }

    return this;
  }

  async popDown() {
    if (!this.active) {
      this.active = true;
    }

    this.DS.menuSceneManager.rightMenuDrawer.setMenuBorderMode(1);

    while (this.currentRow < BOTTOMRIGHTMENUHEIGHT) {
      this.currentRow++;
      this.currentBorderRow++;
      await this.DS.renderer.asyncSleep(30);
    }
  }
  async popUp() {
    while (this.currentRow > SCREENHEIGHT + 3 - BOTTOMRIGHTMENUHEIGHT) {
      this.currentRow--;
      this.currentBorderRow--;
      await this.DS.renderer.asyncSleep(15);
    }

    this.DS.menuSceneManager.rightMenuDrawer.setMenuBorderMode(0);

    this.active = false;
  }

  $doSceneAnimations() {}

  $doSceneWorldAnimations() {}

  $run() {}

  async $draw() {
    if (!this.active) return;

    if (!this.drawn || this.animating) {
      for (let i = 0; i < BOTTOMRIGHTMENUHEIGHT; i++) {
        this.DS.renderer.showAt(
          this.menuBorder[i],
          this.currentBorderRow + i,
          this.currentBorderCollumn
        );
      }
      this.drawn == true;
    }

    let k = this.currentBorderRow;
    for (let i = this.currentRow; i < this.currentRow + BOTTOMMENUHEIGHT; i++) {
      if (k > BOTTOMMENUHEIGHT + this.currentBorderRow - 2) continue;
      this.DS.renderer.showAt(
        this.DS.renderer.stylize(this.currentMenuData[i], this.currentStyle),
        k,
        this.currentBorderCollumn + this.currentCollumn - 1
      );
      k++;
    }
  }
}
