<script setup>
import { computed, ref } from "vue";
import { useCurveStore } from "@/stores/curveStore";
import Menu from "./components/Menu.vue";
import GraphDisplay from "./components/GraphDisplay.vue";
import GraphDisplay3D from "./components/GraphDisplay3D.vue";
import EllipticTorus from "./components/EllipticTorus.vue";
import EllipticSphere from "./components/EllipticSphere.vue";

const store = useCurveStore();

const show3DView = ref(false);

const curveInfo = computed(() => {
  switch (store.curveType) {
    case "weierstrass":
      return {
        name: "Courbe de Weierstrass",
        equation: "y² = x³ + ax + b",
        description: "Utilisée en cryptographie, cette forme générale décrit la majorité des courbes elliptiques."
      };
    case "edwards":
      return {
        name: "Courbe d'Edwards",
        equation: "x² + y² = 1 + d x² y²",
        description: "Permet des calculs plus efficaces et sécurisés, souvent utilisée pour les signatures numériques."
      };
    case "montgomery":
      return {
        name: "Courbe de Montgomery",
        equation: "By² = x³ + Ax² + x",
        description: "Optimisée pour l’algorithme d'échange de clé Diffie-Hellman, elle offre des calculs rapides."
      };
    default:
      return { name: "", equation: "", description: "" };
  }
});

const onCurveChanged = (curveType) => {
  store.curveType = curveType;
};

const toggle3D = () => {
  show3DView.value = true;
};

const toggle2D = () => {
  show3DView.value = false;
};
</script>

<template>
  <div class="app-container">
    <aside class="sidebar">
      <Menu @curveChanged="onCurveChanged" />
      <div class="info-section" v-if="curveInfo.name">
        <h3>{{ curveInfo.name }}</h3>
        <p><strong>Équation :</strong> {{ curveInfo.equation }}</p>
        <p>{{ curveInfo.description }}</p>
      </div>
    </aside>

    <main class="main-content">
      <h1>Visualiseur de courbes elliptiques</h1>
      <!-- Bouton pour activer l'affichage 3D ou revenir à l'affichage 2D -->
      <button @click="toggle3D" v-if="!show3DView">
        3D Visualisation
      </button>
      <button @click="toggle2D" v-if="show3DView">
        2D Visualisation
      </button>
      <div class="graphs-container">
        <!-- Affichage par défaut -->
        <div class="graph-container" v-if="!show3DView">
          <GraphDisplay />
        </div>
        <div class="graph-container" v-if="!show3DView">
          <GraphDisplay3D />
        </div>

        <!-- Affichage 3D alternatif -->
        <div class="graph-container" v-if="show3DView">
          <EllipticTorus />
        </div>
        <div class="graph-container" v-if="show3DView">
          <EllipticSphere />
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
}

.info-section {
  background: white;
  color: #333;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  margin-top: 20px;
  width: 100%;
}

.main-content {
  padding: 20px;
  overflow-y: auto;
}

button {
  margin-bottom: 20px;
  padding: 10px 20px;
  background-color: #2c3e50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
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
