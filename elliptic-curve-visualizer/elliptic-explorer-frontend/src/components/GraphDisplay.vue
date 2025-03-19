<script setup>
import { onMounted, ref } from "vue";

const calculator = ref(null);
const graphRef = ref(null);

const loadDesmos = () => {
    return new Promise((resolve, reject) => {
        if (window.Desmos) {
            resolve(window.Desmos);
        } else {
            const script = document.createElement("script");
            <script src="https://www.desmos.com/jspre/calculator.js"></script>
            script.onload = () => resolve(window.Desmos);
            script.onerror = () => reject("Erreur lors du chargement de Desmos !");
            document.head.appendChild(script);
        }
    });
};

onMounted(async () => {
    try {
        const Desmos = await loadDesmos();
        console.log("Desmos chargé :", Desmos);
        calculator.value = Desmos.GraphingCalculator(graphRef.value);
        calculator.value.setExpressions([{ id: "test", latex: "y = x^2" }]);
    } catch (error) {
        console.error(error);
    }
});
</script>

<template>
    <div ref="graphRef" style="width: 600px; height: 400px;"></div>
</template>
