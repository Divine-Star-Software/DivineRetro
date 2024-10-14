import { WorldData } from "Data/Classes/World";
import { ArchivedWorldData } from "./Archive.types";
import { Flat2DIndex, Vector3Like } from "@amodx/math";
import { ChunkData } from "../Data/Classes/Chunk";
import { ChunkLayer } from "../Data/Classes/ChunkLayer";
import { StringPalette } from "../Classes/StringPalette";
import { TileManager } from "../Tiles/TileManager";
import { TileTextureIndex } from "../Textures/TileTextureIndex";
import { WorldSpaces } from "../Data/WorldSpace";

/**
 * Converts a Base64-encoded string back to an ArrayBuffer.
 * It assumes the Base64 string was created by compressing the original ArrayBuffer using Gzip.
 *
 * @param base64 - The Base64-encoded string to convert.
 * @returns A Promise that resolves to the original ArrayBuffer.
 */
async function base64ToArrayBuffer(base64: string): Promise<ArrayBuffer> {
  // Step 1: Decode the Base64 string to binary data
  const binaryString = atob(base64);
  const binaryLen = binaryString.length;
  const bytes = new Uint8Array(binaryLen);

  for (let i = 0; i < binaryLen; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }

  // Create a Blob from the binary data with the appropriate MIME type
  const compressedBlob = new Blob([bytes], {
    type: "application/octet-stream",
  });

  // Step 2: Decompress the Blob using DecompressionStream with Gzip
  const decompressedBlob = await new Response(
    compressedBlob.stream().pipeThrough(new DecompressionStream("gzip"))
  ).blob();

  // Step 3: Convert the decompressed Blob back to an ArrayBuffer
  const arrayBuffer = await decompressedBlob.arrayBuffer();

  return arrayBuffer;
}

type ImportWorldProps = {
  data: ArchivedWorldData;
};
export default async function ImportWorld({ data }: ImportWorldProps) {
  const worldData: WorldData = {
    id: data.id,
    chunks: [],
  };

  const tilePalette = new StringPalette(data.tilePalette);

  const textureIds = Object.keys(data.tileTextureIndex.mapped);
  const textureIndexer = Flat2DIndex.GetXYOrder();
  textureIndexer.setBounds(...data.tileTextureIndex.textureBounds);
  for (const chunk of data.chunks) {
    const chunkData: ChunkData = {
      position: chunk.position,
      layers: [],
    };
    worldData.chunks[
      Vector3Like.HashXYZ(chunk.position[0], chunk.position[1], 0)
    ] = chunkData;

    for (const layerId in chunk.layers) {
      const layer = chunk.layers[layerId];
      const newLayer = ChunkLayer.Create({
        layerId: Number(layerId),
        colors:
          typeof layer.colors == "number"
            ? new Uint32Array(WorldSpaces.chunkTileIndex.size).fill(layer.colors)
            : new Uint32Array(await base64ToArrayBuffer(layer.colors)),
        states:
          typeof layer.states == "number"
            ? new Uint16Array(WorldSpaces.chunkTileIndex.size).fill(layer.states)
            : new Uint16Array(await base64ToArrayBuffer(layer.states)),
        textures:
          typeof layer.textures == "number"
            ? new Uint16Array(WorldSpaces.chunkTileIndex.size).fill(layer.textures)
            : new Uint16Array(await base64ToArrayBuffer(layer.textures)),
        tileStates:
          typeof layer.tileStates == "number"
            ? new Uint8Array(WorldSpaces.chunkTileIndex.size).fill(layer.tileStates)
            : new Uint8Array(await base64ToArrayBuffer(layer.tileStates)),
        tiles:
          typeof layer.tiles == "number"
            ? new Uint16Array(WorldSpaces.chunkTileIndex.size).fill(layer.tiles)
            : new Uint16Array(await base64ToArrayBuffer(layer.tiles)),
      });

      for (let i = 0; i < newLayer.tiles.length; i++) {
        const tileId = tilePalette.getStringId(newLayer.tiles[i]);
        if (!TileManager.tilePalette.isRegistered(tileId)) {
          console.warn(`${tileId} is not a registered tile`);
          newLayer.tiles[i] = 0;
          continue;
        }
        newLayer.tiles[i] = TileManager.tilePalette.getNumberId(tileId);

        const textureIndex = newLayer.textures[i];
        if (textureIndex == 0) continue;
        for (let t = 0; t < textureIds.length; t++) {
          const bounds = data.tileTextureIndex.mapped[textureIds[t]];
          const [x, y] = textureIndexer.getXY(textureIndex - 1);

          if (
            x < bounds[0][0] ||
            x > bounds[1][0] ||
            y < bounds[0][1] ||
            y > bounds[1][1]
          )
            continue;

          if (!TileTextureIndex._bounds.has(textureIds[t])) {
            console.warn(`Texture with id ${textureIds[t]} is not registered`);
            newLayer.textures[i] = 0;
            break;
          }

          newLayer.textures[i] = TileTextureIndex.getIndex(
            textureIds[t],
            x - bounds[0][0],
            y - bounds[0][1]
          );
          break;
        }
      }

      chunkData.layers[layerId] = newLayer;
    }
  }

  return worldData;
}
