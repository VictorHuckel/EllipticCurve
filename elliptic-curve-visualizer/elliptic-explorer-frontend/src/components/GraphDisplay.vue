<script setup>
import { ref, watch, onMounted } from "vue"; // Importation des fonctionnalités réactives et du cycle de vie
import axios from "axios"; // Importation d'axios pour effectuer les requêtes HTTP

// Props pour recevoir le type de courbe et les coefficients
defineProps({
  selectedCurve: {
    type: String,
    required: true,
  },
  curveParameters: {
    type: Object,
    required: true,
  },
});

// Variables réactives pour gérer les erreurs et les résultats
const errorMessage = ref("");
const result = ref(null);
const cached = ref(false);
let calculator = null; // Référence à l'instance du calculateur (Desmos)

// Fonction de validation des coefficients
const validateParameters = () => {
  if (!selectedCurve) {
    errorMessage.value = "Veuillez sélectionner une courbe.";
    return false;
  }

  if (!curveParameters || Object.keys(curveParameters).length === 0) {
    errorMessage.value = "Veuillez entrer les paramètres de la courbe.";
    return false;
  }

  for (const key in curveParameters) {
    if (isNaN(parseFloat(curveParameters[key]))) {
      errorMessage.value = `Le paramètre ${key} doit être un nombre.`;
      return false;
    }
  }

  errorMessage.value = "";
  return true;
};

// Fonction pour envoyer une requête au backend et récupérer le résultat
const sendRequest = async () => {
  if (!validateParameters()) {
    return;
  }

  try {
    // Envoi d'une requête POST au backend avec les paramètres de la courbe
    const response = await axios.post(`http://localhost:5000/api/curves/${selectedCurve.toLowerCase()}`, curveParameters);

    // Stockage du résultat retourné par le backend
    result.value = response.data.result;
    cached.value = response.data.cached;

    // Mise à jour du graphique avec le nouveau résultat
    updateGraph();
  } catch (error) {
    errorMessage.value = error.response?.data?.error || "Erreur inconnue.";
  }
};

// Fonction pour mettre à jour l'affichage graphique avec Desmos
const updateGraph = () => {
  if (!selectedCurve || !calculator) {
    errorMessage.value = "Veuillez sélectionner une courbe.";
    return;
  }

  // Mise à jour de l'expression de la courbe en fonction du type sélectionné
  switch (selectedCurve) {
    case "Short Weierstrass":
      calculator.setExpression({
        id: "curve",
        latex: `y^2 = x^3 + ${curveParameters.a}x + ${curveParameters.b}`,
        color: "blue",
      });
      break;

    case "Weierstrass":
      calculator.setExpression({
        id: "curve",
        latex: `y^2 + ${curveParameters.a1}xy + ${curveParameters.a3}y = x^3 + ${curveParameters.a2}x^2 + ${curveParameters.a4}x + ${curveParameters.a6}`,
        color: "blue",
      });
      break;

    case "Montgomery":
      calculator.setExpression({
        id: "curve",
        latex: `${curveParameters.B}y^2 = x^3 + ${curveParameters.A}x^2 + x`,
        color: "blue",
      });
      break;

    case "Edwards":
      calculator.setExpression({
        id: "curve",
        latex: `${curveParameters.c}x^2 + y^2 = 1 + ${curveParameters.d}x^2y^2`,
        color: "blue",
      });
      break;

    default:
      errorMessage.value = "Type de courbe non pris en charge.";
      return;
  }
};

// Chargement dynamique de la librairie Desmos lorsque le composant est monté
onMounted(() => {
  const script = document.createElement("script");
  script.src = "/desmos/desmos-calculator.js";
  script.onload = () => {
    console.log("Desmos chargé !");
    // Initialise le calculateur dans l'élément HTML dont l'id est "calculator"
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

// Surveille les changements dans les props pour mettre à jour le graphique
watch([selectedCurve, curveParameters], () => {
  if (selectedCurve && Object.keys(curveParameters).length > 0) {
    sendRequest();
  } else {
    errorMessage.value = "Veuillez sélectionner une courbe et entrer les paramètres.";
  }
});
</script>

<template>
  <div>
    <!-- Titre du composant -->
    <h2>Affichage du graphique</h2>

    <!-- Affichage du message d'erreur en cas de problème -->
    <p v-if="errorMessage" style="color: red;">{{ errorMessage }}</p>

    <!-- Zone pour afficher le graphique -->
    <div id="calculator" style="width: 100%; height: 500px; border: 1px solid #ddd;"></div>

    <!-- Affichage du résultat si celui-ci est disponible -->
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
