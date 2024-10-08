import { RawTexture2DArray } from "@babylonjs/core/Materials/Textures/rawTexture2DArray";
import { Scene } from "@babylonjs/core/scene";
import { Constants } from "@babylonjs/core/Engines/constants";
import { Texture } from "@babylonjs/core/Materials/Textures/texture";
import { ASCIIMapping } from "../ASCIIMapping";

export function BuildASCIITexture(scene: Scene): RawTexture2DArray {
  const numChars = 256;
  const charWidth = 16;
  const charHeight = 32;

  const totalDataSize = numChars * charWidth * charHeight * 4; // RGBA

  const data = new Uint8Array(totalDataSize);

  const canvas = document.createElement("canvas");
  canvas.width = charWidth;
  canvas.height = charHeight;

  const context = canvas.getContext("2d");

  if (!context) {
    throw new Error("Failed to get 2D context");
  }

  context.textAlign = "center";
  context.textBaseline = "middle";
  context.font = `${
    charHeight 
  }px monospace`;

  for (let i = 0; i < numChars; i++) {
    context.clearRect(0, 0, charWidth, charHeight);

    const char = ASCIIMapping.getCharFromCode(i);
    context.clearRect(0, 0, charWidth, charHeight);
    context.fillStyle = "white";
    context.fillText(char, charWidth / 2, charHeight / 2);

    const imageData = context.getImageData(0, 0, charWidth, charHeight);

    const offset = i * charWidth * charHeight * 4;
    data.set(imageData.data, offset);
  }

  const texture = new RawTexture2DArray(
    data,
    charWidth,
    charHeight,
    numChars, // depth
    Constants.TEXTUREFORMAT_RGBA,
    scene,
    false, // generateMipMaps
    false, // invertY
    Texture.NEAREST_SAMPLINGMODE,
    Constants.TEXTURETYPE_UNSIGNED_BYTE
  );

  return texture;
}
