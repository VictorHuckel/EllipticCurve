<script setup>
import { ref, computed, onMounted } from "vue";
import axios from "axios";

// Variables réactives
const curveType = ref("weierstrass"); // Type de courbe sélectionné
const a = ref("");
const b = ref("");
const c = ref(""); // Utilisé pour certaines courbes
const d = ref(""); // Idem
const x = ref("");
const errorMessage = ref("");
const result = ref(null);
const cached = ref(false);
let calculator = null;

// Définition des champs requis en fonction du type de courbe
const curveFields = computed(() => {
  switch (curveType.value) {
    case "weierstrass":
      return ["a", "b", "x"];
    case "edwards":
      return ["a", "d", "x"];
    case "montgomery":
      return ["a", "b", "x"];
    default:
      return [];
  }
});

// Validation des entrées
const validateInputs = () => {
  const aNum = parseFloat(a.value);
  const bNum = parseFloat(b.value);
  const cNum = parseFloat(c.value);
  const dNum = parseFloat(d.value);
  const xNum = parseFloat(x.value);

  if (isNaN(aNum) || isNaN(xNum) || (curveFields.value.includes("b") && isNaN(bNum))) {
    errorMessage.value = "Tous les coefficients doivent être des nombres.";
    return false;
  }

  if (curveType.value === "weierstrass" && 4 * Math.pow(aNum, 3) + 27 * Math.pow(bNum, 2) === 0) {
    errorMessage.value = "La courbe de Weierstrass est singulière (4a³ + 27b² ≠ 0).";
    return false;
  }

  errorMessage.value = "";
  return true;
};

// Envoi des données au back-end
const sendRequest = async () => {
  if (!validateInputs()) return;

  try {
    const payload = { a: parseFloat(a.value), x: parseFloat(x.value) };
    if (curveFields.value.includes("b")) payload.b = parseFloat(b.value);
    if (curveFields.value.includes("c")) payload.c = parseFloat(c.value);
    if (curveFields.value.includes("d")) payload.d = parseFloat(d.value);

    const response = await axios.post(`http://localhost:5000/api/curves/${curveType.value}`, payload);

    result.value = response.data.result;
    cached.value = response.data.cached;
    updateGraph();
  } catch (error) {
    errorMessage.value = error.response?.data?.error || "Erreur inconnue.";
  }
};

// Mise à jour du graphique
const updateGraph = () => {
  if (!calculator || !result.value) return;

  let equation = "";
  switch (curveType.value) {
    case "weierstrass":
      equation = `y^2 = x^3 + ${a.value}x + ${b.value}`;
      break;
    case "edwards":
      equation = `${a.value}x^2 + y^2 = 1 + ${d.value}x^2y^2`;
      break;
    case "montgomery":
      equation = `y^2 = x^3 + ${a.value}x^2 + ${b.value}x`;
      break;
  }

  calculator.setExpression({ id: "curve", latex: equation, color: "blue" });
  calculator.setExpression({ id: "point", latex: `(${x.value}, ${result.value})`, color: "red", pointStyle: "POINT" });
};

// Chargement de Desmos
onMounted(() => {
  const script = document.createElement("script");
  script.src = "/desmos/desmos-calculator.js";
  script.onload = () => {
    const elt = document.getElementById("calculator");
    if (elt) {
      calculator = Desmos.GraphingCalculator(elt);
    }
  };
  script.onerror = () => console.error("Erreur lors du chargement de Desmos !");
  document.head.appendChild(script);
});
</script>

<template>
  <div>
    <h2>Calcul de courbe elliptique</h2>

    <!-- Sélection du type de courbe -->
    <label>Type de courbe :</label>
    <select v-model="curveType">
      <option value="weierstrass">Weierstrass</option>
      <option value="edwards">Edwards</option>
      <option value="montgomery">Montgomery</option>
    </select>

    <!-- Champs de saisie dynamiques -->
    <label v-if="curveFields.includes('a')">Coefficient a :</label>
    <input v-if="curveFields.includes('a')" v-model="a" type="number" step="any" />

    <label v-if="curveFields.includes('b')">Coefficient b :</label>
    <input v-if="curveFields.includes('b')" v-model="b" type="number" step="any" />

    <label v-if="curveFields.includes('c')">Coefficient c :</label>
    <input v-if="curveFields.includes('c')" v-model="c" type="number" step="any" />

    <label v-if="curveFields.includes('d')">Coefficient d :</label>
    <input v-if="curveFields.includes('d')" v-model="d" type="number" step="any" />

    <label>Valeur x :</label>
    <input v-model="x" type="number" step="any" />

    <button @click="sendRequest">Calculer</button>

    <p v-if="errorMessage" style="color: red;">{{ errorMessage }}</p>

    <p v-if="result !== null">
      Résultat : y = {{ result }} <span v-if="cached">(mis en cache)</span>
    </p>

    <div id="calculator" style="width: 600px; height: 400px;"></div>
  </div>
</template>
