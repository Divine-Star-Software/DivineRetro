import type { Scene } from "@babylonjs/core/scene";
import { ShaderMaterial } from "@babylonjs/core";
import { TileLayer } from "./Classes/TileLayer";
import { TileCamera } from "../Camera/TileCamera";
import { TilePatternData } from "../Tiles/Tiles.types";
import { TilePattern } from "./Classes/TilePattern";
import { TextureAnimations } from "../Textures/TextureAnimations";

export class TileRenderer {
  _world: string | null = null;
  get world() {
    return this._world;
  }
  set world(world: string | null) {
    this._world = world;
    console.warn("set world")
    if (world) {
      this.layers.forEach((_) => _.dataTool.setWorld(world));
      this._rendering = true;
    }
    if (!world) {
      this._rendering = false;
    }
  }

  private _rendering = false;

  tilesMaterial: ShaderMaterial;

  renderPatterns = new Set<TilePattern>();
  layers: TileLayer[] = [];
  constructor(public scene: Scene, public camera: TileCamera) {}

  createPattern(data: TilePatternData) {
    const tilePattern = new TilePattern(this, data);
    return tilePattern;
  }

  render() {
    if (!this._rendering) return;
 TextureAnimations.update(this.scene.deltaTime);
    for (let i = 0; i < this.layers.length; i++) {
      this.layers[i].render();
    }
    for (const pattern of this.renderPatterns) {
      pattern.render();
    }
    if (TilePattern.entityTool) TilePattern.entityTool.update();
  }
}
