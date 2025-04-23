/**
 * This file defines the controller logic for handling requests related to elliptic curve computations.
 * It processes incoming requests, validates the data, and invokes the core computation logic.
 */

const { generateCurvePoints } = require("../services/curveEngine");

/**
 * Handles the computation of elliptic curve points based on the request parameters.
 * It extracts the parameters from the request body, invokes the `generateCurvePoints` function,
 * and returns the computed points as a JSON response.
 *
 * @param {Object} req - The HTTP request object containing curve parameters in the body.
 * @param {Object} res - The HTTP response object used to send back the result or errors.
 */
function computeCurve(req, res) {
  try {
    const {
      type,
      field,
      a,
      b,
      d,
      p,
      xMin,
      xMax,
      resolution,
      zDepth,
      zSteps
    } = req.body;

    // Parse and validate input parameters
    const result = generateCurvePoints({
      type,
      field,
      a: parseFloat(a),
      b: parseFloat(b),
      d: parseFloat(d),
      p: parseInt(p),
      xMin: parseFloat(xMin),
      xMax: parseFloat(xMax),
      resolution: parseInt(resolution),
      zDepth: parseFloat(zDepth),
      zSteps: parseInt(zSteps)
    });

    // Send the computed result as a JSON response
    res.json(result);
  } catch (err) {
    console.error("[computeCurve] Error:", err);
    res.status(500).json({ error: err.message });
  }
}

module.exports = {
  computeCurve
};
