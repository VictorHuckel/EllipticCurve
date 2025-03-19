const express = require("express");
const { calculateWeierstrass, calculateMontgomery, calculateEdwards } = require("../controllers/curveController");

const router = express.Router();

router.post("/weierstrass", calculateWeierstrass);
router.post("/montgomery", calculateMontgomery);
router.post("/edwards", calculateEdwards);

module.exports = router;
