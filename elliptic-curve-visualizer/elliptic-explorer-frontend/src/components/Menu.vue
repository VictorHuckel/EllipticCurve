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
  <!-- Coefficient a -->
  <label v-if="requires('a')" for="input-a">a&nbsp;:</label>
  <input
    v-if="requires('a')"
    id="input-a"
    v-model.number="store.a"
    type="number"
    step="any"
    aria-label="Coefficient a"
    placeholder="Valeur de a"
  />

  <!-- Coefficient b -->
  <label v-if="requires('b')" for="input-b">b&nbsp;:</label>
  <input
    v-if="requires('b')"
    id="input-b"
    v-model.number="store.b"
    type="number"
    step="any"
    aria-label="Coefficient b"
    placeholder="Valeur de b"
  />

  <!-- Coefficient d -->
  <label v-if="requires('d')" for="input-d">d&nbsp;:</label>
  <input
    v-if="requires('d')"
    id="input-d"
    v-model.number="store.d"
    type="number"
    step="any"
    aria-label="Coefficient d"
    placeholder="Valeur de d"
  />

  <!-- Modulo p -->
  <label v-if="fieldType === 'modulo'" for="input-p">Modulo p&nbsp;:</label>
  <input
    v-if="fieldType === 'modulo'"
    id="input-p"
    v-model.number="store.p"
    type="number"
    min="2"
    step="1"
    aria-label="Modulo p"
    placeholder="Modulo p"
  />
</div>
    <!-- Vues -->
    <div class="views-selection">
      <label>Vues à afficher :</label>
      <div v-for="view in filteredViews" :key="view.key">
        <input
          type="checkbox"
          :id="view.key"
          :value="view.key"
          v-model="activeViews"
          @change="emitViews"
        />
        <label :for="view.key">{{ view.label }}</label>
      </div>
    </div>

    <!-- Paramètres avancés (dépliables) -->
    <details class="advanced-settings">
  <summary>Paramètres avancés</summary>

  <label for="input-xMin">xMin&nbsp;:</label>
  <input
    id="input-xMin"
    v-model.number="store.xMin"
    type="number"
    step="any"
    aria-label="Valeur minimale de x"
    placeholder="xMin"
  />

  <label for="input-xMax">xMax&nbsp;:</label>
  <input
    id="input-xMax"
    v-model.number="store.xMax"
    type="number"
    step="any"
    aria-label="Valeur maximale de x"
    placeholder="xMax"
  />

  <label for="input-resolution">Résolution (x)&nbsp;:</label>
  <input
    id="input-resolution"
    v-model.number="store.resolution"
    type="number"
    min="10"
    step="1"
    aria-label="Nombre de points pour la résolution"
    placeholder="Résolution"
  />

  <label for="input-zDepth">zDepth&nbsp;:</label>
  <input
    id="input-zDepth"
    v-model.number="store.zDepth"
    type="number"
    step="any"
    aria-label="Profondeur en z"
    placeholder="zDepth"
  />

  <label for="input-zSteps">zSteps&nbsp;:</label>
  <input
    id="input-zSteps"
    v-model.number="store.zSteps"
    type="number"
    min="1"
    step="1"
    aria-label="Nombre d’étapes z"
    placeholder="zSteps"
  />
</details>

    <!-- Résultat / Erreur / Chargement -->
    <p v-if="store.result !== null" class="result">Résultat : y = {{ store.result }}</p>
    <p v-if="store.errorMessage" class="error">Erreur : {{ store.errorMessage }}</p>
    <p v-if="store.loading" class="loading">Chargement en cours...</p>

    <!-- Other menu items -->
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
const debounceDelay = 300;
let timer = null;

const allViews = [
  { key: "2D", label: "Graphique 2D" },
  { key: "2DHomogeneous", label: "Graphique 2D équation Homogène" },
  { key: "Torus", label: "Tore" },
  { key: "Sphere", label: "Sphère" }
];

const filteredViews = computed(() => {
  if (fieldType.value === "real") {
    return allViews.filter(v => v.key !== "Torus");
  } else if (fieldType.value === "modulo") {
    return allViews.filter(v => v.key !== "3D" && v.key !== "Sphere" && v.key !== "2DHomogeneous");
  }
  return allViews;
});

const activeViews = ref([]);

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

function emitViews() {
  emit("viewsChanged", [...activeViews.value]);
}

watch(selectedCurve, val => store.curveType = val);
watch(fieldType, val => {
  store.field = val;
  updateActiveViews();
});

function requires(param) {
  const t = selectedCurve.value;
  if (param === "a" || param === "b") return t === "weierstrass" || t === "montgomery";
  if (param === "d") return t === "edwards";
  return false;
}

function scheduleCompute() {
  clearTimeout(timer);
  timer = setTimeout(() => {
    computeBackend();
  }, debounceDelay);
}

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
    resolution: store.resolution,
    zDepth: store.zDepth,
    zSteps: store.zSteps
  };

  try {
    const res = await axios.post("http://localhost:5000/api/curves/compute", payload);
    console.log("API compute response:", res.data)
    



    const { points2D, homogeneousPoints2D, points3D, torus, sphere, polePoints2D } = res.data;

    console.log("polePoints2D from API:", polePoints2D);
    
    store.graph2D = points2D || [];
    store.homogeneousGraph2D = homogeneousPoints2D || [];
    store.graph3D = points3D || [];
    store.torusRaw = torus || [];
    store.poleGraph2D = polePoints2D || [];
    store.sphereRaw = sphere || [];
    store.result = points2D?.[0]?.y?.toFixed(5) || null;
  } catch (e) {
    store.errorMessage = e.response?.data?.error || e.message || "Erreur serveur.";
  } finally {
    store.loading = false;
  }
}

watch([
  selectedCurve,
  fieldType,
  () => store.a,
  () => store.b,
  () => store.d,
  () => store.p,
  () => store.xMin,
  () => store.xMax,
  () => store.resolution,
  () => store.zDepth,
  () => store.zSteps
], scheduleCompute, { deep: true });

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

label {
  font-weight: bold;
}

.form-section {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}

.field-selection {
  display: flex;
  gap: 1rem;
  align-items: center;
}

.views-selection {
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
  margin-top: 0.5rem;
}

.advanced-settings {
  margin-top: 1rem;
  border-top: 1px solid #ccc;
  padding-top: 0.5rem;
}

.result {
  color: rgb(255, 0, 0);
  font-weight: bold;
}

.error {
  color: red;
}

.loading {
  color: #666;
  font-style: italic;
}

.toggle-wireframe-btn {
  background-color: #000000; /* Couleur de fond */
  color: white; /* Couleur du texte */
  border: none; /* Supprime les bordures */
  border-radius: px; /* Arrondi des coins */
  padding: 0.8rem 1.5rem; /* Taille du bouton */
  font-size: 1.2rem; /* Taille de la police */
  font-family: 'Arial', sans-serif; /* Police d'écriture */
  cursor: pointer; /* Curseur en mode clic */
  transition: background-color 0.3s ease; /* Animation pour le survol */
}

.toggle-wireframe-btn:hover {
  background-color: #0056b3; /* Couleur de fond au survol */
}
</style>
