<template>
  <div id="menu" class="menu">
    <h2>Visualisation des courbes</h2>

    <!-- Section pour sélectionner le type de courbe -->
    <div class="curve-selection">
      <h3>Types de courbes</h3>
      <ul>
        <li
          v-for="curve in curves"
          :key="curve.name"
          @click="selectCurve(curve.name)"
          :class="{ active: selectedCurve === curve.name }"
        >
          {{ curve.label }}
        </li>
      </ul>
    </div>

    <!-- Section pour configurer les paramètres de la courbe -->
    <div v-if="selectedCurve" class="parameters">
      <h3>Paramètres pour {{ selectedCurve }}</h3>
      <div v-for="(param, key) in curves[selectedCurve].parameters" :key="key">
        <label :for="key">{{ param.label }} :</label>
        <input
          :id="key"
          type="number"
          v-model="curveParameters[key]"
          :placeholder="param.placeholder"
        />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Menu",
  props: {
    selectedCurve: {
      type: Object,
      required: true,
    },
    curveParameters: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      curves: {
        "Short Weierstrass": {
          label: "Short Weierstrass",
          parameters: {
            a: { label: "a", placeholder: "Coefficient a" },
            b: { label: "b", placeholder: "Coefficient b" },
          },
        },
        Weierstrass: {
          label: "Weierstrass",
          parameters: {
            a1: { label: "a1", placeholder: "Coefficient a1" },
            a2: { label: "a2", placeholder: "Coefficient a2" },
            a3: { label: "a3", placeholder: "Coefficient a3" },
            a4: { label: "a4", placeholder: "Coefficient a4" },
            a6: { label: "a6", placeholder: "Coefficient a6" },
          },
        },
        Montgomery: {
          label: "Montgomery",
          parameters: {
            A: { label: "A", placeholder: "Coefficient A" },
            B: { label: "B", placeholder: "Coefficient B" },
          },
        },
        Edwards: {
          label: "Edwards",
          parameters: {
            c: { label: "c", placeholder: "Coefficient c" },
            d: { label: "d", placeholder: "Coefficient d" },
          },
        },
      },
    };
  },
  methods: {
    selectCurve(curveName) {
      this.$emit("update:selectedCurve", curveName);
      this.$emit("update:curveParameters", {});
    },
  },
};
</script>

<style scoped>
.menu {
  padding: 20px;
}

h2 {
  text-align: center;
  color: #333;
}

.curve-selection ul {
  list-style: none;
  padding: 0;
}

.curve-selection li {
  padding: 10px;
  cursor: pointer;
  border: 1px solid #ddd;
  margin-bottom: 5px;
  border-radius: 4px;
  text-align: center;
  background-color: #fff;
  transition: background-color 0.3s;
}

.curve-selection li:hover {
  background-color: #f0f0f0;
}

.curve-selection li.active {
  background-color: #42b883;
  color: white;
  font-weight: bold;
}

.parameters {
  margin-top: 20px;
}

.parameters label {
  display: block;
  margin-bottom: 5px;
}

.parameters input {
  margin-bottom: 10px;
  padding: 5px;
  width: 100%;
}
</style>