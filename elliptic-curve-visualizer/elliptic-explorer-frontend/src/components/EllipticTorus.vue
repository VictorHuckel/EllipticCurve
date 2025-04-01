<template>
  <div id="ellipticTorus" style="width: 100vw; height: 100vh;"></div>
</template>

<script>
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { useCurveStore } from "@/stores/curveStore";
import { watch, onMounted } from "vue";

export default {
  setup() {
    const store = useCurveStore();

    watch(() => [store.a, store.b], () => {
      updateGraph();
    });

    let container = null;
    let scene, camera, renderer, controls;

    const initThreeJS = () => {
      container = document.getElementById("ellipticTorus");
      if (!container) return;

      scene = new THREE.Scene();
      scene.background = new THREE.Color(0xffffff);

      camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
      camera.position.set(10, 5, 10);

      renderer = new THREE.WebGLRenderer({ antialias: true });
      renderer.setSize(container.clientWidth, container.clientHeight);
      container.appendChild(renderer.domElement);

      controls = new OrbitControls(camera, renderer.domElement);
      controls.enableDamping = true;

      const axesHelper = new THREE.AxesHelper(5);
      scene.add(axesHelper);

      const ambientLight = new THREE.AmbientLight(0x404040);
      scene.add(ambientLight);
      const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
      directionalLight.position.set(1, 1, 1);
      scene.add(directionalLight);

      const torusGeometry = new THREE.TorusGeometry(3, 1, 30, 100);
      const torusMaterial = new THREE.MeshStandardMaterial({ color: 0x000000, wireframe: true });
      const torus = new THREE.Mesh(torusGeometry, torusMaterial);
      scene.add(torus);

      addCurveOnTorus();
      animate();
    };

    const addCurveOnTorus = () => {
      const a = store.a;
      const b = store.b;
      const points = [];

      const R = 3; // Rayon principal du tore
      const r = 1; // Rayon du tube

      for (let t = -Math.PI; t <= Math.PI; t += 0.01) {
        const x = t; // Utilisation de t comme paramètre x
        const ySquared = x ** 3 + a * x + b;
        const y = Math.sqrt(Math.abs(ySquared)) * (ySquared >= 0 ? 1 : -1);

        const theta = x; // Angle autour du centre du tore
        const phi = y; // Angle autour du tube

        const px = (R + r * Math.cos(phi)) * Math.cos(theta);
        const py = (R + r * Math.cos(phi)) * Math.sin(theta);
        const pz = r * Math.sin(phi);

        points.push(new THREE.Vector3(px, py, pz));
      }

      const curveGeometry = new THREE.BufferGeometry().setFromPoints(points);
      const curveMaterial = new THREE.LineBasicMaterial({ color: 0xff0404, linewidth: 2 });
      const curveMesh = new THREE.Line(curveGeometry, curveMaterial);
      scene.add(curveMesh);
    };

    const animate = () => {
      requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    };

    const updateGraph = () => {
      if (!container) return;
      while (container.firstChild) container.removeChild(container.firstChild);
      initThreeJS();
    };

    onMounted(() => {
      initThreeJS();
    });

    return {};
  },
};
</script>