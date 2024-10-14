import { Scene, FreeCamera, Vector3, Camera, Vector2 } from "@babylonjs/core";
import { EngineSettings } from "../Settings/EngineSettings";

export class TileCamera {
  _camera: FreeCamera;

  position = new Vector2();

  planeWidth: number;
  planeHeight: number;

  constructor(public scene: Scene) {
    // Define camera height based on your scene's scale
    const cameraHeight = 10; // Adjust as needed

    // Initialize the camera at (0, cameraHeight, 0)
    const camera = new FreeCamera(
      "PerspectiveCamera",
      new Vector3(0, 0, -cameraHeight),
      this.scene
    );
    this._camera = camera;

    // Set the camera to perspective mode (default)
    camera.mode = Camera.PERSPECTIVE_CAMERA;

    // Set the target to look at the origin
    camera.setTarget(Vector3.Zero());

    camera.minZ = 0.0001;
    camera.maxZ = 1000;

    this.planeWidth =
      EngineSettings.tilePixelSize[0] *
      EngineSettings.pixelSize *
      EngineSettings.rendererTileSize[0];

    this.planeHeight =
      EngineSettings.tilePixelSize[1] *
      EngineSettings.pixelSize *
      EngineSettings.rendererTileSize[1];

    // Calculate the Field of View (FOV) based on planeHeight and cameraHeight
    // FOV is in radians
    const fov = 2 * Math.atan(this.planeHeight / 2 / cameraHeight);
    camera.fov = fov;
    camera.rotation.y = 2 * Math.PI;

    this.setPosition(0, 0);
  }

  setPosition(x: number, y: number) {
    this.position.set(x, y);

    // Update camera position based on tile coordinates
    this._camera.position.x =
      x * EngineSettings.pixelSize + EngineSettings.rendererMeterSize[0] / 2;

    this._camera.position.y =
      y * EngineSettings.pixelSize + EngineSettings.rendererMeterSize[1] / 2;
    // this._camera.rotation.y = 2 * Math.PI;
    // E  camera.rotation.z = 2 * Math.PI;nsure the camera maintains its height
    //  this._camera.position.z = 10; // Same as initial cameraHeight

    // Re-set the target to ensure correct orientation after moving
    /*    this._camera.setTarget(new Vector3(
      this._camera.position.x,
      0,
      this._camera.position.z
    )); */
  }
}
