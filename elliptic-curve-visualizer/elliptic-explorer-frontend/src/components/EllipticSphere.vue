<template>
    <div id="ellipticSphere" style="width: 100vw; height: 100vh;"></div>
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
        container = document.getElementById("ellipticSphere");
        if (!container) return;
  
        scene = new THREE.Scene();
        scene.background = new THREE.Color(0xffffff);
  
        camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
        camera.position.set(5, 5, 10);
  
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
  
        const sphereGeometry = new THREE.SphereGeometry(3, 32, 32);
        const sphereMaterial = new THREE.MeshStandardMaterial({ color: 0x000000, wireframe: false });
        const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
        scene.add(sphere);
  
        addCurveOnSphere();
        animate();
      };
  
      const addCurveOnSphere = () => {
        const a = store.a;
        const b = store.b;
        const points = [];
        const R = 3; // Rayon de la sphère
  
        for (let t = -Math.PI; t <= Math.PI; t += 0.01) {
          const x = t;
          const ySquared = x ** 3 + a * x + b;
          const y = Math.sqrt(Math.abs(ySquared)) * (ySquared >= 0 ? 1 : -1);
  
          const theta = (x + Math.PI) / (2 * Math.PI) * Math.PI * 2; // Tour de la sphère (0 à 2π)
          const phi = (y + 1) / 2 * Math.PI; // Du pole sud au pole nord de la sphère (0 à π)
  
          const px = R * Math.sin(phi) * Math.cos(theta);
          const py = R * Math.sin(phi) * Math.sin(theta);
          const pz = R * Math.cos(phi);
  
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