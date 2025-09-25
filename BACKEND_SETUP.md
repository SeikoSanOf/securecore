# Configuration Backend PostgreSQL pour SecureCore MVP

## Vue d'ensemble

Ce guide vous aidera à configurer votre propre backend avec PostgreSQL pour le projet SecureCore MVP.

## Architecture

```
Frontend (Lovable) ↔ Backend API (Node.js/Express) ↔ PostgreSQL (Docker)
```

## 1. Configuration Docker PostgreSQL

Créez un fichier `docker-compose.yml` :

```yaml
version: '3.8'
services:
  postgres:
    image: postgres:15
    environment:
      POSTGRES_DB: securecore_db
      POSTGRES_USER: securecore_user
      POSTGRES_PASSWORD: securecore_password
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ./init.sql:/docker-entrypoint-initdb.d/init.sql
    restart: unless-stopped

  adminer:
    image: adminer
    restart: unless-stopped
    ports:
      - "8080:8080"

volumes:
  postgres_data:
```

## 2. Schema de Base de Données

Créez un fichier `init.sql` :

```sql
-- Users table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(50) DEFAULT 'user' CHECK (role IN ('admin', 'analyst', 'user')),
    email_verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP
);

-- Pentest reports table
CREATE TABLE pentest_reports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    type VARCHAR(50) NOT NULL CHECK (type IN ('web_scan', 'network_scan', 'ssl_scan', 'api_scan')),
    target VARCHAR(255) NOT NULL,
    status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'running', 'completed', 'failed')),
    findings JSONB DEFAULT '[]',
    severity_summary JSONB DEFAULT '{"critical":0,"high":0,"medium":0,"low":0,"info":0}',
    raw_data JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP
);

-- Password entries table
CREATE TABLE password_entries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    username VARCHAR(255) NOT NULL,
    password_encrypted TEXT NOT NULL,
    website VARCHAR(255),
    notes TEXT,
    strength_score INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_accessed TIMESTAMP
);

-- Notifications table
CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    type VARCHAR(50) DEFAULT 'info' CHECK (type IN ('info', 'warning', 'error', 'success')),
    read BOOLEAN DEFAULT FALSE,
    action_url VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Dashboard metrics table
CREATE TABLE dashboard_metrics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    metric_type VARCHAR(100) NOT NULL,
    value INTEGER NOT NULL,
    max_value INTEGER,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- OSINT results table
CREATE TABLE osint_results (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    target VARCHAR(255) NOT NULL,
    type VARCHAR(50) NOT NULL CHECK (type IN ('domain', 'email', 'ip', 'social_media')),
    source VARCHAR(255) NOT NULL,
    data JSONB NOT NULL,
    confidence DECIMAL(3,2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_pentest_reports_user_id ON pentest_reports(user_id);
CREATE INDEX idx_password_entries_user_id ON password_entries(user_id);
CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_dashboard_metrics_user_id ON dashboard_metrics(user_id);
CREATE INDEX idx_osint_results_user_id ON osint_results(user_id);
```

## 3. Configuration Backend API

### Structure recommandée :

```
backend/
├── src/
│   ├── config/
│   │   ├── database.js
│   │   └── auth.js
│   ├── models/
│   │   ├── User.js
│   │   ├── PentestReport.js
│   │   └── PasswordEntry.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── dashboard.js
│   │   ├── pentest.js
│   │   ├── passwords.js
│   │   └── notifications.js
│   ├── middleware/
│   │   ├── auth.js
│   │   └── validation.js
│   └── app.js
├── package.json
└── .env
```

### Dépendances Node.js recommandées :

```json
{
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
  }
}
```

## 4. Endpoints API Requis

Le frontend attend ces endpoints (voir `src/services/api.ts`) :

### Authentification
- `POST /api/auth/login`
- `POST /api/auth/register`
- `POST /api/auth/verify-email`
- `POST /api/auth/logout`
- `GET /api/auth/me`

### Dashboard
- `GET /api/dashboard/metrics`
- `GET /api/dashboard/stats`

### Pentest
- `GET /api/pentest/reports`
- `GET /api/pentest/reports/:id`
- `POST /api/pentest/scan`
- `POST /api/pentest/scan/:id/stop`
- `GET /api/pentest/reports/:id/export`

### Password Manager
- `GET /api/passwords`
- `POST /api/passwords`
- `PUT /api/passwords/:id`
- `DELETE /api/passwords/:id`
- `POST /api/passwords/check-breach`
- `POST /api/passwords/generate`

### Notifications
- `GET /api/notifications`
- `POST /api/notifications/:id/read`
- `POST /api/notifications/read-all`

### OSINT
- `POST /api/osint/scan`
- `GET /api/osint/results/:scanId`

## 5. Configuration CORS

```javascript
app.use(cors({
  origin: ['http://localhost:5173', 'https://your-lovable-domain.lovable.app'],
  credentials: true
}));
```

## 6. Variables d'Environnement

Créez un fichier `.env` :

```env
DATABASE_URL=postgresql://securecore_user:securecore_password@localhost:5432/securecore_db
JWT_SECRET=your-super-secret-jwt-key
NODE_ENV=development
PORT=3000
FRONTEND_URL=http://localhost:5173
```

## 7. Configuration Frontend

Modifiez la variable `API_BASE_URL` dans `src/services/api.ts` :

```typescript
const API_BASE_URL = 'http://localhost:3000/api'; // Votre backend local
```

## 8. Commandes de Démarrage

```bash
# Démarrer PostgreSQL
docker-compose up -d

# Installer les dépendances backend
npm install

# Démarrer le backend
npm run dev

# Le frontend Lovable sera accessible sur son URL habituelle
```

## 9. Sécurité Recommandée

- Hachage des mots de passe avec bcrypt
- Tokens JWT avec expiration
- Rate limiting sur les endpoints sensibles
- Validation des entrées avec Joi
- Headers de sécurité avec Helmet
- Chiffrement AES pour les mots de passe stockés

## 10. Tests et Debug

- Utilisez Adminer (http://localhost:8080) pour gérer la DB
- Testez les endpoints avec Postman ou curl
- Les logs backend apparaîtront dans la console

---

**Note** : Ce setup vous permet de développer en local avec votre propre infrastructure tout en gardant le frontend Lovable. Vous pourrez ensuite déployer votre backend sur AWS, Digital Ocean, etc.