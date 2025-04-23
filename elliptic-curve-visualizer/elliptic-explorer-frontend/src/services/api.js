// Service API centralisé pour les calculs de courbes
import axios from "axios";

// URL de base de l'API backend
const API_URL = "http://localhost:5000/api/curves";

/**
 * Appelle le backend pour calculer les points d'une courbe elliptique.
 * @param {Object} params - Paramètres à envoyer au backend (type, field, a, b, d, p, xMin, xMax, resolution)
 * @returns {Object} - Données de courbe (points2D, homogeneousPoints2D, torus, sphere)
 */
export async function computeCurve(params) {
  try {
    const response = await axios.post(`${API_URL}/compute`, params);
    return response.data;
  } catch (error) {
    console.error("Erreur lors du calcul de la courbe :", error);
    throw error;
  }
}
