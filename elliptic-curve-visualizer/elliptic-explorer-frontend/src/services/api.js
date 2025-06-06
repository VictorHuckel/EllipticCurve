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

export const montgomery = async (params) => {
    try {
        const response = await axios.post(`${API_URL}/montgomery`, params);
        return response.data;
    } catch (error) {
        console.error("Erreur API:", error);
        throw error;
    }
};

export const getEdwardsCurve = async (params) => {
    try {
        const response = await axios.post(`${API_URL}/edwards`, params);
        return response.data;
    } catch (error) {
        console.error("Erreur API:", error);
        throw error;
    }
};