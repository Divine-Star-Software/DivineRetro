import { WorldDataRegister } from "../Data/WorldDataRegister";
import { ArchivedChunkData, ArchivedWorldData } from "./Archive.types";
import { TileTextureIndex } from "../Textures/TileTextureIndex";
import { TileManager } from "../Tiles/TileManager";

type ExportWorldProps = {
  worldId: string;
};
const base64Chars =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
async function base64ArrayBuffer(arrayBuffer: ArrayBuffer): Promise<string> {

  const ds = new CompressionStream("gzip");
  const writer = ds.writable.getWriter();
  writer.write(arrayBuffer);
  writer.close();

  arrayBuffer = await new Response(ds.readable).arrayBuffer();
  const bytes = new Uint8Array(arrayBuffer);
  const len = bytes.length;
  let base64 = "";
  let i;

  for (i = 0; i < len - 2; i += 3) {
    base64 += base64Chars[bytes[i] >> 2];
    base64 += base64Chars[((bytes[i] & 3) << 4) | (bytes[i + 1] >> 4)];
    base64 += base64Chars[((bytes[i + 1] & 15) << 2) | (bytes[i + 2] >> 6)];
    base64 += base64Chars[bytes[i + 2] & 63];
  }

  if (i < len) {
    base64 += base64Chars[bytes[i] >> 2];
    if (i === len - 1) {
      base64 += base64Chars[(bytes[i] & 3) << 4];
      base64 += "==";
    } else {
      base64 += base64Chars[((bytes[i] & 3) << 4) | (bytes[i + 1] >> 4)];
      base64 += base64Chars[(bytes[i + 1] & 15) << 2];
      base64 += "=";
    }
  }

  return base64;
}

function arrayBufferToBase64(
  buffer: Uint16Array | Uint32Array | Uint8Array
): Promise<string> | number {
  const firstValue = buffer[0];
  const len = buffer.length;

  for (let i = 1; i < len; i++) {
    if (buffer[i] !== firstValue) {
      return base64ArrayBuffer(buffer.buffer);
    }
  }

  return firstValue;
}

export default async function ExportWorld(data: ExportWorldProps) {
  const world = WorldDataRegister.worlds.get(data.worldId);

  if (!world) throw new Error(`World ${data.worldId} does not exist`);

  const archivedWorld: ArchivedWorldData = {
    id: world.id,
    chunks: [],
    tilePalette: TileManager.tilePalette._palette,
    tileTextureIndex: TileTextureIndex.getIndexData(),
  };

  for (const chunk of world.chunks) {
    if (!chunk) continue;
    const chunkData: ArchivedChunkData = {
      layers: {},
      position: [...chunk.position],
    };

    for (const layerId in chunk.layers) {
      const layer = chunk.layers[layerId];
      const promises = [
        arrayBufferToBase64(layer.colors),
        arrayBufferToBase64(layer.states),
        arrayBufferToBase64(layer.textures),
        arrayBufferToBase64(layer.tileStates),
        arrayBufferToBase64(layer.tiles),
      ];

      const [colors, states, textures, tileStates, tiles] = await Promise.all(
        promises.map((p) => Promise.resolve(p))
      );

      chunkData.layers[layer.layerId] = {
        colors,
        states,
        textures,
        tileStates,
        tiles,
      };
    }
    archivedWorld.chunks.push(chunkData);
  }

  return archivedWorld;
}
