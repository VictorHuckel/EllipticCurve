<script setup>
import { computed, ref } from "vue";
import { useCurveStore } from "@/stores/curveStore";
import Menu from "./components/Menu.vue";
import GraphDisplay from "./components/GraphDisplay.vue";
import GraphDisplayHomogeneous from "./components/GraphDisplayHomogeneous.vue";
import EllipticTorus from "./components/EllipticTorus.vue";
import EllipticSphere from "./components/EllipticSphere.vue";
import Loader from "./components/Loader.vue";

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
        equation: "x² + y² = 1 + d x²y²",
        description:
          "Permet des calculs plus efficaces et sécurisés, souvent utilisée pour les signatures numériques."
      };
    case "montgomery":
      return {
        name: "Courbe de Montgomery",
        equation: "y² = x³ + ax² + bx",
        description:
          "Optimisée pour l’algorithme d'échange de clé Diffie-Hellman, elle offre des calculs rapides."
      };
    default:
      return { name: "", equation: "", description: "" };
  }
});

const activeViews = ref(["2D", "Sphere"]);

// Nouvelle variable pour stocker le point sélectionné
const selectedPoint = ref({ x: null, y: null });

const onCurveChanged = (curveType) => {
  store.curveType = curveType;
};

const onViewsChanged = (views) => {
  activeViews.value = views;
};

const onPointSelected = (point) => {
  selectedPoint.value = point;
};
</script>

<template>
  <div class="app-container">
    <aside class="sidebar">
      <Menu @curveChanged="onCurveChanged" @viewsChanged="onViewsChanged" />
      <div class="info-section" v-if="curveInfo.name">
        <h3>{{ curveInfo.name }}</h3>
        <p><strong>Équation :</strong> {{ curveInfo.equation }}</p>
        <p>{{ curveInfo.description }}</p>
      </div>
    </aside>

    <main class="main-content">
      <h1>Visualiseur de courbes elliptiques</h1>
      <div class="graphs-container">
        <div class="desmos-column">
          <div class="graph-container graph-desmos" v-if="activeViews.includes('2D')">
            <GraphDisplay @pointSelected="onPointSelected" />
            <Loader :visible="store.loading" />
          </div>
          <div class="graph-container graph-desmos" v-if="activeViews.includes('2DHomogeneous')">
            <GraphDisplayHomogeneous />
            <Loader :visible="store.loading" />
          </div>
        </div>
        <div class="graph-container graph-sphere" v-if="activeViews.includes('Sphere')">
          <EllipticSphere :point="selectedPoint" />
          <Loader :visible="store.loading" />
        </div>
        <div class="graph-container graph-torus" v-if="activeViews.includes('Torus') && store.field === 'modulo'">
          <EllipticTorus />
          <Loader :visible="store.loading" />
        </div>
      </div>
    </main>
  </div>
</template>

<style scoped>
.app-container {
  display: flex;
  height: 100vh;
  overflow: hidden;
}

.sidebar {
  background: #2c3e50;
  color: white;
  padding: 20px;
  width: 260px;
  box-sizing: border-box;
  overflow-y: auto;
  flex-shrink: 0;
}

.info-section {
  background: white;
  color: #333;
  padding: 20px;
  border-radius: 8px;
  margin-top: 20px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.main-content {
  flex: 1;
  overflow: hidden;
  padding: 20px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  height: 100%;
}

.graphs-container {
  display: grid;
  gap: 20px;
  width: 100%;
  height: 100%;
  grid-template-columns: 1fr 1fr; /* Deux colonnes : une pour les graphes Desmos, une pour la sphère */
  grid-template-rows: 1fr; /* Une seule rangée */
}

.desmos-column {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.graph-container {
  position: relative;
  border: 2px solid #ccc;
  border-radius: 8px;
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
}

.graph-desmos {
  flex: 1; /* Les graphes Desmos partagent l'espace verticalement */
}

.graph-sphere {
  height: 100%; /* La sphère occupe toute la hauteur de sa colonne */
}
</style>
