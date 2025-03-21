const NodeCache = require("node-cache");
const { Weierstrass, Montgomery, Edwards } = require("../models/Curve");

const cache = new NodeCache({ stdTTL: 60 }); // Stockage en cache pendant 60 secondes

exports.calculateWeierstrass = (req, res) => {
    const { a, b, x } = req.body;
    const cacheKey = `weierstrass_${a}_${b}_${x}`;

    if (cache.has(cacheKey)) {
        return res.json({ result: cache.get(cacheKey), cached: true });
    }

    try {
        if (4 * Math.pow(a, 3) + 27 * Math.pow(b, 2) === 0) {
            throw new Error("La courbe de Weierstrass est singulière.");
        }

        const curve = new Weierstrass(a, b);
        const result = curve.evaluate(x);
        cache.set(cacheKey, result);
        res.json({ result, cached: false });
    } catch (error) {
        console.error("Erreur dans calculateWeierstrass:", error.message);
        res.status(400).json({ error: error.message });
    }
};
