<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";

const a = ref("");
const b = ref("");
const x = ref("");
const errorMessage = ref("");
const result = ref(null);
const cached = ref(false);
let calculator = null;

const validateWeierstrass = () => {
  const aNum = parseFloat(a.value);
  const bNum = parseFloat(b.value);
  const xNum = parseFloat(x.value);

  if (isNaN(aNum) || isNaN(bNum) || isNaN(xNum)) {
    errorMessage.value = "Tous les coefficients doivent être des nombres.";
    return false;
  }
  if (4 * Math.pow(aNum, 3) + 27 * Math.pow(bNum, 2) === 0) {
    errorMessage.value = "La courbe est singulière (4a³ + 27b² ≠ 0).";
    return false;
  }
  errorMessage.value = "";
  return true;
};

const sendRequest = async () => {
  if (!validateWeierstrass()) {
    return;
  }

  try {
    const response = await axios.post("http://localhost:5000/weierstrass", {
      a: parseFloat(a.value),
      b: parseFloat(b.value),
      x: parseFloat(x.value),
    });

    result.value = response.data.result;
    cached.value = response.data.cached;
    updateGraph();
  } catch (error) {
    errorMessage.value = error.response?.data?.error || "Erreur inconnue.";
  }
};

const updateGraph = () => {
  if (!calculator || !result.value) return;

  calculator.setExpression({
    id: "curve",
    latex: `y^2 = x^3 + ${a.value}x + ${b.value}`,
    color: "blue",
  });

  calculator.setExpression({
    id: "point",
    latex: `(${x.value}, ${result.value})`,
    color: "red",
    pointStyle: "POINT",
  });
};

onMounted(() => {
  const script = document.createElement("script");
  script.src = "/desmos/desmos-calculator.js";
  script.onload = () => {
    console.log("Desmos chargé !");
    const elt = document.getElementById("calculator");
    if (elt) {
      calculator = Desmos.GraphingCalculator(elt);
    }
  };
  script.onerror = () => {
    console.error("Erreur lors du chargement de Desmos !");
  };
  document.head.appendChild(script);
});
</script>

<template>
  <div>
    <h2>Calcul de courbe de Weierstrass</h2>
    
    <label>Coefficient a :</label>
    <input v-model="a" type="number" step="any" />

    <label>Coefficient b :</label>
    <input v-model="b" type="number" step="any" />

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
