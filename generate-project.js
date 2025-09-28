#!/usr/bin/env node

import fs from 'fs';
import path from 'path';

// Project structure and file contents
const projectFiles = {
  'package.json': `{
  "name": "securecore-backend",
  "version": "1.0.0",
  "description": "SecureCore Backend API",
  "main": "src/app.js",
  "scripts": {
    "start": "node src/app.js",
    "dev": "nodemon src/app.js",
    "test": "echo \\"Error: no test specified\\" && exit 1"
  },
  "keywords": ["security", "pentest", "password-manager"],
  "author": "",
  "license": "ISC",
  "dependencies": {
    "express": "^4.18.0",
    "pg": "^8.11.0",
    "bcryptjs": "^2.4.3",
    "jsonwebtoken": "^9.0.0",
    "cors": "^2.8.5",
    "helmet": "^7.0.0",
    "dotenv": "^16.0.0",
    "express-rate-limit": "^6.7.0",
    "joi": "^17.9.0"
  },
  "devDependencies": {
    "nodemon": "^2.0.22"
  }
}`,

  '.env': `DATABASE_URL=postgresql://securecore_user:securecore_password@localhost:5432/securecore_db
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
NODE_ENV=development
PORT=3000
FRONTEND_URL=http://localhost:5173
ENCRYPTION_KEY=32-char-encryption-key-change-it`,

  '.env.example': `# Database Configuration
DATABASE_URL=postgresql://securecore_user:securecore_password@localhost:5432/securecore_db

# Authentication
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
ENCRYPTION_KEY=32-char-encryption-key-change-it

# Server Configuration
NODE_ENV=development
PORT=3000

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:5173

# Optional: Redis URL (for caching and sessions)
REDIS_URL=redis://localhost:6379`,

  '.gitignore': `# Dependencies
node_modules/
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Environment variables
.env
.env.local
.env.production
.env.test

# Logs
logs/
*.log

# Runtime data
pids/
*.pid
*.seed
*.pid.lock

# Coverage directory
coverage/
*.lcov

# Dependency directories
jspm_packages/

# Optional npm cache directory
.npm

# Optional eslint cache
.eslintcache

# IDE files
.vscode/
.idea/
*.swp
*.swo

# OS generated files
.DS_Store
.DS_Store?
._*
Thumbs.db

# Uploads and temporary files
uploads/
temp/
tmp/

# Build artifacts
dist/
build/`,

  'Dockerfile': `FROM node:18-alpine

# Set working directory
WORKDIR /app

# Install system dependencies
RUN apk add --no-cache \\
    postgresql-client \\
    curl \\
    && rm -rf /var/cache/apk/*

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production && \\
    npm cache clean --force

# Create non-root user
RUN addgroup -g 1001 -S nodejs && \\
    adduser -S securecore -u 1001 -G nodejs

# Copy application code
COPY --chown=securecore:nodejs . .

# Switch to non-root user
USER securecore

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \\
    CMD curl -f http://localhost:3000/health || exit 1

# Start command
CMD ["npm", "start"]`,

  'docker-compose.yml': `version: '3.8'

services:
  # PostgreSQL Database
  postgres:
    image: postgres:15-alpine
    container_name: securecore_postgres
    restart: unless-stopped
    environment:
      POSTGRES_DB: securecore_db
      POSTGRES_USER: securecore_user
      POSTGRES_PASSWORD: securecore_password
      PGDATA: /var/lib/postgresql/data/pgdata
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ./init.sql:/docker-entrypoint-initdb.d/init.sql:ro
    ports:
      - "5432:5432"
    networks:
      - securecore_network
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U securecore_user -d securecore_db"]
      interval: 10s
      timeout: 5s
      retries: 5

  # SecureCore Backend
  backend:
    build: .
    container_name: securecore_backend
    restart: unless-stopped
    depends_on:
      postgres:
        condition: service_healthy
    environment:
      DATABASE_URL: postgresql://securecore_user:securecore_password@postgres:5432/securecore_db
      JWT_SECRET: your-super-secret-jwt-key-change-this-in-production-docker
      NODE_ENV: production
      PORT: 3000
      FRONTEND_URL: http://localhost:5173
      ENCRYPTION_KEY: docker-32-char-encryption-key-!!
    ports:
      - "3000:3000"
    networks:
      - securecore_network
    volumes:
      - ./logs:/app/logs
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:3000/health"]
      interval: 30s
      timeout: 10s
      retries: 3

  # Redis for caching (optional)
  redis:
    image: redis:7-alpine
    container_name: securecore_redis
    restart: unless-stopped
    ports:
      - "6379:6379"
    networks:
      - securecore_network
    volumes:
      - redis_data:/data
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]
      interval: 10s
      timeout: 5s
      retries: 5

volumes:
  postgres_data:
    driver: local
  redis_data:
    driver: local

networks:
  securecore_network:
    driver: bridge`,

  'init.sql': `-- SecureCore Database Initialization Script
-- This script creates the necessary tables and indexes

-- Enable UUID extension if needed
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(255) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(50) DEFAULT 'user',
    is_verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Pentest reports table
CREATE TABLE IF NOT EXISTS pentest_reports (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    target_url VARCHAR(500) NOT NULL,
    scan_type VARCHAR(100) NOT NULL,
    status VARCHAR(50) DEFAULT 'pending',
    results JSONB,
    risk_score INTEGER,
    vulnerabilities_found INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP
);

-- Password entries table
CREATE TABLE IF NOT EXISTS password_entries (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    site_name VARCHAR(255) NOT NULL,
    site_url VARCHAR(500),
    username VARCHAR(255),
    encrypted_password TEXT NOT NULL,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Notifications table
CREATE TABLE IF NOT EXISTS notifications (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    type VARCHAR(50) DEFAULT 'info',
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);
CREATE INDEX IF NOT EXISTS idx_pentest_reports_user_id ON pentest_reports(user_id);
CREATE INDEX IF NOT EXISTS idx_pentest_reports_status ON pentest_reports(status);
CREATE INDEX IF NOT EXISTS idx_pentest_reports_created_at ON pentest_reports(created_at);
CREATE INDEX IF NOT EXISTS idx_password_entries_user_id ON password_entries(user_id);
CREATE INDEX IF NOT EXISTS idx_password_entries_site_name ON password_entries(site_name);
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_is_read ON notifications(is_read);
CREATE INDEX IF NOT EXISTS idx_notifications_created_at ON notifications(created_at);

-- Create triggers for updated_at columns
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_users_updated_at 
    BEFORE UPDATE ON users 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_password_entries_updated_at 
    BEFORE UPDATE ON password_entries 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();`
};

