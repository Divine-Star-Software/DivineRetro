import { DivineStar } from "../DivineStar";
import { LevelScene, SceneInterface } from "../meta/Scene/Scene.types";

export class SceneProcessor {
  constructor(public DS: DivineStar) {}

  async processSceneStates(scene: SceneInterface) {
    for (const state of Object.keys(scene.rawText)) {
      const stateText = scene.rawText[state].map;
      let rows = stateText.split(/\r\n|\r|\n/);
      rows.splice(0, 1);
      rows.splice(rows.length - 1, 1);
      let newString: string[] = [];
      for (let r of rows) {
        newString.push(r.substring(1, r.length - 1));
      }
      scene.screenStates[state] = newString;
    }
  }

  async processCollisionMaps(scene: LevelScene) {
    for (const collisionMap of Object.keys(scene.collisionMapsRaw)) {
      const mapTextRaw = scene.collisionMapsRaw[collisionMap];
      let rows = mapTextRaw.split(/\r\n|\r|\n/);
      rows.splice(0, 1);
      rows.splice(rows.length - 1, 1);
      let newString: string[] = [];
      for (let r of rows) {
        newString.push(r.substring(1, r.length - 1));
      }
      scene.collisionMaps[collisionMap] = newString;
    }
  }

  async processEntityMaps(scene: SceneInterface) {
    for (const entityMapId of Object.keys(scene.entityMapRaw)) {
      const mapTextRaw = scene.entityMapRaw[entityMapId];
      let rows = mapTextRaw.split(/\r\n|\r|\n/);
      const entityMap = scene.entityMap;
      scene.entityLocations = {};
      scene.entityLocations[entityMapId] = [];
      let rowNum = 0;
      for (let r of rows) {
        rowNum++;
        let colNum = 0;
        for (let c of r) {
          colNum++;
          if (entityMap[c]) {
            scene.entityLocations[entityMapId].push({
              x: colNum - 1,
              y: rowNum,
              data: entityMap[c],
            });
          }
        }
      }
    }
  }
}
