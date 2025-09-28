const express = require("express");
const crypto = require("crypto");
const axios = require("axios");
const { pool } = require("../config/database");
const authMiddleware = require("../middleware/auth");

const router = express.Router();

// ---- Utilitaires ----
const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || "default-32-char-secret-key"; // 32 chars
const IV_LENGTH = 16;

function encrypt(text) {
  let iv = crypto.randomBytes(IV_LENGTH);
  let cipher = crypto.createCipheriv("aes-256-cbc", Buffer.from(ENCRYPTION_KEY), iv);
  let encrypted = cipher.update(text);

  encrypted = Buffer.concat([encrypted, cipher.final()]);
  return iv.toString("hex") + ":" + encrypted.toString("hex");
}

function decrypt(text) {
  let parts = text.split(":");
  let iv = Buffer.from(parts.shift(), "hex");
  let encryptedText = Buffer.from(parts.join(":"), "hex");
  let decipher = crypto.createDecipheriv("aes-256-cbc", Buffer.from(ENCRYPTION_KEY), iv);
  let decrypted = decipher.update(encryptedText);

  decrypted = Buffer.concat([decrypted, decipher.final()]);
  return decrypted.toString();
}

// ---- Routes ----

// GET /api/passwords (liste tous les mdp de l’utilisateur)
router.get("/", authMiddleware, async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT id, site_name, site_url, username, encrypted_password, notes, created_at, updated_at FROM password_entries WHERE user_id = $1 ORDER BY created_at DESC",
      [req.user.id]
    );

    const passwords = result.rows.map((row) => ({
      ...row,
      decrypted_password: decrypt(row.encrypted_password),
    }));

    res.json(passwords);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erreur serveur" });
  }
});

// POST /api/passwords (ajout d’un mot de passe)
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { site_name, site_url, username, password, notes } = req.body;

    const encryptedPassword = encrypt(password);

    const result = await pool.query(
      `INSERT INTO password_entries (user_id, site_name, site_url, username, encrypted_password, notes, created_at, updated_at) 
       VALUES ($1, $2, $3, $4, $5, $6, NOW(), NOW()) RETURNING *`,
      [req.user.id, site_name, site_url, username, encryptedPassword, notes]
    );

    res.status(201).json({ message: "Mot de passe ajouté", entry: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erreur serveur" });
  }
});

// PUT /api/passwords/:id (mise à jour)
router.put("/:id", authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const { site_name, site_url, username, password, notes } = req.body;

    const encryptedPassword = password ? encrypt(password) : null;

    const result = await pool.query(
      `UPDATE password_entries 
       SET site_name = COALESCE($1, site_name),
           site_url = COALESCE($2, site_url),
           username = COALESCE($3, username),
           encrypted_password = COALESCE($4, encrypted_password),
           notes = COALESCE($5, notes),
           updated_at = NOW()
       WHERE id = $6 AND user_id = $7
       RETURNING *`,
      [site_name, site_url, username, encryptedPassword, notes, id, req.user.id]
    );

    if (result.rows.length === 0) return res.status(404).json({ error: "Entrée introuvable" });

    res.json({ message: "Mot de passe mis à jour", entry: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erreur serveur" });
  }
});

// DELETE /api/passwords/:id
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      "DELETE FROM password_entries WHERE id = $1 AND user_id = $2 RETURNING id",
      [id, req.user.id]
    );

    if (result.rows.length === 0) return res.status(404).json({ error: "Entrée introuvable" });

    res.json({ message: "Mot de passe supprimé" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erreur serveur" });
  }
});

// POST /api/passwords/check-breach
// Vérifie si le mdp est dans une fuite via HaveIBeenPwned (API K-Anonymity)
router.post("/check-breach", authMiddleware, async (req, res) => {
  try {
    const { password } = req.body;
    const sha1 = crypto.createHash("sha1").update(password).digest("hex").toUpperCase();
    const prefix = sha1.substring(0, 5);
    const suffix = sha1.substring(5);

    const response = await axios.get(`https://api.pwnedpasswords.com/range/${prefix}`);
    const found = response.data.split("\n").some((line) => line.startsWith(suffix));

    res.json({ breached: found });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erreur lors de la vérification" });
  }
});

// POST /api/passwords/generate
// Génère un mdp aléatoire
router.post("/generate", authMiddleware, (req, res) => {
  const { length = 16 } = req.body;
  const charset =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_-+=<>?";

  let password = "";
  for (let i = 0; i < length; i++) {
    const randomIndex = crypto.randomInt(0, charset.length);
    password += charset[randomIndex];
  }

  res.json({ password });
});

module.exports = router;
