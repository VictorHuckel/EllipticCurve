# Elliptic Curve Visualizer


https://github.com/user-attachments/assets/e7db511d-cdff-4ddd-babb-48b38326f425


## Description

Ce projet est une application web permettant de visualiser des courbes elliptiques et d'effectuer différentes opérations dessus. Il est développé en **Vue.js** pour l'interface utilisateur et utilise un serveur **Node.js avec Express** pour effectuer les calculs mathématiques.

## Structure du Projet

Le projet est divisé en deux parties principales :

### 1. Client-Side (Vue.js + Vite)

Le client est responsable de l'affichage et de l'interaction utilisateur. Il communique avec le serveur pour récupérer les données nécessaires.

#### 📂 **client/**

- **`/public/`** : Contient les assets statiques.
- **`/src/`** : Contient le code source Vue.js.
  - **`/assets/`** : Ressources statiques spécifiques à l'application.
  - **`/components/`** : Composants réutilisables.
  - **`/views/`** : Pages principales de l’application.
  - **`/services/`** : Gestion des appels API au back-end.
  - **`/utils/`** : Fonctions utilitaires (ex : formattage des données).
  - **`App.vue`** : Composant racine de l'application Vue.
  - **`main.js`** : Point d'entrée de l'application Vue.
  - **`vite.config.js`** : Configuration de Vite.

### 2. Server-Side (Node.js + Express)

Le serveur est responsable des calculs mathématiques liés aux courbes elliptiques. Il expose une API REST utilisée par le client.

#### 📂 **server/**

- **`/api/`** : Contient la logique back-end.
  - **`/routes/`** : Définition des routes API.
  - **`/controllers/`** : Implémentation des calculs et logique métier.
  - **`/models/`** : Structures de données pour les courbes elliptiques.
- **`server.js`** : Point d’entrée du serveur.
- **`package.json`** : Configuration des dépendances et des scripts NPM.

##  Lancement


### 1. Lancement

Pour démarrer le client Vue.js :
```sh
cd client
npm run dev
```


Si `vite` n'est pas installé, installez-le avec :
```sh
cd client
npm install vite
```


Pour démarrer le serveur Node.js :
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

