const express = require("express");
const user = require("../controllers/User.controller.js");
const authMiddleware = require("../middlewares/Auth.middleware.js");

const router = express.Router();

/**
 * @swagger
 * tags:
 *   - name: Users
 *     description: Gestion des utilisateurs
 */

// --- Routes publiques (sans auth) ---
// IMPORTANT: les routes statiques doivent être avant /:id pour éviter les conflits Express

/**
 * @swagger
 * /users/register:
 *   post:
 *     summary: Inscrire un nouvel utilisateur
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, email, password]
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Alice"
 *               email:
 *                 type: string
 *                 example: "alice@example.com"
 *               password:
 *                 type: string
 *                 example: "monmotdepasse123"
 *     responses:
 *       201:
 *         description: Utilisateur inscrit avec succès.
 *       400:
 *         description: Email déjà utilisé ou champs manquants.
 *       500:
 *         description: Erreur serveur.
 */
router.post("/register", user.register);

/**
 * @swagger
 * /users/login:
 *   post:
 *     summary: Connecter un utilisateur et obtenir un token JWT
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email:
 *                 type: string
 *                 example: "alice@example.com"
 *               password:
 *                 type: string
 *                 example: "monmotdepasse123"
 *     responses:
 *       200:
 *         description: Connexion réussie.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *       401:
 *         description: Mot de passe incorrect.
 *       404:
 *         description: Utilisateur introuvable.
 *       500:
 *         description: Erreur serveur.
 */
router.post("/login", user.login);

/**
 * @swagger
 * /users/verify-email:
 *   post:
 *     summary: Vérifier l'email d'un utilisateur via un code
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, code]
 *             properties:
 *               email:
 *                 type: string
 *                 example: "alice@example.com"
 *               code:
 *                 type: string
 *                 example: "123456"
 *     responses:
 *       200:
 *         description: Email vérifié avec succès.
 *       401:
 *         description: Code invalide.
 *       404:
 *         description: Utilisateur introuvable.
 *       500:
 *         description: Erreur serveur.
 */
router.post("/verify-email", user.verifyEmail);

/**
 * @swagger
 * /users/forgot-password:
 *   post:
 *     summary: Envoyer un code de réinitialisation de mot de passe
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email]
 *             properties:
 *               email:
 *                 type: string
 *                 example: "alice@example.com"
 *     responses:
 *       200:
 *         description: Code de réinitialisation envoyé.
 *       404:
 *         description: Utilisateur introuvable.
 *       500:
 *         description: Erreur serveur.
 */
router.post("/forgot-password", user.forgotPassword);

/**
 * @swagger
 * /users/reset-password:
 *   post:
 *     summary: Réinitialiser le mot de passe avec un code
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, code, newPassword]
 *             properties:
 *               email:
 *                 type: string
 *                 example: "alice@example.com"
 *               code:
 *                 type: string
 *                 example: "123456"
 *               newPassword:
 *                 type: string
 *                 example: "nouveaumotdepasse123"
 *     responses:
 *       200:
 *         description: Mot de passe réinitialisé avec succès.
 *       401:
 *         description: Code invalide.
 *       404:
 *         description: Utilisateur introuvable.
 *       500:
 *         description: Erreur serveur.
 */
router.post("/reset-password", user.resetPassword);

// --- Routes protégées (JWT requis) ---

/**
 * @swagger
 * /users/{id}:
 *   get:
 *     summary: Récupérer un utilisateur par son ID
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Détails de l'utilisateur.
 *       401:
 *         description: Token manquant ou invalide.
 *       404:
 *         description: Utilisateur introuvable.
 *       500:
 *         description: Erreur serveur.
 */
router.get("/:id", authMiddleware, user.findOne);

/**
 * @swagger
 * /users/{id}:
 *   put:
 *     summary: Mettre à jour un utilisateur
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Alice Dupont"
 *               email:
 *                 type: string
 *                 example: "alice.dupont@example.com"
 *     responses:
 *       200:
 *         description: Utilisateur mis à jour.
 *       401:
 *         description: Token manquant ou invalide.
 *       500:
 *         description: Erreur serveur.
 */
router.put("/:id", authMiddleware, user.update);

/**
 * @swagger
 * /users/{id}:
 *   delete:
 *     summary: Supprimer un utilisateur
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Utilisateur supprimé.
 *       401:
 *         description: Token manquant ou invalide.
 *       500:
 *         description: Erreur lors de la suppression.
 */
router.delete("/:id", authMiddleware, user.delete);

/**
 * @swagger
 * /users/{id}/change-password:
 *   put:
 *     summary: Modifier le mot de passe d'un utilisateur
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [oldPassword, newPassword]
 *             properties:
 *               oldPassword:
 *                 type: string
 *                 example: "ancienmdp123"
 *               newPassword:
 *                 type: string
 *                 example: "nouveaumdp123"
 *     responses:
 *       200:
 *         description: Mot de passe modifié.
 *       401:
 *         description: Mot de passe incorrect ou token invalide.
 *       404:
 *         description: Utilisateur introuvable.
 *       500:
 *         description: Erreur serveur.
 */
router.put("/:id/change-password", authMiddleware, user.changePassword);

module.exports = (app) => {
  app.use("/users", router);
};
