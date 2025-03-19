const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const curveRoutes = require("./routes/curveRoutes");

const app = express();
app.use(bodyParser.json());
app.use(cors()); // Permet au front-end Vue.js de communiquer avec l'API

// Définition des routes
app.use("/api/curves", curveRoutes);

// Lancement du serveur
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
