<script setup>
import { ref } from "vue";
import GraphDisplay from "@/components/GraphDisplay.vue";
import { getEdwardsCurve } from "@/services/api";

const a = ref(1);
const d = ref(2);
const x = ref(3);
const equation = ref("");

const fetchCurve = async () => {
    try {
        const response = await getEdwardsCurve({ a: a.value, d: d.value, x: x.value });
        equation.value = `x² + y² = 1 + ${d.value}x²y²`;
    } catch (error) {
        console.error("Erreur lors du calcul :", error);
    }
};
</script>

<template>
    <div>
        <h1>Courbe d'Edwards</h1>
        <input type="number" v-model="a" placeholder="a">
        <input type="number" v-model="d" placeholder="d">
        <input type="number" v-model="x" placeholder="x">
        <button @click="fetchCurve">Calculer</button>
        <GraphDisplay v-if="equation" :equation="equation" />
    </div>
</template>
