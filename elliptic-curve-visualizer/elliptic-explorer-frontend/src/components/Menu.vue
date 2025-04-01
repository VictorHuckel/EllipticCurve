<template>
  <div class="menu-container">
    <label for="curve-select">Choisir une courbe :</label>
    <select id="curve-select" v-model="selectedCurve" @change="updateCurve">
      <option value="weierstrass">Weierstrass</option>
      <option value="montgomery">Montgomery</option>
      <option value="edwards">Edwards</option>
      <option value="twisted-edwards">Twisted Edwards</option>
    </select>
  </div>
</template>

<script setup>
import { ref, defineEmits } from "vue";

const selectedCurve = ref("weierstrass");
const emit = defineEmits(["curveChanged"]);

const updateCurve = () => {
  emit("curveChanged", selectedCurve.value);
};
</script>

<style scoped>
.menu-container {
  margin-bottom: 1rem;
}
select {
  padding: 0.5rem;
  font-size: 1rem;
}
</style>
