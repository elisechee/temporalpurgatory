import './style.css'
import * as THREE from 'three';

import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';



// Wait for the DOM to load
document.addEventListener('DOMContentLoaded', () => {
  console.log("DOM fully loaded and parsed");

  const landingPage = document.getElementById('landing-page');
  const sceneContainer = document.getElementById('scene-container');
  const centerButton = document.querySelector('.center-button');

  if (!centerButton) {
    console.error("Button with class 'center-button' not found!");
    return;
  }

  console.log("Button found:", centerButton);
  
  // Show 3D scene when the button is clicked
  centerButton.addEventListener('click', () => {
    console.log('Button clicked');
    landingPage.style.display = 'none';
    sceneContainer.style.display = 'block';
    initScene();
  });

  function initScene() {
    console.log('Scene initialized');

    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
    
    camera.position.set(0, 35, 0);
    
    // Set camera's rotation to (-90, 0, -90) in degrees, but Three.js uses radians for rotation
    /*
    camera.rotation.set(
      THREE.MathUtils.degToRad(-90), // Convert -90 degrees to radians for X rotation
      0,                             // Y rotation
      0//THREE.MathUtils.degToRad(-90)  // Convert -90 degrees to radians for Z rotation
    );
    */
    
    const renderer = new THREE.WebGLRenderer({
      canvas: document.querySelector("#bg"),
    });
    
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    //camera.position.setZ(30);
    
    renderer.render(scene, camera);
    
    //light source
    const pointLight = new THREE.PointLight(0xffffff);
    pointLight.position.set(5,5,5);
    
    const ambientLight = new THREE.AmbientLight(0xffffff);
    scene.add(pointLight, ambientLight);
    
    const lightHelper = new THREE.PointLightHelper(pointLight)
    scene.add(lightHelper);
    
    //geometry
    const geometry = new THREE.TorusGeometry(10,3,16,100);
    const material = new THREE.MeshBasicMaterial({ color: 0xffffff , wireframe: true});
    const torus = new THREE.Mesh(geometry, material);
    
    //scene.add(torus);
    
    //controls
    const controls = new OrbitControls(camera, renderer.domElement);
    
    //controls.maxDistance = 14;  // Set max distance
    //controls.minDistance = 1;  // Set min distance
    
    // Restrict panning (shift) by clamping the camera's position
    //controls.screenSpacePanning = false;  // Disable screen space panning (optional, based on your preference)
    controls.maxAzimuthAngle = Math.PI / 2;  // Restrict horizontal rotation to 45 degrees (change as needed)
    controls.minAzimuthAngle = -Math.PI / 2;  // Restrict horizontal rotation to -45 degrees (change as needed)
    
    // Restrict vertical rotation using polar angles (between 0 and PI)
    controls.maxPolarAngle = Math.PI / 3;  // Restrict vertical rotation from above (e.g., 80 degrees max)
    //controls.minPolarAngle = Math.PI;  // Restrict vertical rotation from below (e.g., 45 degrees min)
    
    window.addEventListener('resize', () => {
      renderer.setSize(window.innerWidth, window.innerHeight);
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
    });
    
    //bg
    //const spaceTexture = new THREE.TextureLoader().load("texture.jpg");
    scene.background = new THREE.Color( 0x000000 );
    //spaceTexture;
    //console.log(renderer.domElement);
    
    //model
    const loader = new GLTFLoader();
    const scenePath = '/scene.gltf';
    
    loader.load(scenePath, (gltf) => {
      const model = gltf.scene;
      
      //90-degree counterclockwise rotation around the Y axis
      model.rotation.y = THREE.MathUtils.degToRad(90); // Rotate counterclockwise 90 degrees
    
      scene.add(gltf.scene);
      console.log('GLTF model loaded successfully!');
    }, undefined, (error) => {
      console.error('Error loading GLTF model:', error);
    });
    
    function addStar() {
      const geometry = new THREE.SphereGeometry(0.025);
      const material = new THREE.MeshBasicMaterial({ color: 0xffffff});
      const star = new THREE.Mesh(geometry, material);
    
      const [x, y, z] = Array(3).fill().map(() => THREE.MathUtils.randFloatSpread(12));
      star.position.set(x, y, z);
      scene.add(star)
    }
    Array(500).fill().forEach(addStar) 
     
    
    function animate() {
      requestAnimationFrame(animate);
      torus.rotation.x += 0.01;
      torus.rotation.y += 0.005;
      torus.rotation.z += 0.01;
    
        // Update controls
        if (camera) {
          controls.update(); // Only update controls if the camera is defined
        }
      //controls.update();
      renderer.render(scene, camera);
    }
    animate();    
  }
});