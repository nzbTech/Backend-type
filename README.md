# BACKEND TYPE. 

* node/express et mongoDB

## lancement API

* Ajoutez  le document `.env` dans le dossier `/BACKEND`
* Installez toutes les dépendances du projet : `npm install`
* Démarrez le serveur Node.js : `nodemon server`

## Update API
* heroku restart


## ENDPOINT

path parameters
{ :id = "620f449ed389ca3314ace82e"} = mongoDB :id

### HOME

* `GET`localhost:3000/api/home
    * affiche la page d'accueil


### USERS

* `POST`localhost:3000/api/user/signup
    * Création d'un compte utilisateur

* `POST`localhost:3000/api/user/login
    * Connexion au compte utilisateur

* `DELETE`localhost:3000/api/user/delete/:id
    * Suppression d'un utilisateur

* `PATCH`localhost:3000/api/user/update/:id
    * Modification d'un utilisateur

* `GET`localhost:3000/api/user/:id
    * Récupération d'un utilisateur par :id


### PRODUCTS

* `POST`localhost:3000/api/products/create
    * Création d'un produit

* `PATCH`localhost:3000/api/products/update/:id
    * Modification d'un produit

* `DELETE`localhost:3000/api/products/delete/:id
    * Suppression d'un produit

* `GET`localhost:3000/api/products
    * Récupération des produits

* `GET`localhost:3000/api/products/:id
    * Récupération d'un produit par :id

### ORDERS

* `POST`localhost:3000/api/orders/create
    * Création d'une commande

* `PATCH`localhost:3000/api/orders/update/:id
    * Modification d'une commande

* `DELETE`localhost:3000/api/orders/delete/:id
    * Suppression d'une commande

* `GET`localhost:3000/api/orders
    * Récupération des commandes

* `GET`localhost:3000/api/orders/:id
    * Récupération d'une commande par :id
