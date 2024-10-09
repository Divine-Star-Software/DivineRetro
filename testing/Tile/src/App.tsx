import { useEffect, useRef, useState } from "react";
import { Engine, Scene } from "@babylonjs/core";
let init = false;
import { TextureManager } from "@divineretro/tile/Textures/TextureManager";
import { TileCamera } from "@divineretro/tile/Camera/TileCamera";
import { TileRenderer } from "@divineretro/tile/Renderer/TileRenderer";
import { RetroTerminalEffect } from "@divineretro/tile/Effects/RetroTerminalEffect";

import { BrushTool } from "@divineretro/tile/Data/BrushTool";
import { DataTool } from "@divineretro/tile/Data/DataTool";

import { WorldDataRegister } from "@divineretro/tile/Data/WorldDataRegister";
import WorldBuilder from "WorldBuilder/WorldBuilder";
import { EngienNodes } from "EngineNodes";

export function App() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [nodes, setNodes] = useState<EngienNodes | false>(false);

  useEffect(() => {
    if (init) return;
    init = true;

    (async () => {
      const engine = new Engine(canvasRef.current!);
      const scene = new Scene(engine);
      const camera = new TileCamera(scene);
      TextureManager.registerTiles();
      const effect = new RetroTerminalEffect();
      effect.create(camera._camera!);
      const renderer = new TileRenderer(scene, camera);

      let x = 0;
      setInterval(() => {
        //  console.log(camera.position.x);
        // camera.camera!.position.z -= 0.001;
      }, 400);

      await renderer.create({
        layers: [0],

        tileTextures: [
          {
            id: "walls",
            src: "assets/textures/walls.png",
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
                rotation:0,
                color: [15, 15, 15, 15],
              },
              {
                texture: "walls",
                tileX: 0,
                tileY: 0,
                rotation:0,
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
      }, 10);

      const brush = new BrushTool();

      for (let x = 0; x < 64; x++) {
        for (let y = 0; y < 32; y++) {
          if (y % 4 !== 0) continue;
          brush
            .setPosition(x, y)
            .setColorData(15, 0, 0, 15)
            .setTextureId("walls", 0, 0)
            .paint();
        }
      }

      const centerX = (-16 + 72) / 2;
      const centerY = (-16 + 48) / 2;

      const radius = 100;

      let angle = 0;

      const speed = 0.01;

      engine.runRenderLoop(() => {
        //    angle += speed;

        //   const x = centerX + radius * Math.cos(angle);
        //   const y = centerY + radius * Math.sin(angle);

        //   camera.setPosition(x, y);

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
