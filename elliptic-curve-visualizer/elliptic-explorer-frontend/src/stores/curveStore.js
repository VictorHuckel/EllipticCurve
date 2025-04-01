import { defineStore } from "pinia";
import { ref, computed } from "vue";

export const useCurveStore = defineStore("curve", () => {
  const curveType = ref("weierstrass");
  const a = ref("");
  const b = ref("");
  const d = ref("");
  const x = ref("");
  const y = ref("");
  const errorMessage = ref("");
  const result = ref(null);

  const curveFields = computed(() => {
    switch (curveType.value) {
      case "weierstrass":
        return ["a", "b", "x"];
      case "edwards":
        return ["d", "x"];
      case "montgomery":
        return ["a", "b", "x"];
      default:
        return [];
    }
  });

  return {
    curveType,
    a,
    b,
    d,
    x,
    y,
    errorMessage,
    result,
    curveFields,
  };
});
