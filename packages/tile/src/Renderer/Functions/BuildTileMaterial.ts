import {
  Vector2,
  type RawTexture2DArray,
  type Scene,
  type Texture,
} from "@babylonjs/core";
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
uniform vec2 tileUVDimenions;
uniform vec2 tileTextureTileBounds;

uniform float time;


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
out vec4 vColor;

void main(void) {
    #ifdef INSTANCES
      // Construct the final world matrix
      mat4 finalWorld = mat4(world0, world1, world2, world3); 
   



      // Extract the color components (lower 16 bits)
      float r = float((tileData.y >> 24u) & 0xFFu) / 255.0;
      float g = float((tileData.y >> 16u) & 0xFFu) / 255.0;
      float b = float((tileData.y >> 8u) & 0xFFu) / 255.0;
      float a = float(tileData.y & 0xFFu) / 255.0;

      uint rotationIndex = (tileData.x >> 0u) & 0xFu;  // bits 0-3
      uint flipVertical = (tileData.x >> 4u) & 0x1u;  // bit 4
      uint flipHorizontal = (tileData.x >> 5u) & 0x1u;  // bit 5
      uint blendMode = (tileData.x >> 6u) & 0x7u;  // bits 6-8
     
      uint mask = 1u << rotationIndex;

      float uvX = float( (uint(uv.x) & mask ) >> rotationIndex );
      float uvY = float( (uint(uv.y) & mask ) >> rotationIndex );
      vec2 uvAdjusted = vec2(uvX,uvY);

      // Apply horizontal and vertical flips
      if (flipHorizontal == 1u) {
         uvAdjusted.x = 1.0 - uvAdjusted.x;
      }
      if (flipVertical == 1u) {
          uvAdjusted.y = 1.0 - uvAdjusted.y;
      }

      float tileIndex = float((tileData.x >> 16u) & 0xFFFFu);

      if(tileIndex == 0.) {
        vColor.a = 0.;
        return;
      }
      tileIndex -= 1.;


      

      vec2 tilePosition = vec2(
        mod(tileIndex, tileTextureTileBounds.x),
        floor(tileIndex / tileTextureTileBounds.x)
      );
 // vec2 tilePosition = vec2(0.,0.);


    uvAdjusted = uvAdjusted * tileUVDimenions + tilePosition * tileUVDimenions;


    vUV = uvAdjusted;





      // Pack the RGBA color into vColor
      vColor = vec4(r, g, b, a);
    //vColor = vec4(1.,1.,1.,1.);
      gl_Position = viewProjection * finalWorld * vec4(position, 1.0);  
    #else
      gl_Position = worldViewProjection * vec4(position, 1.0); 
    #endif




}
`;

Effect.ShadersStore["retroFragmentShader"] = /* glsl  */ `
#version 300 es
precision highp float;
precision highp sampler2D;
out vec4 FragColor;
in vec2 vUV;
in float vTextureIndex;
in vec4 vColor;

uniform sampler2D tileTexture;

void main() {
#ifdef INSTANCES
   vec4 texColor = texture(tileTexture, vec2(vUV));
   FragColor = texColor * vColor;
   if(texColor.a < .2) {

    discard;
   }
 //  FragColor = texColor;
// FragColor = vec4(1.);
#endif
#ifndef INSTANCES
    FragColor = vec4(1.,1.,1.,1.);
#endif
}

`;

export function BuildTileMaterial(
  scene: Scene,
  tileTexture: Texture,
  tileUVDimenions: Vector2,
  tileTextureTileBounds: Vector2
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
        "time",
        "viewProjection",
        "worldViewProjection",
        "tileUVDimenions",
        "tileTextureTileBounds",
      ],
      samplers: ["tileTexture"],
      needAlphaBlending: true,
      needAlphaTesting: true,
    }
  );

  let time = 0;
  scene.registerBeforeRender(() => {
    material.setFloat("time", time);
    time += 1;
  });
  material.setTexture("tileTexture", tileTexture);

  console.log(tileUVDimenions);
  material.setVector2("tileUVDimenions", tileUVDimenions);
  material.setVector2("tileTextureTileBounds", tileTextureTileBounds);

  return material;
}
