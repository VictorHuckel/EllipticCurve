<script setup>
import { ref, computed } from "vue";
import Menu from "@/components/Menu.vue";

// Importation des vues spécifiques aux courbes
import WeierstrassView from "@/views/WeierstrassView.vue";
import ShortWeierstrassView from "@/views/ShortWeierstrassView.vue";
import EdwardsView from "@/views/EdwardsView.vue";
import MontgomeryView from "@/views/MontgomeryView.vue";

const selectedCurve = ref("Weierstrass");

// Dictionnaire des informations pour chaque courbe
const curveInfo = computed(() => {
    const info = {
        Weierstrass: {
            name: "Courbe de Weierstrass",
            equation: "y² = x³ + ax + b",
            description: "Utilisée en cryptographie, cette forme générale décrit la majorité des courbes elliptiques."
        },
        ShortWeierstrass: {
            name: "Courbe de Weierstrass (Forme Courte)",
            equation: "y² = x³ + ax + b",
            description: "Version simplifiée de Weierstrass, couramment utilisée dans l'algèbre elliptique."
        },
        Edwards: {
            name: "Courbe d'Edwards",
            equation: "x² + y² = 1 + d x² y²",
            description: "Permet des calculs plus efficaces et sécurisés, souvent utilisée pour les signatures numériques."
        },
        Montgomery: {
            name: "Courbe de Montgomery",
            equation: "By² = x³ + Ax² + x",
            description: "Optimisée pour l’algorithme d'échange de clé Diffie-Hellman, elle offre des calculs rapides."
        }
    };
    return info[selectedCurve.value];
});

// Sélection dynamique de la vue
const selectedView = computed(() => {
    switch (selectedCurve.value) {
        case "Weierstrass":
            return WeierstrassView;
        case "ShortWeierstrass":
            return ShortWeierstrassView;
        case "Edwards":
            return EdwardsView;
        case "Montgomery":
            return MontgomeryView;
        default:
            return WeierstrassView;
    }
});
</script>

<template>
    <div class="container">
        <!-- Menu latéral -->
        <aside class="sidebar">
            <h2>Type de courbe</h2>
            <Menu @curveSelected="selectedCurve = $event" />

            <!-- Détails sous le menu déroulant -->
            <div class="info-section">
                <h3>{{ curveInfo.name }}</h3>
                <p><strong>Équation :</strong> {{ curveInfo.equation }}</p>
                <p>{{ curveInfo.description }}</p>
            </div>
        </aside>

        <!-- Contenu principal -->
        <main class="content">
            <!-- Vue dynamique affichant la courbe choisie -->
            <component :is="selectedView" />
        </main>
    </div>
</template>

<style scoped>
/* Disposition en 2 colonnes avec le menu à gauche */
.container {
    display: grid;
    grid-template-columns: 250px 1fr;
    height: 100vh;
    background: #f4f4f9;
}

/* Menu latéral */
.sidebar {
    background: #2c3e50;
    color: white;
    padding: 20px;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    box-shadow: 2px 0 5px rgba(0, 0, 0, 0.1);
}

/* Contenu principal */
.content {
    padding: 20px;
    overflow-y: auto;
}

/* Section d'information */
.info-section {
    background: white;
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    margin-top: 20px;
    width: 80%;
}

/* Style de la section info */
h3 {
    font-size: 18px;
    margin-bottom: 10px;
}

p {
    font-size: 14px;
    color: #555;
}
</style>
