<script setup>
import GraphDisplay from "./components/GraphDisplay.vue";
import GraphDisplay3D from "./components/GraphDisplay3D.vue";
</script>

<template>
    <div>
     <h1>Bienvenue sur mon application Vue !</h1>
     <GraphDisplay />
     <div class="graph-container">
       <GraphDisplay3D />
     </div>
    </div>
</template>

<style scoped>
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
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}
.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
</style>
