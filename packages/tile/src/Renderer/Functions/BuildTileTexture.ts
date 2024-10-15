import { Scene } from "@babylonjs/core/scene";
import { Texture } from "@babylonjs/core/Materials/Textures/texture";
import { TileTextureData } from "../../Textures/Texture.types";
import { Vec2Array } from "@amodx/math";
import { Vector2 } from "@babylonjs/core";
import { TileTextureIndex } from "../../Textures/TileTextureIndex";
import { EngineSettings } from "../../Settings/EngineSettings";

export async function BuildTileTexture(
  scene: Scene,
  tileSetSize: Vec2Array,
  textures: TileTextureData[]
) {
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d")!;

  const columns = Math.ceil(Math.sqrt(textures.length));
  const rows = Math.ceil(textures.length / columns);

  const imageWidth = columns * tileSetSize[0];
  const imageHeight = rows * tileSetSize[1];
  canvas.width = imageWidth;
  canvas.height = imageHeight;
  TileTextureIndex.setTextureTileBounds(
    imageWidth / EngineSettings.tilePixelSize[0],
    imageHeight / EngineSettings.tilePixelSize[1]
  );
  console.warn(imageWidth, imageHeight, textures);
  for (let imageY = 0; imageY < imageHeight; imageY += tileSetSize[1]) {
    let done = false;
    for (let imageX = 0; imageX < imageWidth; imageX += tileSetSize[0]) {
      const texture = textures.shift()!;
      if (!texture) {
        done = true;
        break;
      }

      await new Promise(async (resolve) => {
        const image = new Image();
        image.onload = () => {
       //   context.clearRect(imageX, imageY, tileSetSize[0], tileSetSize[1]);
          context.save();
          context.translate(0, canvas.height);
          context.scale(1, -1);


   
          context.drawImage(
            image,
            imageX,
            imageY,
            tileSetSize[0],
            tileSetSize[1]
          );

          context.restore();

          TileTextureIndex.registerTexture(
            texture.id,
            imageX / EngineSettings.tilePixelSize[0],
            imageY / EngineSettings.tilePixelSize[1],
            (imageX + tileSetSize[0]) / EngineSettings.tilePixelSize[0],
            (imageY + tileSetSize[1]) / EngineSettings.tilePixelSize[1]
          );
          console.warn("register texture", texture.id);
          resolve(true);
        };
        image.src = texture.src;
      });
    }
    if (done) break;
  }
  const tileUVDimenions = new Vector2(
    EngineSettings.tilePixelSize[0] / imageWidth,
    EngineSettings.tilePixelSize[1] / imageHeight
  );
  const tileTextureTileBounds = new Vector2(
    imageWidth / EngineSettings.tilePixelSize[0],
    imageHeight / EngineSettings.tilePixelSize[1]
  );

  console.log(tileUVDimenions, tileTextureTileBounds);

  const imageBlob = await new Promise<Blob>((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (!blob) return reject(new Error("Tile texture could not be created."));
      resolve(blob);
    }, "image/png");
  });

  const texture = new Texture(
    URL.createObjectURL(imageBlob),
    scene,
    undefined,
    undefined,
    Texture.NEAREST_NEAREST
  );

  return [texture, tileUVDimenions, tileTextureTileBounds] as const;
}
