# Simulation de Match de Tennis

## Lancement du Projet

### Prérequis
* Node.js installé sur votre machine

### Installation
# Installer les dépendances
npm install

# Lancer le projet en mode développement
npm run dev

### Accès à l'Application
Ouvrez votre navigateur à l'adresse : http://localhost:3000

## Réalisation du Projet

### Objectif
Le but de ce projet est de développer un mini-site simulant le déroulement d'un match de tennis. L'application propose une expérience de simulation de match avec les caractéristiques suivantes.

### Fonctionnalités Principales
* Génération de points entre deux joueurs avec un système probabiliste
* Calcul dynamique du score basé sur le niveau des joueurs
* Simulation complète d'un match de tennis respectant les règles officielles

### Détails de la Simulation
* Les joueurs sont classés sur une échelle de niveau de 1 à 10
* Chaque session génère 150 points automatiquement
* Le gagnant de chaque point est calculé en fonction de l'écart de niveau entre les joueurs
* Possibilité de régénérer des points si le match n'est pas terminé
* Affichage détaillé du score dans un tableau

### Processus de Simulation
1. Sélectionnez deux joueurs avec leurs niveaux
2. Générez les points automatiquement
3. Visualisez le score en temps réel
4. Continuez à générer des points jusqu'à la fin du match

## Technologies Utilisées

### Frontend
* JavaScript
* HTML
* CSS

### Backend
* Node.js
* Express
* TypeScript

## Fonctionnement Détaillé

### Génération des Points
* 150 points sont générés automatiquement à chaque session
* La probabilité de gagner un point dépend du niveau des joueurs
* Calcul probabiliste basé sur la différence de niveau entre les joueurs

### Calcul du Score
* Implémentation côté serveur de la logique de scoring du tennis
* Suivi précis des points, jeux, et sets
* Gestion des cas spéciaux (tie-break, avantage)

## Utilisation
1. Entrez les noms et niveaux des joueurs dans l'interface
2. Cliquez sur le bouton "Générer des points"
3. Visualisez le déroulement du score en temps réel
4. Régénérez des points supplémentaires si nécessaire pour terminer le match

