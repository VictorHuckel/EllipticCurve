<script setup>
import { ref, watch, onMounted, defineProps } from "vue";
import axios from "axios";

const props = defineProps({
  selectedCurve: {
    type: String,
    default: null,
  },
  curveParameters: {
    type: Object,
    required: true,
  },
});

const errorMessage = ref("");
const result = ref(null);
const cached = ref(false);
let calculator = null;

const validateParameters = () => {
  if (!props.selectedCurve) {
    errorMessage.value = "Veuillez sélectionner une courbe.";
    return false;
  }

  if (!props.curveParameters || Object.keys(props.curveParameters).length === 0) {
    errorMessage.value = "Veuillez entrer les paramètres de la courbe.";
    return false;
  }

  for (const key in props.curveParameters) {
    if (isNaN(parseFloat(props.curveParameters[key]))) {
      errorMessage.value = `Le paramètre ${key} doit être un nombre.`;
      return false;
    }
  }

  errorMessage.value = "";
  return true;
};

const sendRequest = async () => {
  if (!validateParameters()) {
    return;
  }

  try {
    const response = await axios.post(`http://localhost:5000/api/curves/${props.selectedCurve.toLowerCase()}`, props.curveParameters);
    result.value = response.data.result;
    cached.value = response.data.cached;
    updateGraph();
  } catch (error) {
    errorMessage.value = error.response?.data?.error || "Erreur inconnue.";
  }
};

const updateGraph = () => {
  if (!props.selectedCurve || !calculator) {
    errorMessage.value = "Veuillez sélectionner une courbe.";
    return;
  }

  calculator.setExpression({ id: "curve", latex: getCurveEquation(), color: "blue" });
};

const getCurveEquation = () => {
  switch (props.selectedCurve) {
    case "Short Weierstrass":
      return `y^2 = x^3 + ${props.curveParameters.a}x + ${props.curveParameters.b}`;
    case "Weierstrass":
      return `y^2 + ${props.curveParameters.a1}xy + ${props.curveParameters.a3}y = x^3 + ${props.curveParameters.a2}x^2 + ${props.curveParameters.a4}x + ${props.curveParameters.a6}`;
    case "Montgomery":
      return `${props.curveParameters.B}y^2 = x^3 + ${props.curveParameters.A}x^2 + x`;
    case "Edwards":
      return `${props.curveParameters.c}x^2 + y^2 = 1 + ${props.curveParameters.d}x^2y^2`;
    default:
      return "";
  }
};

onMounted(() => {
  const script = document.createElement("script");
  script.src = "/desmos/desmos-calculator.js";
  script.onload = () => {
    const elt = document.getElementById("calculator");
    if (elt) {
      calculator = Desmos.GraphingCalculator(elt);
    }
  };
  document.head.appendChild(script);
});

watch([() => props.selectedCurve, () => props.curveParameters], () => {
  if (props.selectedCurve && Object.keys(props.curveParameters).length > 0) {
    sendRequest();
  }
});
</script>

<template>
  <div>
    <h2>Affichage du graphique</h2>
    <p v-if="errorMessage" style="color: red;">{{ errorMessage }}</p>
    <div id="calculator" style="width: 100%; height: 500px; border: 1px solid #ddd;"></div>
    <p v-if="result !== null">
      Résultat : y = {{ result }} <span v-if="cached">(mis en cache)</span>
    </p>
  </div>
</template>

<style scoped>
#calculator {
  margin-top: 20px;
  border-radius: 8px;
  background-color: #f9f9f9;
}
</style>
