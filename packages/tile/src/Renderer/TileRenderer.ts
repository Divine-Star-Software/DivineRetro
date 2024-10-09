import type { Scene } from "@babylonjs/core/scene";
import { BuildTileTexture } from "./Functions/BuildTileTexture";
import { BuildTileMaterial } from "./Functions/BuildTileMaterial";
import { ShaderMaterial } from "@babylonjs/core";
import { TileLayer } from "./Classes/TileLayer";
import { TileCamera } from "../Camera/TileCamera";
import { TileTextureData } from "../Textures/Texture.types";
import { TilesData } from "../Tiles/Tiles.types";
import { TextureManager } from "../Textures/TextureManager";
import { TileManager } from "../Tiles/TileManager";

export class TileRenderer {
  tilesMaterial: ShaderMaterial;

  layers: TileLayer[] = [];
  constructor(public scene: Scene, public camera: TileCamera) {}

  async create(data: {
    layers: number[];
    tileTextures: TileTextureData[];
    tiles: TilesData[];
  }) {
  //  this.scene.useRightHandedSystem = false;


    TextureManager.registerTiles(...data.tileTextures);
    const texture = await BuildTileTexture(this.scene, data.tileTextures);
    const material = BuildTileMaterial(this.scene, texture);

    this.tilesMaterial = material;
    for (let i = 0; i < data.layers.length; i++) {
      this.layers[data.layers[i]] = new TileLayer(this, data.layers[i]);
    }

    TileManager.registerTiles(...data.tiles);
  }

  render() {
    for (let i = 0; i < this.layers.length; i++) {
      this.layers[i].render();
    }
  }
}
