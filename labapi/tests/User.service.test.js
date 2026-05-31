jest.mock("../models/index", () => ({
  User: {
    findAll: jest.fn(),
    findOne: jest.fn(),
    findByPk: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    destroy: jest.fn(),
  },
}));

const { User } = require("../models/index");
const UserService = require("../services/User.service");

describe("UserService", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("findAll", () => {
    it("should return all users without passwords", async () => {
      User.findAll.mockResolvedValue([
        { dataValues: { userId: 1, name: "User 1", password: "hashed" } },
        { dataValues: { userId: 2, name: "User 2", password: "hashed" } },
      ]);

      const users = await UserService.findAll();

      expect(User.findAll).toHaveBeenCalled();
      expect(users).toEqual([
        { userId: 1, name: "User 1" },
        { userId: 2, name: "User 2" },
      ]);
    });
  });

  describe("findByEmail", () => {
    it("should return a user by email without password", async () => {
      User.findOne.mockResolvedValue({
        dataValues: { userId: 1, email: "test@example.com", password: "hashed" },
      });

      const user = await UserService.findByEmail("test@example.com");

      expect(User.findOne).toHaveBeenCalledWith({ where: { email: "test@example.com" } });
      expect(user).toEqual({ userId: 1, email: "test@example.com" });
    });

    it("should return null if no user is found", async () => {
      User.findOne.mockResolvedValue(null);

      const user = await UserService.findByEmail("nonexistent@example.com");

      expect(User.findOne).toHaveBeenCalledWith({ where: { email: "nonexistent@example.com" } });
      expect(user).toBeNull();
    });
  });

  describe("findOne", () => {
    it("should return a user by ID without password", async () => {
      User.findByPk.mockResolvedValue({
        dataValues: { userId: 1, name: "User 1", password: "hashed" },
      });

      const user = await UserService.findOne(1);

      expect(User.findByPk).toHaveBeenCalledWith(1);
      expect(user).toEqual({ userId: 1, name: "User 1" });
    });

    it("should return null if no user is found", async () => {
      User.findByPk.mockResolvedValue(null);

      const user = await UserService.findOne(99);

      expect(User.findByPk).toHaveBeenCalledWith(99);
      expect(user).toBeNull();
    });
  });

  describe("create", () => {
    it("should create a new user and return it without password", async () => {
      User.findOne.mockResolvedValue(null);
      User.create.mockResolvedValue({
        dataValues: { userId: 1, email: "test@example.com", name: "Test User" },
      });

      const user = await UserService.create({
        email: "test@example.com",
        name: "Test User",
        password: "securepassword",
      });

      expect(User.findOne).toHaveBeenCalledWith({ where: { email: "test@example.com" } });
      expect(User.create).toHaveBeenCalled();
      expect(user).toEqual({ userId: 1, email: "test@example.com", name: "Test User" });
    });

    it("should throw if email is already used", async () => {
      User.findOne.mockResolvedValue({ dataValues: { userId: 1, email: "test@example.com" } });

      await expect(
        UserService.create({ email: "test@example.com", name: "Test User", password: "securepassword" })
      ).rejects.toThrow("Email déjà utilisé");
    });

    it("should throw if required fields are missing", async () => {
      User.findOne.mockResolvedValue(null);

      await expect(
        UserService.create({ email: "test@example.com" })
      ).rejects.toThrow("Champs manquants");
    });
  });

  describe("update", () => {
    it("should update a user and return the updated record", async () => {
      User.update.mockResolvedValue([1]);
      User.findByPk.mockResolvedValue({
        dataValues: { userId: 1, name: "Updated User" },
      });

      const user = await UserService.update(1, { name: "Updated User" });

      expect(User.update).toHaveBeenCalledWith({ name: "Updated User" }, { where: { userId: 1 } });
      expect(user).toEqual({ userId: 1, name: "Updated User" });
    });
  });

  describe("delete", () => {
    it("should delete a user by ID", async () => {
      User.destroy.mockResolvedValue(1);

      await UserService.delete(1);

      expect(User.destroy).toHaveBeenCalledWith({ where: { userId: 1 } });
    });
  });

  describe("updateLoginDate", () => {
    it("should update lastLogin to current date", async () => {
      User.update.mockResolvedValue([1]);

      await UserService.updateLoginDate(1);

      expect(User.update).toHaveBeenCalledWith(
        { lastLogin: expect.any(Date) },
        { where: { userId: 1 } }
      );
    });
  });

  describe("setPassword", () => {
    it("should throw if password is missing", async () => {
      await expect(UserService.setPassword(1, "")).rejects.toThrow("Mot de passe manquant");
    });

    it("should throw if password is shorter than 10 characters", async () => {
      await expect(UserService.setPassword(1, "short")).rejects.toThrow(
        "Le mot de passe doit contenir au moins 10 caractères"
      );
    });

    it("should hash and store the new password", async () => {
      User.update.mockResolvedValue([1]);

      await UserService.setPassword(1, "newpassword123");

      expect(User.update).toHaveBeenCalledWith(
        { password: expect.any(String) },
        { where: { userId: 1 } }
      );
    });
  });
});
