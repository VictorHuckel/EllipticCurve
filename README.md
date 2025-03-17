# Elliptic Curve Visualizer

## Description
Ce projet est une application web permettant de visualiser des courbes elliptiques et d'effectuer différentes opérations dessus. Il est développé en **Vue.js** pour l'interface utilisateur et utilise un serveur **Node.js avec Express** pour effectuer les calculs mathématiques.

## Structure du Projet
Le projet est divisé en deux parties principales :

### 1. Client-Side (Vue.js)
Le client est responsable de l'affichage et de l'interaction utilisateur. Il communique avec le serveur pour récupérer les données nécessaires.

#### 📂 **client/**
- **`/public/`** : Contient les assets statiques.
- **`/src/`** : Contient le code source Vue.js.
  - **`/components/`** : Composants réutilisables.
  - **`/views/`** : Pages principales de l’application.
  - **`/utils/`** : Fonctions utilitaires (ex : formattage des données).
  - **`/services/`** : Gestion des appels API au back-end.
  - **`App.vue`** : Composant racine de l'application Vue.
  - **`main.js`** : Point d'entrée de l'application.

### 2. Server-Side (Node.js + Express)
Le serveur est responsable des calculs mathématiques liés aux courbes elliptiques. Il expose une API REST utilisée par le client.

#### 📂 **server/**
- **`/api/`** : Contient la logique back-end.
  - **`/routes/`** : Définition des routes API.
  - **`/controllers/`** : Implémentation des calculs et logique métier.
  - **`/models/`** : Structures de données pour les courbes elliptiques.
- **`server.ts`** : Point d’entrée du serveur.

## Installation et Lancement

### 1. Prérequis
- Node.js >= 16
- npm ou yarn

### 2. Installation des dépendances
```sh
# Installation côté client
cd client
npm install

# Installation côté serveur
cd ../server
npm install
```

### 3. Lancer l'application
```sh
# Lancer le serveur
cd server
npm start

# Lancer le client
cd ../client
npm run dev
```

L'application sera accessible sur `http://localhost:5173/` et l'API sur `http://localhost:5000/`.

## Contribution
Les contributions sont les bienvenues ! Merci de suivre les bonnes pratiques de développement et de soumettre des Pull Requests claires.

## Licence
Ce projet est sous licence MIT.

