<script setup>
import { ref, onMounted } from "vue"; // Importation des fonctionnalités réactives et du cycle de vie
import axios from "axios"; // Importation d'axios pour effectuer les requêtes HTTP

// Déclaration des variables réactives pour stocker les coefficients et les résultats
const a = ref("");
const b = ref("");
const x = ref("");
const errorMessage = ref("");
const result = ref(null);
const cached = ref(false);
let calculator = null; // Référence à l'instance du calculateur (Desmos)

// Fonction de validation des coefficients et de x
const validateWeierstrass = () => {
  const aNum = parseFloat(a.value);
  const bNum = parseFloat(b.value);
  const xNum = parseFloat(x.value);

  // Vérifie que tous les champs sont des nombres
  if (isNaN(aNum) || isNaN(bNum) || isNaN(xNum)) {
    errorMessage.value = "Tous les coefficients doivent être des nombres.";
    return false;
  }
  // Vérifie la condition de non-singularité de la courbe : 4a³ + 27b² ≠ 0
  if (4 * Math.pow(aNum, 3) + 27 * Math.pow(bNum, 2) === 0) {
    errorMessage.value = "La courbe est singulière (4a³ + 27b² ≠ 0).";
    return false;
  }
  errorMessage.value = "";
  return true;
};

// Fonction pour envoyer la requête au backend et récupérer le résultat du calcul
const sendRequest = async () => {
  if (!validateWeierstrass()) {
    return;
  }

  try {
    // Envoi d'une requête POST avec les valeurs converties en nombres
    const response = await axios.post("http://localhost:5000/api/curves/weierstrass", {
      a: parseFloat(a.value),
      b: parseFloat(b.value),
      x: parseFloat(x.value),
    });

    // Stockage du résultat retourné par le backend et de l'information de cache
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
  if (!calculator || !result.value) return;

  // Mise à jour de l'expression de la courbe
  calculator.setExpression({
    id: "curve",
    latex: `y^2 = x^3 + ${a.value}x + ${b.value}`,
    color: "blue",
  });

  // Affichage du point calculé sur la courbe
  calculator.setExpression({
    id: "point",
    latex: `(${x.value}, ${result.value})`,
    color: "red",
    pointStyle: "POINT",
  });
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
</script>

<template>
  <div>
    <!-- Titre du composant -->
    <h2>Calcul de courbe de Weierstrass</h2>
    
    <!-- Champs de saisie pour les coefficients a et b -->
    <label>Coefficient a :</label>
    <input v-model="a" type="number" step="any" />

    <label>Coefficient b :</label>
    <input v-model="b" type="number" step="any" />

    <!-- Champ de saisie pour la valeur x -->
    <label>Valeur x :</label>
    <input v-model="x" type="number" step="any" />

    <!-- Bouton pour lancer le calcul de la courbe -->
    <button @click="sendRequest">Calculer</button>

    <!-- Affichage du message d'erreur en cas de problème -->
    <p v-if="errorMessage" style="color: red;">{{ errorMessage }}</p>

    <!-- Affichage du résultat si celui-ci est disponible, avec indication de cache si applicable -->
    <p v-if="result !== null">
      Résultat : y = {{ result }} <span v-if="cached">(mis en cache)</span>
    </p>

    <!-- Zone où le calculateur graphique Desmos va afficher la courbe -->
    <div id="calculator" style="width: 600px; height: 400px;"></div>
  </div>
</template>
