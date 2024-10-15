import {
  Vector2,
  type Scene,
  type Texture,
} from "@babylonjs/core";
import { ShaderMaterial } from "@babylonjs/core/Materials/shaderMaterial";
import { Effect } from "@babylonjs/core/Materials/effect";
import { ConsoleColors } from "../ASCIIMapping";

Effect.ShadersStore["asciiVertexShader"] = /* glsl */ `
#version 300 es
precision highp float;
// Attributes
in vec3 position;
in vec3 normal;
in vec2 uv;
// Uniforms
uniform mat4 worldViewProjection;                
uniform mat4 viewProjection;   
uniform vec3[9] asciiColors;   
uniform vec3[9] asciiBrightColors;   
uniform vec2 tileUVDimenions;
uniform vec2 tileTextureTileBounds;
uniform vec2 charSizeInCell;
uniform vec2 charOffsetInCell;

#ifdef INSTANCES
// Matrices
in vec4 world0;
in vec4 world1;
in vec4 world2;
in vec4 world3;
// Custom attributes
in uint faceData;
#endif

// Varying
out vec2 vUV;
out vec3 vColor;
out vec3 vBGColor;

const uint CHAR_INDEX_MASK = 0xFFu;
const uint CHAR_INDEX_SHIFT = 24u;

const uint FG_COLOR_MASK = 0xFFu;
const uint FG_COLOR_SHIFT = 16u;

const uint BG_COLOR_MASK = 0xFFu;
const uint BG_COLOR_SHIFT = 8u;

const uint BOLD_MASK = 1u << 0u;
const uint DIM_MASK = 1u << 1u;
const uint BLINKING_MASK = 1u << 2u;

void main(void) {
    #ifdef INSTANCES
        // Construct the final world matrix
        mat4 finalWorld = mat4(world0, world1, world2, world3); 
        gl_Position = viewProjection * finalWorld * vec4(position, 1.0);  

        uint charData = uint(faceData);
        float charIndex = float((charData >> CHAR_INDEX_SHIFT) & CHAR_INDEX_MASK);

        float tileX = mod(charIndex, tileTextureTileBounds.x);
        float tileY = floor(charIndex / tileTextureTileBounds.x);
        vec2 tilePosition = vec2(tileX, tileY);

        vec2 adjustedUV = uv * charSizeInCell + charOffsetInCell;
        vUV = (adjustedUV + tilePosition) * tileUVDimenions;

        uint fgColorIndex = (charData >> FG_COLOR_SHIFT) & FG_COLOR_MASK;
        uint bgColorIndex = (charData >> BG_COLOR_SHIFT) & BG_COLOR_MASK;

        bool isBold = (charData & BOLD_MASK) != 0u;
        bool isDim = (charData & DIM_MASK) != 0u;
        bool isBlinking = (charData & BLINKING_MASK) != 0u;

        if (fgColorIndex > 0u) {
            vColor = asciiColors[fgColorIndex];
            if (isBold) {
                vColor *= 1.3; // Increase brightness for bold
            }
            if (isDim) {
                vColor *= 0.3; // Decrease brightness for dim
            }
        } else {
            vColor = vec3(1.);
        }

        if (bgColorIndex > 0u) {
            vBGColor = asciiColors[bgColorIndex];
        } else {
            vBGColor = vec3(0.);
        }

    #else
        gl_Position = worldViewProjection * vec4(position, 1.0); 
    #endif
}`;
 
Effect.ShadersStore["asciiFragmentShader"] = /* glsl */ `
#version 300 es
precision highp float;
precision highp sampler2D;
out vec4 FragColor;
in vec2 vUV;
in vec3 vColor;
in vec3 vBGColor;

uniform sampler2D asciiTexture;

void main() {
    #ifdef INSTANCES
    vec4 color = texture(asciiTexture, vUV);
    if (color.a < 0.2) {
        FragColor = vec4(vBGColor, 1.);
        return;
    }
    FragColor = vec4(color.rgb * vColor, 1.); 
    #endif
    #ifndef INSTANCES
    FragColor = vec4(1., 1., 1., 1.);
    #endif
}
`;

type ColorValue = [r: number, g: number, b: number];

const ASCIIColors: ColorValue[] = [];
ASCIIColors[0] = [0, 0, 0];
ASCIIColors[ConsoleColors.Black] = [0, 0, 0];
ASCIIColors[ConsoleColors.Red] = [187, 0, 0];
ASCIIColors[ConsoleColors.Purple] = [187, 0, 187];
ASCIIColors[ConsoleColors.Green] = [0, 187, 0];
ASCIIColors[ConsoleColors.Blue] = [0, 0, 187];
ASCIIColors[ConsoleColors.Cyan] = [0, 187, 187];
ASCIIColors[ConsoleColors.Yellow] = [187, 187, 0];
ASCIIColors[ConsoleColors.White] = [187, 187, 187];

const BrightASCIIColors: ColorValue[] = [];
BrightASCIIColors[0] = [0, 0, 0];
BrightASCIIColors[ConsoleColors.Black] = [85, 85, 85];
BrightASCIIColors[ConsoleColors.Red] = [255, 85, 85];
BrightASCIIColors[ConsoleColors.Purple] = [255, 85, 255];
BrightASCIIColors[ConsoleColors.Green] = [85, 255, 85];
BrightASCIIColors[ConsoleColors.Blue] = [85, 85, 255];
BrightASCIIColors[ConsoleColors.Cyan] = [85, 255, 255];
BrightASCIIColors[ConsoleColors.Yellow] = [255, 255, 85];
BrightASCIIColors[ConsoleColors.White] = [255, 255, 255];

export function BuildASCIIMaterial(scene: Scene, asciiTexture: Texture) {
  const material = new ShaderMaterial(
    "shader",
    scene,
    {
      vertex: "ascii",
      fragment: "ascii",
    },
    {
      attributes: [
        "position",
        "normal",
        "faceData",
        "uv",
        "world0",
        "world1",
        "world2",
        "world3",
      ],
      uniforms: [
        "viewProjection",
        "worldViewProjection",
        "asciiColors",
        "asciiBrightColors",
        "tileUVDimenions",
        "tileTextureTileBounds",
        "charSizeInCell",
        "charOffsetInCell",
      ],
      samplers: ["asciiTexture"],
    }
  );

  material.setTexture("asciiTexture", asciiTexture);
  material.setArray3(
    "asciiColors",
    ASCIIColors.flatMap((_) => _.map((n) => n / 255))
  );
  material.setArray3(
    "asciiBrightColors",
    BrightASCIIColors.flatMap((_) => _.map((n) => n / 255))
  );

  const charWidth = 8;
  const charHeight = 16;
  const padding = 4;
  const cellWidth = charWidth + padding * 2; // 16
  const cellHeight = charHeight + padding * 2; // 24
  const textureCharWidth = 16;
  const textureCharHeight = 16;

  // Compute tile dimensions in UV space
  const tileUVDimensions = new Vector2(1 / textureCharWidth, 1 / textureCharHeight);
  material.setVector2("tileUVDimenions", tileUVDimensions);

  // Compute character size and offset within each cell
  const charSizeInCell = new Vector2(charWidth / cellWidth, charHeight / cellHeight);
  const charOffsetInCell = new Vector2(padding / cellWidth, padding / cellHeight);
  material.setVector2("charSizeInCell", charSizeInCell);
  material.setVector2("charOffsetInCell", charOffsetInCell);

  material.setVector2("tileTextureTileBounds", new Vector2(16, 16));

  return material;
}
