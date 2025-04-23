import { defineStore } from "pinia";
import { ref, computed } from "vue";

export const useCurveStore = defineStore("curveStore", () => {
  const curveType = ref("weierstrass");  // "weierstrass", "montgomery", "edwards"
  const field = ref("real");             // "real" ou "modulo"
  const method = ref("explicit");        // "explicit" ou "parametric"

  // Ajoutez un computed pour la version homogénéisée
  const homogeneousCurveType = computed(() => {
    switch (curveType.value) {
      case "weierstrass":
        return "weierstrass_homogeneous";
      case "montgomery":
        return "montgomery_homogeneous";
      case "edwards":
        return "edwards_homogeneous";
      default:
        return null;
    }
  });
  const wireframeMode = ref(false); // State to track wireframe mode

  function toggleWireframe() {
    wireframeMode.value = !wireframeMode.value;
  }
  // Coefficients
  const a = ref(1);
  const b = ref(1);
  const d = ref(1);
  const p = ref(7); // pour le mode modulo

  // Paramètre unique pour la résolution ponctuelle (si nécessaire)
  const x = ref(0);

  // Paramètres d'échantillonnage (mode réel)
  const xMin = ref(-5);
  const xMax = ref(5);
  const resolution = ref(2000);

  // Paramètres d’extrusion 3D
  const zDepth = ref(5);
  const zSteps = ref(20);

  // Paramètres de courbe paramétrique
  const tMin = ref(-Math.PI);
  const tMax = ref(Math.PI);
  const tSteps = ref(500);

  // Résultats du backend
  const loading = ref(false);
  const errorMessage = ref("");
  const result = ref(null); // pour le point y(x)
  const graph2D = ref([]);
  const homogeneousGraph2D = ref([]);
  const graph3D = ref([]);
  const torusRaw = ref([]);
  const sphereRaw = ref([]);

  // Synthèse selon le mode actif
  const viewsData = computed(() => ({
    graph2D: graph2D.value,
    homogeneousGraph2D: homogeneousGraph2D.value,
    graph3D: graph3D.value,
    torus: field.value === "modulo" ? torusRaw.value : [],
    sphere: field.value === "modulo" ? sphereRaw.value : []
  }));

  // Champs nécessaires selon la courbe
  const curveFields = computed(() => {
    switch (curveType.value) {
      case "weierstrass":
      case "weierstrass_homogeneous":
        return ["a", "b"];
      case "montgomery":
      case "montgomery_homogeneous":
        return ["a", "b"];
      case "edwards":
      case "edwards_homogeneous":
        return ["d"];
      default:
        return [];
    }
  });

  return {
    // Courbe et méthode
    curveType,
    homogeneousCurveType, // Exposez la version homogénéisée
    field,
    method,

    // Coefficients
    a, b, d, p,

    // Résolution d’un point
    x,

    // Domaines et extrusions
    xMin,
    xMax,
    resolution,
    zDepth,
    zSteps,

    // Paramétrique
    tMin,
    tMax,
    tSteps,

    // Résultats
    loading,
    result,
    errorMessage,
    graph2D,
    homogeneousGraph2D,
    graph3D,
    torusRaw,
    sphereRaw,

    // Synthèse
    viewsData,
    curveFields,

    wireframeMode,
    toggleWireframe
  };
});