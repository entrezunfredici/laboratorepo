const bcrypt = require("bcryptjs");
const { sequelize, User, Todo } = require("../models/index");

async function seed() {
  await sequelize.sync({ force: true });
  console.log("Base de données synchronisée.");

  const hashedPassword = await bcrypt.hash("password1234", 10);

  const [alice, bob] = await User.bulkCreate([
    {
      name: "Alice",
      email: "alice@example.com",
      password: hashedPassword,
      hasValidatedEmail: true,
    },
    {
      name: "Bob",
      email: "bob@example.com",
      password: hashedPassword,
      hasValidatedEmail: true,
    },
  ]);

  await Todo.bulkCreate([
    {
      todoName: "Acheter du pain",
      todoText: "Aller à la boulangerie avant 18h",
      completed: false,
      userId: alice.userId,
    },
    {
      todoName: "Appeler maman",
      todoText: "Rappeler pour le dîner de dimanche",
      completed: true,
      userId: alice.userId,
    },
    {
      todoName: "Réviser Express",
      todoText: "Relire la doc Sequelize et les middlewares",
      completed: false,
      userId: bob.userId,
    },
    {
      todoName: "Écrire les tests",
      todoText: "Couvrir les cas limites du service Todo",
      completed: false,
      userId: bob.userId,
    },
  ]);

  console.log("Seeding terminé : 2 utilisateurs, 4 todos.");
  await sequelize.close();
}

seed().catch((err) => {
  console.error("Erreur lors du seeding :", err);
  process.exit(1);
});
