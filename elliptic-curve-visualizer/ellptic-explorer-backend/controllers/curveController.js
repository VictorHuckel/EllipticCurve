/**
 * Contrôleur de calcul des points de courbes elliptiques.
 * Extrait les paramètres de la requête, appelle le moteur de calcul,
 * et renvoie les points calculés (2D, homogène, sphère, tore).
 */

const { generateCurvePoints } = require("../services/curveEngine");

function computeCurve(req, res) {
  try {
    // Extraction et parsing des paramètres
    const {
      type,
      field,
      a,
      b,
      d,
      p,
      xMin,
      xMax,
      resolution
    } = req.body;

    // Appel du moteur de calcul
    const result = generateCurvePoints({
      type,
      field,
      a: parseFloat(a),
      b: parseFloat(b),
      d: parseFloat(d),
      p: parseInt(p),
      xMin: parseFloat(xMin),
      xMax: parseFloat(xMax),
      resolution: parseInt(resolution)
    });

    // Envoi du résultat JSON
    res.json(result);

  } catch (err) {
    console.error("[computeCurve] Erreur de calcul :", err);
    res.status(500).json({ error: err.message });
  }
}

module.exports = {
  computeCurve
};
