import { RawTexture2DArray } from "@babylonjs/core/Materials/Textures/rawTexture2DArray";
import { Constants } from "@babylonjs/core/Engines/constants";
import { Texture } from "@babylonjs/core/Materials/Textures/texture";
export function BuildTileTexture(scene, textureURL) {
    const numChars = 256;
    const charWidth = 8;
    const charHeight = 8;
    const totalDataSize = numChars * charWidth * charHeight * 4; // RGBA
    const data = new Uint8Array(totalDataSize);
    const canvas = document.createElement("canvas");
    canvas.width = charWidth;
    canvas.height = charHeight;
    const texture = new RawTexture2DArray(data, charWidth, charHeight, numChars, Constants.TEXTUREFORMAT_RGBA, scene, false, false, Texture.NEAREST_SAMPLINGMODE, Constants.TEXTURETYPE_UNSIGNED_BYTE);
    return texture;
}
