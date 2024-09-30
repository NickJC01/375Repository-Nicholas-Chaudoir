let glCone, glSphere, glCylinder;
let matrixStackCone, matrixStackSphere, matrixStackCylinder;
let cone, sphere, cylinder;
let angle = 0.0;

window.onload = function() {
    // Initialize the canvases and WebGL context
    const coneCanvas = document.getElementById("cone-canvas");
    glCone = coneCanvas.getContext("webgl2");

    if (!glCone) {
        alert("WebGL 2 is not supported by your browser.");
        return;
    }

    const sphereCanvas = document.getElementById("sphere-canvas");
    glSphere = sphereCanvas.getContext("webgl2");

    if (!glSphere) {
        alert("WebGL 2 is not supported by your browser.");
        return;
    }

    const cylinderCanvas = document.getElementById("cylinder-canvas");
    glCylinder = cylinderCanvas.getContext("webgl2");

    if (!glCylinder) {
        alert("WebGL 2 is not supported by your browser.");
        return;
    }

    // Set clear colors and enable depth testing for all contexts
    glCone.clearColor(0.2, 0.2, 0.2, 1.0);
    glCone.enable(glCone.DEPTH_TEST);

    glSphere.clearColor(0.2, 0.2, 0.2, 1.0);
    glSphere.enable(glSphere.DEPTH_TEST);

    glCylinder.clearColor(0.2, 0.2, 0.2, 1.0);
    glCylinder.enable(glCylinder.DEPTH_TEST);

    // Initialize the matrix stacks and shapes
    cone = new Cone(glCone, 36);       // 36 segments for the cone
    sphere = new Sphere(glSphere, 3, 36);  // Make the sphere a triangle cuz I'm a rebel
    cylinder = new Cylinder(glCylinder, 48); // 48 Segments but I still don't know why it's not a cylinder

    matrixStackCone = new MatrixStack();
    matrixStackSphere = new MatrixStack();
    matrixStackCylinder = new MatrixStack();

    // Start the rendering process for all objects
    render();
};

function render() {
    requestAnimationFrame(render);

    // ----- Render the rotating cone -----
    glCone.clear(glCone.COLOR_BUFFER_BIT | glCone.DEPTH_BUFFER_BIT);

    // Increment the rotation angle for the cone
    angle += 1.0;
    angle %= 360.0;

    // Push the current matrix onto the stack for the cone
    matrixStackCone.push();

    matrixStackCone.rotate(angle, [1, 1, 0]);  // Rotate the cone
    matrixStackCone.scale([0.6, 0.6, 0.6]);    // Scale the cone

    // Pass the current matrix to the cone and draw it
    cone.MV = matrixStackCone.current();
    cone.draw();

    // Pop the matrix after drawing the cone
    matrixStackCone.pop();

    // ----- Render the stationary sphere -----
    glSphere.clear(glSphere.COLOR_BUFFER_BIT | glSphere.DEPTH_BUFFER_BIT);

    matrixStackSphere.push();

    matrixStackSphere.scale([0.6, 0.6, 0.6]);    // Scale the sphere

    sphere.MV = matrixStackSphere.current();
    sphere.draw();

    matrixStackSphere.pop();

    // ----- Render the rotating cylinder -----
    glCylinder.clear(glCylinder.COLOR_BUFFER_BIT | glCylinder.DEPTH_BUFFER_BIT);

    matrixStackCylinder.push();

    matrixStackCylinder.rotate(angle, [1, 0, 0]);  // Flip rotation around X axis
    matrixStackCylinder.scale([0.4, 0.02, 0.4]);   

    cylinder.MV = matrixStackCylinder.current();
    cylinder.draw();

    matrixStackCylinder.pop();
}
