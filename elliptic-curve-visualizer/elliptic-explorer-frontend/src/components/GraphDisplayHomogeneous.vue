<template>
  <div id="desmos-homogeneous-view" class="desmos-container"></div>
</template>

<script setup>
import { onMounted, watch } from "vue";
import { useCurveStore } from "@/stores/curveStore";
import Desmos from "desmos";

const store = useCurveStore();
let calculator = null;
let homogeneousCalculator = null;

onMounted(() => {
  const elt = document.getElementById("desmos-view");
  calculator = Desmos.GraphingCalculator(elt, {
    expressions: false,
    settingsMenu: false,
    zoomButtons: true,
    invertedColors: false,
    xAxisStep: 1,
    yAxisStep: 1,
    xAxisLabel: 'x',
    yAxisLabel: 'y',
    restrictedFunctions: false
  });
  renderCurve();
  
  const homogeneousElt = document.getElementById("desmos-homogeneous-view");
  homogeneousCalculator = Desmos.GraphingCalculator(homogeneousElt, {
    expressions: false,
    settingsMenu: false,
    zoomButtons: true,
    invertedColors: false,
    xAxisStep: 1,
    yAxisStep: 1,
    xAxisLabel: 'x',
    yAxisLabel: 'y',
    restrictedFunctions: false
  });
  renderHomogeneousCurve();
});

watch(
  () => [store.curveType, store.field, store.homogeneousGraph2D],
  () => {
    renderCurve();
    renderHomogeneousCurve();
  },
  { deep: true }
);

function renderCurve() {
  if (!calculator) return;
  calculator.setBlank();

  if (store.field === "real") {
    renderImplicitEquation();
  } else if (store.field === "modulo") {
    renderPointCloud();
  }
}

function renderImplicitEquation() {
  let latex = "";
  const a = store.a ?? 1;
  const b = store.b ?? 1;
  const d = store.d ?? 1;

  switch (store.curveType) {
    case "weierstrass":
      latex = `y^2 = x^3 + ${a}x + ${b}`;
      break;
    case "montgomery":
      latex = `y^2 = x^3 + ${a}x^2 + ${b}x`;
      break;
    case "edwards":
      latex = `x^2 + y^2 = 1 + ${d}x^2y^2`;
      break;
  }

  if (latex) {
    calculator.setExpression({
      id: "curve",
      latex,
      color: Desmos.Colors.BLUE,
      lineStyle: Desmos.Styles.SOLID
    });
  }
}

function renderPointCloud() {
  const data = store.homogeneousGraph2D;
  if (!data || data.length === 0) return;

  const exprs = data.map((pt, i) => ({
    id: `pt${i}`,
    latex: `(${pt.x}, ${pt.y})`,
    color: Desmos.Colors.RED,
    pointStyle: Desmos.Styles.POINT
  }));

  exprs.forEach(e => calculator.setExpression(e));
}

function renderHomogeneousCurve() {
  if (!homogeneousCalculator) return;
  homogeneousCalculator.setBlank();

  const a = store.a ?? 1;
  const b = store.b ?? 1;
  const d = store.d ?? 1;

  let latex = "";
  switch (store.curveType) {
    case "weierstrass":
      latex = `y = x^3 + ${a}xy^2 + ${b}y^3`;
      break;
    case "montgomery":
      latex = `y = x^3 + ${a}x^2y + ${b}xy^2`;
      break;
    case "edwards":
      latex = `x^2 + y^2 = y^2 + ${d}x^2y^2`;
      break;
  }

  if (latex) {
    homogeneousCalculator.setExpression({
      id: "homogeneous_curve",
      latex,
      color: Desmos.Colors.RED,
      lineStyle: Desmos.Styles.SOLID
    });
  }
}
</script>

<style scoped>
.desmos-container {
  width: 100%;
  height: 100%;
  border: 1px solid #ccc;
}
</style>
