<script setup>
import { onMounted } from "vue";
import axios from "axios";
import { useCurveStore } from "@/stores/curveStore";

// Utilisation du store
const store = useCurveStore();

// Variables locales
let calculator = null;

// Validation des entrées
const validateInputs = () => {
  const xNum = parseFloat(store.x);
  if (isNaN(xNum)) {
    store.errorMessage = "x doit être un nombre.";
    return false;
  }

  if (store.curveFields.includes("a") && isNaN(parseFloat(store.a))) {
    store.errorMessage = "a doit être un nombre.";
    return false;
  }

  if (store.curveFields.includes("b") && isNaN(parseFloat(store.b))) {
    store.errorMessage = "b doit être un nombre.";
    return false;
  }

  if (store.curveFields.includes("d")) {
    const dNum = parseFloat(store.d);
    if (isNaN(dNum) || dNum === 1) {
      store.errorMessage = "d doit être un nombre différent de 1.";
      return false;
    }
  }

  store.errorMessage = "";
  return true;
};

// Envoi des données au back-end
const sendRequest = async () => {
  if (!validateInputs()) return;

  try {
    const payload = { x: parseFloat(store.x) };
    if (store.curveType === "edwards") {
      payload.d = parseFloat(store.d);
    } else {
      if (store.curveFields.includes("a")) payload.a = parseFloat(store.a);
      if (store.curveFields.includes("b")) payload.b = parseFloat(store.b);
    }

    const response = await axios.post(`http://localhost:5000/api/curves/${store.curveType}`, payload);
    store.result = response.data.result;
    updateGraph();
  } catch (error) {
    store.errorMessage = error.response?.data?.error || "Erreur inconnue.";
  }
};

// Mise à jour du graphique Desmos
const updateGraph = () => {
  if (!calculator) return;

  calculator.setExpressions([]); // Réinitialiser

  switch (store.curveType) {
    case "weierstrass":
      calculator.setExpression({
        id: "curve",
        latex: `y^2 = x^3 + ${store.a}x + ${store.b}`,
        color: "blue",
      });
      break;

    case "edwards":
      calculator.setExpression({
        id: "edwards_positive",
        latex: `y=\\sqrt{\\frac{1 - x^2}{1 - ${store.d} * x^2}}`,
        color: "blue",
      });
      calculator.setExpression({
        id: "edwards_negative",
        latex: `y=-\\sqrt{\\frac{1 - x^2}{1 - ${store.d} * x^2}}`,
        color: "blue",
      });
      break;

    case "montgomery":
      calculator.setExpression({
        id: "curve",
        latex: `y^2 = x^3 + ${store.a}x^2 + ${store.b}x`,
        color: "blue",
      });
      break;
  }

  if (store.result !== null) {
    calculator.setExpression({
      id: "point",
      latex: `(${store.x}, ${store.result})`,
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
    <select v-model="store.curveType">
      <option value="weierstrass">Weierstrass</option>
      <option value="edwards">Edwards</option>
      <option value="montgomery">Montgomery</option>
    </select>

    <!-- Champs dynamiques -->
    <label v-if="store.curveFields.includes('a')">Coefficient a :</label>
    <input v-if="store.curveFields.includes('a')" v-model="store.a" type="number" step="any" />

    <label v-if="store.curveFields.includes('b')">Coefficient b :</label>
    <input v-if="store.curveFields.includes('b')" v-model="store.b" type="number" step="any" />

    <label v-if="store.curveFields.includes('d')">Coefficient d :</label>
    <input v-if="store.curveFields.includes('d')" v-model="store.d" type="number" step="any" />

    <label>Valeur x :</label>
    <input v-model="store.x" type="number" step="any" />

    <button @click="sendRequest">Calculer</button>

    <p v-if="store.errorMessage" style="color: red;">{{ store.errorMessage }}</p>

    <p v-if="store.result !== null">
      Résultat : y = {{ store.result }}
    </p>

    <div id="calculator" style="width: 600px; height: 400px;"></div>
  </div>
</template>
