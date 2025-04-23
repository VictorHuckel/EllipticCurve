import { createRouter, createWebHistory } from "vue-router";
import App from "@/App.vue";

const routes = [
  { path: "/", component: App }, // on rend directement le composant principal
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
