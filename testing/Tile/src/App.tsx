import { useEffect, useRef, useState } from "react";
import {
  Color4,
  Engine,
  NoiseProceduralTexture,
  ParticleSystem,
  Scene,
  Texture,
  Vector3,
} from "@babylonjs/core";
let init = false;
import { TextureManager } from "@divineretro/tile/Textures/TextureManager";
import { TileCamera } from "@divineretro/tile/Camera/TileCamera";
import { TilesEngine } from "@divineretro/tile/TilesEngine";
import { RetroTerminalEffect } from "@divineretro/tile/Effects/RetroTerminalEffect";

import { BrushTool } from "@divineretro/tile/Data/BrushTool";
import { DataTool } from "@divineretro/tile/Data/DataTool";

import { WorldDataRegister } from "@divineretro/tile/Data/WorldDataRegister";
import WorldBuilder from "WorldBuilder/WorldBuilder";
import { EngienNodes } from "EngineNodes";
import { EngineSettings } from "@divineretro/tile/Settings/EngineSettings";
export const ParticleTexture =
  "data:image/png;base64,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";

  export function App() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [nodes, setNodes] = useState<EngienNodes | false>(false);

  useEffect(() => {
    if (init) return;
    init = true;

    (async () => {
      const engine = new Engine(canvasRef.current!);
      let maxTextureArrayLayers = engine.getCaps().texture2DArrayMaxLayerCount;
      console.log(
        "Max Texture Array Layers:",
        maxTextureArrayLayers,
        engine.getCaps().maxTextureSize
      );
      const scene = new Scene(engine);
      scene.clearColor.set(0, 0, 0, 1);

      let x = 0;

      console.log({
        frameOrder: new Array(32).fill(0).map((v, index) => index),
        frameLength: new Array(32).fill(0).map((v, index) => 200),
      });
      //    TilesEngine.addWorld({ id: "main", size: [10, 10], chunks: [] });
      const { camera, renderer } = await TilesEngine.create({
        scene,
        tileAnimations: [
          {
            textureId: "water",
            framesRange: [
              [0, 0],
              [17, 6],
            ],
            frameSize: [2, 6],
            frameOrder: [0, 1, 2, 3, 4, 5, 6, 7],
            frameLength: [200, 200, 200, 200, 200, 200, 200, 200],
          },
          {
            textureId: "water",
            framesRange: [
              [0, 16],
              [32, 32],
            ],
            frameSize: [4, 4],
            frameOrder: new Array(32).fill(0).map((v, index) => index),
            frameLength: new Array(32).fill(0).map((v, index) => 80),
          },
        ],
        tileSetSize: [256, 256],
        tileTextures: [
          {
            id: "water",
            src: "assets/textures/water.png",
          },
          {
            id: "palace",
            src: "assets/textures/palace.png",
          },
          {
            id: "plants",
            src: "assets/textures/plants.png",
          },
          {
            id: "world",
            src: "assets/textures/world.png",
          },
        ],
        layers: [
          {
            id: -4,
            tileSize: [120, 100],
            tileStartOffset: [-30, -40],
            worldLayer: -4,
            readWorldData: true,
            zPosition: 10,
            worldDataClamp: 32,
            renderGroup: 0,
          },
          {
            id: -3,
            tileSize: [80, 60],
            tileStartOffset: [-10, -10],
            worldLayer: -3,
            readWorldData: true,
            zPosition: 4,
            worldDataClamp: 0,
            renderGroup: 0,
          },
          {
            id: -2,
            tileSize: [120, 80],
            tileStartOffset: [-30, -30],
            worldLayer: -2,
            readWorldData: true,
            zPosition: 8,
            worldDataClamp: 0,
            renderGroup: 0,
          },
          {
            id: -1,
            tileSize: [62, 34],
            tileStartOffset: [-1, -1],
            worldLayer: -1,
            readWorldData: true,
            renderGroup: 1,
          },
          {
            id: 0,
            tileSize: [62, 34],
            tileStartOffset: [-1, -1],
            worldLayer: 0,
            readWorldData: true,
            renderGroup: 1,
          },
          {
            id: 1,
            tileSize: [62, 34],
            tileStartOffset: [-1, -1],
            worldLayer: 1,
            readWorldData: true,
            renderGroup: 1,
          },
          {
            id: 2,
            tileSize: [62, 34],
            tileStartOffset: [-1, -1],
            worldLayer: 2,
            readWorldData: true,
            zPosition: 0,
            renderGroup: 2,
          },
          {
            id: 3,
            tileSize: [58, 34],
            tileStartOffset: [-1, -1],
            worldLayer: 3,
            readWorldData: true,
            zPosition: -1,
            renderGroup: 2,
          },
        ],
        tiles: [
          {
            id: "wall",
            properties: {
              solid: true,
            },
          },
        ],
      });

      const effect = new RetroTerminalEffect();
      effect.create(camera._camera!);

      const particleSystem = new ParticleSystem("particles", 1000, scene);
      // particleSystem.isLocal = true;
      particleSystem.particleTexture = new Texture(ParticleTexture, scene);
      particleSystem.updateSpeed = 0.001;
      particleSystem.emitter = new Vector3(0, 0, 1);
      particleSystem.emitRate = 200;
      particleSystem.renderingGroupId = 1;
      particleSystem.minEmitBox = new Vector3(0, 0, 3);
      particleSystem.maxEmitBox = new Vector3(
        EngineSettings.chunkMeterSize[0],
        0,
        0
      );
      const noiseTexture = new NoiseProceduralTexture("perlin", 512, scene);
      particleSystem.noiseTexture = noiseTexture;
      particleSystem.noiseStrength = new Vector3(2, 2, 2);
      particleSystem.direction1 = new Vector3(-1, 1, -1);
      particleSystem.direction2 = new Vector3(1, 1, 1);

      particleSystem.blendMode = 2;
      particleSystem.minAngularSpeed = 0.02;
      particleSystem.maxAngularSpeed = 1;
      particleSystem.minEmitPower = 0.5;
      particleSystem.maxEmitPower = 2;
      particleSystem.minLifeTime = 2;
      particleSystem.maxLifeTime = 20;
      particleSystem.color1 = new Color4(77 / 255, 114 / 255, 214 / 255, 0.8);
      particleSystem.color2 = new Color4(132 / 255, 152 / 255, 207 / 255, 0.8);
      particleSystem.colorDead = new Color4(24 / 255, 67 / 255, 110 / 255, 0.8);

      particleSystem.minSize = 0.005;
      particleSystem.maxSize = 0.025;

      particleSystem.gravity = new Vector3(0.1, -0.2, 0);

      particleSystem.preWarmCycles = 100;
      particleSystem.preWarmStepOffset = 10;
      particleSystem.gravity = new Vector3(0.1, -0.2, 0);
      particleSystem.start();
      /* 
      const pattern = renderer.createPattern({
        id: "test",
        defaultPattern: 0,
        patterns: {
          0: [
            [
              {
                texture: "walls",
                tileX: 0,
                tileY: 0,
                rotation: 0,
                color: [15, 15, 15, 15],
              },
              {
                texture: "walls",
                tileX: 0,
                tileY: 0,
                rotation: 0,
                color: [15, 15, 15, 15],
              },
            ],
          ],
        },
      });

      let up = true;
      setInterval(() => {
        if (pattern.position.y > 128) {
          up = false;
        }
        if (pattern.position.y <= 0) {
          up = true;
        }
        if (up) {
          pattern.position.y += 1;
        } else {
          pattern.position.y -= 1;
        }
      }, 10); */

      /*     const brush = new BrushTool();
      brush.setWorld("main");

     for (let x = 0; x < 64; x++) {
        for (let y = 0; y < 64; y++) {
          if (y % 4 !== 0) continue;
          brush
            .setPosition(x, y)
            .setColorData(15, 0, 0, 15)
            .setTextureId("walls", 0, 0)
            .paint();
        }
      } 
 */
      const centerX = (-16 + 72) / 2;
      const centerY = (-16 + 48) / 2;

      const radius = 100;

      let angle = 0;

      const speed = 0.01;

      const emitter = new Vector3();
      particleSystem.emitter = emitter;
      engine.runRenderLoop(() => {
        console.log(engine.getFps())
        //    angle += speed;

        //   const x = centerX + radius * Math.cos(angle);
        //   const y = centerY + radius * Math.sin(angle);

        //   camera.setPosition(x, y);
        emitter.copyFrom(camera._camera.position);
        emitter.z = 1;
        emitter.x -= EngineSettings.chunkMeterSize[0] / 2;
        emitter.y -= EngineSettings.chunkMeterSize[1] / 2;

        renderer.render();
        scene.render();
      });
      setNodes(new EngienNodes(renderer, camera));
    })();
  }, []);

  return (
    <div className="main-app">
      <canvas id="render-canvas" ref={canvasRef}></canvas>
      {nodes && <WorldBuilder nodes={nodes} />}
    </div>
  );
}
