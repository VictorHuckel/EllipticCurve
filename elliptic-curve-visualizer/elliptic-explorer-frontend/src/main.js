import { createApp } from "vue";
import App from "./App.vue";
import router from "./router/index.js"; // Assure-toi que l'extension .js est correcte
import { createPinia } from "pinia";

const pinia = createPinia();
const app = createApp(App);
app.use(router);
app.use(pinia);
app.mount("#app");
