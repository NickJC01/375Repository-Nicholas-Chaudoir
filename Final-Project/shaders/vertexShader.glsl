uniform float time;              // Time uniform to animate ripples
uniform vec3 clickPosition;      // Position of the click triggering ripples
varying vec2 vUv;                // Texture coordinates passed to the fragment shader
varying float vWave;             // Height of the ripple passed to the fragment shader
varying vec3 vNormal;            // Normal vector for lighting calculations
varying vec3 vPosition;          // Vertex position for reflection/refraction

void main() {
    vec3 pos = position; // Vertex position in object space

    // Calculate radial distance from the click position
    float distanceFromClick = distance(vec2(pos.x, pos.y), clickPosition.xy);

    // Ripple parameters
    float elapsedTime = time;
    float waveSpeed = 6.0;        // Speed of ripple propagation
    float waveFrequency = 3.0;    // Number of waves in the ripple
    float decayRate = 1.5;        // Exponential decay to dampen ripples

    // Generate ripple
    float ripple = 0.15 * sin(distanceFromClick * waveFrequency - elapsedTime * waveSpeed);
    ripple *= exp(-distanceFromClick * decayRate); // Apply decay over distance

    // Apply ripple displacement to the Z-coordinate
    pos.z += ripple;

    // Pass values to the fragment shader
    vWave = ripple;               // Ripple height
    vUv = uv;                     // UV coordinates
    vNormal = normal;             // Normal for lighting
    vPosition = pos;              // Position for reflections/refractions

    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0); // Final vertex position
}
