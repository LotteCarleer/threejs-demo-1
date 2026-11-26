import * as THREE from 'three';
import './style.css';

const canvas = document.querySelector('#scene');
const scene = new THREE.Scene();
scene.background = new THREE.Color('#160f1d');

const camera = new THREE.PerspectiveCamera(
  40,
  window.innerWidth / window.innerHeight,
  0.1,
  100,
);
camera.position.set(3.2, 2.4, 4.5);
camera.lookAt(0, 0, 0);

const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.15;

scene.add(new THREE.AmbientLight('#ffffff', 1.8));

const keyLight = new THREE.DirectionalLight('#fff0f8', 4);
keyLight.position.set(3, 5, 4);
scene.add(keyLight);

const fillLight = new THREE.PointLight('#bd72ff', 18, 12);
fillLight.position.set(-3, 1, -2);
scene.add(fillLight);

const cube = new THREE.Mesh(
  new THREE.BoxGeometry(1.7, 1.7, 1.7),
  new THREE.MeshStandardMaterial({
    color: '#ff5ca8',
    roughness: 0.28,
    metalness: 0.08,
  }),
);
scene.add(cube);

let isDragging = false;
let previousPointer = { x: 0, y: 0 };
const dragRotation = { x: 0, y: 0 };

canvas.addEventListener('pointerdown', (event) => {
  isDragging = true;
  previousPointer = { x: event.clientX, y: event.clientY };
  canvas.setPointerCapture(event.pointerId);
  canvas.classList.add('is-dragging');
});

canvas.addEventListener('pointermove', (event) => {
  if (!isDragging) return;

  dragRotation.y += (event.clientX - previousPointer.x) * 0.01;
  dragRotation.x += (event.clientY - previousPointer.y) * 0.01;
  previousPointer = { x: event.clientX, y: event.clientY };
});

function stopDragging(event) {
  if (!isDragging) return;

  isDragging = false;
  canvas.classList.remove('is-dragging');
  if (canvas.hasPointerCapture(event.pointerId)) {
    canvas.releasePointerCapture(event.pointerId);
  }
}

canvas.addEventListener('pointerup', stopDragging);
canvas.addEventListener('pointercancel', stopDragging);

function resize() {
  const width = window.innerWidth;
  const height = window.innerHeight;
  camera.aspect = width / height;
  camera.updateProjectionMatrix();
  renderer.setSize(width, height);
}

window.addEventListener('resize', resize);

const clock = new THREE.Clock();

function animate() {
  const elapsed = clock.getElapsedTime();
  cube.rotation.x = elapsed * 0.22 + dragRotation.x;
  cube.rotation.y = elapsed * 0.35 + dragRotation.y;
  cube.position.y = Math.sin(elapsed * 0.8) * 0.08;
  renderer.render(scene, camera);
}

renderer.setAnimationLoop(animate);
