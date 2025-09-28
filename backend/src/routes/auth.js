const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { pool } = require("../config/database");
const authMiddleware = require("../middleware/auth");

// -------------------------
// POST /api/auth/register
// -------------------------
router.post("/register", async (req, res) => {
  try {
    const { username, email, password } = req.body;
    if (!username || !email || !password)
      return res.status(400).json({ error: "Tous les champs sont requis" });

    // Vérifier si l'email existe déjà
    const exists = await pool.query("SELECT id FROM users WHERE email = $1", [email]);
    if (exists.rows.length > 0) {
      return res.status(400).json({ error: "Email déjà utilisé" });
    }

    // Hasher le mot de passe
    const hashedPassword = await bcrypt.hash(password, 10);

    // Ajouter l'utilisateur
    const result = await pool.query(
      "INSERT INTO users (name, email, password_hash, role) VALUES ($1, $2, $3, $4) RETURNING id, name, email, role",
      [username, email, hashedPassword, "user"]
    );

    const newUser = result.rows[0];

    // Générer un token JWT
    const token = jwt.sign(
      { userId: newUser.id, email: newUser.email, role: newUser.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.status(201).json({ user: newUser, token });
  } catch (err) {
    console.error("❌ Erreur register backend:", err);
    res.status(500).json({ error: "Erreur serveur" });
  }
});


// -------------------------
// POST /api/auth/login
// -------------------------
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ error: "Email et mot de passe requis" });

    const result = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
    if (result.rows.length === 0)
      return res.status(401).json({ error: "Identifiants invalides" });
    
    const user = result.rows[0];
    if (!user.is_verified) {
      return res.status(403).json({ error: "Compte non vérifié. Vérifiez votre email." });
    }
    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid)
      return res.status(401).json({ error: "Identifiants invalides" });

    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );


    // Renvoi de l'objet user + token
    res.json({
      user: {
        id: user.id,
        name: user.name,       // important !
        email: user.email,
        role: user.role,
        is_verified: user.is_verified,
      },
      token,
    });

  } catch (err) {
    console.error("❌ Erreur login backend:", err);
    res.status(500).json({ error: "Erreur serveur" });
  }
});



router.get("/check-user", async (req, res) => {
  const { email } = req.query;
  try {
    const result = await pool.query("SELECT id FROM users WHERE email = $1", [email]);
    if (result.rows.length > 0) {
      res.status(200).send();
    } else {
      res.status(404).send();
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erreur serveur" });
  }
});

// -------------------------
// POST /api/auth/verify-email
// -------------------------
router.post("/verify-email", async (req, res) => {
  const { email } = req.body;
  res.json({ message: `Email ${email} vérifié (mock)` });
});

// -------------------------
// POST /api/auth/logout
// -------------------------
router.post("/logout", (req, res) => {
  res.json({ message: "Déconnexion réussie (supprimez le token côté client)" });
});

// -------------------------
// GET /api/auth/me
// -------------------------
router.get("/me", authMiddleware, async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT id, username, email, created_at FROM users WHERE id = $1",
      [req.user.userId]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Utilisateur introuvable" });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erreur serveur" });
  }
});

module.exports = router;
