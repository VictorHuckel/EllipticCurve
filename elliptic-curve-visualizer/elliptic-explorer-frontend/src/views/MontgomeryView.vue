<template>
  <div class="montgomery-view">
    <h2>Courbe de type Montgomery</h2>

    <!-- Section pour afficher l'équation de la courbe -->
    <div class="equation">
      <h3>Équation de la courbe</h3>
      <p>
        La forme générale d'une courbe de Montgomery est :
        <strong>By² = x³ + Ax² + x</strong>
      </p>
    </div>

    <!-- Section pour configurer les paramètres de la courbe -->
    <div class="parameters">
      <h3>Paramètres</h3>
      <label for="param-a">A :</label>
      <input id="param-a" type="number" v-model="parameters.A" />

      <label for="param-b">B :</label>
      <input id="param-b" type="number" v-model="parameters.B" />

      <button @click="updateCurve">Mettre à jour la courbe</button>
    </div>

    <!-- Section pour afficher le graphique -->
    <div class="graph">
      <h3>Graphique</h3>
      <div id="montgomery-graph"></div>
    </div>
  </div>
</template>

<script>
import { graphStore } from "@/stores/graph.js";

export default {
  name: "MontgomeryView",
  setup() {
    const graphS = graphStore();

    return { graphS };
  },
  data() {
    return {
      parameters: {
        A: 1, // Valeur par défaut pour A
        B: 1, // Valeur par défaut pour B
      },
    };
  },
  methods: {
    updateCurve() {
      const { A, B } = this.parameters;

      // Vérification des paramètres
      if (B === 0) {
        alert("Le paramètre B ne peut pas être nul.");
        return;
      }

      // Affichage de la courbe Montgomery
      this.graphS.displayMontgomery(A, B);
    },
  },
};
</script>

<style scoped>
.montgomery-view {
  padding: 20px;
}

.equation {
  margin-bottom: 20px;
}

.parameters {
  margin-bottom: 20px;
}

.parameters label {
  display: block;
  margin-bottom: 5px;
}

.parameters input {
  margin-bottom: 10px;
  padding: 5px;
  width: 100px;
}

button {
  padding: 10px 15px;
  background-color: #42b883;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

button:hover {
  background-color: #369f6e;
}

.graph {
  margin-top: 20px;
  border: 1px solid #ddd;
  padding: 10px;
  border-radius: 5px;
  background-color: #f9f9f9;
}
</style>