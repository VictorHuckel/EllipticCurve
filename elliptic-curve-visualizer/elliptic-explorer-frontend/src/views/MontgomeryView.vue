<script setup>
import { ref } from "vue";
import GraphDisplay from "@/components/GraphDisplay.vue";
import { getMontgomeryCurve } from "@/services/api";

const selectedCurve = ref("Montgomery");
const curveParameters = ref({ a: 1, b: 1 });

const fetchCurve = async () => {
    try {
        await getMontgomeryCurve(curveParameters.value);
    } catch (error) {
        console.error("Erreur lors du calcul :", error);
    }
};
</script>

<template>
    <div>
        <h1>Courbe de Montgomery</h1>
        <input type="number" v-model="curveParameters.a" placeholder="a">
        <input type="number" v-model="curveParameters.b" placeholder="b">
        <button @click="fetchCurve">Calculer</button>

        <GraphDisplay :selectedCurve="selectedCurve" :curveParameters="curveParameters" />
    </div>
</template>
