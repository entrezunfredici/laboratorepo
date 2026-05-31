const jwt = require("jsonwebtoken");

/**
 * Middleware d'authentification JWT.
 * Vérifie le token Bearer dans le header Authorization et injecte req.user.
 *
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @param {import("express").NextFunction} next
 */
module.exports = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1]; // "Bearer <token>"

  if (!token) return res.status(401).send({ message: "Token manquant." });

  try {
    req.user = jwt.verify(token, process.env.AUTH_JWT_SECRET);
    next();
  } catch {
    res.status(403).send({ message: "Token invalide ou expiré." });
  }
};
