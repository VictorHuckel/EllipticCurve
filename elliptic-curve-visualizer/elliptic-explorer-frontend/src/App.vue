<script setup>
import GraphDisplay from "./components/GraphDisplay.vue";
import Menu from "./components/Menu.vue";
import { ref } from "vue";

// Stocke le type de courbe sélectionné et ses paramètres
const selectedCurve = ref(null);
const curveParameters = ref({});
</script>

<template>
  <div class="app-container">
    <!-- Menu sur le côté gauche -->
    <Menu
      class="menu"
      :selectedCurve="selectedCurve"
      :curveParameters="curveParameters"
      @update:selectedCurve="selectedCurve = $event"
      @update:curveParameters="curveParameters = $event"
    />

    <!-- Affichage du graphique sur le côté droit -->
    <div class="graph-container">
      <GraphDisplay
        :selectedCurve="selectedCurve"
        :curveParameters="curveParameters"
      />
    </div>
  </div>
</template>

<style scoped>
.app-container {
  display: flex;
  height: 100vh;
}

.menu {
  width: 300px;
  background-color: #f9f9f9;
  border-right: 1px solid #ddd;
  overflow-y: auto;
}

.graph-container {
  flex: 1;
  padding: 20px;
  background-color: #fff;
}
</style>
