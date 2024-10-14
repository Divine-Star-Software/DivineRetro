import {
  CreateBox,
  Material,
  Mesh,
  Scene,
  StandardMaterial,
  VertexBuffer,
} from "@babylonjs/core";
import { EntityTool } from "../Classes/EntityTool";
import { EngineSettings } from "../../Settings/EngineSettings";
function compose(...bits: number[]): number {
  // Validate that all inputs are either 0 or 1
  for (const bit of bits) {
    if (bit !== 0 && bit !== 1) {
      throw new Error(`Invalid bit value: ${bit}. Only 0 or 1 are allowed.`);
    }
  }

  // Combine bits into a single number
  let result = 0;
  for (const bit of bits) {
    result = (result << 1) | bit;
  }

  return result;
}

export function BuildTileGeometry(scene: Scene) {
  // 8x16 pixel size in meters (assuming each pixel is 1mm or 0.001 meters)

  const instanceMesh = new Mesh("tile-quad", scene);

  const meterSize = EngineSettings.tileMeterSize;
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

  const deg0UV = [
    // v1
    1, 0,
    // v2
    0, 0,
    // v3
    0, 1,
    // v4
    1, 1,
  ];

  const deg90UV = [
    // v1
    0, 0,
    // v2
    0, 1,
    // v3
    1, 1,
    // v4
    1, 0,
  ];

  const deg180UV = [
    // v1 original (1, 0) becomes (0, 1)
    0, 1,
    // v2
    1, 1,
    // v3
    1, 0,
    // v4
    0, 0,
  ];

  const deg270UV = [
    // v1
    1, 1,
    // v2
    1, 0,
    // v3
    0, 0,
    // v4
    0, 1,
  ];

  const finalUVS: number[] = [];

  for (let i = 0; i < deg0UV.length; i++) {
    finalUVS[i] = compose(deg270UV[i], deg180UV[i], deg90UV[i], deg0UV[i]);
  }

  instanceMesh.setVerticesData(VertexBuffer.UVKind, finalUVS);

  instanceMesh.setIndices([0, 1, 2, 2, 3, 0]);

  return instanceMesh;
}
