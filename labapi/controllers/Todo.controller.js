const todoService = require("../services/Todo.service");

exports.findAll = async (req, res) => {
  try {
    const todos = await todoService.findAllByUser(req.user.id);
    res.status(200).send(todos);
  } catch (error) {
    console.error(error?.message || error);
    res.status(500).send({ message: "Erreur serveur." });
  }
};

exports.findOne = async (req, res) => {
  try {
    const todo = await todoService.findOne(req.params.id, req.user.id);
    if (!todo) return res.status(404).send({ message: "Todo introuvable." });
    res.status(200).send(todo);
  } catch (error) {
    console.error(error?.message || error);
    res.status(500).send({ message: "Erreur serveur." });
  }
};

exports.create = async (req, res) => {
  try {
    const todo = await todoService.create({ ...req.body, userId: req.user.id });
    res.status(201).send(todo);
  } catch (error) {
    const message = error?.message || "Erreur lors de la création du todo.";
    console.error(message);
    res.status(message.includes("manquants") ? 400 : 500).send({ message });
  }
};

exports.update = async (req, res) => {
  try {
    const todo = await todoService.update(req.params.id, req.user.id, req.body);
    res.status(200).send(todo);
  } catch (error) {
    const message = error?.message || "Erreur lors de la mise à jour.";
    console.error(message);
    res.status(message.includes("introuvable") ? 404 : 500).send({ message });
  }
};

exports.toggleCompleted = async (req, res) => {
  try {
    const todo = await todoService.toggleCompleted(req.params.id, req.user.id);
    res.status(200).send(todo);
  } catch (error) {
    const message = error?.message || "Erreur lors du toggle.";
    console.error(message);
    res.status(message.includes("introuvable") ? 404 : 500).send({ message });
  }
};

exports.delete = async (req, res) => {
  try {
    await todoService.delete(req.params.id, req.user.id);
    res.status(200).send({ message: "Todo supprimé avec succès." });
  } catch (error) {
    const message = error?.message || "Erreur lors de la suppression.";
    console.error(message);
    res.status(message.includes("introuvable") ? 404 : 500).send({ message });
  }
};
