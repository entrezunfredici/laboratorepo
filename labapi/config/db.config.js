module.exports = {
  dialect: "sqlite",
  storage: process.env.DB_PATH || "./db.sqlite",
  logging: false,
};
