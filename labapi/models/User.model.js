const { DataTypes } = require("sequelize");

/**
 * Définit le modèle Sequelize User.
 *
 * @param {import("sequelize").Sequelize} sequelize - Instance Sequelize partagée.
 * @returns {import("sequelize").Model} Modèle User.
 */
module.exports = (sequelize) => {
  const User = sequelize.define(
    "User",
    {
      userId: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      validEmailCode: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      resetPasswordCode: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      hasValidatedEmail: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      lastLogin: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      tableName: "User",
      updatedAt: "updatedAt",
      createdAt: "createdAt",
      timestamps: false,
    }
  );

  /**
   * Déclare les associations du modèle User.
   * Appelé depuis models/index.js après initialisation de tous les modèles.
   *
   * @param {{ Todo: import("sequelize").Model }} models - Map des modèles initialisés.
   */
  User.associate = (models) => {
    User.hasMany(models.Todo, {
      foreignKey: "userId",
      as: "todos",
    });
  };

  return User;
};
