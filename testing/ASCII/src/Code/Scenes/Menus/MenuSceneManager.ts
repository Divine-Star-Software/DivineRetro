import { SceneManagerInterface } from "../../meta/Scene/SceneManager.interface";
import type {
  SceneInterface,
  SceneMetaMap,
  SceneKeyMap,
  AnimationKey,
} from "../../meta/Scene/Scene.types";
import { DivineStar } from "../../DivineStar";
import { RightMenuDrawer } from "./Drawers/RightMenu/RightMenuDrawer";
import { INPUTChars, INPUTKeys } from "../../Controls/ControlManager";
import { BottomMenuDrawer } from "./Drawers/BottemMenu/BottemMenuDrawer";
import { BottomRightMenuDrawer } from "./Drawers/BottomRightMenu/BottomRightMenuDrawer";

export class MenuSceneManager implements SceneManagerInterface {
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

  activeMeta: SceneKeyMap = { id: "overworld", scene: {} };
  scenes: SceneMetaMap = {};
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

  keyControls: Record<INPUTKeys, Record<string, Function[]>> = {
    up: {},
    left: {},
    right: {},
    down: {},
    enter: {},
  };
  charControls: Record<INPUTChars, Record<string, Function[]>> = {
    m: {},
    h: {},
    z: {},
    x: {},
  };

  rightMenuDrawer: RightMenuDrawer;
  bottomMenuDrawer: BottomMenuDrawer;
  bottomRightMenuDrawer: BottomRightMenuDrawer;

  constructor(public DS: DivineStar) {
    this.rightMenuDrawer = new RightMenuDrawer(DS);
    this.bottomMenuDrawer = new BottomMenuDrawer(DS);
    this.bottomRightMenuDrawer = new BottomRightMenuDrawer(DS);
    this.DS.controlManager.onInput("w", async () => {
      for (const controNames of Object.keys(this.keyControls["up"])) {
        for (const func of this.keyControls["up"][controNames]) {
          await func();
        }
      }
    });
    this.DS.controlManager.onInput("s", async () => {
      for (const controNames of Object.keys(this.keyControls["down"])) {
        for (const func of this.keyControls["down"][controNames]) {
          await func();
        }
      }
    });
    this.DS.controlManager.onInput("a", () => {
      for (const controNames of Object.keys(this.keyControls["left"])) {
        for (const func of this.keyControls["left"][controNames]) {
          func();
        }
      }
    });
    this.DS.controlManager.onInput("d", () => {
      for (const controNames of Object.keys(this.keyControls["right"])) {
        for (const func of this.keyControls["right"][controNames]) {
          func();
        }
      }
    });
    this.DS.controlManager.onInput("Enter", () => {
      for (const controNames of Object.keys(this.keyControls["enter"])) {
        for (const func of this.keyControls["enter"][controNames]) {
          func();
        }
      }
    });
    this.DS.controlManager.onInput("z", () => {
      for (const controNames of Object.keys(this.charControls["z"])) {
        for (const func of this.charControls["z"][controNames]) {
          func();
        }
      }
    });
    this.DS.controlManager.onInput("x", () => {
      for (const controNames of Object.keys(this.charControls["x"])) {
        for (const func of this.charControls["x"][controNames]) {
          func();
        }
      }
    });
    this.DS.controlManager.onInput("m", () => {
      for (const controNames of Object.keys(this.charControls["m"])) {
        for (const func of this.charControls["m"][controNames]) {
          func();
        }
      }
    });
    this.DS.controlManager.onInput("h", () => {
      for (const controNames of Object.keys(this.charControls["h"])) {
        for (const func of this.charControls["h"][controNames]) {
          func();
        }
      }
    });
  }

  addKeyControl(id: string, key: INPUTKeys, func: Function) {
    this.keyControls[key][id] ? false : (this.keyControls[key][id] = []);
    this.keyControls[key][id].push(func);
  }
  addCharControl(id: string, key: INPUTChars, func: Function) {
    this.charControls[key][id] ? false : (this.charControls[key][id] = []);
    this.charControls[key][id].push(func);
  }

  setActiveSceneMeta(metaName: string) {
    this.activeMeta = this.scenes[metaName];
    return this;
  }
  setActiveScene(metaName: string, sceneId: string) {
    this.activeScene = this.scenes[metaName].scene[sceneId];

    /*     if (this.activeScene.entityLocations) {
      for (const entity of this.activeScene.entityLocations[
        this.activeScene.activeEntityMap
      ]) {
        this.DS.entityManager.createNewEntity(
          entity.data.data ? entity.data.data : {},
          entity.data.entityName,
          entity.data.type,
          entity.x,
          entity.y
        );
      }
    } */
    return this;
  }

  registerSceneMeta(metaName: string) {
    this.scenes[metaName] = {
      id: metaName,
      scene: {},
    };
    return this;
  }

  addSceneToMeta(metaName: string, scene: SceneInterface) {
    Promise.all([
      this.DS.sceneProcessor.processSceneStates(scene),
      this.DS.sceneProcessor.processEntityMaps(scene),
    ]);

    this.scenes[metaName].scene[scene.id] = scene;
    return this;
  }

  getScene(sceneId: string) {
    return this.activeMeta.scene[sceneId];
  }

  async $draw() {
    this.bottomMenuDrawer.$draw();
    this.bottomRightMenuDrawer.$draw();
    this.rightMenuDrawer.$draw();
  }
  async $run() {
    this.rightMenuDrawer.$run();
    this.bottomMenuDrawer.$run();
    this.bottomRightMenuDrawer.$run();
  }

  $doSceneAnimations() {
    if (this.rightMenuDrawer.active) {
      //  this.rightMenuDrawer.$doSceneAnimations();
    }
    if (this.bottomMenuDrawer.active) {
      this.bottomMenuDrawer.$doSceneAnimations();
    }
    if (this.bottomRightMenuDrawer.active) {
      //    this.bottomRightMenuDrawer.$doSceneAnimations();
    }
  }

  $doSceneWorldAnimations() {
    if (this.rightMenuDrawer.active) {
      //   this.rightMenuDrawer.$doSceneWorldAnimations();
    }
    if (this.bottomMenuDrawer.active) {
      this.bottomMenuDrawer.$doSceneWorldAnimations();
    }
    if (this.bottomRightMenuDrawer.active) {
      //     this.bottomRightMenuDrawer.$doSceneWorldAnimations();
    }
  }
}
