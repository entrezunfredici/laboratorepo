jest.mock("../models/index", () => ({
  Todo: {
    findAll: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    destroy: jest.fn(),
  },
}));

const { Todo } = require("../models/index");
const todoService = require("../services/Todo.service");

const mockTodo = (overrides = {}) => ({
  idTodo: 1,
  todoName: "Test todo",
  todoText: "Texte du todo",
  completed: false,
  userId: 42,
  save: jest.fn().mockResolvedValue(true),
  destroy: jest.fn().mockResolvedValue(true),
  ...overrides,
});

describe("TodoService", () => {
  afterEach(() => jest.clearAllMocks());

  describe("findAllByUser", () => {
    it("should return all todos for a user", async () => {
      const todos = [mockTodo(), mockTodo({ idTodo: 2, todoName: "Second todo" })];
      Todo.findAll.mockResolvedValue(todos);

      const result = await todoService.findAllByUser(42);

      expect(Todo.findAll).toHaveBeenCalledWith({ where: { userId: 42 } });
      expect(result).toHaveLength(2);
    });
  });

  describe("findOne", () => {
    it("should return a todo if it belongs to the user", async () => {
      const todo = mockTodo();
      Todo.findOne.mockResolvedValue(todo);

      const result = await todoService.findOne(1, 42);

      expect(Todo.findOne).toHaveBeenCalledWith({ where: { idTodo: 1, userId: 42 } });
      expect(result).toEqual(todo);
    });

    it("should return null if todo does not belong to the user", async () => {
      Todo.findOne.mockResolvedValue(null);

      const result = await todoService.findOne(1, 99);

      expect(result).toBeNull();
    });
  });

  describe("create", () => {
    it("should create a todo for a user", async () => {
      const todo = mockTodo();
      Todo.create.mockResolvedValue(todo);

      const result = await todoService.create({ todoName: "Test todo", todoText: "Texte", userId: 42 });

      expect(Todo.create).toHaveBeenCalledWith({
        todoName: "Test todo",
        todoText: "Texte",
        userId: 42,
        completed: false,
      });
      expect(result).toEqual(todo);
    });

    it("should throw if todoName is missing", async () => {
      await expect(
        todoService.create({ todoText: "Texte", userId: 42 })
      ).rejects.toThrow("Champs manquants");
    });

    it("should throw if todoText is missing", async () => {
      await expect(
        todoService.create({ todoName: "Nom", userId: 42 })
      ).rejects.toThrow("Champs manquants");
    });
  });

  describe("update", () => {
    it("should update allowed fields and save", async () => {
      const todo = mockTodo();
      Todo.findOne.mockResolvedValue(todo);

      const result = await todoService.update(1, 42, { todoName: "Nouveau nom", completed: true });

      expect(todo.todoName).toBe("Nouveau nom");
      expect(todo.completed).toBe(true);
      expect(todo.save).toHaveBeenCalled();
      expect(result).toEqual(todo);
    });

    it("should throw if todo is not found", async () => {
      Todo.findOne.mockResolvedValue(null);

      await expect(todoService.update(1, 42, {})).rejects.toThrow("Todo introuvable.");
    });
  });

  describe("delete", () => {
    it("should destroy the todo", async () => {
      const todo = mockTodo();
      Todo.findOne.mockResolvedValue(todo);

      await todoService.delete(1, 42);

      expect(todo.destroy).toHaveBeenCalled();
    });

    it("should throw if todo is not found", async () => {
      Todo.findOne.mockResolvedValue(null);

      await expect(todoService.delete(1, 42)).rejects.toThrow("Todo introuvable.");
    });
  });

  describe("toggleCompleted", () => {
    it("should toggle completed from false to true", async () => {
      const todo = mockTodo({ completed: false });
      Todo.findOne.mockResolvedValue(todo);

      const result = await todoService.toggleCompleted(1, 42);

      expect(result.completed).toBe(true);
      expect(todo.save).toHaveBeenCalled();
    });

    it("should toggle completed from true to false", async () => {
      const todo = mockTodo({ completed: true });
      Todo.findOne.mockResolvedValue(todo);

      const result = await todoService.toggleCompleted(1, 42);

      expect(result.completed).toBe(false);
    });

    it("should throw if todo is not found", async () => {
      Todo.findOne.mockResolvedValue(null);

      await expect(todoService.toggleCompleted(1, 42)).rejects.toThrow("Todo introuvable.");
    });
  });
});
