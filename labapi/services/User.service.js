const { User } = require("../models/index");
const bcrypt = require("bcryptjs");
const generateCode = require("../helpers/generateCode");

class UserService {
  /**
   * Retourne tous les utilisateurs sans leur mot de passe.
   *
   * @returns {Promise<Object[]>}
   */
  async findAll() {
    const users = await User.findAll();
    return users.map((user) => {
      const { password, ...userWithoutPassword } = user?.dataValues || user;
      return userWithoutPassword;
    });
  }

  /**
   * Retourne un utilisateur par email, sans son mot de passe.
   *
   * @param {string} email
   * @returns {Promise<Object|null>}
   */
  async findByEmail(email) {
    const user = await User.findOne({ where: { email } });
    if (!user) return null;
    const { password, ...userWithoutPassword } = user?.dataValues || user;
    return userWithoutPassword;
  }

  /**
   * Retourne un utilisateur par son ID, sans son mot de passe.
   *
   * @param {number} userId
   * @returns {Promise<Object|null>}
   */
  async findOne(userId) {
    const user = await User.findByPk(userId);
    if (!user) return null;
    const { password, ...userWithoutPassword } = user?.dataValues || user;
    return userWithoutPassword;
  }

  /**
   * Crée un nouvel utilisateur avec mot de passe hashé.
   *
   * @param {{ email: string, name: string, password: string }} userData
   * @returns {Promise<Object>}
   * @throws {Error} Si l'email est déjà utilisé ou si des champs sont manquants.
   */
  async create(userData) {
    if (await this.findByEmail(userData.email)) throw new Error("Email déjà utilisé");
    if (!userData.name || !userData.password || !userData.email) throw new Error("Champs manquants");

    userData.password = await bcrypt.hash(userData.password, 10);

    const newUser = await User.create(userData);
    if (!newUser) throw new Error("Erreur lors de la création de l'utilisateur");

    const { password, ...userWithoutPassword } = newUser?.dataValues || newUser;
    return userWithoutPassword;
  }

  /**
   * Met à jour les données d'un utilisateur.
   *
   * @param {number} userId
   * @param {Object} userData
   * @returns {Promise<Object>}
   */
  async update(userId, userData) {
    await User.update(userData, { where: { userId } });
    return this.findOne(userId);
  }

  /**
   * Supprime un utilisateur.
   *
   * @param {number} userId
   * @returns {Promise<void>}
   */
  async delete(userId) {
    await User.destroy({ where: { userId } });
  }

  /**
   * Met à jour la date de dernière connexion.
   *
   * @param {number} userId
   * @returns {Promise<void>}
   */
  async updateLoginDate(userId) {
    await User.update({ lastLogin: new Date() }, { where: { userId } });
  }

  /**
   * Vérifie si un mot de passe en clair correspond au hash stocké.
   *
   * @param {number} userId
   * @param {string} password
   * @returns {Promise<boolean>}
   */
  async verifyPassword(userId, password) {
    const user = await User.findByPk(userId);
    return bcrypt.compare(password, user.password);
  }

  /**
   * Remplace le mot de passe d'un utilisateur.
   *
   * @param {number} userId
   * @param {string} password - Nouveau mot de passe en clair (min 10 caractères).
   * @returns {Promise<void>}
   * @throws {Error} Si le mot de passe est absent ou trop court.
   */
  async setPassword(userId, password) {
    if (!password) throw new Error("Mot de passe manquant");
    if (password.length < 10) throw new Error("Le mot de passe doit contenir au moins 10 caractères");

    const hashedPassword = await bcrypt.hash(password, 10);
    await User.update({ password: hashedPassword }, { where: { userId } });
  }

  /**
   * Génère et stocke un code de validation d'email.
   *
   * @param {number} userId
   * @param {string|number} [code] - Code à stocker. Généré automatiquement si absent.
   * @returns {Promise<void>}
   */
  async setValidEmailCode(userId, code = "") {
    if (!code) code = generateCode();
    await User.update({ validEmailCode: String(code) }, { where: { userId } });
  }

  /**
   * Vérifie le code de validation d'email puis l'efface.
   *
   * @param {number} userId
   * @param {string} code
   * @returns {Promise<boolean>}
   */
  async verifyValidEmailCode(userId, code) {
    const user = await User.findByPk(userId);
    const isValid = String(user.validEmailCode) === String(code);
    user.validEmailCode = null;
    await user.save();
    return isValid;
  }

  /**
   * Efface le code de validation d'email.
   *
   * @param {number} userId
   * @returns {Promise<void>}
   */
  async clearValidEmailCode(userId) {
    await User.update({ validEmailCode: null }, { where: { userId } });
  }

  /**
   * Génère et stocke un code de réinitialisation de mot de passe.
   *
   * @param {number} userId
   * @param {string|number} [code] - Code à stocker. Généré automatiquement si absent.
   * @returns {Promise<void>}
   */
  async setResetPasswordCode(userId, code = "") {
    if (!code) code = generateCode();
    await User.update({ resetPasswordCode: Number(code) }, { where: { userId } });
  }

  /**
   * Vérifie le code de réinitialisation de mot de passe puis l'efface.
   *
   * @param {number} userId
   * @param {string|number} code
   * @returns {Promise<boolean>}
   */
  async verifyResetPasswordCode(userId, code) {
    const user = await User.findByPk(userId);
    const isValid = Number(user.resetPasswordCode) === Number(code);
    user.resetPasswordCode = null;
    await user.save();
    return isValid;
  }

  /**
   * Efface le code de réinitialisation de mot de passe.
   *
   * @param {number} userId
   * @returns {Promise<void>}
   */
  async clearResetPasswordCode(userId) {
    await User.update({ resetPasswordCode: null }, { where: { userId } });
  }

  /**
   * Efface tous les codes temporaires (validation email + reset password).
   *
   * @param {number} userId
   * @returns {Promise<void>}
   */
  async clearAllCodes(userId) {
    await this.clearValidEmailCode(userId);
    await this.clearResetPasswordCode(userId);
  }
}

module.exports = new UserService();
