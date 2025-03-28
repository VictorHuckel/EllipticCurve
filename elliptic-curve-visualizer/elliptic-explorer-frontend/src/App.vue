<script setup>
import { useCurveStore } from "@/stores/curveStore";
import GraphDisplay from "./components/GraphDisplay.vue";
import GraphDisplay3D from "./components/GraphDisplay3D.vue";

const store = useCurveStore();
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
    </aside>
    <main class="main-content">
      <h1>Bienvenue sur mon application Vue !</h1>
      <GraphDisplay />
      <div class="graph-container">
        <GraphDisplay3D />
      </div>
    </main>
  </div>
</template>

<style scoped>
.app-container {
  display: flex;
  min-height: 100vh;
}

.sidebar {
  width: 250px;
  padding: 1rem;
  border-right: 2px solid #ccc;
  background-color: #f9f9f9;
}

.main-content {
  flex: 1;
  padding: 1rem;
}

.graph-container {
  width: 600px;
  height: 600px;
  display: flex;
  justify-content: center;
  align-items: center;
  border: 2px solid #ccc;
  border-radius: 8px;
  overflow: hidden;
}
</style>