import { useEffect, useRef } from "react";
import { Engine, Scene } from "@babylonjs/core";
let init = false;
import { TextureManager } from "@divineretro/tile/Textures/TextureManager";
import { TileCamera } from "@divineretro/tile/Camera/TileCamera";
import { TileRenderer } from "@divineretro/tile/Renderer/TileRenderer";
import { RetroTerminalEffect } from "@divineretro/tile/Effects/RetroTerminalEffect";

import { BrushTool } from "@divineretro/tile/Data/BrushTool";
import { DataTool } from "@divineretro/tile/Data/DataTool";

import { WorldDataRegister } from "@divineretro/tile/Data/WorldDataRegister";

export function App() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

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

      const brush = new BrushTool();
      const dataTool = new DataTool();

      for (let x = 0; x < 64; x++) {
        for (let y = 0; y < 32; y++) {
          brush.setPosition(x, y).setTextureId("walls", 0, 0).paint();
        }
      }

      console.warn(dataTool.setPosition(34, 2).loadIn());
      console.warn(
        WorldDataRegister.worlds,
        WorldDataRegister.getChunk("main", 48, 0)
      );

      // Calculate the center of the box
      const centerX = (-16 + 72) / 2; // 28
      const centerY = (-16 + 48) / 2; // 16

      // Define the radius of the circular path
      const radius = 100; // Adjust as needed for your scene

      // Initialize the angle
      let angle = 0;

      // Define the speed of rotation (radians per frame)
      const speed = 0.01;

      // Run the render loop
      engine.runRenderLoop(() => {
        // Update the angle for the next frame
        angle += speed;

        const x = centerX + radius * Math.cos(angle);
        const y = centerY + radius * Math.sin(angle);

        camera.setPosition(x, y);

        renderer.render();
        scene.render();
      });
    })();
  }, []);

  return <canvas id="render-canvas" ref={canvasRef}></canvas>;
}
