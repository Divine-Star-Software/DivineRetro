import { Camera, Effect, PostProcess } from "@babylonjs/core";

Effect.ShadersStore["crtFragmentShader"] = /* glsl */ `
#ifdef GL_ES
precision highp float;
#endif

#define PI 3.1415926538

// Samplers
varying vec2 vUV;
uniform sampler2D textureSampler;

// Parameters
uniform vec2 curvature;
uniform vec2 screenResolution;
uniform vec2 scanLineOpacity;
uniform float vignetteOpacity;
uniform float brightness;
uniform float vignetteRoundness;
uniform float glowIntensity; // New uniform for glow intensity
uniform float contrast; // New uniform for contrast

vec2 curveRemapUV(vec2 uv) {
    // Distortion using a sinusoid.
    uv = uv * 2.0 - 1.0;
    vec2 offset = abs(uv.yx) / vec2(curvature.x, curvature.y);
    uv = uv + uv * offset * offset;
    uv = uv * 0.5 + 0.5;
    return uv;
}

vec4 scanLineIntensity(float uv, float resolution, float opacity) {
    float intensity = sin(uv * resolution * PI * 2.0);
    intensity = ((0.5 * intensity) + 0.5) * 0.9 + 0.1;
    return vec4(vec3(pow(intensity, opacity)), 1.0);
}

vec4 vignetteIntensity(vec2 uv, vec2 resolution, float opacity, float roundness) {
    float intensity = uv.x * uv.y * (1.0 - uv.x) * (1.0 - uv.y);
    return vec4(vec3(clamp(pow((resolution.x / roundness) * intensity, opacity), 0.0, 1.0)), 1.0);
}

// Glow effect function (blurring bright areas)
vec4 applyGlow(vec4 color, vec2 uv) {
    vec4 glowColor = vec4(0.0);
    float blurSize = 1.0 / screenResolution.x * glowIntensity; // Adjust blur size

    // Sample neighboring pixels to create a simple blur effect
    for (int x = -2; x <= 2; x++) {
        for (int y = -2; y <= 2; y++) {
            vec2 offset = vec2(float(x), float(y)) * blurSize;
            glowColor += texture2D(textureSampler, uv + offset);
        }
    }
    glowColor /= 25.0; // Normalize the blur contribution

    // Add glow based on brightness threshold
    vec3 brightColor = max(vec3(0.0), color.rgb - vec3(0.8)); // Adjust threshold
    return vec4(color.rgb + brightColor * glowColor.rgb * glowIntensity, color.a);
}

void main(void) {
  //  vec2 remappedUV = curveRemapUV(vUV); // Apply curvature
  vec2 remappedUV = vUV;
    vec4 baseColor = texture2D(textureSampler, remappedUV);

    // Apply vignette effect
    baseColor *= vignetteIntensity(remappedUV, screenResolution, vignetteOpacity, vignetteRoundness);

    // Apply scan line effect
    baseColor *= scanLineIntensity(remappedUV.x, screenResolution.y, scanLineOpacity.x);
    baseColor *= scanLineIntensity(remappedUV.y, screenResolution.x, scanLineOpacity.y);

    // Apply brightness
    baseColor *= vec4(vec3(brightness), 1.0);

    // Apply contrast
    baseColor.rgb = (baseColor.rgb - 0.5) * contrast + 0.5;

    // Apply glow effect
    baseColor = applyGlow(baseColor, remappedUV);

    // Clamp UV coordinates and set final color
    if (remappedUV.x < 0.0 || remappedUV.y < 0.0 || remappedUV.x > 1.0 || remappedUV.y > 1.0) {
        gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0);
    } else {
        gl_FragColor = baseColor;
    }
}
`;

export class RetroTerminalEffect {
  postProcess: PostProcess;
  private _contrast: number = 1;

  create(camera: Camera) {
      this.postProcess = new PostProcess(
          "CRTShaderPostProcess",
          "crt",
          [
              "curvature",
              "screenResolution",
              "scanLineOpacity",
              "vignetteOpacity",
              "brightness",
              "vignetteRoundness",
              "glowIntensity",
              "contrast"
          ],
          null,
          1,
          camera
      );

      this.postProcess.onApply = (effect) => {
          effect.setFloat2("curvature", 5.0, 5.0);
          effect.setFloat2("screenResolution", 300.0, 300.0);
          effect.setFloat2("scanLineOpacity", 0.5, 0.5);
          effect.setFloat("vignetteOpacity", 0.0);
          effect.setFloat("brightness", 2.0);
          effect.setFloat("vignetteRoundness", 0.0);
          effect.setFloat("glowIntensity", 0.0);
          effect.setFloat("contrast", this._contrast);
      };
  }

  // Method to update contrast dynamically
  setContrast(value: number) {
      this._contrast = value;
      if (this.postProcess && this.postProcess.onApply) {
          this.postProcess.onApply = this.postProcess.onApply.bind(this);
          this.postProcess.getEffect()?.setFloat("contrast", this._contrast);
      }
  }
}