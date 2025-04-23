/**
 * This file defines the API routes for handling elliptic curve computations.
 * It includes validation middleware and routes for computing curve points.
 */

const express = require("express");
const { computeCurve } = require("../controllers/curveController");
const { body, validationResult } = require("express-validator");

const router = express.Router();

// Middleware for validating incoming requests
const validateRequest = (validations) => {
  return async (req, res, next) => {
    await Promise.all(validations.map(v => v.run(req)));
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
    next();
  };
};

// Route for computing elliptic curve points
router.post(
  "/compute",
  validateRequest([
    body("type").isString().withMessage("Type is required"),
    body("field").isString().withMessage("Field is required (real or modulo)"),
    body("a").optional().isNumeric(),
    body("b").optional().isNumeric(),
    body("d").optional().isNumeric(),
    body("p").optional().isInt({ min: 2 }),
    body("xMin").isNumeric(),
    body("xMax").isNumeric(),
    body("resolution").isInt({ min: 10 }),
    body("zDepth").isNumeric(),
    body("zSteps").isInt({ min: 1 })
  ]),
  computeCurve
);

module.exports = router;