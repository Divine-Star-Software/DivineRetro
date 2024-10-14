import { useEffect, useRef, useState } from "react";

import { TileRenderer } from "@divineretro/tile/Renderer/TileRenderer";
import {
  ActionEvent,
  ActionManager,
  CreateGround,
  ExecuteCodeAction,
  HemisphericLight,
  StandardMaterial,
  Vector3,
} from "@babylonjs/core";

import { WorldBuilderManager } from "WorldBuilder/WorldBuilderManager";
import { TileControls } from "./TileControls";


export function TileConstructor(props: { renderer: TileRenderer }) {
  useEffect(() => {
    const light = new HemisphericLight(
      "",
      new Vector3(0, 1, 0),
      props.renderer.scene
    );
    const pickGround = CreateGround(
      "",
      {
        width: 1_000_000,
        height: 1_000_000,
      },
      props.renderer.scene
    );
    pickGround.position.y = 0;
    pickGround.renderingGroupId = 0;
    const mat = new StandardMaterial("", props.renderer.scene);
    mat.alpha = 0;
    mat.diffuseColor.set(1,0,0);
    pickGround.rotation.x = -Math.PI/2;
    pickGround.material = mat;

    // Prevent context menu on right-click

    pickGround.actionManager = new ActionManager(props.renderer.scene);
    pickGround.actionManager.registerAction(
      new ExecuteCodeAction(
        ActionManager.OnRightPickTrigger,
        (event: ActionEvent) => {
          //  event.preventDefault();
          (event.sourceEvent as MouseEvent).preventDefault();
        }
      )
    );

    return () => {
      pickGround.dispose(); // Clean up the ground when the component unmounts
    };
  }, [props.renderer.scene]);

  return (
    <div className="tile-data-selector">

      <TileControls renderer={props.renderer} /> 
    </div>
  );
}
