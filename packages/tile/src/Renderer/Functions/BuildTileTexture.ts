import { RawTexture2DArray } from "@babylonjs/core/Materials/Textures/rawTexture2DArray";
import { Scene } from "@babylonjs/core/scene";
import { Constants } from "@babylonjs/core/Engines/constants";
import { Texture } from "@babylonjs/core/Materials/Textures/texture";
import { TileTextureData } from "../../Textures/Texture.types";
import { TileTextureIndex } from "../../Textures/TileTextureIndex";
import { EngineSettings } from "../../Settings/EngineSettings";

export async function BuildTileTexture(
  scene: Scene,
  textures: TileTextureData[]
): Promise<RawTexture2DArray> {
  const tileWidth = EngineSettings.tilePixelSize[0];
  const tileHeight = EngineSettings.tilePixelSize[1];
  const arrays: Uint8ClampedArray[] = [
    new Uint8ClampedArray(tileWidth * tileHeight * 4),
  ];

  const canvas = document.createElement("canvas");

  let totalLength = tileWidth * tileHeight * 4;
  const context = canvas.getContext("2d")!;

  for (const texture of textures) {
    await new Promise(async (resolve) => {
      const image = new Image();
      image.onload = () => {
        const width = image.width;
        const height = image.height;
        canvas.width = width;
        canvas.height = height;
        context.clearRect(0, 0, width, height);
        context.drawImage(image, 0, 0, width!, height!);

        const tilesX = width / tileWidth;
        const tilesY = height / tileHeight;

        const textureIndex = TileTextureIndex.registerTexture(
          texture.id,
          tilesX,
          tilesY
        );
        const startingIndex = arrays.length;

        for (let x = 0; x < width; x += tileWidth) {
          for (let y = 0; y < height; y += tileHeight) {
            const data = context.getImageData(x, y, tileWidth, tileHeight);

            arrays[
              startingIndex +
                textureIndex.getIndexXY(x / tileWidth, y / tileHeight)
            ] = data.data;
            totalLength += data.data.length;
          }
        }

        resolve(true);
      };
      image.src = texture.src;
    });
  }

  const data = new Uint8ClampedArray(totalLength);

  let index = 0;

  for (let a = 0; a < arrays.length; a++) {
    const array = arrays[a];
    for (let i = 0; i < array.length; i++) {
      data[index + i] = array[i];
    }
    index += array.length;
  }

  const texture = new RawTexture2DArray(
    data,
    tileWidth,
    tileHeight,
    arrays.length,
    Constants.TEXTUREFORMAT_RGBA,
    scene,
    false,
    false,
    Texture.NEAREST_SAMPLINGMODE,
    Constants.TEXTURETYPE_UNSIGNED_BYTE
  );

  return texture;
}
