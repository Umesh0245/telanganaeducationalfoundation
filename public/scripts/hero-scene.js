import * as THREE from 'three';

const canvas = document.querySelector('[data-hero-canvas]');

if (!canvas) {
  throw new Error('Hero canvas was not found.');
}

const scene = new THREE.Scene();
scene.fog = new THREE.FogExp2(0xe9f8ff, 0.045);

const renderer = new THREE.WebGLRenderer({
  canvas,
  antialias: true,
  alpha: true,
  powerPreference: 'high-performance'
});
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

const camera = new THREE.PerspectiveCamera(52, 1, 0.1, 100);
camera.position.set(0, 0.5, 8);

const hemisphere = new THREE.HemisphereLight(0xd9f4ff, 0xc8f0da, 1.25);
scene.add(hemisphere);

const keyLight = new THREE.PointLight(0x2aa8ef, 1.7, 40);
keyLight.position.set(5, 8, 6);
scene.add(keyLight);

const rimLight = new THREE.PointLight(0x51d29f, 1.15, 30);
rimLight.position.set(-6, -2, 5);
scene.add(rimLight);

const group = new THREE.Group();
scene.add(group);

const majorGeometry = new THREE.IcosahedronGeometry(1.8, 2);
const majorMaterial = new THREE.MeshPhysicalMaterial({
  color: 0x32b7ea,
  metalness: 0.08,
  roughness: 0.12,
  clearcoat: 1,
  clearcoatRoughness: 0.05,
  transparent: true,
  opacity: 0.75,
  transmission: 0.92,
  thickness: 0.85,
  ior: 1.25
});

const majorMesh = new THREE.Mesh(majorGeometry, majorMaterial);
group.add(majorMesh);

const torus = new THREE.Mesh(
  new THREE.TorusGeometry(2.5, 0.05, 20, 220),
  new THREE.MeshStandardMaterial({
    color: 0xffffff,
    emissive: 0x3ca5d9,
    emissiveIntensity: 0.35,
    transparent: true,
    opacity: 0.42,
    roughness: 0.4,
    metalness: 0.6
  })
);
torus.rotation.x = Math.PI / 2.4;
scene.add(torus);

const particleCount = 300;
const particleGeometry = new THREE.BufferGeometry();
const particlePositions = new Float32Array(particleCount * 3);

for (let i = 0; i < particleCount; i += 1) {
  particlePositions[i * 3] = (Math.random() - 0.5) * 18;
  particlePositions[i * 3 + 1] = (Math.random() - 0.5) * 13;
  particlePositions[i * 3 + 2] = (Math.random() - 0.5) * 18;
}

particleGeometry.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));

const particles = new THREE.Points(
  particleGeometry,
  new THREE.PointsMaterial({
    color: 0x79bfe6,
    size: 0.055,
    transparent: true,
    opacity: 0.68,
    blending: THREE.AdditiveBlending,
    depthWrite: false
  })
);
scene.add(particles);

const mouse = new THREE.Vector2(0, 0);

const onPointerMove = (event) => {
  const x = (event.clientX / window.innerWidth) * 2 - 1;
  const y = (event.clientY / window.innerHeight) * 2 - 1;
  mouse.set(x, y);
};

window.addEventListener('pointermove', onPointerMove, { passive: true });

const resize = () => {
  const width = canvas.clientWidth;
  const height = canvas.clientHeight;

  renderer.setSize(width, height, false);
  camera.aspect = width / height;
  camera.updateProjectionMatrix();
};

resize();
window.addEventListener('resize', resize);

const clock = new THREE.Clock();

const animate = () => {
  const elapsed = clock.getElapsedTime();

  group.rotation.x = elapsed * 0.18 + mouse.y * 0.28;
  group.rotation.y = elapsed * 0.24 + mouse.x * 0.36;

  majorMesh.position.y = Math.sin(elapsed * 0.9) * 0.22;
  torus.rotation.z = elapsed * 0.16;

  particles.rotation.y = elapsed * 0.03;
  particles.rotation.x = Math.sin(elapsed * 0.2) * 0.08;

  camera.position.x += (mouse.x * 0.75 - camera.position.x) * 0.03;
  camera.position.y += (-mouse.y * 0.45 + 0.4 - camera.position.y) * 0.03;
  camera.lookAt(0, 0, 0);

  renderer.render(scene, camera);
  requestAnimationFrame(animate);
};

animate();
