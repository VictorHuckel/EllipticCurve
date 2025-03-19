const { Weierstrass, Montgomery, Edwards } = require("../models/Curve");

exports.calculateWeierstrass = (req, res) => {
    const { a, b, x } = req.body;
    try {
        const curve = new Weierstrass(a, b);
        const result = curve.evaluate(x);
        res.json({ result });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.calculateMontgomery = (req, res) => {
    const { A, B, x } = req.body;
    try {
        const curve = new Montgomery(A, B);
        const result = curve.evaluate(x);
        res.json({ result });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.calculateEdwards = (req, res) => {
    const { c, d, x, y } = req.body;
    try {
        const curve = new Edwards(c, d);
        const result = curve.evaluate(x, y);
        res.json({ result });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};
