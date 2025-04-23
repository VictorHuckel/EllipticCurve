import { defineStore } from "pinia";
import { ref, computed } from "vue";

export const useCurveStore = defineStore("curveStore", () => {
  // Type de courbe et champ
  const curveType = ref("weierstrass");
  const field = ref("real");

  // Version homogénéisée automatiquement dérivée
  const homogeneousCurveType = computed(() => {
    switch (curveType.value) {
      case "weierstrass": return "weierstrass_homogeneous";
      case "montgomery": return "montgomery_homogeneous";
      case "edwards": return "edwards_homogeneous";
      default: return null;
    }
  });

  // Coefficients selon la courbe
  const a = ref(1);
  const b = ref(1);
  const d = ref(1);
  const p = ref(7); // champ modulo

  // Domaine pour le champ réel
  const xMin = ref(-5);
  const xMax = ref(5);
  const resolution = ref(2000);

  // Résultats du backend
  const loading = ref(false);
  const errorMessage = ref("");
  const result = ref(null);

  const graph2D = ref([]);
  const homogeneousGraph2D = ref([]);
  const torusRaw = ref([]);
  const sphereRaw = ref([]);
  const poleGraph2D = ref([]);

  // Vues selon le champ actif
  const viewsData = computed(() => ({
    graph2D: graph2D.value,
    homogeneousGraph2D: homogeneousGraph2D.value,
    torus: field.value === "modulo" ? torusRaw.value : [],
    sphere: field.value === "modulo" ? sphereRaw.value : []
  }));

  // Champs requis selon la courbe
  const curveFields = computed(() => {
    switch (curveType.value) {
      case "weierstrass":
      case "weierstrass_homogeneous":
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

  // Mode wireframe
  const wireframeMode = ref(false);
  function toggleWireframe() {
    wireframeMode.value = !wireframeMode.value;
  }

  return {
    // Type
    curveType,
    field,
    homogeneousCurveType,

    // Coefficients
    a, b, d, p,

    // Domaine
    xMin,
    xMax,
    resolution,

    // Résultats
    loading,
    errorMessage,
    result,
    graph2D,
    homogeneousGraph2D,
    torusRaw,
    sphereRaw,
    poleGraph2D,

    // Vue calculée
    viewsData,
    curveFields,

    // Autres
    wireframeMode,
    toggleWireframe
  };
});
