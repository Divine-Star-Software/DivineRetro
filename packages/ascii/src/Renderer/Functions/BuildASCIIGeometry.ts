import {
  CreateBox,
  Material,
  Mesh,
  Scene,
  StandardMaterial,
  VertexBuffer,
} from "@babylonjs/core";
import { EntityTool } from "../Classes/EntityTool";

export function BuildASCIIGeometry(scene: Scene, material: Material) {
  // 8x16 pixel size in meters (assuming each pixel is 1mm or 0.001 meters)
  const pixelSize = 0.001;
  const meterSize = [8 * pixelSize, 16 * pixelSize]; // 8mm x 16mm

  const instanceMesh = new Mesh("ascii-quad", scene);

  instanceMesh.setVerticesData(VertexBuffer.PositionKind, [
    // Top-right corner
    meterSize[0],
    meterSize[1],
    0,
    // Top-left corner
    0,
    meterSize[1],
    0,
    // Bottom-left corner
    0,
    0,
    0,
    // Bottom-right corner
    meterSize[0],
    0,
    0,
  ]);

  instanceMesh.setVerticesData(
    VertexBuffer.NormalKind,
    [0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1]
  );

  instanceMesh.setVerticesData(VertexBuffer.UVKind, [0, 0, 1, 0, 1, 1, 0, 1]);

  instanceMesh.setIndices([0, 2, 1, 0, 3, 2]);

  instanceMesh.material = material;
  const entityTool = new EntityTool(instanceMesh);

  instanceMesh.alwaysSelectAsActiveMesh = true;
  return entityTool;
}
