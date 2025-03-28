<script setup>
import { ref } from "vue";
import GraphDisplay from "@/components/GraphDisplay.vue";
import { getWeierstrassCurve } from "@/services/api";

const selectedCurve = ref("Weierstrass");
const curveParameters = ref({ a: 1, b: 2, x: 3 });

const fetchCurve = async () => {
    try {
        await getWeierstrassCurve(curveParameters.value);
    } catch (error) {
        console.error("Erreur lors du calcul :", error);
    }
};
</script>

<template>
    <div>
        <h1>Courbe de Weierstrass</h1>
        <input type="number" v-model="curveParameters.a" placeholder="a">
        <input type="number" v-model="curveParameters.b" placeholder="b">
        <input type="number" v-model="curveParameters.x" placeholder="x">
        <button @click="fetchCurve">Calculer</button>
        
        <!-- Correction ici : envoi de `selectedCurve` et `curveParameters` -->
        <GraphDisplay :selectedCurve="selectedCurve" :curveParameters="curveParameters" />
    </div>
</template>
