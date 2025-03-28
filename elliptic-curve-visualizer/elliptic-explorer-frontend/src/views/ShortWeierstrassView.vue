<script setup>
import { ref } from "vue";
import GraphDisplay from "@/components/GraphDisplay.vue";
import { getShortWeierstrassCurve } from "@/services/api";

const selectedCurve = ref("ShortWeierstrass");
const curveParameters = ref({ a: 1, b: 2 });

const fetchCurve = async () => {
    try {
        await getShortWeierstrassCurve(curveParameters.value);
    } catch (error) {
        console.error("Erreur lors du calcul :", error);
    }
};
</script>

<template>
    <div>
        <h1>Courbe de Weierstrass (Forme Courte)</h1>
        <input type="number" v-model="curveParameters.a" placeholder="a">
        <input type="number" v-model="curveParameters.b" placeholder="b">
        <button @click="fetchCurve">Calculer</button>

        <GraphDisplay :selectedCurve="selectedCurve" :curveParameters="curveParameters" />
    </div>
</template>
