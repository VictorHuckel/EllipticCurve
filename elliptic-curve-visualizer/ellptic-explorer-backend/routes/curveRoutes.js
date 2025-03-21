const express = require("express");
const { calculateWeierstrass, calculateMontgomery, calculateEdwards } = require("../controllers/curveController");
const { body, validationResult } = require("express-validator");

const router = express.Router();

// 📌 Route unique pour Weierstrass
router.post(
    "/weierstrass",
    [
        body("a").isNumeric().withMessage("Le coefficient 'a' doit être un nombre"),
        body("b").isNumeric().withMessage("Le coefficient 'b' doit être un nombre"),
        body("x").isNumeric().withMessage("La valeur 'x' doit être un nombre")
    ],
    (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { a, b } = req.body;
        if (4 * Math.pow(a, 3) + 27 * Math.pow(b, 2) === 0) {
            return res.status(400).json({ error: "La courbe est singulière (4a³ + 27b² ≠ 0)." });
        }

        calculateWeierstrass(req, res);
    }
);


module.exports = router;
