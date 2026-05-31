const express = require("express");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
const swaggerOptions = require("./config/swagger.config");

const app = express();

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// Swagger
const swaggerSpec = swaggerJsdoc(swaggerOptions);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Routes
require("./routes/User.routes")(app);
require("./routes/Todo.routes")(app);

// 404
app.use((req, res) => {
  res.status(404).send({ message: "Route non trouvée." });
});

// Gestionnaire d'erreurs global
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).send({ message: err.message || "Erreur serveur." });
});

module.exports = app;
