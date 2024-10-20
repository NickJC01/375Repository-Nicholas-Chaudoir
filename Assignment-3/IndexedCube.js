/////////////////////////////////////////////////////////////////////////////
//
//  IndexedCube.js
//
//  A cube defined of 12 triangles using vertex indices.
//

class IndexedCube {
    constructor(gl, vertexShader, fragmentShader) {

        // let program = new ShaderProgram(gl, this, vertexShader, fragmentShader);
        vertexShader ||= `
            uniform mat4 P;  // Projection transformation
            uniform mat4 MV; // Model-view transformation

            in vec4 aPosition;
            in vec4 aColor;
            out vec4 vColor;

            void main() {
                vColor = aColor;
                gl_Position = P * MV * aPosition;
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

        // Define the 8 unique vertex positions of the cube.
        let positions = new Float32Array([
            -0.5, -0.5,  0.5,  // Front-bottom-left
             0.5, -0.5,  0.5,  // Front-bottom-right
             0.5,  0.5,  0.5,  // Front-top-right
            -0.5,  0.5,  0.5,  // Front-top-left
            -0.5, -0.5, -0.5,  // Back-bottom-left
             0.5, -0.5, -0.5,  // Back-bottom-right
             0.5,  0.5, -0.5,  // Back-top-right
            -0.5,  0.5, -0.5   // Back-top-left
        ]);

        // Define the rainbow colors (Red, Orange, Yellow, Green, Blue, Indigo, Violet) + White
        let colors = new Float32Array([
            1.0, 0.0, 0.0, 1.0,  // Red
            1.0, 0.5, 0.0, 1.0,  // Orange
            1.0, 1.0, 0.0, 1.0,  // Yellow
            0.0, 1.0, 0.0, 1.0,  // Green
            0.0, 0.0, 1.0, 1.0,  // Blue
            0.3, 0.0, 0.5, 1.0,  // Indigo
            0.6, 0.0, 1.0, 1.0,  // Violet
            1.0, 1.0, 1.0, 1.0   // White
        ]);

        // Define the indices that represent the 12 triangles.
        let indices = new Uint16Array([
            // Front face
            0, 1, 2, 0, 2, 3,
            // Back face
            4, 5, 6, 4, 6, 7,
            // Left face
            4, 7, 3, 4, 3, 0,
            // Right face
            1, 5, 6, 1, 6, 2,
            // Top face
            3, 2, 6, 3, 6, 7,
            // Bottom face
            4, 0, 1, 4, 1, 5
        ]);

        // Create the vertex attribute objects
        let positionAttr = new Attribute(gl, program, "aPosition", positions, 3, gl.FLOAT);
        let colorAttr = new Attribute(gl, program, "aColor", colors, 4, gl.FLOAT);

        // Create the index buffer object
        let indexBuffer = new Indices(gl, indices);

        this.MV = mat4();
        this.P = mat4()

        this.draw = () => {
            program.use();
            positionAttr.enable();
            colorAttr.enable();
            indexBuffer.enable();

            // Draw the cube using the index buffer
            gl.drawElements(gl.TRIANGLES, indexBuffer.count, indexBuffer.type, 0);

            positionAttr.disable();
            colorAttr.disable();
            indexBuffer.disable();
        };
    }
}
