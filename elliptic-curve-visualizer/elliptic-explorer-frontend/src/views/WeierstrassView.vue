<script setup>
import { ref } from "vue";
import GraphDisplay from "@/components/GraphDisplay.vue";
import { getWeierstrassCurve } from "@/services/api";

const a = ref(1);
const b = ref(2);
const x = ref(3);
const equation = ref("");

const fetchCurve = async () => {
    try {
        const response = await getWeierstrassCurve({ a: a.value, b: b.value, x: x.value });
        equation.value = `y^2 = x^3 + ${a.value}x + ${b.value}`;
    } catch (error) {
        console.error("Erreur lors du calcul :", error);
    }
};
</script>

<template>
    <div>
        <h1>Courbe de Weierstrass</h1>
        <input type="number" v-model="a" placeholder="a">
        <input type="number" v-model="b" placeholder="b">
        <input type="number" v-model="x" placeholder="x">
        <button @click="fetchCurve">Calculer</button>
        <GraphDisplay v-if="equation" :equation="equation" />
    </div>
</template>
