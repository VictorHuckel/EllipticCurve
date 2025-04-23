<template>
  <div id="threeDView" class="three-container"></div>
</template>

<script setup>
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { onMounted, watch } from "vue";
import { useCurveStore } from "@/stores/curveStore";

const store = useCurveStore();
let container, scene, camera, renderer, controls;
let mesh = null;

const initThree = () => {
  container = document.getElementById("threeDView");
  if (!container) return;

  scene = new THREE.Scene();
  scene.background = new THREE.Color(0xffffff);

  camera = new THREE.PerspectiveCamera(60, container.clientWidth / container.clientHeight, 0.1, 1000);
  camera.position.set(0, 0, 15);

  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(container.clientWidth, container.clientHeight);
  container.appendChild(renderer.domElement);

  controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;

  scene.add(new THREE.AxesHelper(5));
  scene.add(new THREE.AmbientLight(0xffffff, 0.6));
  const dirLight = new THREE.DirectionalLight(0xffffff, 0.6);
  dirLight.position.set(5, 10, 7);
  scene.add(dirLight);

  animate();
  renderSurface3D();
};

const animate = () => {
  requestAnimationFrame(animate);
  controls.update();
  renderer.render(scene, camera);
};

const renderSurface3D = () => {
  if (!scene) return;

  if (mesh) {
    scene.remove(mesh);
    mesh.geometry.dispose();
    mesh.material.dispose();
    mesh = null;
  }

  if (store.field !== "real") return;
  const data = store.graph3D;
  if (!data || data.length === 0) return;

  const zSet = [...new Set(data.map(p => p.z))].sort((a, b) => a - b);
  const zStepCount = zSet.length;
  const xStepCount = data.length / zStepCount;

  const positions = [];
  const indices = [];

  for (let i = 0; i < data.length; i++) {
    positions.push(data[i].x, data[i].y, data[i].z);
  }

  const isValid = (...pts) =>
    pts.every(
      pt =>
        pt &&
        isFinite(pt.x) &&
        isFinite(pt.y) &&
        isFinite(pt.z)
    );

  const dist3D = (p1, p2) =>
    Math.sqrt(
      (p1.x - p2.x) ** 2 +
      (p1.y - p2.y) ** 2 +
      (p1.z - p2.z) ** 2
    );

  const maxDist = 1.2;
  const maxYDiff = 5;

  for (let j = 0; j < zStepCount - 1; j++) {
    for (let i = 0; i < xStepCount - 1; i++) {
      const index = j * xStepCount + i;
      const a = index;
      const b = index + 1;
      const c = index + xStepCount;
      const d = c + 1;

      const A = data[a], B = data[b], C = data[c], D = data[d];

      if (isValid(A, B, C)) {
        const dAB = dist3D(A, B);
        const dAC = dist3D(A, C);
        if (
          dAB < maxDist &&
          dAC < maxDist &&
          Math.abs(A.y - B.y) < maxYDiff &&
          Math.abs(A.y - C.y) < maxYDiff
        ) {
          indices.push(a, c, b);
        }
      }

      if (isValid(B, C, D)) {
        const dBC = dist3D(B, C);
        const dBD = dist3D(B, D);
        if (
          dBC < maxDist &&
          dBD < maxDist &&
          Math.abs(B.y - C.y) < maxYDiff &&
          Math.abs(B.y - D.y) < maxYDiff
        ) {
          indices.push(b, c, d);
        }
      }
    }
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  geometry.setIndex(indices);
  geometry.computeVertexNormals();

  const material = new THREE.MeshStandardMaterial({color: 0x00bcd4, side: THREE.DoubleSide, flatShading: true});

  mesh = new THREE.Mesh(geometry, material);
  scene.add(mesh);
};


watch(
  () => [store.graph3D, store.field],
  () => {
    renderSurface3D();
  },
  { deep: true }
);

onMounted(() => {
  initThree();
});
</script>

<style scoped>
.three-container {
  width: 100%;
  height: 100%;
  border: 1px solid #ccc;
}
</style>
