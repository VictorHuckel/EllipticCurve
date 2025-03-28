<script setup>
import { ref, defineEmits } from "vue";

const selectedCurve = ref("Weierstrass");
const emit = defineEmits(["curveSelected"]);

const updateCurve = () => {
    emit("curveSelected", selectedCurve.value);
};
</script>

<template>
    <div>
        <select v-model="selectedCurve" @change="updateCurve" class="dropdown">
            <option value="Weierstrass">Weierstrass</option>
            <option value="ShortWeierstrass">Weierstrass (Forme Courte)</option>
            <option value="Edwards">Edwards</option>
            <option value="Montgomery">Montgomery</option>
        </select>
    </div>
</template>

<style scoped>
/* Style du menu déroulant */
.dropdown {
    width: 100%;
    padding: 8px;
    font-size: 16px;
    border: none;
    border-radius: 5px;
    background: white;
    color: #333;
    margin-top: 15px;
}
</style>
