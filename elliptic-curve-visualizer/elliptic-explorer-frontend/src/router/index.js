import { createRouter, createWebHistory } from "vue-router";
import WeierstrassView from "@/views/WeierstrassView.vue";

const routes = [
    { path: "/", component: WeierstrassView },
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;
