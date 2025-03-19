const express = require("express");
const { calculateWeierstrass, calculateMontgomery, calculateEdwards } = require("../controllers/curveController");
const { body, validationResult } = require("express-validator");

const router = express.Router();

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
        calculateWeierstrass(req, res);
    }
);

router.post(
    "/montgomery",
    [
        body("A").isNumeric().withMessage("Le coefficient 'A' doit être un nombre"),
        body("B").isNumeric().withMessage("Le coefficient 'B' doit être un nombre"),
        body("x").isNumeric().withMessage("La valeur 'x' doit être un nombre")
    ],
    (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        calculateMontgomery(req, res);
    }
);

router.post(
    "/edwards",
    [
        body("c").isNumeric().withMessage("Le coefficient 'c' doit être un nombre"),
        body("d").isNumeric().withMessage("Le coefficient 'd' doit être un nombre"),
        body("x").isNumeric().withMessage("La valeur 'x' doit être un nombre"),
        body("y").isNumeric().withMessage("La valeur 'y' doit être un nombre")
    ],
    (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        calculateEdwards(req, res);
    }
);

module.exports = router;
