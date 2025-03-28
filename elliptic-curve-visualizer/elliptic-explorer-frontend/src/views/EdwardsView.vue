<script setup>
import { ref } from "vue";
import GraphDisplay from "@/components/GraphDisplay.vue";
import { getEdwardsCurve } from "@/services/api";

const selectedCurve = ref("Edwards");
const curveParameters = ref({ a: 1, d: 2 });

const fetchCurve = async () => {
    try {
        await getEdwardsCurve(curveParameters.value);
    } catch (error) {
        console.error("Erreur lors du calcul :", error);
    }
};
</script>

<template>
    <div>
        <h1>Courbe de Edwards</h1>
        <input type="number" v-model="curveParameters.a" placeholder="a">
        <input type="number" v-model="curveParameters.d" placeholder="d">
        <button @click="fetchCurve">Calculer</button>

        <GraphDisplay :selectedCurve="selectedCurve" :curveParameters="curveParameters" />
    </div>
</template>
