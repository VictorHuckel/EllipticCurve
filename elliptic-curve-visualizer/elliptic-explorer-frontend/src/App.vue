<script setup>
import { computed } from "vue";
import { useCurveStore } from "@/stores/curveStore";
import GraphDisplay from "./components/GraphDisplay.vue";
import GraphDisplay3D from "./components/GraphDisplay3D.vue";

const store = useCurveStore();

const curveInfo = computed(() => {
  switch (store.curveType) {
    case "weierstrass":
      return {
        name: "Courbe de Weierstrass",
        equation: "y² = x³ + ax + b",
        description:
          "Utilisée en cryptographie, cette forme générale décrit la majorité des courbes elliptiques."
      };
    case "edwards":
      return {
        name: "Courbe d'Edwards",
        equation: "x² + y² = 1 + d x² y²",
        description:
          "Permet des calculs plus efficaces et sécurisés, souvent utilisée pour les signatures numériques."
      };
    case "montgomery":
      return {
        name: "Courbe de Montgomery",
        equation: "By² = x³ + Ax² + x",
        description:
          "Optimisée pour l’algorithme d'échange de clé Diffie-Hellman, elle offre des calculs rapides."
      };
    default:
      return { name: "", equation: "", description: "" };
  }
});
</script>

<template>
  <div class="app-container">
    <aside class="sidebar">
      <h3>Sélection de la courbe</h3>
      <label>Type de courbe :</label>
      <select v-model="store.curveType">
        <option value="weierstrass">Weierstrass</option>
        <option value="edwards">Edwards</option>
        <option value="montgomery">Montgomery</option>
      </select>

      <!-- Cadre d'informations sur la courbe -->
      <div class="info-section">
        <h3>{{ curveInfo.name }}</h3>
        <p><strong>Équation :</strong> {{ curveInfo.equation }}</p>
        <p>{{ curveInfo.description }}</p>
      </div>
    </aside>
    <main class="main-content">
      <h1>Bienvenue sur mon application Vue !</h1>
      <div class="graphs-container">
        <div class="graph-container">
          <GraphDisplay />
        </div>
        <div class="graph-container">
          <GraphDisplay3D />
        </div>
      </div>
    </main>
  </div>
</template>

<style scoped>
.app-container {
  display: grid;
  grid-template-columns: 250px 1fr;
  height: 100vh;
  background: #f4f4f9;
}

.sidebar {
  background: #2c3e50;
  color: white;
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  box-shadow: 2px 0 5px rgba(0, 0, 0, 0.1);
  box-sizing: border-box; /* Ajouté */
}

/* Augmentation de la taille du texte pour le label */
.sidebar label {
  font-size: 1.3rem;
  font-weight: bold;
  margin-bottom: 10px;
}

.info-section {
  background: white;
  color: #333;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  margin-top: 20px;
  width: 100%;
  box-sizing: border-box; /* Ajouté */
}

.info-section h3 {
  font-size: 1.2rem;
  margin-bottom: 10px;
}

.info-section p {
  font-size: 0.9rem;
  margin-bottom: 5px;
}

.main-content {
  padding: 20px;
  overflow-y: auto;
}

.graphs-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
  margin-top: 20px;
}

.graph-container {
  border: 2px solid #ccc;
  border-radius: 8px;
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 400px;
}
</style>