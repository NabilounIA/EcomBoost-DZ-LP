# 🚀 Déploiement Rapide - EcomBoost DZ

## ⚡ Démarrage Rapide

### 1. Prérequis
```bash
# Installer les CLI nécessaires
npm install -g vercel
# ou
npm install -g netlify-cli
```

### 2. Configuration
```bash
# Copier le template de configuration
cp .env.production.template .env.production

# Éditer avec vos vraies valeurs
# IMPORTANT: Remplacez TOUS les XXXXXXXXXX
```

### 3. Validation
```bash
# Vérifier la configuration
npm run validate:env
```

### 4. Déploiement
```bash
# Déploiement complet sur Vercel
npm run deploy:prod

# Ou déploiement rapide (sans tests)
npm run deploy:quick

# Ou déploiement sur Netlify
npm run deploy:netlify
```

## 🔧 Variables Critiques à Configurer

| Variable | Description | Exemple |
|----------|-------------|---------|
| `VITE_GA_MEASUREMENT_ID` | Google Analytics 4 ID | `G-XXXXXXXXXX` |
| `VITE_WHATSAPP_NUMBER` | Numéro WhatsApp Business | `+213XXXXXXXXX` |
| `VITE_CONTACT_EMAIL` | Email de contact | `contact@ecomboost-dz.com` |
| `NODE_ENV` | Environnement | `production` |

## 📋 Checklist de Déploiement

### Avant le Déploiement
- [ ] Variables d'environnement configurées
- [ ] Tests locaux passent (`npm test`)
- [ ] Build de production fonctionne (`npm run build:prod`)
- [ ] Validation environnement OK (`npm run validate:env`)

### Après le Déploiement
- [ ] Site accessible
- [ ] Formulaires fonctionnent
- [ ] Analytics configurés
- [ ] PWA installable
- [ ] Performance > 90 (Lighthouse)

## 🛠️ Commandes Disponibles

```bash
# Validation
npm run validate:env          # Valider les variables d'environnement

# Build
npm run build:prod           # Build optimisé pour production
npm run preview              # Prévisualiser le build

# Déploiement
npm run deploy               # Déploiement standard
npm run deploy:prod          # Déploiement production Vercel
npm run deploy:netlify       # Déploiement Netlify
npm run deploy:staging       # Déploiement staging
npm run deploy:quick         # Déploiement sans tests

# Analyse
npm run analyze:bundle       # Analyser la taille du bundle
```

## 🔍 Dépannage Rapide

### Build échoue
```bash
rm -rf node_modules package-lock.json
npm install
npm run build:prod
```

### Variables manquantes
```bash
# Vérifier la configuration
npm run validate:env

# Copier le template
cp .env.production.template .env.production
```

### Déploiement échoue
```bash
# Vérifier la connexion
vercel whoami
# ou
netlify status

# Se reconnecter si nécessaire
vercel login
# ou
netlify login
```

## 📞 Support

- 📧 **Email**: dev@ecomboost-dz.com
- 📱 **WhatsApp**: +213 XXX XXX XXX
- 📖 **Guide complet**: [DEPLOYMENT-GUIDE.md](./DEPLOYMENT-GUIDE.md)

---

**🎯 Objectif**: Déployer en moins de 5 minutes avec toutes les optimisations de performance !