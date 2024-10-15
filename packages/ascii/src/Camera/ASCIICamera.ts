import { Scene, FreeCamera, Vector3, Camera, HemisphericLight } from "@babylonjs/core";

export class ASCIICamera {
  camera: FreeCamera | null;

  constructor(public scene: Scene, public rows: number, public cols: number) {}

  create() {
    const cameraHeight = 1;
    const camera = new FreeCamera(
      "OrthoCamera",
      new Vector3(0, 0, cameraHeight),
      this.scene
    );
    this.camera = camera;

    // Change camera mode to orthographic
    camera.mode = Camera.ORTHOGRAPHIC_CAMERA;
    camera.setTarget(new Vector3(0, 0, 0));

    camera.speed = 0.1;
    camera.minZ = 0.001;

    const pixelSize = 0.001;

    const light = new HemisphericLight("", new Vector3(0, 1, 0), this.scene);

    const planeWidth = 8 * pixelSize * this.cols;
    const planeHeight = 16 * pixelSize * this.rows;

    // Set orthographic camera properties
    camera.orthoLeft = 0;
    camera.orthoRight = planeWidth;
    camera.orthoBottom = 0;
    camera.orthoTop = planeHeight;

    // Position the camera to view the entire plane
    camera.position.x = planeWidth + pixelSize * 8 ;
    camera.position.y = 0 ;
  }
}
