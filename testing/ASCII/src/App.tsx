import { useEffect, useRef, useState } from "react";
import { Engine, Scene } from "@babylonjs/core";
import { ASCIICamera } from "@divineretro/ascii/Camera/ASCIICamera";
import { RetroTerminalEffect } from "@divineretro/ascii/Effects/RetroTerminalEffect";
import { ASCIIRender } from "@divineretro/ascii/Renderer/ASCIIRenderer";
import { StartGame } from "Code/StartGame";
let init = false;

export function App() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (init) return;
    init = true;

    const rows = 40;
    const cols = 80;

    const engine = new Engine(canvasRef.current!);

    const scene = new Scene(engine);
    scene.clearColor.set(0, 0, 0, 1);

    const camera = new ASCIICamera(scene, rows, cols);
    camera.create();
    const effect = new RetroTerminalEffect();
    effect.create(camera.camera!);
    const renderer = new ASCIIRender(scene, rows, cols);

    engine.runRenderLoop(() => {
      scene.render();
    });

    StartGame(renderer);
  }, []);

  return <canvas id="main" className="render-canvas" ref={canvasRef}></canvas>;
}
