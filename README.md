# ASP - Trouve ta voie

## Configuration du projet

```cd {directory}```

```sh
npm install
```

### Commande pour faire rouler le projet en local

```sh
npm run serve
```

### Notes :

BASE DE DONNÉES :

Vous pouvez décider d'utiliser les variables d'environnement en modifiant la valeur
de `NODE_ENV`. Il existe le mode `development` et `production`. S'il n'y a pas de valeur,
l'API décidera automatiquement que le mode à utiliser est `development`;

Mise en garde : Le fichier `db_development.sql` crée la base de données, les tables
et le compte administrateur pour l'environnement en développment.

Recommandations : Il est conseillé, une fois les paquets npm installés et après avoir décidé
de l'environnement à utiliser, d'exécuter la commande `npm run serve`. Au démarrage de l'application,
si la base de données n'existe pas, l'API se chargera de créer la base de données et ses tables
et d'insérer l'utilisateur admin.

Mise en garde : L'option d'importer le fichier `db_development.sql` ou exécuter la commande
`npm run serve` n'insère pas les données en même temps. Il faut ensuite importer le fichier
`db_development-data.sql` dans la base de données.

GIT :

Le répertoire git utilisé pour ce projet est : https://github.com/snowstorm-bit/asp-api.git

Vous pourrez trouver l'ensemble du back-end et du front-end au répertoire git suivant : 
https://gitlab.com/truc123/asp-a2022.git