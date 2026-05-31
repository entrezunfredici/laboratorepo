const { DataTypes } = require("sequelize");

/**
 * Définit le modèle Sequelize Todo.
 *
 * @param {import("sequelize").Sequelize} sequelize - Instance Sequelize partagée.
 * @returns {import("sequelize").Model} Modèle Todo.
 */
module.exports = (sequelize) => {
  const Todo = sequelize.define(
    "Todo",
    {
      idTodo: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      todoName: {
        type: DataTypes.STRING(50),
        allowNull: false,
      },
      todoText: {
        type: DataTypes.STRING(200),
        allowNull: false,
      },
      completed: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "User",
          key: "userId",
        },
      },
    },
    {
      tableName: "Todo",
      timestamps: false,
    }
  );

  /**
   * Déclare les associations du modèle Todo.
   * Appelé depuis models/index.js après initialisation de tous les modèles.
   *
   * @param {{ User: import("sequelize").Model }} models - Map des modèles initialisés.
   */
  Todo.associate = (models) => {
    Todo.belongsTo(models.User, {
      foreignKey: "userId",
      as: "user",
    });
  };

  return Todo;
};
