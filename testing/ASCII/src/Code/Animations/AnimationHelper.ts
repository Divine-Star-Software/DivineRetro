import type { DivineStar } from "../DivineStar";
import { BasicKeyFrame } from "../meta/Animation/Animtion.types";

export class AnimationHelper {
  constructor(public DS: DivineStar) {}

  preprocessStyleKeyFrames(keyFrameMap: Record<string, BasicKeyFrame[]>) {
    for (const animCat of Object.keys(keyFrameMap)) {
      for (const animKey of keyFrameMap[animCat]) {
        animKey.animText = this.DS.renderer.stylize(
          animKey.animText,
          animKey.style
        );
      }
    }
    return keyFrameMap;
  }
}
