<template>
  <div class="menu-container">
    <!-- Courbe & Méthode -->
    <label for="curve-select">Courbe elliptique :</label>
    <select id="curve-select" v-model="selectedCurve">
      <option value="weierstrass">Weierstrass</option>
      <option value="montgomery">Montgomery</option>
      <option value="edwards">Edwards</option>
    </select>

    <!-- Champ -->
    <div class="field-selection">
      <label>Champ :</label>
      <label><input type="radio" value="real" v-model="fieldType" /> Réel</label>
      <label><input type="radio" value="modulo" v-model="fieldType" /> Modulo</label>
    </div>

    <!-- Paramètres principaux -->
    <div class="form-section">
      <label v-if="requires('a')" for="input-a">a :</label>
      <input v-if="requires('a')" id="input-a" v-model.number="store.a" type="number" step="any" placeholder="a" />

      <label v-if="requires('b')" for="input-b">b :</label>
      <input v-if="requires('b')" id="input-b" v-model.number="store.b" type="number" step="any" placeholder="b" />

      <label v-if="requires('d')" for="input-d">d :</label>
      <input v-if="requires('d')" id="input-d" v-model.number="store.d" type="number" step="any" placeholder="d" />

      <label v-if="fieldType === 'modulo'" for="input-p">Modulo p :</label>
      <input v-if="fieldType === 'modulo'" id="input-p" v-model.number="store.p" type="number" min="2" step="1" placeholder="p" />
    </div>

    <!-- Vues à afficher -->
    <div class="views-selection">
      <label>Vues à afficher :</label>
      <div v-for="view in filteredViews" :key="view.key">
        <input type="checkbox" :id="view.key" :value="view.key" v-model="activeViews" @change="emitViews" />
        <label :for="view.key">{{ view.label }}</label>
      </div>
    </div>

    <!-- Paramètres avancés -->
    <details class="advanced-settings">
      <summary>Paramètres avancés</summary>
      <label for="input-xMin">xMin :</label>
      <input id="input-xMin" v-model.number="store.xMin" type="number" step="any" placeholder="xMin" />

      <label for="input-xMax">xMax :</label>
      <input id="input-xMax" v-model.number="store.xMax" type="number" step="any" placeholder="xMax" />

      <label for="input-resolution">Résolution :</label>
      <input id="input-resolution" v-model.number="store.resolution" type="number" min="10" step="1" placeholder="Résolution" />
    </details>

    <!-- Résultats / erreurs -->
    <p v-if="store.result !== null" class="result">Résultat : y = {{ store.result }}</p>
    <p v-if="store.errorMessage" class="error">Erreur : {{ store.errorMessage }}</p>
    <p v-if="store.loading" class="loading">Chargement en cours...</p>

    <!-- Bouton wireframe -->
    <button @click="toggleWireframe">Toggle Wireframe</button>
  </div>
</template>

<script setup>
import { ref, watch, onMounted, computed } from "vue";
import axios from "axios";
import { useCurveStore } from "@/stores/curveStore";

const store = useCurveStore();
const selectedCurve = ref(store.curveType);
const fieldType = ref(store.field);
const emit = defineEmits(["viewsChanged"]);
let timer = null;

// Toutes les vues possibles
const allViews = [
  { key: "2D", label: "Graphique 2D" },
  { key: "2DHomogeneous", label: "Graphique 2D équation Homogène" },
  { key: "Torus", label: "Tore" },
  { key: "Sphere", label: "Sphère" }
];

// Vues filtrées selon le champ
const filteredViews = computed(() => {
  if (fieldType.value === "real") return allViews.filter(v => v.key !== "Torus");
  if (fieldType.value === "modulo") return allViews.filter(v => v.key !== "3D" && v.key !== "Sphere" && v.key !== "2DHomogeneous");
  return allViews;
});

const activeViews = ref([]);

// Mise à jour des vues autorisées
function updateActiveViews() {
  const allowed = filteredViews.value.map(v => v.key);
  activeViews.value = activeViews.value.filter(v => allowed.includes(v));
  for (const view of allowed) {
    if (!activeViews.value.includes(view)) {
      activeViews.value.push(view);
    }
  }
  emitViews();
}

// Notification des vues au parent
function emitViews() {
  emit("viewsChanged", [...activeViews.value]);
}

// Paramètres nécessaires selon le type de courbe
function requires(param) {
  const t = selectedCurve.value;
  if (param === "a" || param === "b") return t === "weierstrass" || t === "montgomery";
  if (param === "d") return t === "edwards";
  return false;
}

// Lancer le calcul après délai
function scheduleCompute() {
  clearTimeout(timer);
  timer = setTimeout(() => {
    computeBackend();
  }, 300);
}

// Appel à l'API backend
async function computeBackend() {
  store.errorMessage = "";
  store.result = null;
  store.loading = true;

  const payload = {
    type: selectedCurve.value,
    field: fieldType.value,
    a: requires("a") ? store.a : undefined,
    b: requires("b") ? store.b : undefined,
    d: requires("d") ? store.d : undefined,
    p: fieldType.value === "modulo" ? store.p : undefined,
    xMin: store.xMin,
    xMax: store.xMax,
    resolution: store.resolution
  };

  try {
    const res = await axios.post("http://localhost:5000/api/curves/compute", payload);
    console.log("API response:", res.data);

    const {
      points2D,
      homogeneousPoints2D,
      torus,
      sphere,
      polePoints2D
    } = res.data;

    store.graph2D = points2D || [];
    store.homogeneousGraph2D = homogeneousPoints2D || [];
    store.torusRaw = torus || [];
    store.sphereRaw = sphere || [];
    store.poleGraph2D = polePoints2D || [];

    store.result = points2D?.[0]?.y?.toFixed(5) || null;
  } catch (e) {
    store.errorMessage = e.response?.data?.error || e.message || "Erreur serveur.";
  } finally {
    store.loading = false;
  }
}

// Suivre les changements de paramètres
watch([
  selectedCurve,
  fieldType,
  () => store.a,
  () => store.b,
  () => store.d,
  () => store.p,
  () => store.xMin,
  () => store.xMax,
  () => store.resolution
], scheduleCompute, { deep: true });

watch(selectedCurve, val => store.curveType = val);
watch(fieldType, val => {
  store.field = val;
  updateActiveViews();
});

onMounted(() => {
  updateActiveViews();
  computeBackend();
});

function toggleWireframe() {
  store.toggleWireframe();
}
</script>

<style scoped>
.menu-container {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 1rem;
  max-width: 350px;
}
input, select {
  padding: 0.4rem;
  font-size: 1rem;
  width: 100%;
}
label { font-weight: bold; }
.form-section { display: flex; flex-direction: column; gap: 0.4rem; }
.field-selection { display: flex; gap: 1rem; align-items: center; }
.views-selection { display: flex; flex-direction: column; gap: 0.3rem; margin-top: 0.5rem; }
.advanced-settings { margin-top: 1rem; border-top: 1px solid #ccc; padding-top: 0.5rem; }
.result { color: rgb(255, 0, 0); font-weight: bold; }
.error { color: red; }
.loading { color: #666; font-style: italic; }
.toggle-wireframe-btn {
  background-color: #000000;
  color: white;
  border: none;
  padding: 0.8rem 1.5rem;
  font-size: 1.2rem;
  font-family: 'Arial', sans-serif;
  cursor: pointer;
  transition: background-color 0.3s ease;
}
.toggle-wireframe-btn:hover { background-color: #0056b3; }
</style>
