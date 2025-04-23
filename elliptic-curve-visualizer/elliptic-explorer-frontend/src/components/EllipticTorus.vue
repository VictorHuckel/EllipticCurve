<template>
  <div id="ellipticTorus" style="width: 100%; height: 100%;"></div>
</template>

<script>
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { useCurveStore } from "@/stores/curveStore";
import { onMounted, watch } from "vue";

/**
 * Composant qui :
 *  - Initialise une scène ThreeJS avec un tore wireframe
 *  - En mode real : lit store.graph2D => (x,y) => on map en angles => on trace un line
 *  - En mode modulo : lit store.torusRaw => points 3D => on affiche un nuage Points
 */

export default {
  setup() {
    const store = useCurveStore();

    let container = null, scene, camera, renderer, controls;
    let torusRef = null;    // tore wireframe
    let lineMesh = null;    // line en mode real
    let pointsMesh = null;  // nuage en mode modulo

    const initThreeJS = () => {
      container = document.getElementById("ellipticTorus");
      if (!container) return;

      scene = new THREE.Scene();
      scene.background = new THREE.Color(0xffffff);

      camera = new THREE.PerspectiveCamera(
        75,
        container.clientWidth / container.clientHeight,
        0.1,
        1000
      );
      camera.position.set(10, 5, 10);

      renderer = new THREE.WebGLRenderer({ antialias: true });
      renderer.setSize(container.clientWidth, container.clientHeight);
      container.appendChild(renderer.domElement);

      controls = new OrbitControls(camera, renderer.domElement);
      controls.enableDamping = true;

      // axes
      scene.add(new THREE.AxesHelper(5));

      // lumières
      scene.add(new THREE.AmbientLight(0xffffff, 0.8));
      const dirLight = new THREE.DirectionalLight(0xffffff, 0.6);
      dirLight.position.set(1, 1, 1);
      scene.add(dirLight);

      // Tore wireframe de référence
      const R = 3, r = 1;
      const torusGeom = new THREE.TorusGeometry(R, r, 30, 100);
      const torusMat = new THREE.MeshStandardMaterial({
        color: 0xffffff,
        wireframe: store.wireframeMode, // Initial wireframe mode
      });
      torusRef = new THREE.Mesh(torusGeom, torusMat);
      scene.add(torusRef);

      animate();
      updateTorus();
    };

    // Animation
    const animate = () => {
      requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    };

    // Nettoyage
    const clearMeshes = () => {
      if (lineMesh) {
        scene.remove(lineMesh);
        lineMesh.geometry.dispose();
        lineMesh.material.dispose();
        lineMesh = null;
      }
      if (pointsMesh) {
        scene.remove(pointsMesh);
        pointsMesh.geometry.dispose();
        pointsMesh.material.dispose();
        pointsMesh = null;
      }
    };

    // Construit la courbe en mode real
    // On suppose graph2D = [ { x, y}, ... ]
    // On map (x,y) => (theta,phi) => X= (R + r cos(phi)) cos(theta), etc.
    const buildLineReal = () => {
      const R = 3, r = 1;
      const arr = store.graph2D || [];
      if (!arr.length) return;

      // On crée un tableau de Vector3
      const vectors = [];
      for (let i=0; i< arr.length; i++) {
        const xVal= arr[i].x;
        const yVal= arr[i].y;
        // On peut interpréter xVal => theta, yVal => phi (ex)
        const theta= xVal;
        const phi= yVal;

        const px= (R + r*Math.cos(phi))* Math.cos(theta);
        const py= (R + r*Math.cos(phi))* Math.sin(theta);
        const pz= r* Math.sin(phi);
        vectors.push(new THREE.Vector3(px, py, pz));
      }

      // On fait un simple Line (pas un tube)
      const geometry = new THREE.BufferGeometry().setFromPoints(vectors);
      const material = new THREE.LineBasicMaterial({ color: 0x0000ff});
      lineMesh = new THREE.Line(geometry, material);
      scene.add(lineMesh);
    };

    // Construit un nuage de points en mode modulo
    // store.torusRaw = [ { x, y, z }, ...]
    const buildPointsModulo = () => {
      const arr = store.torusRaw || [];
      if (!arr.length) return;

      const positions = [];
      for (let i=0; i< arr.length; i++) {
        positions.push(arr[i].x, arr[i].y, arr[i].z);
      }
      const geometry = new THREE.BufferGeometry();
      geometry.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
      const material = new THREE.PointsMaterial({ color: 0xff0000, size: 0.05 });
      pointsMesh= new THREE.Points(geometry, material);
      scene.add(pointsMesh);
    };

    // Met à jour l'affichage
    const updateTorus = () => {
      if (!scene) return;
      clearMeshes();

      if (store.field === "real") {
        buildLineReal();
      } else if (store.field === "modulo") {
        buildPointsModulo();
      }
    };

    // On relance la scène 3D si on change la taille
    // ou si store.* change => update la courbe
    const reinitScene = () => {
      if (!container) return;
      // on vide
      while (container.firstChild) {
        container.removeChild(container.firstChild);
      }
      initThreeJS();
    };

    onMounted(() => {
      initThreeJS();
    });

    // Surveille si la dimension du container change ou si on veut reinit
    // (optionnel)

    // Surveille store.* => update la courbe
    watch(
      () => [
        store.field,
        store.graph2D,
        store.torusRaw
      ],
      () => {
        updateTorus();
      },
      { deep: true }
    );

    // Met à jour le wireframe du tore lorsque l'état wireframeMode change
    watch(
      () => store.wireframeMode,
      (newVal) => {
        if (torusRef) {
          torusRef.material.wireframe = newVal;
        }
      }
    );

    return {};
  }
};
</script>

<style scoped>
#ellipticTorus {
  width: 100%;
  height: 100%;
  position: relative;
  overflow: hidden;
}
</style>
