import { AnimatedTileData } from "./Texture.types";
import { TextureAnimation } from "./TextureAnimation";
import { TileTextureIndex } from "./TileTextureIndex";

export class TextureAnimations {
  static animatedIndex: TextureAnimation[] = [];
  static animations: TextureAnimation[] = [];

  static registerAnimations(data: AnimatedTileData[]) {
    for (const animation of data) {
      const [[sx, sy], [ex, ey]] = animation.framesRange;

      const textureAnimation = new TextureAnimation(animation);
      this.animations.push(textureAnimation);

      for (let x = sx; x < ex; x++) {
        for (let y = sy; y < ey; y++) {
          const index = TileTextureIndex.getIndex(animation.textureId, x, y);
          this.animatedIndex[index - 1] = textureAnimation;
        }
      }
    }
  }

  static update(deltaTime: number) {
    for (let i = 0; i < this.animations.length; i++) {
      this.animations[i].update(deltaTime);
    }
  }
}
