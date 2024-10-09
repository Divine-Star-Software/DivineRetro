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
in uvec2 tileData;
#endif

// Varying
out vec2 vUV;
out float vTextureIndex;
out vec4 vColor;

void main(void) {
    #ifdef INSTANCES
      // Construct the final world matrix
      mat4 finalWorld = mat4(world0, world1, world2, world3); 
      // Unpack tileData
      vTextureIndex = float((tileData.x >> 16u) & 0xFFFFu);

      // Extract the color components (lower 16 bits)
      float r = float((tileData.x >> 12u) & 0xFu) / 15.0;
      float g = float((tileData.x >> 8u) & 0xFu) / 15.0;
      float b = float((tileData.x >> 4u) & 0xFu) / 15.0;
      float a = float(tileData.x & 0xFu) / 15.0;




      uint rotationIndex = tileData.y & 3u;


      // Create a mask with a 1 at the desired bit position
      uint mask = 1u << rotationIndex;

      // Extract the bit by masking and shifting
      float uvX = float( (uint(uv.x) & mask ) >> rotationIndex );
      float uvY = float( (uint(uv.y) & mask ) >> rotationIndex );
      vUV = vec2(uvX,uvY);





      // Pack the RGBA color into vColor
      vColor = vec4(r, g, b, a);
      gl_Position = viewProjection * finalWorld * vec4(position, 1.0);  
    #else
      gl_Position = worldViewProjection * vec4(position, 1.0); 
    #endif




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
vec4 texColor = texture(tileTexture, vec3(vUV, vTextureIndex));
    // Apply tint by multiplying RGB and handling alpha appropriately
    FragColor = texColor * vColor;
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
        "tileData",
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
      needAlphaBlending:true,
      needAlphaTesting:true
    }
  );
  material.setTexture("tileTexture", tileTexture);

  return material;
}
