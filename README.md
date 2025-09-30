# SecureCore MVP - Installation Guide

## 🚀 Installation Rapide

### Prérequis
- Node.js 18+ ([installer avec nvm](https://github.com/nvm-sh/nvm#installing-and-updating))
- PostgreSQL 13+ (optionnel, pour backend)
- Git

### 1. Cloner le projet
```bash
git clone https://github.com/SeikoSanOf/securecore.git
cd securecore
```

### 2. Installer les dépendances
```bash
npm install
```

### 3. Démarrer en mode développement
```bash
npm run dev
```
L'application sera disponible sur http://localhost:8080

## 🎯 Modes de Fonctionnement

### Mode Mock (par défaut)
L'application utilise automatiquement des données fictives pour tester toutes les fonctionnalités :
- ✅ Authentification simulée
- ✅ Dashboard avec métriques temps réel
- ✅ Password Manager complet
- ✅ Pentest Suite avec rapports
- ✅ Module OSINT avancé
- ✅ Système de notifications

**Connexion :** Utilisez n'importe quel email/mot de passe

### Mode Backend PostgreSQL

#### Configuration de la base de données
1. **Installer PostgreSQL** (si pas déjà fait)
```bash
# macOS
brew install postgresql
brew services start postgresql

# Ubuntu/Debian
sudo apt update && sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql

# Windows
# Téléchargez depuis https://www.postgresql.org/download/
```

2. **Créer la base de données**
```bash
sudo -u postgres psql
CREATE DATABASE securecore_dev;
CREATE USER securecore_user WITH PASSWORD 'votre_mot_de_passe';
GRANT ALL PRIVILEGES ON DATABASE securecore_dev TO securecore_user;
\q
```

3. **Configuration avec Docker (alternative)**
```bash
docker-compose -f docker-compose.dev.yml up -d
```

4. **Variables d'environnement**
Créez un fichier `.env.local` :
```env
VITE_API_URL=http://localhost:3000/api
```

5. **Schéma de base** 
Consultez `BACKEND_SETUP.md` pour le schéma SQL complet.

## 📁 Structure du Projet

```
securecore-mvp/
├── src/
│   ├── components/          # Composants UI réutilisables
│   ├── pages/              # Pages principales
│   ├── services/           # Services API et données mock
│   ├── hooks/              # Hooks React personnalisés
│   ├── contexts/           # Contexts React (Auth, etc.)
│   └── types/              # Types TypeScript
├── public/                 # Assets statiques
└── docs/                   # Documentation
```

## 🔧 Scripts Disponibles

```bash
# Développement
npm run dev              # Serveur de dev avec hot reload

# Build
npm run build           # Build de production
npm run preview         # Preview du build

# Qualité de code
npm run lint            # ESLint
npm run type-check      # Vérification TypeScript
```

## 🌟 Fonctionnalités Principales

### 📊 Dashboard
- Métriques de sécurité temps réel
- Graphiques d'activité interactifs
- Quick Actions vers modules principaux
- Status système et alertes

### 🔐 Password Manager
- CRUD complet des mots de passe
- Générateur de mots de passe sécurisés
- Vérification de compromission (Have I Been Pwned)
- Import/Export chiffrés

### 🎯 Pentest Suite
- 25+ types de scans (Nmap, SQLMap, OSINT, etc.)
- Rapports détaillés avec niveaux de sévérité
- Générateur de reverse shells
- Export JSON/PDF

### 🔍 Module OSINT
- 8 sources d'intelligence différentes
- Recherche domaines, emails, réseaux sociaux
- Dark Web monitoring
- Export des résultats

### 🔔 Notifications
- Alertes temps réel
- Système de notifications push
- Historique complet

## 🚀 Déploiement`

### Build Manuel
```bash
npm run build
# Upload du dossier dist/ vers votre serveur
```

## 🔒 Sécurité

- **Authentification :** JWT avec refresh tokens
- **Chiffrement :** AES-256 pour données sensibles  
- **HTTPS :** Obligatoire en production
- **CSP :** Content Security Policy configuré
- **Rate Limiting :** Protection contre brute force

## 🧪 Tests

```bash
# Tests unitaires (à venir)
npm run test

# Tests E2E (à venir)  
npm run test:e2e
```

## 📖 Documentation

- [Guide de Développement](DEVELOPMENT_GUIDE.md)
- [Configuration Backend](BACKEND_SETUP.md)
- [API Documentation](docs/API.md) (à venir)

## 🆘 Dépannage

### Problèmes courants
1. **Port 8080 occupé :** Modifiez le port dans `vite.config.ts`
2. **Erreurs de build :** Vérifiez la version Node.js (18+ requis)
3. **Base de données :** Vérifiez les credentials dans `.env.local`

### Support
- GitHub Issues : [Créer un ticket](https://github.com/seikosanof/securecore/issues)
- Email : support@securecore.dev (Pas encore actif)

## 📝 License

MIT License - voir [LICENSE](LICENSE) pour plus de détails.

## 🤝 Contribution

1. Fork le projet
2. Créez votre branche feature (`git checkout -b feature/AmazingFeature`)
3. Committez vos changements (`git commit -m 'Add some AmazingFeature'`)
4. Push vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrez une Pull Request

---

**SecureCore** - Plateforme de cybersécurité professionnelle  
Version 1.0 | Développé avec ❤️ et React