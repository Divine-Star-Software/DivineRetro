import type { Scene } from "@babylonjs/core/scene";
import { Flat2DIndex } from "@amodx/math";
import { EntityInstance } from "./Classes/EntityInstance";
import { EntityTool } from "./Classes/EntityTool";
import { BuildTileTexture } from "./Functions/BuildTileTexture";
import { BuildTileMaterial } from "./Functions/BuildTileMaterial";
import { TileDataEncode } from "./Classes/TileDataEncode";
import { ShaderMaterial } from "@babylonjs/core";

export class RetroRender {
  bufferIndex: Flat2DIndex;
  charTiles: EntityInstance[] = [];

  entityTool: EntityTool;
  tileDataEncode = new TileDataEncode();

  tilesMaterial: ShaderMaterial;

  constructor(public scene: Scene, public rows: number, public cols: number) {
    const texture = BuildTileTexture(scene, "");
    const material = BuildTileMaterial(scene, texture);

    this.tilesMaterial = material;
  }
}
