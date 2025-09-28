const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

// Import routes
const authRoutes = require('./routes/auth');
const dashboardRoutes = require('./routes/dashboard');
const pentestRoutes = require('./routes/pentest');
const passwordRoutes = require('./routes/passwords');
const notificationRoutes = require('./routes/notifications');

const app = express();
const PORT = process.env.PORT || 3000;

// Security middleware
app.use(helmet());

// CORS configuration
app.use(cors({
  origin: "http://localhost:8080", // URL de ton front
  credentials: true,
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP'
});
app.use(limiter);

// Body parser middleware
app.use(express.json({})); //limit: '10mb'
app.use(express.urlencoded({ extended: true }));

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/pentest', pentestRoutes);
app.use('/api/passwords', passwordRoutes);
app.use('/api/notifications', notificationRoutes);

// OSINT routes (inline as they're simple)
app.post('/api/osint/scan', async (req, res) => {
  try {
    const { target, scanType } = req.body;
    const scanId = `osint_${Date.now()}`;
    
    // Simulate OSINT scan
    setTimeout(() => {
      console.log(`OSINT scan completed for ${target}`);
    }, 5000);
    
    res.json({ 
      success: true, 
      scanId, 
      message: 'OSINT scan initiated',
      estimatedTime: '5-10 minutes'
    });
  } catch (error) {
    res.status(500).json({ error: 'OSINT scan failed' });
  }
});

app.get('/api/osint/results/:scanId', async (req, res) => {
  try {
    const { scanId } = req.params;
    
    // Mock results
    const results = {
      scanId,
      status: 'completed',
      findings: {
        emails: ['admin@target.com', 'info@target.com'],
        domains: ['target.com', 'mail.target.com'],
        socialMedia: ['@target_official'],
        technologies: ['Apache', 'PHP', 'MySQL'],
        vulnerabilities: 2,
        riskScore: 7.5
      },
      completedAt: new Date().toISOString()
    };
    
    res.json(results);
  } catch (error) {
    res.status(500).json({ error: 'Failed to get OSINT results' });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

app.listen(PORT, () => {
  console.log(`SecureCore backend running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV}`);
});