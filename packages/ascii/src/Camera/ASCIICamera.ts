import { Scene, FreeCamera, Vector3, Camera } from "@babylonjs/core";

export class ASCIICamera {
  camera: FreeCamera | null;
  constructor(public scene: Scene, public rows: number, public cols: number) {}

  create() {
    const camera = new FreeCamera(
      "OrthoCamera",
      new Vector3(0, 10, 0),
      this.scene
    );
    this.camera = camera;
    camera.mode = Camera.ORTHOGRAPHIC_CAMERA;
    camera.setTarget(new Vector3(0, 0, 0));

    camera.speed = 0.1;
    camera.minZ = 0.001;

    const pixelSize = 0.001;

    const planeWidth = 8 * pixelSize * this.cols;
    const planeHeight = 16 * pixelSize * this.rows;

    camera.orthoLeft = 0;
    camera.orthoRight = planeWidth;
    camera.orthoTop = planeHeight;
    camera.orthoBottom = 0;
  }
}
