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
      default: () => ({ x: null, y: null }),
    },
  },
  setup(props) {
    const store = useCurveStore();

    let container, scene, camera, renderer, controls;
    let sphereWire = null;
    let pointsMesh = null;
    let selectedPointMesh = null;

    const R = 3;

    // Initialisation de la scène Three.js
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
        wireframe: store.wireframeMode,
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

    // Supprime les anciens points de courbe et sélection
    function clearMeshes() {
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

    // Ajout d'un point sélectionné (ex: utilisateur clique sur un point)
    async function addSelectedPointToSphere(x, y, z = 1) {
  if (!scene) return;

  try {
    const res = await fetch("http://localhost:5000/api/curves/project/point", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ x, y, z }),
    });

    if (!res.ok) throw new Error("Projection failed");

    const { x: px, y: py, z: pz } = await res.json();

    const point = new THREE.Vector3(px, py, pz);
    const geometry = new THREE.SphereGeometry(0.1, 16, 16);
    const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });

    selectedPointMesh = new THREE.Mesh(geometry, material);
    selectedPointMesh.position.copy(point);
    scene.add(selectedPointMesh);

  } catch (err) {
    console.error("Erreur projection point:", err);
  }
}


    // Construction de la courbe projetée (points depuis le backend)
    function buildSphereCurve() {
      const spherePoints = store.sphereRaw || [];
      if (!spherePoints.length) return;

      const positions = [];
      for (const { x, y, z } of spherePoints) {
        positions.push(x, y, z);
      }

      const geometry = new THREE.BufferGeometry();
      geometry.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
      const material = new THREE.PointsMaterial({ color: 0x0000ff, size: 0.05 });
      pointsMesh = new THREE.Points(geometry, material);
      scene.add(pointsMesh);
    }

    // Met à jour la sphère selon le champ
    function updateSphere() {
      if (!scene) return;
      clearMeshes();

      if (store.field === "real") {
        buildSphereCurve(); // on affiche seulement la projection réelle
      }
    }

    // Mise à jour du mode wireframe
    watch(() => store.wireframeMode, (newVal) => {
      if (sphereWire) sphereWire.material.wireframe = newVal;
    });

    // Affichage du point sélectionné
    watch(() => props.point, (newPoint) => {
      if (newPoint && typeof newPoint.x === "number" && typeof newPoint.y === "number") {
        clearSelectedPointMesh();
        addSelectedPointToSphere(newPoint.x, newPoint.y);
      }
    }, { immediate: true });

    // Chargement initial
    onMounted(() => {
      initThreeJS();
    });

    // Actualisation à chaque changement de courbe
    watch(
      () => [store.field, store.sphereRaw],
      () => {
        updateSphere();
      },
      { deep: true, immediate: true }
    );

    // Nettoyage à la destruction
    onUnmounted(() => {
      renderer.dispose();
      controls.dispose();
    });

    return {};
  }
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
