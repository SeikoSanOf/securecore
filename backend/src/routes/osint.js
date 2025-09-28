// backend/src/routes/osint.js
const express = require('express');
const router = express.Router();

// Stockage temporaire des scans (en mémoire)
const scans = {};

/**
 * POST /api/osint/scan
 * Lance un scan OSINT sur une cible
 */
router.post('/scan', (req, res) => {
  const { target, scanType } = req.body;
  if (!target || !scanType) return res.status(400).json({ error: "Target et scanType requis" });

  const scanId = `scan_${Date.now()}`;
  scans[scanId] = {
    scanId,
    target,
    scanType,
    status: 'in_progress',
    findings: null,
    startedAt: new Date()
  };

  // Simuler un scan async
  setTimeout(() => {
    scans[scanId].status = 'completed';
    scans[scanId].findings = {
      emails: ['admin@' + target, 'info@' + target],
      domains: [target, 'mail.' + target],
      socialMedia: ['@' + target + '_official'],
      technologies: ['Apache', 'PHP', 'MySQL'],
      vulnerabilities: Math.floor(Math.random() * 5),
      riskScore: (Math.random() * 10).toFixed(1)
    };
    scans[scanId].completedAt = new Date();
  }, 5000); // 5s pour simulation

  res.json({
    success: true,
    scanId,
    message: 'OSINT scan initié',
    estimatedTime: '5-10 secondes'
  });
});

/**
 * GET /api/osint/results/:scanId
 * Récupère les résultats d’un scan
 */
router.get('/results/:scanId', (req, res) => {
  const { scanId } = req.params;
  const scan = scans[scanId];
  if (!scan) return res.status(404).json({ error: 'Scan introuvable' });

  res.json(scan);
});

module.exports = router;