// Source code files (truncated for brevity - you would include all the full files here)
const srcFiles = {
  'src/app.js': `const express = require('express');
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
  origin: ['http://localhost:5173', 'https://your-lovable-domain.lovable.app'],
  credentials: true
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP'
});
app.use(limiter);

// Body parser middleware
app.use(express.json({ limit: '10mb' }));
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
    const scanId = \`osint_\${Date.now()}\`;
    
    // Simulate OSINT scan
    setTimeout(() => {
      console.log(\`OSINT scan completed for \${target}\`);
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
  console.log(\`SecureCore backend running on port \${PORT}\`);
  console.log(\`Environment: \${process.env.NODE_ENV}\`);
});`,
  
  // Add other source files here...
};

// Function to create directory structure and files
function createProject() {
  const baseDir = 'backend';
  
  // Create base directory
  if (!fs.existsSync(baseDir)) {
    fs.mkdirSync(baseDir, { recursive: true });
  }

  // Create src directory structure
  const directories = [
    'src',
    'src/config',
    'src/models',
    'src/routes',
    'src/middleware',
    'logs'
  ];

  directories.forEach(dir => {
    const fullPath = path.join(baseDir, dir);
    if (!fs.existsSync(fullPath)) {
      fs.mkdirSync(fullPath, { recursive: true });
    }
  });

  // Create root files
  Object.entries(projectFiles).forEach(([filename, content]) => {
    const filePath = path.join(baseDir, filename);
    fs.writeFileSync(filePath, content, 'utf8');
    console.log("✅ Created " + filename);
  });

  // Create source files
  Object.entries(srcFiles).forEach(([filename, content]) => {
    const filePath = path.join(baseDir, filename);
    const dir = path.dirname(filePath);
    
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    
    fs.writeFileSync(filePath, content, 'utf8');
    console.log("✅ Created " + filename);
  });

  console.log("\n🎉 Project SecureCore Backend created successfully!");
console.log("\n📁 Project structure:");
console.log("backend/");
console.log("├── src/");
console.log("│   ├── config/");
console.log("│   ├── models/");
console.log("│   ├── routes/");
console.log("│   ├── middleware/");
console.log("│   └── app.js");
console.log("├── package.json");
console.log("├── .env");
console.log("├── Dockerfile");
console.log("└── docker-compose.yml");

console.log("\n🚀 Next steps:");
console.log("1. cd backend");
console.log("2. npm install");
console.log("3. Configure your .env file");
console.log("4. npm run dev");
}

// Run the project generator
createProject();