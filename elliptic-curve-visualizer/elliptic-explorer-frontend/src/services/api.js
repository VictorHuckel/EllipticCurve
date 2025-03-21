import axios from "axios";

const API_URL = "http://localhost:5000/api/curves";

export const getWeierstrassCurve = async (params) => {
    try {
        const response = await axios.post(`${API_URL}/weierstrass`, params);
        return response.data;
    } catch (error) {
        console.error("Erreur API:", error);
        throw error;
    }
};

export const getEdwardsCurve = async (params) => {
    console.log("Envoi de la requête :", params);
    return fetch("http://localhost:5000/api/curves/edwards", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(params),
    }).then(async (res) => {
        const data = await res.json();
        console.log("Réponse reçue :", data);
        return data;
    });
};