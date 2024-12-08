async function fetchShader(url) {
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
    }
    return response.text();
}

async function init() {
    const vertexShaderSrc = await fetchShader('shaders/vertexShader.glsl');
    const fragmentShaderSrc = await fetchShader('shaders/fragmentShader.glsl');

    // Scene and Camera
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 4.6, 0); // Top-down view
    camera.lookAt(new THREE.Vector3(0, 0, 0)); // Point camera to the center

    // Renderer
    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.getElementById('scene-container').appendChild(renderer.domElement);

    // Water plane with ripple shader
    const planeGeometry = new THREE.PlaneGeometry(10, 10, 200, 200);
    const planeMaterial = new THREE.ShaderMaterial({
        vertexShader: vertexShaderSrc,
        fragmentShader: fragmentShaderSrc,
        uniforms: {
            time: { value: 0.0 },
            clickPosition: { value: new THREE.Vector2(-10000, -10000) },
            startTime: { value: 0.0 },
            duration: { value: 1.0 },
            baseColor: { value: new THREE.Color(0x0a2647) },
            opacity: { value: 0.3 }, // Adjust transparency
        },
        transparent: true,
        depthWrite: false,
        side: THREE.DoubleSide,
        blending: THREE.NormalBlending,
    });
    const waterPlane = new THREE.Mesh(planeGeometry, planeMaterial);
    waterPlane.rotation.x = -Math.PI / 2;
    waterPlane.position.y = 0.01; // Slightly above the box
    waterPlane.renderOrder = 1; // Render after other objects
    scene.add(waterPlane);

    // Texture loader for pond base
    const textureLoader = new THREE.TextureLoader();
    const pondBaseTexture = textureLoader.load(
        'textures/pondbase.webp',
        () => console.log('Texture loaded successfully'),
        undefined,
        (err) => console.error('Texture loading error:', err)
    );

    // Add textured plane below the box (pond base)
    const pondPlaneGeometry = new THREE.PlaneGeometry(10, 10);
    const pondPlaneMaterial = new THREE.MeshBasicMaterial({
        map: pondBaseTexture,
        side: THREE.DoubleSide, // Render both sides for flexibility
    });
    const pondPlane = new THREE.Mesh(pondPlaneGeometry, pondPlaneMaterial);
    pondPlane.rotation.x = -Math.PI / 2;
    pondPlane.position.y = -1.5; // Position below the box
    scene.add(pondPlane);

    // Box volume for water depth visualization
    const boxGeometry = new THREE.BoxGeometry(10, 2.5, 10);
    const boxMaterial = new THREE.MeshBasicMaterial({
        color: 0x0a2647,
        transparent: true,
        opacity: 0.3, // Increase transparency for the box
    });
    const box = new THREE.Mesh(boxGeometry, boxMaterial);
    box.position.y = -1.25; // Slightly above the pond base
    scene.add(box);

    // Test object (red sphere) below the pond base
    const testSphereGeometry = new THREE.SphereGeometry(1, 32, 32);
    const testSphereMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 }); // Red color
    const testSphere = new THREE.Mesh(testSphereGeometry, testSphereMaterial);
    testSphere.position.set(0, -3.5, 0); // Position below the pond base
    scene.add(testSphere);

    // Animate the scene
    function animate() {
        requestAnimationFrame(animate);
        planeMaterial.uniforms.time.value += 0.016; // Update ripple time
        renderer.render(scene, camera);
    }

    // Raycasting for ripple interaction
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    renderer.domElement.addEventListener('click', function (event) {
        const rect = renderer.domElement.getBoundingClientRect();
        mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
        mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

        raycaster.setFromCamera(mouse, camera);
        const intersects = raycaster.intersectObject(waterPlane);

        if (intersects.length > 0) {
            const point = intersects[0].point;
            planeMaterial.uniforms.clickPosition.value.set(point.x, -point.z);
            planeMaterial.uniforms.startTime.value = planeMaterial.uniforms.time.value; // Sync ripple start time
        }
    });

    animate();
}

init().catch(console.error);
