const express = require("express");
const todo = require("../controllers/Todo.controller.js");
const authMiddleware = require("../middlewares/Auth.middleware.js");

const router = express.Router();

// Toutes les routes todos sont protégées
router.use(authMiddleware);

/**
 * @swagger
 * tags:
 *   - name: Todos
 *     description: Gestion des todos (authentification requise)
 */

/**
 * @swagger
 * /todos:
 *   get:
 *     summary: Récupérer tous les todos de l'utilisateur connecté
 *     tags: [Todos]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Liste des todos.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Todo'
 *       401:
 *         description: Token manquant ou invalide.
 *       500:
 *         description: Erreur serveur.
 */
router.get("/", todo.findAll);

/**
 * @swagger
 * /todos/{id}:
 *   get:
 *     summary: Récupérer un todo par son ID
 *     tags: [Todos]
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
 *         description: Détails du todo.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Todo'
 *       401:
 *         description: Token manquant ou invalide.
 *       404:
 *         description: Todo introuvable.
 *       500:
 *         description: Erreur serveur.
 */
router.get("/:id", todo.findOne);

/**
 * @swagger
 * /todos:
 *   post:
 *     summary: Créer un nouveau todo
 *     tags: [Todos]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [todoName, todoText]
 *             properties:
 *               todoName:
 *                 type: string
 *                 example: "Faire les courses"
 *               todoText:
 *                 type: string
 *                 example: "Lait, pain, œufs"
 *     responses:
 *       201:
 *         description: Todo créé.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Todo'
 *       400:
 *         description: Champs manquants.
 *       401:
 *         description: Token manquant ou invalide.
 *       500:
 *         description: Erreur serveur.
 */
router.post("/", todo.create);

/**
 * @swagger
 * /todos/{id}:
 *   put:
 *     summary: Mettre à jour un todo
 *     tags: [Todos]
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
 *               todoName:
 *                 type: string
 *                 example: "Faire les courses (modifié)"
 *               todoText:
 *                 type: string
 *                 example: "Lait, pain, œufs, fromage"
 *               completed:
 *                 type: boolean
 *                 example: true
 *     responses:
 *       200:
 *         description: Todo mis à jour.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Todo'
 *       401:
 *         description: Token manquant ou invalide.
 *       404:
 *         description: Todo introuvable.
 *       500:
 *         description: Erreur serveur.
 */
router.put("/:id", todo.update);

/**
 * @swagger
 * /todos/{id}/toggle:
 *   patch:
 *     summary: Inverser le statut completed d'un todo
 *     tags: [Todos]
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
 *         description: Statut inversé.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Todo'
 *       401:
 *         description: Token manquant ou invalide.
 *       404:
 *         description: Todo introuvable.
 *       500:
 *         description: Erreur serveur.
 */
router.patch("/:id/toggle", todo.toggleCompleted);

/**
 * @swagger
 * /todos/{id}:
 *   delete:
 *     summary: Supprimer un todo
 *     tags: [Todos]
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
 *         description: Todo supprimé.
 *       401:
 *         description: Token manquant ou invalide.
 *       404:
 *         description: Todo introuvable.
 *       500:
 *         description: Erreur serveur.
 */
router.delete("/:id", todo.delete);

/**
 * @swagger
 * components:
 *   schemas:
 *     Todo:
 *       type: object
 *       properties:
 *         idTodo:
 *           type: integer
 *           example: 1
 *         todoName:
 *           type: string
 *           example: "Faire les courses"
 *         todoText:
 *           type: string
 *           example: "Lait, pain, œufs"
 *         completed:
 *           type: boolean
 *           example: false
 *         userId:
 *           type: integer
 *           example: 1
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 */

module.exports = (app) => {
  app.use("/todos", router);
};
