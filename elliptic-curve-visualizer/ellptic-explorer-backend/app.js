// Importation des modules nécessaires
const express = require("express"); // Framework pour créer le serveur HTTP
const bodyParser = require("body-parser"); // Middleware pour parser le corps des requêtes
const cors = require("cors"); // Middleware pour autoriser les requêtes cross-origin
const rateLimit = require("express-rate-limit"); // Middleware pour limiter le nombre de requêtes
const curveRoutes = require("./routes/curveRoutes"); // Importation des routes de courbes

// Création de l'application Express
const app = express();

// Utilisation du middleware bodyParser pour traiter les requêtes JSON
app.use(bodyParser.json());

// Activation de CORS pour permettre les requêtes depuis d'autres domaines
app.use(cors());

// Mise en place d'un limiteur de requêtes pour prévenir les abus (DoS, brute force, etc.)
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // Fenêtre de 15 minutes
    max: 100, // Maximum de 100 requêtes par IP pendant cette fenêtre
    message: "Trop de requêtes, veuillez réessayer plus tard." // Message renvoyé en cas de dépassement
});

// Application du limiteur à toutes les requêtes entrantes
app.use(limiter);

// Montage des routes pour les courbes sous le chemin /api/curves
app.use("/api/curves", curveRoutes);

// Lancement du serveur sur le port défini (5000 par défaut ou défini via la variable d'environnement PORT)
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
