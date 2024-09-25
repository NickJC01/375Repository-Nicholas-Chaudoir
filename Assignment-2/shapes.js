let gl;
let matrixStack;
let shapes = [];

function init() {
    let canvas = document.getElementById("webgl-canvas");
    gl = canvas.getContext("webgl2");
    if (!gl) {
        alert("Your Web browser doesn't support WebGL 2\nPlease contact Dave");
        return;
    }

    matrixStack = new MatrixStack();

    // Initialize shapes
    shapes.push(new Cone(gl, { color: [1, 0, 0, 1] }));
    shapes.push(new Cylinder(gl, { color: [0, 1, 0, 1] }));
    shapes.push(new Sphere(gl, { color: [0, 0, 1, 1] }));

    // Initial transformations to fit them within the canvas without overlapping
    shapes[0].transform = mat4.translate(mat4.create(), mat4.create(), [-0.6, 0, 0]);
    shapes[1].transform = mat4.translate(mat4.create(), mat4.create(), [0.6, 0, 0]);
    shapes[2].transform = mat4.translate(mat4.create(), mat4.create(), [0, 0.6, 0]);

    requestAnimationFrame(render);
}

function render() {
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    matrixStack.loadIdentity();
    shapes.forEach((shape, index) => {
        matrixStack.push();
        matrixStack.multiply(shape.transform);

        // Animation for the first object
        if (index === 0) {
            let rotation = mat4.rotate(mat4.create(), mat4.create(), 0.01, [0, 1, 0]);
            mat4.multiply(shape.transform, shape.transform, rotation);
        }

        shape.render(matrixStack.top());
        matrixStack.pop();
    });

    requestAnimationFrame(render);
}

window.onload = init;
