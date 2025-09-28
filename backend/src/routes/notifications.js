// backend/src/routes/notifications.js
const express = require('express');
const router = express.Router();

// Exemple de données temporaires
let notifications = [
  { id: 1, message: "Nouvelle alerte de sécurité", read: false },
  { id: 2, message: "Votre rapport pentest est disponible", read: false }
];

/**
 * GET /api/notifications
 * Récupérer toutes les notifications
 */
router.get('/', (req, res) => {
  res.json(notifications);
});

/**
 * POST /api/notifications/:id/read
 * Marquer une notification comme lue
 */
router.post('/:id/read', (req, res) => {
  const { id } = req.params;
  const notif = notifications.find(n => n.id === parseInt(id));
  if (!notif) return res.status(404).json({ message: "Notification non trouvée" });

  notif.read = true;
  res.json({ message: "Notification marquée comme lue", notification: notif });
});

/**
 * POST /api/notifications/read-all
 * Marquer toutes les notifications comme lues
 */
router.post('/read-all', (req, res) => {
  notifications = notifications.map(n => ({ ...n, read: true }));
  res.json({ message: "Toutes les notifications ont été marquées comme lues", notifications });
});

module.exports = router;
