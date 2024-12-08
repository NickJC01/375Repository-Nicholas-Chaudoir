uniform vec3 baseColor;          // Base water color
uniform float opacity;           // Transparency level
uniform sampler2D backgroundTexture; // Pond base texture
varying float vWave;             // Ripple height from the vertex shader
varying vec2 vUv;                // Texture coordinates

void main() {
    // Distort UV coordinates based on ripple height for a water-like effect
    vec2 distortedUv = vUv + vWave * 0.05;

    // Sample the background texture (pond base)
    vec3 background = texture2D(backgroundTexture, distortedUv).rgb;

    // Blend base color with distorted background texture
    vec3 waterColor = mix(baseColor, background, 0.6);

    // Add ripple highlights for realism
    float highlight = smoothstep(0.05, 0.2, abs(vWave)) * 0.8;
    vec3 rippleColor = mix(waterColor, vec3(1.0, 1.0, 1.0), highlight);

    // Output the final color with transparency
    gl_FragColor = vec4(rippleColor, opacity);
}
