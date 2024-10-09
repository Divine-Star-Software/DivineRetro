import { Scene, FreeCamera, Vector3, Camera, Vector2 } from "@babylonjs/core";
import { EngineSettings } from "../Settings/EngineSettings";

export class TileCamera {
  _camera: FreeCamera;

  position = new Vector2();

  planeWidth: number;
  planeHeight: number;
  constructor(public scene: Scene) {
    const camera = new FreeCamera(
      "OrthoCamera",
      new Vector3(0, 10, 0),
      this.scene
    );
    this._camera = camera;
    camera.mode = Camera.ORTHOGRAPHIC_CAMERA;
    camera.setTarget(new Vector3(0, 0, 0));
    camera.minZ = 0.001;

    camera.rotation.y =2 *  Math.PI;

    this.planeWidth =
      EngineSettings.tilePixelSize[0] *
      EngineSettings.pixelSize *
      EngineSettings.chunkTileSize[0];

    this.planeHeight =
      EngineSettings.tilePixelSize[1] *
      EngineSettings.pixelSize *
      EngineSettings.chunkTileSize[1];

    camera.orthoLeft = -this.planeWidth / 2;
    camera.orthoRight = this.planeWidth / 2;
    camera.orthoTop = this.planeHeight / 2;
    camera.orthoBottom = -this.planeHeight / 2;
    this.setPosition(0, 0);
  }

  setPosition(x: number, y: number) {
    this.position.set(x, y);

    this._camera.position.x =
      x * EngineSettings.pixelSize + EngineSettings.chunkMeterSize[0] / 2;

    this._camera.position.z =
      y * EngineSettings.pixelSize + EngineSettings.chunkMeterSize[1] / 2;
  }
}
