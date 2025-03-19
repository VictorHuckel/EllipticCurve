const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const rateLimit = require("express-rate-limit");
const curveRoutes = require("./routes/curveRoutes");

const app = express();
app.use(bodyParser.json());
app.use(cors());

// Ajout d'un limiteur de requêtes
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // 100 requêtes max par IP
    message: "Trop de requêtes, veuillez réessayer plus tard."
});

app.use(limiter);

app.use("/api/curves", curveRoutes);

// Lancement du serveur
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
