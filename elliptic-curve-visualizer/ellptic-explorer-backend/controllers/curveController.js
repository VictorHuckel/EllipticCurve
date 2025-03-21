
const NodeCache = require("node-cache");
const { Weierstrass, Montgomery, Edwards } = require("../models/Curve");


const cache = new NodeCache({ stdTTL: 60 });

// Contrôleur pour le calcul de la courbe de Weierstrass
exports.calculateWeierstrass = (req, res) => {
    // Extraction des paramètres a, b et x depuis le corps de la requête
    const { a, b, x } = req.body;
    
    const cacheKey = `weierstrass_${a}_${b}_${x}`;

    if (cache.has(cacheKey)) {

        return res.json({ result: cache.get(cacheKey), cached: true });
    }

    try {
        // Vérifie que la courbe de Weierstrass n'est pas singulière
        if (4 * Math.pow(a, 3) + 27 * Math.pow(b, 2) === 0) {
            throw new Error("La courbe de Weierstrass est singulière.");
        }


        const curve = new Weierstrass(a, b);
        // Calcul de la valeur de la courbe pour la valeur x donnée
        const result = curve.evaluate(x);


        cache.set(cacheKey, result);

        res.json({ result, cached: false });
    } catch (error) {

        console.error("Erreur dans calculateWeierstrass:", error.message);
        res.status(400).json({ error: error.message });
    }
};
