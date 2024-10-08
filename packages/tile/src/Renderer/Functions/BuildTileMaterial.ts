import type { RawTexture2DArray, Scene } from "@babylonjs/core";
import { ShaderMaterial } from "@babylonjs/core/Materials/shaderMaterial";
import { Effect } from "@babylonjs/core/Materials/effect";

Effect.ShadersStore["retroVertexShader"] = /* glsl  */ `
#version 300 es
precision highp float;
// Attributes
in vec3 position;
in vec3 normal;

in vec2 uv;
// Uniforms

uniform mat4 worldViewProjection;                
uniform mat4 viewProjection;   


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
out float vTextureIndex;
out vec4 vColor;

void main(void) {
    #ifdef INSTANCES
      // Construct the final world matrix
      mat4 finalWorld = mat4(world0, world1, world2, world3); 
      // Unpack faceData
      // Extract the texture index (upper 16 bits)
      vTextureIndex = float((faceData >> 16u) & 0xFFFFu);

      // Extract the color components (lower 16 bits)
      float r = float((faceData >> 12u) & 0xFu) / 15.0;
      float g = float((faceData >> 8u) & 0xFu) / 15.0;
      float b = float((faceData >> 4u) & 0xFu) / 15.0;
      float a = float(faceData & 0xFu) / 15.0;

      // Pack the RGBA color into vColor
      vColor = vec4(r, g, b, a);
      gl_Position = viewProjection * finalWorld * vec4(position, 1.0);  
    #else
      gl_Position = worldViewProjection * vec4(position, 1.0); 
    #endif

    vUV = uv;


}
`;

Effect.ShadersStore["retroFragmentShader"] = /* glsl  */ `
#version 300 es
precision highp float;
precision highp sampler2DArray;
out vec4 FragColor;
in vec2 vUV;
in float vTextureIndex;
in vec4 vColor;

uniform sampler2DArray tileTexture;

void main() {
#ifdef INSTANCES
   vec4 color = texture(tileTexture, vec3(vUV, vTextureIndex));
   FragColor = color * vColor;
#endif
#ifndef INSTANCES
    FragColor = vec4(1.,1.,1.,1.);
#endif
}

`;

export function BuildTileMaterial(
  scene: Scene,
  tileTexture: RawTexture2DArray
) {
  const material = new ShaderMaterial(
    "shader",
    scene,
    {
      vertex: "retro",
      fragment: "retro",
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
        "retroColors",
        "retroBrightColors",
      ],
      samplers: ["tileTexture"],
    }
  );
  material.setTexture("tileTexture", tileTexture);

  return material;
}
