const { Sequelize } = require("sequelize");
const dbConfig = require("../config/db.config");

/**
 * Instance Sequelize unique pour toute l'application.
 * Configurée via config/db.config.js (SQLite par défaut).
 */
const sequelize = new Sequelize(dbConfig);

const User = require("./User.model")(sequelize);
const Todo = require("./Todo.model")(sequelize);

const models = { User, Todo };

// Applique les associations déclarées dans chaque modèle
Object.values(models).forEach((model) => {
  if (model.associate) model.associate(models);
});

/**
 * @exports sequelize - Instance Sequelize (pour sync, authenticate, transactions)
 * @exports User - Modèle User
 * @exports Todo - Modèle Todo
 */
module.exports = { sequelize, ...models };
