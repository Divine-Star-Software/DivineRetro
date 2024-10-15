import type { DivineStar } from "../DivineStar";
import { FearFormAnimationKey } from "../meta/FearmForms/FearForm.types";

export class BattleDrawer {
  active = false;
  animatedEntitesKeys: string[] = [];
  animatedEntites: Record<
    string,
    {
      row: number;
      col: number;
      activeStateAnimation: string;
      count: number;
      interval: number;
      currentFrame: number;
      maxFrames: number;
    }
  > = {};
  animatedEntitesAnimations: Record<
    string,
    Record<string, FearFormAnimationKey[]>
  > = {};

  constructor(public DS: DivineStar) {}

  changeEntityAnimationState(id: string, stateId: string) {
    const animation = this.animatedEntitesAnimations[id];
    const firstFrame = animation[stateId][0];
    this.animatedEntites[id] = {
      row: this.animatedEntites[id].row,
      col: this.animatedEntites[id].col,
      activeStateAnimation: stateId,
      count: 0,
      interval: firstFrame.interval,
      currentFrame: 0,
      maxFrames: animation[stateId].length,
    };
  }

  addEntity(
    id: string,
    row: number,
    col: number,
    activeStateAnimation: string,
    animationMap: Record<string, FearFormAnimationKey[]>
  ) {
    this.DS.animationHelper.preprocessStyleKeyFrames(animationMap);
    const firstFrame = animationMap[activeStateAnimation][0];
    this.animatedEntites[id] = {
      row: row,
      col: col,
      activeStateAnimation: activeStateAnimation,
      count: 0,
      interval: firstFrame.interval,
      currentFrame: 0,
      maxFrames: animationMap[activeStateAnimation].length,
    };
    this.animatedEntitesAnimations[id] = animationMap;
    this.animatedEntitesKeys.push(id);
  }

  $draw() {
    if(!this.active)return;
    for (const entityID of this.animatedEntitesKeys) {
      const animatedEntity = this.animatedEntites[entityID];
      const animation =
        this.animatedEntitesAnimations[entityID][
          animatedEntity.activeStateAnimation
        ][animatedEntity.currentFrame];

      this.DS.renderer.showAt(animation.animText, animatedEntity.row,animatedEntity.col);

      if (animatedEntity.count == 0) {
        if (animatedEntity.currentFrame >= animatedEntity.maxFrames - 1) {
          animatedEntity.currentFrame = 0;
        } else {
          animatedEntity.currentFrame++;
          const newFrame =
            this.animatedEntitesAnimations[entityID][
              animatedEntity.activeStateAnimation
            ][animatedEntity.currentFrame];
          animatedEntity.count = newFrame.interval;
          animatedEntity.interval = newFrame.interval;
        }
      } else {
        animatedEntity.count--;
      }
    }
  }
}
