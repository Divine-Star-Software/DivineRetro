import { StyleObject } from "@divineretro/ascii/Renderer/ASCIIMapping";
import type { DivineStar } from "../../DivineStar";
import type {
  AnimationKey,
  LevelScene,
  SceneKeyMap,
  SceneMetaMap,
} from "../../meta/Scene/Scene.types";
import { SceneManagerInterface } from "../../meta/Scene/SceneManager.interface";

type Levels = { id: string; scene: Record<string, LevelScene> };

const blankStyle = StyleObject.New({});

export class LevelManager implements SceneManagerInterface {
  animations: Record<string, AnimationKey[]> = {};
  animationIntervalMap: Record<
    string,
    {
      totalFrames: number;
      currentFrame: number;
      interval: number;
      count: number;
    }
  > = {};
  screenStateKeyCount = 0;
  screenStateKeyTotal = 0;
  screenStateAnimationInterval = -1;
  screenStateAnimationIntervalCount = -1;
  screenStateAnimationActiveID = "";
  activeScene: LevelScene = {
    id: "",
    activeAnimationScreenState: "",
    activeEntityMap: "",
    entityMap: {},
    entityMapRaw: {},
    animations: {},
    styleMap: {},
    collisionMapsRaw: {},
    collisionMaps: {},
    screenStateAnimationKeys: {},
    rawText: {},
    screenStates: {},
    bottomScrene: false,
    topScrene: false,
    rightScrene: false,
    leftScrene: false,
  };

  constructor(public DS: DivineStar) {}
  activeMeta: { id: string; scene: Record<string, LevelScene> } = {
    id: "overworld",
    scene: {},
  };

  scenes: Record<string, Levels> = {};

  getScene(sceneId: string) {
    return this.activeMeta.scene[sceneId];
  }

  setActiveSceneMeta(metaName: string) {
    this.activeMeta = this.scenes[metaName];

    return this;
  }
  setActiveScene(metaName: string, sceneId: string) {
    this.activeScene = this.scenes[metaName].scene[sceneId];
    this.DS.engine.setWorldScene("level", this.activeScene);
    this.animations = {};
    this.animationIntervalMap = {};
    this.screenStateAnimationActiveID =
      this.activeScene.activeAnimationScreenState;
    if (
      this.screenStateAnimationActiveID != "" &&
      this.activeScene.screenStateAnimationKeys[
        this.screenStateAnimationActiveID
      ].length != 0
    ) {
      this.screenStateAnimationInterval =
        this.activeScene.screenStateAnimationKeys[
          this.screenStateAnimationActiveID
        ][0].inteerval;
      this.screenStateAnimationIntervalCount =
        this.activeScene.screenStateAnimationKeys[
          this.screenStateAnimationActiveID
        ][0].inteerval;
      this.screenStateKeyCount = 0;
      this.screenStateKeyTotal =
        this.activeScene.screenStateAnimationKeys[
          this.screenStateAnimationActiveID
        ].length;
    } else {
      this.screenStateAnimationInterval = -1;
      this.screenStateAnimationIntervalCount = -1;
      this.screenStateKeyCount = 0;
      this.screenStateKeyTotal = 0;
    }
    this.animations = this.activeScene.animations;
    for (const animKeys of Object.keys(this.activeScene.animations)) {
      const anim = this.activeScene.animations[animKeys];
      const interval = anim[0].interval;
      this.animationIntervalMap[animKeys] = {
        interval: interval,
        count: 0,
        totalFrames: anim.length,
        currentFrame: 0,
      };
    }
    if (this.screenStateAnimationInterval != -1) {
    }

    return this;
  }

  registerSceneMeta(metaName: string) {
    this.scenes[metaName] = {
      id: metaName,
      scene: {},
    };
    return this;
  }

  addSceneToMeta(metaName: string, scene: LevelScene) {
    Promise.all([
      this.DS.sceneProcessor.processSceneStates(scene),
      this.DS.sceneProcessor.processEntityMaps(scene),
      this.DS.sceneProcessor.processCollisionMaps(scene),
    ]);

    this.scenes[metaName].scene[scene.id] = scene;
    return this;
  }

  $doSceneWorldAnimations() {
    if (this.DS.engine.sceneTransitiong) return;
    for (const anim of Object.keys(this.animations)) {
      const animCounts = this.animationIntervalMap[anim];
      const animKey = this.animations[anim][animCounts.currentFrame];
      let rowBuf = 0;
      let up = false;
      if (animKey?.animDirection == "up") {
        up = true;
      }
      for (const strings of animKey.animText) {
        const animString = this.DS.renderer.stylize(strings, animKey.style);
        this.DS.renderer.showAt(animString, animKey.row + rowBuf, animKey.col);
        if (!up) {
          rowBuf++;
        } else {
          rowBuf--;
        }
      }

      if (animCounts.count == 0) {
        if (animCounts.currentFrame >= animCounts.totalFrames - 1) {
          animCounts.currentFrame = 0;
        } else {
          animCounts.currentFrame++;
        }
        animCounts.interval =
          this.animations[anim][animCounts.currentFrame].interval;
        animCounts.count = animCounts.interval;
      } else {
        animCounts.count--;
      }
    }
  }

  $doSceneAnimations() {
    if (this.DS.engine.sceneTransitiong) return;
    if (this.screenStateAnimationIntervalCount == 0) {
      if (this.screenStateKeyCount >= this.screenStateKeyTotal - 1) {
        this.screenStateKeyCount = 0;
      } else {
        this.screenStateKeyCount++;
      }
      const keyFrame =
        this.DS.levelManager.activeScene.screenStateAnimationKeys[
          this.screenStateAnimationActiveID
        ][this.screenStateKeyCount];
      this.screenStateAnimationIntervalCount = keyFrame.inteerval;

      this.DS.engine.setWorldData(
        this.activeScene.screenStates[keyFrame.stateName]
      );

      if (this.activeScene.rawText[keyFrame.stateName].styleMap != "-1") {
        StyleObject.Copy(
          this.DS.engine._activeStyleObject,
          this.activeScene.styleMap[
            this.activeScene.rawText[keyFrame.stateName].styleMap
          ]
        );
      } else {
        StyleObject.Clear(this.DS.engine._activeStyleObject);
      }

      /*     
      this.DS.renderer.defineMessageStyle(
        "Raw",
        this.DS.engine._activeStyleObject
      );
    
 */
    } else {
      if (this.screenStateAnimationIntervalCount > 0) {
        this.screenStateAnimationIntervalCount--;
      }
    }
  }

  /*   _styleizeScreen(rows : string[],styleMapId : string,styleMap :  Record<string, { row: number; col: number }[]>,screen : LevelScreen) {

    console.log(styleMap);
      for(const style of Object.keys(styleMap)) {
        let rowBuf = 0;
        const locations = styleMap[style];
        const styleObject = screen.styleMapsRaw[styleMapId].styleMap[style];
        for(const location of locations) {
         
            const char = rows[location.row][location.col];
           const newChar = this.DS.dsCom.stylize(char,styleObject);
           console.log(newChar);
            rows[location.row] = this._setCharAt(rows[location.row],location.col ,"X");
         //   rows[location.row].replace("X"," ");
         rowBuf += newChar.length;
        }

      } 

      //this.DS.dsCom.DIE;
      return rows;
  }

   _setCharAt(str : string,index : number,chr : string) {
    if(index > str.length-1) return str;
    return str.substring(0,index) + chr + str.substring(index+1);
}
*/
}
