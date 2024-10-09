import { TilePatternData } from "Tiles/Tiles.types";
import { EntityTool } from "./EntityTool";
import { BuildTileGeometry } from "../Functions/BuildTileGeometry";
import { TileRenderer } from "../TileRenderer";
import { Vector2 } from "@babylonjs/core";
import { EngineSettings } from "../../Settings/EngineSettings";
import { EntityInstance } from "./EntityInstance";
import { TileDataEncode } from "./TileDataEncode";
import { TileTextureIndex } from "../../Textures/TileTextureIndex";
import { Vec2Array } from "@amodx/math";

export class TilePattern {
  static entityTool: EntityTool;
  static tileData: Uint32Array;
  static maxTiles = new Map<string, number>();
  static patternData = new Map<
    string,
    Record<string | number, Vec2Array[][]>
  >();
  tiles: EntityInstance[] = [];
  position = new Vector2();

  pattern: string | number;

  patternData: Record<string | number, Vec2Array[][]>;

  constructor(public renderer: TileRenderer, public data: TilePatternData) {
    if (!TilePattern.entityTool) {
      const mesh = BuildTileGeometry(renderer.scene, renderer.tilesMaterial);
      mesh.alwaysSelectAsActiveMesh = true;
      const entityTool = new EntityTool(mesh);
      entityTool.setInstanceAmount(EngineSettings.maxPatternTiles);
      TilePattern.tileData = new Uint32Array(EngineSettings.maxPatternTiles * 2);
      TilePattern.entityTool = entityTool;
      entityTool.addBuffer("tileData", TilePattern.tileData as any, 2);
    }
    this.pattern = data.defaultPattern;

    if (TilePattern.patternData.get(data.id)) {
      this.patternData = TilePattern.patternData.get(data.id)!;
      const totalTiles = TilePattern.maxTiles.get(data.id)!;
      for (let i = 0; i < totalTiles; i++) {
        const instance = TilePattern.entityTool.getInstance();
        if (!instance) {
          console.warn("not enough tile instanecs");
          continue;
        }
        this.tiles[i] = instance;
      }
    } else {
      const tileData = new TileDataEncode();

      const patternData: Record<string | number, Vec2Array[][]> = {};
      let totalTiles = 0;
      for (const pattern in data.patterns) {
        const pat = data.patterns[pattern];
        let tiles = 0;

        const encodedData: Vec2Array[][] = [];

        for (let i = 0; i < pat.length; i++) {
          encodedData[i] ??= [];
          for (let k = 0; k < pat[i].length; k++) {
            const patData = pat[i][k];
            encodedData[i][k] = [
              tileData
                .setData(0)
                .setColorR(patData.color ? patData.color[0] : 1)
                .setColorG(patData.color ? patData.color[1] : 1)
                .setColorB(patData.color ? patData.color[2] : 1)
                .setColorA(patData.color ? patData.color[3] : 1)
                .setTexture(
                  TileTextureIndex.getIndex(
                    patData.texture,
                    patData.tileX,
                    patData.tileY
                  )
                )
                .getData(),
              tileData.setData(0).setRotation(patData.rotation).getData(),
            ];
            if (patData) {
              tiles++;
            }
          }
        }
        patternData[pattern] = encodedData;
        if (tiles > totalTiles) totalTiles = tiles;
      }

      for (let i = 0; i < totalTiles; i++) {
        const instance = TilePattern.entityTool.getInstance();
        if (!instance) {
          console.warn("not enough tile instanecs");
          continue;
        }
        this.tiles[i] = instance;
      }
      TilePattern.maxTiles.set(data.id, totalTiles)!;
      TilePattern.patternData.set(data.id, patternData);
      this.patternData = patternData;
    }
    renderer.renderPatterns.add(this);
  }

  dispose() {
    for (const instance of this.tiles) {
      instance.destroy();
    }
    this.renderer.renderPatterns.delete(this);
  }

  render() {
    const patternData = this.patternData[this.pattern];
    let tileIndex = 0;
    for (let i = 0; i < patternData.length; i++) {
      for (let k = 0; k < patternData[i].length; k++) {
        const tile = this.tiles[tileIndex];
        if (!tile) continue;

        tile.position.x =
          this.position.x * EngineSettings.pixelSize +
          k * EngineSettings.tileMeterSize[0];
        tile.position.z =
          this.position.y * EngineSettings.pixelSize +
          i * EngineSettings.tileMeterSize[1];
        TilePattern.tileData[tile.index * 2] = patternData[i][k][0];
        TilePattern.tileData[tile.index * 2 + 1] = patternData[i][k][1];
        tileIndex++;
      }
    }
  }
}
