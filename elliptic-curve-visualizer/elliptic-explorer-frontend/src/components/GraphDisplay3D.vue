<template>
  <div id="ellipticCurveGraph" style="width: 100vw; height: 100vh;"></div>
</template>

<script>
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { useCurveStore } from "@/stores/curveStore";
import { watch, onMounted } from "vue";

export default {
  setup() {
    const store = useCurveStore();

    // Met à jour le graph quand les valeurs changent
    watch(() => [store.curveType, store.a, store.b, store.d], () => {
      console.log("Mise à jour du graphique...");
      updateGraph();
    });

    let container = null;
    let scene, camera, renderer, controls;

    const initThreeJS = () => {
      container = document.getElementById("ellipticCurveGraph");
      if (!container) return;

      scene = new THREE.Scene();
      scene.background = new THREE.Color(0xffffff);

      camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
      camera.position.set(0, 5, 10);

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

      animate();
    };

    const animate = () => {
      requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    };

    const getEquation = () => {
      const { curveType, a, b, d } = store;
      switch (curveType) {
        case "weierstrass":
          return `x ** 3 + ${a} * x + ${b}`;
        case "edwards":
          return `(1 - x ** 2) / (1 - ${d} * x ** 2)`;
        case "montgomery":
          return `x ** 3 + ${a} * x ** 2 + ${b} * x`;
        default:
          return "x ** 3 - x + 1";
      }
    };

    const updateGraph = () => {
      if (!container) return;
      while (container.firstChild) container.removeChild(container.firstChild);
      initThreeJS();
      addCurve(getEquation());
    };

    const addCurve = (equation) => {
      console.log("Equation utilisée :", equation);

      const surfaces = generateSurfaces(equation);
      surfaces.forEach((surface) => scene.add(surface));
    };

    const generateSurfaces = (equation) => {
      const surfaces = [];
      const zRange = 5;
      const resolution = 100;
      const zSteps = 20;
      const xMin = -2, xMax = 2;

      [1, -1].forEach((sign) => {
        const geometry = new THREE.BufferGeometry();
        const vertices = [];
        const validPoints = [];

        for (let j = 0; j <= zSteps; j++) {
          const z = (j / zSteps) * zRange - zRange / 2;

          for (let i = 0; i <= resolution; i++) {
            const x = (i / resolution) * (xMax - xMin) + xMin;
            try {
              const ySquared = eval(equation.replace(/x/g, `(${x})`));
              console.log(`x: ${x}, y²: ${ySquared}`);
              if (ySquared >= 0) {
                const y = sign * Math.sqrt(ySquared);
                vertices.push(x, y, z);
                validPoints.push(true);
              } else {
                vertices.push(x, 0, z);
                validPoints.push(false);
              }
            } catch (error) {
              console.error("Erreur lors de l'évaluation de l'équation :", error);
            }
          }
        }

        const indices = [];
        for (let j = 0; j < zSteps; j++) {
          for (let i = 0; i < resolution; i++) {
            const a = j * (resolution + 1) + i;
            const b = a + 1;
            const c = a + (resolution + 1);
            const d = c + 1;

            if (validPoints[a] && validPoints[b] && validPoints[c]) {
              indices.push(a, b, c);
            }
            if (validPoints[b] && validPoints[d] && validPoints[c]) {
              indices.push(b, d, c);
            }
          }
        }

        geometry.setAttribute("position", new THREE.Float32BufferAttribute(vertices, 3));
        geometry.setIndex(indices);
        geometry.computeVertexNormals();

        const material = new THREE.MeshStandardMaterial({ color: 0x8b0000, side: THREE.DoubleSide });
        surfaces.push(new THREE.Mesh(geometry, material));
      });

      return surfaces;
    };

    onMounted(() => {
      initThreeJS();
      addCurve(getEquation());
    });

    return {};
  },
};
</script>
