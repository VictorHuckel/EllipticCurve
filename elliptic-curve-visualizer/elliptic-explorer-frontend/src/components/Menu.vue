<template>
  <div id="menu" class="menu">
    <h2>Visualisation des courbes</h2>

    <!-- Section pour sélectionner le type de courbe -->
    <div class="curve-selection">
      <h3>Types de courbes</h3>
      <ul>
        <li
          v-for="curve in Object.keys(curves)"
          :key="curve"
          @click="selectCurve(curve)"
          :class="{ active: selectedCurve === curve }"
        >
          {{ curves[curve].label }}
        </li>
      </ul>
    </div>

    <!-- Section pour afficher la formule et configurer les paramètres de la courbe -->
    <div v-if="selectedCurve" class="parameters">
      <h3>Formule pour {{ selectedCurve }}</h3>
      <p class="formula">{{ curves[selectedCurve].formula }}</p>

      <h3>Paramètres</h3>
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
      type: String,
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
          formula: "y² = x³ + ax + b",
          parameters: {
            a: { label: "a", placeholder: "Coefficient a" },
            b: { label: "b", placeholder: "Coefficient b" },
          },
        },
        Weierstrass: {
          label: "Weierstrass",
          formula: "y² + a₁xy + a₃y = x³ + a₂x² + a₄x + a₆",
          parameters: {
            a1: { label: "a₁", placeholder: "Coefficient a₁" },
            a2: { label: "a₂", placeholder: "Coefficient a₂" },
            a3: { label: "a₃", placeholder: "Coefficient a₃" },
            a4: { label: "a₄", placeholder: "Coefficient a₄" },
            a6: { label: "a₆", placeholder: "Coefficient a₆" },
          },
        },
        Montgomery: {
          label: "Montgomery",
          formula: "By² = x³ + Ax² + x",
          parameters: {
            A: { label: "A", placeholder: "Coefficient A" },
            B: { label: "B", placeholder: "Coefficient B" },
          },
        },
        Edwards: {
          label: "Edwards",
          formula: "c x² + y² = 1 + d x² y²",
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
      this.$emit("update:curveParameters", {}); // Réinitialise les paramètres
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

.formula {
  font-style: italic;
  color: #555;
  margin-bottom: 15px;
}
</style>