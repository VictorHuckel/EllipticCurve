import { createApp } from "vue";
import App from "./App.vue";
import router from "./router/index.js"; // Assure-toi que l'extension .js est correcte

const app = createApp(App);
app.use(router);
app.mount("#app");
