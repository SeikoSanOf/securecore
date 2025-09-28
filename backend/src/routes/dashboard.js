const express = require("express");
const router = express.Router();
const { pool } = require("../config/database");
const authMiddleware = require("../middleware/auth");

// -------------------------
// GET /api/dashboard/metrics
// Exemple : renvoyer quelques infos globales
// -------------------------
router.get("/metrics", authMiddleware, async (req, res) => {
  try {
    const usersCount = await pool.query("SELECT COUNT(*) FROM users");
    const reportsCount = await pool.query("SELECT COUNT(*) FROM pentest_reports");
    const passwordsCount = await pool.query("SELECT COUNT(*) FROM password_entries");

    res.json({
      users: parseInt(usersCount.rows[0].count, 10),
      reports: parseInt(reportsCount.rows[0].count, 10),
      passwords: parseInt(passwordsCount.rows[0].count, 10),
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erreur serveur" });
  }
});

// -------------------------
// GET /api/dashboard/stats
// Exemple : stats d’activité (mock pour l’instant)
// -------------------------
router.get("/stats", authMiddleware, async (req, res) => {
  try {
    // Exemple fictif : stats par semaine
    const stats = {
      weeklyLogins: [12, 18, 25, 30, 22, 15, 9],
      pentestsRun: [1, 3, 0, 4, 2, 5, 1],
      passwordGenerated: [5, 2, 6, 8, 4, 3, 7],
    };

    res.json(stats);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erreur serveur" });
  }
});

module.exports = router;
