<template>
  <div id="ellipticSphere" class="elliptic-sphere-container"></div>
</template>

<script>
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { onMounted, onUnmounted, watch, defineComponent } from "vue";
import { useCurveStore } from "@/stores/curveStore";

export default defineComponent({
  name: "EllipticSphere",
  props: {
    point: {
      type: Object,
      required: true,
      default: () => ({ x: null, y: null }), // Valeur par défaut
    },
  },
  setup(props) {
    console.log("Props received in EllipticSphere:", props.point);
    const store = useCurveStore();

    let container, scene, camera, renderer, controls;
    let sphereWire = null;
    let realLineMesh = null;
    let homoLineMesh = null;
    let pointsMesh = null;
    let selectedPointMesh = null;

    const R = 3;

    function initThreeJS() {
      container = document.getElementById("ellipticSphere");
      if (!container) return;

      scene = new THREE.Scene();
      scene.background = new THREE.Color(0xffffff);

      const width = container.clientWidth;
      const height = container.clientHeight;
      camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
      camera.position.set(8, 6, 8);

      renderer = new THREE.WebGLRenderer({ antialias: true });
      renderer.setSize(width, height);
      container.appendChild(renderer.domElement);

      controls = new OrbitControls(camera, renderer.domElement);
      controls.enableDamping = true;
      controls.dampingFactor = 0.1;

      scene.add(new THREE.AxesHelper(2));
      scene.add(new THREE.AmbientLight(0xffffff, 0.8));
      const dirLight = new THREE.DirectionalLight(0xffffff, 0.6);
      dirLight.position.set(2, 5, 3);
      scene.add(dirLight);

      const sphereGeom = new THREE.SphereGeometry(R, 32, 32);
      const sphereMat = new THREE.MeshBasicMaterial({
        color: 0xdddddd,
        wireframe: store.wireframeMode, // Set initial wireframe mode
      });
      sphereWire = new THREE.Mesh(sphereGeom, sphereMat);
      scene.add(sphereWire);

      animate();
      updateSphere();
    }

    function animate() {
      requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    }

    function clearMeshes() {
      [realLineMesh, homoLineMesh].forEach(m => {
        if (m) {
          scene.remove(m);
          m.geometry.dispose();
          m.material.dispose();
        }
      });
      realLineMesh = homoLineMesh = null;

      if (pointsMesh) {
        scene.remove(pointsMesh);
        pointsMesh.geometry.dispose();
        pointsMesh.material.dispose();
        pointsMesh = null;
      }
    }

    function clearSelectedPointMesh() {
      if (selectedPointMesh) {
        scene.remove(selectedPointMesh);
        selectedPointMesh.geometry.dispose();
        selectedPointMesh.material.dispose();
        selectedPointMesh = null;
      }
    }

    function addSelectedPointToSphere(x, y) {
      if (!scene) return;

      const pointOnSphere = projectiveToSphere(x, y, 1);

      const geometry = new THREE.SphereGeometry(0.1, 16, 16);
      const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
      selectedPointMesh = new THREE.Mesh(geometry, material);

      selectedPointMesh.position.copy(pointOnSphere);

      scene.add(selectedPointMesh);
    }

    function projectiveToSphere(X, Y, Z) {
      const norm = Math.sqrt(X * X + Y * Y + Z * Z);
      return new THREE.Vector3(R * X / norm, R * Y / norm, R * Z / norm);
    }

    function buildLineReal() {
      const rawPoints = store.graph2D || [];
      if (rawPoints.length < 2) return;

      const vectors = [];

      for (const { x, y } of rawPoints) {
        const P1 = projectiveToSphere(x, y, 1);
        const S1 = projectiveToSphere(-x, -y, -1);
        vectors.push(P1, S1);
      }

      const geometry = new THREE.BufferGeometry().setFromPoints(vectors);
      const material = new THREE.PointsMaterial({ color: 0x0000ff, size: 0.05 });
      realLineMesh = new THREE.Points(geometry, material);
      scene.add(realLineMesh);
    }

    function buildHomogeneousCurve() {
      const rawPoints = store.homogeneousGraph2D || [];
      if (rawPoints.length < 2) return;

      const vectors = [];

      for (const { X, Y, Z } of rawPoints) {
        const P = projectiveToSphere(X, Y, Z);
        const S = projectiveToSphere(-X, -Y, -Z);
        vectors.push(P, S);
      }

      const geometry = new THREE.BufferGeometry().setFromPoints(vectors);
      const material = new THREE.PointsMaterial({ color: 0x0000ff, size: 0.05 });
      homoLineMesh = new THREE.Points(geometry, material);
      scene.add(homoLineMesh);
    }

    function buildPointsModulo() {
      const arr = store.sphereRaw || [];
      if (!arr.length) return;
      const positions = [];
      for (const pt of arr) {
        positions.push(pt.x, pt.y, pt.z);
      }
      const geometry = new THREE.BufferGeometry();
      geometry.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
      const material = new THREE.PointsMaterial({ color: 0xff0000, size: 0.06 });
      pointsMesh = new THREE.Points(geometry, material);
      scene.add(pointsMesh);
    }

    function updateSphere() {
      if (!scene) return;
      clearMeshes();

      if (store.field === "real") {
        if (store.curveType === "edwards") {
          buildLineReal();
        } else {
          buildLineReal();
          buildHomogeneousCurve();
        }
      } else if (store.field === "modulo") {
        buildPointsModulo();
      }
    }

    watch(
      () => store.wireframeMode,
      (newVal) => {
        if (sphereWire) {
          sphereWire.material.wireframe = newVal;
        }
      }
    );

    watch(
      () => props.point,
      (newPoint) => {
        console.log("New point received:", newPoint);
        if (newPoint && typeof newPoint.x === "number" && typeof newPoint.y === "number") {
          clearSelectedPointMesh();
          addSelectedPointToSphere(newPoint.x, newPoint.y);
        }
      },
      { immediate: true }
    );

    onMounted(() => {
      initThreeJS();
    });

    watch(
      () => [store.field, store.graph2D, store.homogeneousGraph2D, store.sphereRaw],
      () => {
        updateSphere();
      },
      { deep: true, immediate: true }
    );

    onUnmounted(() => {
      renderer.dispose();
      controls.dispose();
    });

    return {};
  },
});
</script>

<style scoped>
.elliptic-sphere-container,
#ellipticSphere {
  width: 100%;
  height: 100%;
  position: relative;
  overflow: hidden;
}
</style>