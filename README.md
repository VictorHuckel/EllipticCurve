# Elliptic Curve Visualizer

## Description

Ce projet est une application web permettant de visualiser des courbes elliptiques et d'effectuer différentes opérations dessus. Il est développé en **Vue.js** pour l'interface utilisateur et utilise un serveur **Node.js avec Express** pour effectuer les calculs mathématiques.


### Overview 

![aperçu](./client/public/preview.png)


## Fonctionnalités

- Visualisation interactive de courbes elliptiques en 2D et 3D
- Projection sur sphère et tore
- Support des courbes homogènes
- Interface utilisateur personnalisable
- API Node.js pour les calculs mathématiques


## Technologies Utilisées

### Front-End
- Vue.js 3
- Vite
- Desmos API
- Three.js

### Back-End
- Node.js
- Express
- Math.js

### Outils
- Git
- npm
- nodemon


## Structure du Projet

Le projet est divisé en deux parties principales :

### 1. Client-Side (Vue.js + Vite)

Le client est responsable de l'affichage et de l'interaction utilisateur. Il communique avec le serveur pour récupérer les données nécessaires.

#### 📂 **client/**

- **`/public/`** : Contient les assets statiques (e.g., favicon, index.html).
- **`/src/`** : Contient le code source Vue.js.
  - **`/assets/`** : Ressources statiques spécifiques à l'application (e.g., styles CSS).
  - **`/components/`** : Composants réutilisables.
    - **`Menu.vue`** : Interface pour sélectionner les paramètres de la courbe.
    - **`GraphDisplay.vue`** : Affichage 2D des courbes.
    - **`GraphDisplayHomogeneous.vue`** : Affichage 2D des courbes homogènes.
    - **`EllipticSphere.vue`** : Affichage 3D des courbes projetées sur une sphère.
    - **`EllipticTorus.vue`** : Affichage 3D des courbes projetées sur un tore.
    - **`Loader.vue`** : Indicateur de chargement.
  - **`/views/`** : Pages principales de l’application.
    - **`HomeView.vue`** : Vue principale de l'application.
  - **`/services/`** : Gestion des appels API au back-end.
    - **`apiService.js`** : Contient les fonctions pour interagir avec l'API backend.
  - **`/utils/`** : Fonctions utilitaires (e.g., formattage des données).
    - **`mathUtils.js`** : Fonctions mathématiques spécifiques.
  - **`App.vue`** : Composant racine de l'application Vue.
  - **`main.js`** : Point d'entrée de l'application Vue.
  - **`vite.config.js`** : Configuration de Vite.

### 2. Server-Side (Node.js + Express)

Le serveur est responsable des calculs mathématiques liés aux courbes elliptiques. Il expose une API REST utilisée par le client.

#### 📂 **server/**

- **`/routes/`** : Définit les routes API.
  - **`curveRoutes.js`** : Routes pour les calculs liés aux courbes elliptiques.
- **`/controllers/`** : Implémente la logique métier.
  - **`curveController.js`** : Gère les calculs et renvoie les résultats.
- **`/services/`** : Contient les fonctions mathématiques.
  - **`curveEngine.js`** : Génère les points des courbes elliptiques.
  - **`modmath.js`** : Fonctions pour les calculs modulo.
  - **`projection.js`** : Projections des points sur des surfaces 3D (sphère, tore).
- **`/models/`** : Structures de données pour les courbes elliptiques.
  - **`Curve.js`** : Définit les modèles mathématiques des courbes.
- **`app.js`** : Point d’entrée du serveur.
- **`package.json`** : Configuration des dépendances et des scripts NPM.
##  Lancement


### 1. Lancement

## Pour démarrer le client Vue.js :
```sh
cd client
npm run dev
```


Si `vite` n'est pas installé, installez-le avec :
```sh
cd client
npm install vite
```


## Pour démarrer le serveur Node.js :
```sh
cd server
npm start  # Démarrage simple
# ou
npm run dev  # Utilise nodemon pour rechargement automatique
```

Si `nodemon` n'est pas installé, installez-le avec :
```sh
npm install -g nodemon
```
ou
```sh
npm install --save-dev nodemon
```



## Contribution

Les contributions sont les bienvenues ! Merci de suivre les bonnes pratiques de développement et de soumettre des Pull Requests claires.

## Licence

Ce projet est sous licence MIT.

