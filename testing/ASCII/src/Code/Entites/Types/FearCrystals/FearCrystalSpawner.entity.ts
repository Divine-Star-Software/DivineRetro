import type { DivineStar } from "../../../DivineStar";
import { probability } from "../../../Helper/Helper";
import {
  FearFormSpawnMap,
  FearFormBattleSet,
} from "../../../meta/FearmForms/FearForm.types";
import { SceneTypes } from "../../../meta/Scene/Scene.types";
import { direction } from "../../../meta/Util.types";
import { EntityInterface } from "../../Entity.interface";

declare const DS: DivineStar;

export class FearCrystalSpawner implements EntityInterface {
  maxEntites = 2;
  currentEntites = 0;
  tickInterval = 5;
  tickCount = 0;
  active = true;
  draw = false;
  spawnProbabliltiy = 0.8;

  constructor(
    public data: FearFormSpawnMap,
    public id: string,
    public type: string,
    public x: number,
    public y: number,
    public sceneType : SceneTypes
  ) {}

  _determineBattleSet(): FearFormBattleSet {
    const battleSet: FearFormBattleSet = {};

    for (const fearFormCats of Object.keys(this.data)) {
      
      const spawnMapSet = this.data[fearFormCats];
    
      for(const spawnMap of spawnMapSet){
       
      if (probability(spawnMap.probability) || spawnMap.probability == 1) {

        for (const fearForm of spawnMap.fearFormMap) {
          if (probability(fearForm.probability) || fearForm.min >= 1) {
            let num = 1;
            if (fearForm.min != fearForm.max) {
              num += (Math.random() * fearForm.max) >>> 0;
            } else {
              num = fearForm.min;
            }
            battleSet[fearFormCats] ? true : battleSet[fearFormCats] =[];

            battleSet[fearFormCats].push({
              num: num,
              id: fearForm.id,
            });
          }
        }
      }
    }
    }

    return battleSet;
  }

  _spawn() {
    if (this.currentEntites >= this.maxEntites) return;
    const data = this._determineBattleSet();
    DS.entityManager.createNewEntity(
      "level",
        data,
      "FearCrystalWanderEntity",
      "test",
      this.x,
      this.y
    );
    this.currentEntites++;
  }

  $run() {
    //don't spawn right on player
    if (!this.active || !(this.x - DS.player.x) || !(this.y - DS.player.y)) {
      return;
    }

    if (this.tickCount == 0) {
      if (probability(this.spawnProbabliltiy)) {
        this._spawn();
      }
      this.tickCount = this.tickInterval;
    } else {
      this.tickCount--;
    }
  }

  $draw() {
    if (!this.draw) return;
 //   DS.dsCom.showAt("testing", { row: this.y, col: this.x });
  }
  
  $destroy() {
        
  }
}
