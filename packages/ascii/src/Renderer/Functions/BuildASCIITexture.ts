import { Scene } from "@babylonjs/core/scene";
import { Texture } from "@babylonjs/core/Materials/Textures/texture";
import { ASCIIMapping } from "../ASCIIMapping";
import { Flat2DIndex } from "@amodx/math";

export function BuildASCIITexture(scene: Scene): Texture {
  const numChars = 256;
  const charWidth = 8;
  const charHeight = 16;
  const textureCharWidth = 16;
  const textureCharHeight = 16;
  const padding = 4; // Add 4-pixel padding
  const cellWidth = charWidth + padding * 2;
  const cellHeight = charHeight + padding * 2;

  const canvas = document.createElement("canvas");
  canvas.width = cellWidth * textureCharWidth;
  canvas.height = cellHeight * textureCharHeight;

  const context = canvas.getContext("2d");

  if (!context) {
    throw new Error("Failed to get 2D context");
  }

  const index = Flat2DIndex.GetXYOrder();
  index.setBounds(16, 16);

  context.textAlign = "center";
  context.textBaseline = "middle";
  context.font = `${charHeight}px monospace`;
  context.translate(0, canvas.height);
  context.scale(1, -1);

  for (let i = 0; i < numChars; i++) {
    const [x, y] = index.getXY(i);
    const char = ASCIIMapping.getCharFromCode(i);

    context.fillStyle = "white";
    context.fillText(
      char,
      x * cellWidth + padding + charWidth / 2,
      y * cellHeight + padding + charHeight / 2
    );
  }

  const texture = new Texture(
    canvas.toDataURL("image/png"),
    scene,
    undefined,
    undefined,
    Texture.NEAREST_NEAREST
  );

  return texture;
}
