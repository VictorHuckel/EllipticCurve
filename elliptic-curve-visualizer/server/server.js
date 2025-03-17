const express = require('express');
const app = express();
const port = 3000;

// Middleware pour gérer les requêtes JSON
app.use(express.json());

// Route de test
app.get('/', (req, res) => {
    res.send('Serveur Node.js avec Express est en marche 🚀');
});

// Démarrage du serveur
app.listen(port, () => {
    console.log(`Serveur démarré sur http://localhost:${port}`);
});
