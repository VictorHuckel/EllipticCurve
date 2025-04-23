// src/services/api.js
import axios from "axios";

const API_URL = "http://localhost:5000/api/curves";

export async function computeCurve(params) {
  try {
    const response = await axios.post(`${API_URL}/compute`, params);
    return response.data;
  } catch (error) {
    console.error("Erreur API:", error);
    throw error;
  }
}
