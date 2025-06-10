# Youcode Fil Rouge A1

#### Ce projet est un exemple de consommation de la partie backend.

### Deux projets consomment les mêmes endpoints et partagent le même design.

La différence réside dans l'architecture adoptée :

- Le projet `native-spa` suit une architecture **modulaire**.
- Le projet `with-jquery` est basé sur une approche **fonctionnelle**.

Vous êtes libre d'adopter l'approche de votre choix.

---

## Installation

### Pour le projet modulaire :

Il utilise un système de modules (`type="module"`) et nécessite un **serveur HTTP**.  
Si vous utilisez VS Code, vous pouvez simplement utiliser l'extension **Live Server** pour le lancer, ou bien tout autre serveur (Apache, Nginx...).

### Pour le projet avec jQuery :

Aucune configuration n'est nécessaire. Il peut être ouvert directement dans le navigateur.

### Configuration commune :

✅ **DÉJÀ CONFIGURÉ** - La variable `baseUrl` est maintenant configurée pour pointer vers votre backend :
`http://localhost/Jeu_de_video_fil_rouge/boilerplate-php-fy1-sql`

---

## URLs d'accès

- **jQuery Version:** `http://localhost/Jeu_de_video_fil_rouge/sample-front-fy1/with-jquery/`
- **Native-SPA Version:** `http://localhost/Jeu_de_video_fil_rouge/sample-front-fy1/native-spa/`
- **Backend API:** `http://localhost/Jeu_de_video_fil_rouge/boilerplate-php-fy1-sql/`

---

## Description

Ce projet est une démonstration simple d'un **système de gestion des employés**, incluant la gestion des **augmentations salariales**.

---

![Exemple Projet](/screenshots/1.png)
