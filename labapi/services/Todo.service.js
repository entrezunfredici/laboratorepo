const { Todo } = require("../models/index");

class TodoService {
  /**
   * Retourne tous les todos d'un utilisateur.
   *
   * @param {number} userId
   * @returns {Promise<Todo[]>}
   */
  async findAllByUser(userId) {
    return Todo.findAll({ where: { userId } });
  }

  /**
   * Retourne un todo par son ID, uniquement si il appartient à l'utilisateur.
   *
   * @param {number} idTodo
   * @param {number} userId
   * @returns {Promise<Todo|null>}
   */
  async findOne(idTodo, userId) {
    return Todo.findOne({ where: { idTodo, userId } });
  }

  /**
   * Crée un nouveau todo pour un utilisateur.
   *
   * @param {{ todoName: string, todoText: string, userId: number }} todoData
   * @returns {Promise<Todo>}
   * @throws {Error} Si les champs obligatoires sont manquants.
   */
  async create(todoData) {
    const { todoName, todoText, userId } = todoData;
    if (!todoName || !todoText) throw new Error("Champs manquants : todoName et todoText sont requis.");
    return Todo.create({ todoName, todoText, userId, completed: false });
  }

  /**
   * Met à jour un todo. Vérifie que le todo appartient à l'utilisateur.
   *
   * @param {number} idTodo
   * @param {number} userId
   * @param {{ todoName?: string, todoText?: string, completed?: boolean }} updates
   * @returns {Promise<Todo>}
   * @throws {Error} Si le todo est introuvable ou n'appartient pas à l'utilisateur.
   */
  async update(idTodo, userId, updates) {
    const todo = await this.findOne(idTodo, userId);
    if (!todo) throw new Error("Todo introuvable.");

    const allowed = ["todoName", "todoText", "completed"];
    allowed.forEach((field) => {
      if (updates[field] !== undefined) todo[field] = updates[field];
    });

    await todo.save();
    return todo;
  }

  /**
   * Supprime un todo. Vérifie que le todo appartient à l'utilisateur.
   *
   * @param {number} idTodo
   * @param {number} userId
   * @returns {Promise<void>}
   * @throws {Error} Si le todo est introuvable ou n'appartient pas à l'utilisateur.
   */
  async delete(idTodo, userId) {
    const todo = await this.findOne(idTodo, userId);
    if (!todo) throw new Error("Todo introuvable.");
    await todo.destroy();
  }

  /**
   * Inverse le statut completed d'un todo.
   *
   * @param {number} idTodo
   * @param {number} userId
   * @returns {Promise<Todo>}
   * @throws {Error} Si le todo est introuvable ou n'appartient pas à l'utilisateur.
   */
  async toggleCompleted(idTodo, userId) {
    const todo = await this.findOne(idTodo, userId);
    if (!todo) throw new Error("Todo introuvable.");
    todo.completed = !todo.completed;
    await todo.save();
    return todo;
  }
}

module.exports = new TodoService();
