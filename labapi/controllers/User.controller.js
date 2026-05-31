const userService = require("../services/User.service");
const jwt = require("jsonwebtoken");

exports.register = async (req, res) => {
  try {
    const { name, password, email } = req.body;
    await userService.create({ name, email, password });
    res.status(201).send({ message: "Utilisateur inscrit avec succès." });
  } catch (error) {
    const message = error?.message || "Erreur lors de l'inscription.";
    const isConflict =
      typeof message === "string" &&
      (message.toLowerCase().includes("utilis") || message.toLowerCase().includes("exist"));

    console.error(message);
    res.status(isConflict ? 400 : 500).send({ message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await userService.findByEmail(email);
    if (!user) return res.status(404).send({ message: "Utilisateur introuvable." });

    const isPasswordValid = await userService.verifyPassword(user.userId, password);
    if (!isPasswordValid) return res.status(401).send({ message: "Mot de passe incorrect." });

    const token = jwt.sign(
      { id: user.userId, name: user.name, email: user.email },
      process.env.AUTH_JWT_SECRET,
      { expiresIn: process.env.AUTH_JWT_EXPIRES_IN }
    );

    await userService.updateLoginDate(user.userId);

    res.status(200).send({ token });
  } catch (error) {
    console.error(error?.message || error);
    res.status(500).send({ message: "Erreur lors de la connexion." });
  }
};

exports.verifyEmail = async (req, res) => {
  const { email, code } = req.body;
  try {
    const user = await userService.findByEmail(email);
    if (!user) return res.status(404).send({ message: "Utilisateur introuvable." });

    const isValid = await userService.verifyValidEmailCode(user.userId, code);
    if (!isValid) return res.status(401).send({ message: "Code invalide." });

    await userService.update(user.userId, { hasValidatedEmail: true });

    res.status(200).send({ message: "Email vérifié avec succès." });
  } catch (error) {
    console.error(error?.message || error);
    res.status(500).send({ message: "Erreur lors de la vérification de l'email." });
  }
};

exports.forgotPassword = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await userService.findByEmail(email);
    if (!user) return res.status(404).send({ message: "Utilisateur introuvable." });

    await userService.setResetPasswordCode(user.userId);
    // TODO: envoyer le code par email (helpers/sendEmail.js)

    res.status(200).send({ message: "Code de réinitialisation envoyé avec succès." });
  } catch (error) {
    console.error(error?.message || error);
    res.status(500).send({ message: "Erreur lors de l'envoi du code de réinitialisation." });
  }
};

exports.resetPassword = async (req, res) => {
  const { email, code, newPassword } = req.body;
  try {
    const user = await userService.findByEmail(email);
    if (!user) return res.status(404).send({ message: "Utilisateur introuvable." });

    const isValid = await userService.verifyResetPasswordCode(user.userId, code);
    if (!isValid) return res.status(401).send({ message: "Code invalide." });

    await userService.setPassword(user.userId, newPassword);

    res.status(200).send({ message: "Mot de passe réinitialisé avec succès." });
  } catch (error) {
    console.error(error?.message || error);
    res.status(500).send({ message: "Erreur lors de la réinitialisation du mot de passe." });
  }
};

exports.findOne = async (req, res) => {
  try {
    const user = await userService.findOne(req.params.id);
    if (!user) return res.status(404).send({ message: "Utilisateur introuvable." });
    res.status(200).send(user);
  } catch (error) {
    console.error(error?.message || error);
    res.status(500).send({ message: "Erreur serveur." });
  }
};

exports.update = async (req, res) => {
  try {
    const updatedUser = await userService.update(req.params.id, req.body);
    res.status(200).send(updatedUser);
  } catch (error) {
    console.error(error?.message || error);
    res.status(500).send({ message: "Erreur lors de la mise à jour de l'utilisateur." });
  }
};

exports.changePassword = async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  try {
    const user = await userService.findOne(req.params.id);
    if (!user) return res.status(404).send({ message: "Utilisateur introuvable." });

    const isPasswordValid = await userService.verifyPassword(user.userId, oldPassword);
    if (!isPasswordValid) return res.status(401).send({ message: "Mot de passe incorrect." });

    await userService.setPassword(user.userId, newPassword);

    res.status(200).send({ message: "Mot de passe modifié avec succès." });
  } catch (error) {
    console.error(error?.message || error);
    res.status(500).send({ message: "Erreur lors de la modification du mot de passe." });
  }
};

exports.delete = async (req, res) => {
  try {
    await userService.delete(req.params.id);
    res.status(200).send({ message: "Utilisateur supprimé avec succès." });
  } catch (error) {
    console.error(error?.message || error);
    res.status(500).send({ message: "Erreur lors de la suppression de l'utilisateur." });
  }
};
