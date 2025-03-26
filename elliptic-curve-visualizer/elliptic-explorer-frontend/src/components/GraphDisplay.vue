<script setup>
import { ref, computed, onMounted } from "vue";
import axios from "axios";

// Variables réactives
const curveType = ref("weierstrass");
const a = ref("");
const b = ref("");
const d = ref(""); // d est utilisé pour Edwards
const x = ref("");
const y = ref("");
const errorMessage = ref("");
const result = ref(null);
const cached = ref(false);
let calculator = null;

// Champs requis selon le type de courbe
const curveFields = computed(() => {
  switch (curveType.value) {
    case "weierstrass":
      return ["a", "b", "x"];
    case "edwards":
      return ["d", "x"];
    case "montgomery":
      return ["a", "b", "x"];
    default:
      return [];
  }
});

// Validation des entrées
const validateInputs = () => {
  const xNum = parseFloat(x.value);
  if (isNaN(xNum)) {
    errorMessage.value = "x doit être un nombre.";
    return false;
  }

  if (curveFields.value.includes("a") && isNaN(parseFloat(a.value))) {
    errorMessage.value = "a doit être un nombre.";
    return false;
  }

  if (curveFields.value.includes("b") && isNaN(parseFloat(b.value))) {
    errorMessage.value = "b doit être un nombre.";
    return false;
  }

  if (curveFields.value.includes("d")) {
    const dNum = parseFloat(d.value);
    if (isNaN(dNum) || dNum === 1) {
      errorMessage.value = "d doit être un nombre différent de 1.";
      return false;
    }
  }

  errorMessage.value = "";
  return true;
};

// Envoi des données au back-end
const sendRequest = async () => {
  if (!validateInputs()) return;

  try {
    const payload = { x: parseFloat(x.value) };
    if (curveType.value === "edwards") {
      payload.d = parseFloat(d.value);
    } else {
      if (curveFields.value.includes("a")) payload.a = parseFloat(a.value);
      if (curveFields.value.includes("b")) payload.b = parseFloat(b.value);
    }

    const response = await axios.post(`http://localhost:5000/api/curves/${curveType.value}`, payload);
    result.value = response.data.result;
    updateGraph();
  } catch (error) {
    errorMessage.value = error.response?.data?.error || "Erreur inconnue.";
  }
};

// Mise à jour du graphique Desmos
const updateGraph = () => {
  if (!calculator) return;

  calculator.setExpressions([]); // Réinitialiser

  switch (curveType.value) {
    case "weierstrass":
      calculator.setExpression({
        id: "curve",
        latex: `y^2 = x^3 + ${a.value}x + ${b.value}`,
        color: "blue",
      });
      break;

    case "edwards":
      calculator.setExpression({
        id: "edwards_positive",
        latex: `y=\\sqrt{\\frac{1 - x^2}{1 - ${d.value} * x^2}}`,
        color: "blue",
      });
      calculator.setExpression({
        id: "edwards_negative",
        latex: `y=-\\sqrt{\\frac{1 - x^2}{1 - ${d.value} * x^2}}`,
        color: "blue",
      });
      break;

    case "montgomery":
      calculator.setExpression({
        id: "curve",
        latex: `y^2 = x^3 + ${a.value}x^2 + ${b.value}x`,
        color: "blue",
      });
      break;
  }

  if (result.value !== null) {
    calculator.setExpression({
      id: "point",
      latex: `(${x.value}, ${result.value})`,
      color: "red",
      pointStyle: "POINT",
    });
  }
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

    <!-- Champs dynamiques -->
    <label v-if="curveFields.includes('a')">Coefficient a :</label>
    <input v-if="curveFields.includes('a')" v-model="a" type="number" step="any" />

    <label v-if="curveFields.includes('b')">Coefficient b :</label>
    <input v-if="curveFields.includes('b')" v-model="b" type="number" step="any" />

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
