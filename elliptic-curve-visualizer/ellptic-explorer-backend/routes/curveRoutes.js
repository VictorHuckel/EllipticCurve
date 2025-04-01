const express = require("express");
const { calculateWeierstrass, calculateMontgomery, calculateEdwards, calculateTwistedEdwards } = require("../controllers/curveController");
const { body, validationResult } = require("express-validator");

const router = express.Router();

// 📌 Middleware de validation des entrées
const validateRequest = (validations) => {
    return async (req, res, next) => {
        await Promise.all(validations.map(validation => validation.run(req)));
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    };
};

// 📌 Route pour la courbe de Weierstrass
router.post(
    "/weierstrass",
    validateRequest([
        body("a").isNumeric().withMessage("Le coefficient 'a' doit être un nombre."),
        body("b").isNumeric().withMessage("Le coefficient 'b' doit être un nombre."),
        body("x").isNumeric().withMessage("La valeur 'x' doit être un nombre.")
    ]),
    (req, res) => {
        const { a, b } = req.body;
        if (4 * Math.pow(a, 3) + 27 * Math.pow(b, 2) === 0) {
            return res.status(400).json({ error: "La courbe est singulière (4a³ + 27b² ≠ 0)." });
        }
        calculateWeierstrass(req, res);
    }
);

router.post(
    "/montgomery",
    validateRequest([
        body("a").isNumeric().withMessage("Le coefficient 'a' doit être un nombre."),
        body("b").isNumeric().withMessage("Le coefficient 'b' doit être un nombre."),
        body("x").isNumeric().withMessage("La valeur 'x' doit être un nombre.")
    ]),
    (req, res) => calculateMontgomery(req, res) 
);

router.post(
    "/edwards",
    validateRequest([
        body("d")
            .isNumeric()
            .withMessage("Le coefficient 'd' doit être un nombre.")
            .custom(value => {
                if (parseFloat(value) === 1) {
                    throw new Error("Le coefficient 'd' ne peut pas être égal à 1.");
                }
                return true;
            }),
        body("x").isNumeric().withMessage("La valeur 'x' doit être un nombre.")
    ]),
    (req, res) => calculateEdwards(req, res)
);

router.post(
    "/twisted-edwards",
    validateRequest([
        body("a").isNumeric().withMessage("Le coefficient 'a' doit être un nombre."),
        body("d").isNumeric().withMessage("Le coefficient 'd' doit être un nombre."),
        body("x").isNumeric().withMessage("La valeur 'x' doit être un nombre.")
    ]),
    (req, res) => calculateTwistedEdwards(req, res) 
);

module.exports = router;
