
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


exports.calculateEdwards = (req, res) => {
    const { d, x } = req.body;

    if (typeof d !== "number" || typeof x !== "number") {
        return res.status(400).json({ error: "Les valeurs de 'd' et 'x' doivent être numériques." });
    }

    if (d === 1) {
        return res.status(400).json({ error: "Le coefficient 'd' ne peut pas être égal à 1." });
    }

    // Calcul du discriminant
    const discriminant = 1 - x ** 2 + d * x ** 2;
    if (discriminant < 0) {
        return res.status(400).json({ error: "Aucune solution réelle pour ce x donné." });
    }

    // Calcul des deux valeurs possibles de y
    const y_positive = Math.sqrt(discriminant);
    const y_negative = -y_positive;

    // Expressions Desmos
    const edwards_positive = `sqrt(1 - x^2 + ${d} * x^2 * y^2)`;
    const edwards_negative = `-sqrt(1 - x^2 + ${d} * x^2 * y^2)`;

    res.json({
        equation: `x^2 + y^2 = 1 + ${d} * x^2 * y^2`,
        edwards_positive,
        edwards_negative,
        y_positive,
        y_negative
    });
};

exports.calculateTwistedEdwards = (req, res) => {
    const { a, d, x } = req.body;
    const cacheKey = `twistededwards_${a}_${d}_${x}`;

    if (cache.has(cacheKey)) {
        return res.json({ result: cache.get(cacheKey), cached: true });
    }

    try {
        const curve = new TwistedEdwards(a, d);
        const result = curve.evaluate(x);
        cache.set(cacheKey, result);
        res.json({ result, cached: false });
    } catch (error) {
        console.error("Erreur dans calculateTwistedEdwards:", error.message);
        res.status(400).json({ error: error.message });
    }
};

exports.calculateMontgomery = (req, res) => {
    const { a, b, x } = req.body;
    const cacheKey = `montgomery_${a}_${b}_${x}`;

    if (cache.has(cacheKey)) {
        return res.json({ result: cache.get(cacheKey), cached: true });
    }

    try {
        const curve = new Montgomery(a, b);
        const result = curve.evaluate(x);
        cache.set(cacheKey, result);
        res.json({ result, cached: false });
    } catch (error) {
        console.error("Erreur dans calculateMontgomery:", error.message);
        res.status(400).json({ error: error.message });
    }
};
