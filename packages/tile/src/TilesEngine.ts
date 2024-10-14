import { Scene } from "@babylonjs/core";
import { TileCamera } from "./Camera/TileCamera";
import { WorldData } from "./Data/Classes/World";
import { WorldDataRegister } from "./Data/WorldDataRegister";
import { TileLayer } from "./Renderer/Classes/TileLayer";
import { BuildTileMaterial } from "./Renderer/Functions/BuildTileMaterial";
import { BuildTileTexture } from "./Renderer/Functions/BuildTileTexture";
import { TileRenderer } from "./Renderer/TileRenderer";
import { EngineSettings } from "./Settings/EngineSettings";
import { AnimatedTileData, TileTextureData } from "./Textures/Texture.types";
import { TextureManager } from "./Textures/TextureManager";
import { TileManager } from "./Tiles/TileManager";
import { TilesTypeData } from "./Tiles/Tiles.types";
import { TileRendererLayerData } from "./Renderer/TileRederer.types";
import { Vec2Array } from "@amodx/math";
import { TextureAnimations } from "./Textures/TextureAnimations";
import { TileTextureIndex } from "./Textures/TileTextureIndex";

export class TilesEngine {
  static updateSettings(settings: Partial<EngineSettings>) {
    //update
  }

  static addWorld(data: WorldData) {
    WorldDataRegister.createWorld(data);
  }

  static async create(data: {
    scene: Scene;
    layers: TileRendererLayerData[];
    tileSetSize: Vec2Array;
    tileTextures: TileTextureData[];
    tileAnimations: AnimatedTileData[];
    tiles: TilesTypeData[];
  }) {
    const camera = new TileCamera(data.scene);
    const renderer = new TileRenderer(data.scene, camera);
    TextureManager.registerTiles(...data.tileTextures);


    const textureData = await BuildTileTexture(
      data.scene,
      data.tileSetSize,
      data.tileTextures
    );
    

    const material = BuildTileMaterial(data.scene, ...textureData);

    renderer.tilesMaterial = material;
    for (let i = 0; i < data.layers.length; i++) {
      renderer.layers[i] = new TileLayer(renderer, data.layers[i]);
    }

    console.log(TileTextureIndex._bounds)
    TileManager.registerTiles(...data.tiles);
    TextureAnimations.registerAnimations(data.tileAnimations)
    return {
      camera,
      renderer,
    };
  }
}
