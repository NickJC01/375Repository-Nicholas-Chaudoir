/////////////////////////////////////////////////////////////////////////////
//
//  ExperimentalCube.js
//
//  A cube rendered using instanced rendering.
//
class ExperimentalCube {
    constructor(gl, vertexShader, fragmentShader) {

        vertexShader ||= `
            in vec4 aPosition;
            in vec4 aColor;
            uniform mat4 P;
            uniform mat4 MV;

            // Instance-specific data
            uniform vec3 instanceOffsets[4]; // Array of 4 offsets for instancing
            uniform float instanceScales[4]; // Array of scale factors for each instance

            out vec4 vColor;

            void main() {
                // Each instance gets a unique offset and scale using gl_InstanceID
                vec3 offset = instanceOffsets[gl_InstanceID];
                float scale = instanceScales[gl_InstanceID];

                // Apply scaling and translation based on the instance ID
                vec4 scaledPosition = vec4(aPosition.xyz * scale, 1.0) + vec4(offset, 0.0);

                gl_Position = P * MV * scaledPosition;
                vColor = aColor;
            }
        `;

        fragmentShader ||= `
            precision mediump float;
            in vec4 vColor;
            out vec4 fColor;

            void main() {
                fColor = vColor;
            }
        `;

        let program = new ShaderProgram(gl, this, vertexShader, fragmentShader);

        // Define the 8 unique cube vertices
        const positions = new Float32Array([
            // Front face
            -0.5, -0.5,  0.5,
             0.5, -0.5,  0.5,
             0.5,  0.5,  0.5,
            -0.5,  0.5,  0.5,
            // Back face
            -0.5, -0.5, -0.5,
             0.5, -0.5, -0.5,
             0.5,  0.5, -0.5,
            -0.5,  0.5, -0.5
        ]);

        // Define colors for the 8 unique vertices (rainbow + white)
        const colors = new Float32Array([
            1.0, 0.0, 0.0, 1.0, // Red
            1.0, 0.5, 0.0, 1.0, // Orange
            1.0, 1.0, 0.0, 1.0, // Yellow
            0.0, 1.0, 0.0, 1.0, // Green
            0.0, 0.0, 1.0, 1.0, // Blue
            0.3, 0.0, 0.5, 1.0, // Indigo
            0.5, 0.0, 1.0, 1.0, // Violet
            1.0, 1.0, 1.0, 1.0  // White
        ]);

        // Define indices for the cube's 12 triangles
        const indices = new Uint16Array([
            // Front face
            0, 1, 2,    0, 2, 3,
            // Back face
            4, 6, 5,    4, 7, 6,
            // Top face
            3, 2, 6,    3, 6, 7,
            // Bottom face
            0, 5, 1,    0, 4, 5,
            // Right face
            1, 5, 6,    1, 6, 2,
            // Left face
            0, 3, 7,    0, 7, 4
        ]);

        // Create vertex attributes
        let aPosition = new Attribute(gl, program, "aPosition", positions, 3, gl.FLOAT);
        let aColor = new Attribute(gl, program, "aColor", colors, 4, gl.FLOAT);
        let indexBuffer = new Indices(gl, indices);

        // Define instance-specific offsets and scales
        this.instanceOffsets = [
            [ 1.0,  0.0,  0.0],  // Instance 1 offset
            [-1.0,  0.0,  0.0],  // Instance 2 offset
            [ 0.0,  1.0,  0.0],  // Instance 3 offset
            [ 0.0, -1.0,  0.0]   // Instance 4 offset
        ];

        this.instanceScales = [1.0, 0.75, 0.5, 0.25]; // Different scales for each instance

        this.draw = () => {
            program.use();

            // Pass the instance-specific offsets and scales to the shader
            gl.uniform3fv(gl.getUniformLocation(program.program, "instanceOffsets"), flatten(this.instanceOffsets));
            gl.uniform1fv(gl.getUniformLocation(program.program, "instanceScales"), flatten(this.instanceScales));

            aPosition.enable();
            aColor.enable();
            indexBuffer.enable();

            // Draw 4 instances of the cube
            gl.drawElementsInstanced(gl.TRIANGLES, indices.length, gl.UNSIGNED_SHORT, 0, 4);

            aPosition.disable();
            aColor.disable();
            indexBuffer.disable();
        };
    }
};
