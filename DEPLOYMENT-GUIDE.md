# 🚀 Guide de Déploiement - EcomBoost DZ

## 📋 Pré-requis

### Comptes Nécessaires
- [ ] Compte Vercel (recommandé) ou Netlify
- [ ] Compte Google Analytics 4
- [ ] Compte Google Search Console
- [ ] Domaine personnalisé (optionnel)

### Variables d'Environnement
Configurez ces variables dans votre plateforme de déploiement :

```env
# Production
NODE_ENV=production
VITE_BUILD_TARGET=production

# Analytics
VITE_GA_MEASUREMENT_ID=G-XXXXXXXXXX
GA4_API_SECRET=your_ga4_api_secret

# Contact
VITE_WHATSAPP_NUMBER=+213XXXXXXXXX
VITE_CONTACT_EMAIL=contact@ecomboost-dz.com

# Features
VITE_ENABLE_ANALYTICS=true
VITE_ENABLE_AB_TESTING=true
VITE_ENABLE_PERFORMANCE_MONITORING=true
VITE_ENABLE_ERROR_TRACKING=true
VITE_ENABLE_LEAD_CAPTURE=true

# API
VITE_API_BASE_URL=https://votre-domaine.com/api

# Business
WHATSAPP_BUSINESS_NUMBER=+213XXXXXXXXX
```

## 🔧 Déploiement sur Vercel

### 1. Installation CLI Vercel
```bash
npm install -g vercel
```

### 2. Connexion et Configuration
```bash
# Se connecter à Vercel
vercel login

# Initialiser le projet
vercel

# Configurer les variables d'environnement
vercel env add VITE_GA_MEASUREMENT_ID
vercel env add VITE_WHATSAPP_NUMBER
# ... répéter pour toutes les variables
```

### 3. Déploiement
```bash
# Build et test local
npm run build:prod
npm run preview

# Déploiement de production
vercel --prod
```

### 4. Configuration du Domaine (Optionnel)
```bash
# Ajouter un domaine personnalisé
vercel domains add votre-domaine.com
vercel alias set your-deployment-url.vercel.app votre-domaine.com
```

## 🔧 Déploiement sur Netlify

### 1. Configuration Build
Créer `netlify.toml` :
```toml
[build]
  command = "npm run build:prod"
  publish = "dist"

[build.environment]
  NODE_ENV = "production"
  VITE_BUILD_TARGET = "production"

[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "DENY"
    X-XSS-Protection = "1; mode=block"
    X-Content-Type-Options = "nosniff"

[[headers]]
  for = "/sw.js"
  [headers.values]
    Cache-Control = "no-cache, no-store, must-revalidate"

[[headers]]
  for = "/assets/*"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"

[[redirects]]
  from = "/api/*"
  to = "/.netlify/functions/:splat"
  status = 200
```

### 2. Déploiement
```bash
# Installation CLI
npm install -g netlify-cli

# Connexion
netlify login

# Déploiement
netlify deploy --prod --dir=dist
```

## 📊 Configuration Google Analytics

### 1. Créer une Propriété GA4
1. Aller sur [Google Analytics](https://analytics.google.com)
2. Créer une nouvelle propriété
3. Configurer pour un site web
4. Copier le Measurement ID (G-XXXXXXXXXX)

### 2. Configuration API
1. Aller sur [Google Cloud Console](https://console.cloud.google.com)
2. Activer l'API Google Analytics Data
3. Créer des identifiants API
4. Copier l'API Secret

### 3. Variables d'Environnement
```bash
vercel env add VITE_GA_MEASUREMENT_ID production
vercel env add GA4_API_SECRET production
```

## 🔍 Configuration Google Search Console

### 1. Ajouter la Propriété
1. Aller sur [Search Console](https://search.google.com/search-console)
2. Ajouter une propriété (URL prefix)
3. Vérifier la propriété via balise HTML ou DNS

### 2. Soumettre le Sitemap
```
https://votre-domaine.com/sitemap.xml
```

### 3. Configurer les Alertes
- Erreurs d'exploration
- Problèmes de sécurité
- Améliorations de l'expérience utilisateur

## 🛡️ Configuration de Sécurité

### 1. Variables Sensibles
```bash
# Ne JAMAIS commiter ces variables
GA4_API_SECRET=secret_key
WHATSAPP_BUSINESS_TOKEN=business_token
```

### 2. Headers de Sécurité
Déjà configurés dans `vercel.json` :
- Content Security Policy
- X-Frame-Options
- X-XSS-Protection
- HSTS

### 3. Rate Limiting
Configuré dans les APIs pour :
- Capture de leads : 5 requêtes/15min
- Contact WhatsApp : 3 requêtes/5min

## 🚀 Optimisations de Performance

### 1. Vérifications Post-Déploiement
```bash
# Test de performance
npm run analyze:bundle

# Vérification PWA
# Utiliser Lighthouse dans Chrome DevTools
```

### 2. Métriques à Surveiller
- **LCP** (Largest Contentful Paint) < 2.5s
- **FID** (First Input Delay) < 100ms
- **CLS** (Cumulative Layout Shift) < 0.1
- **TTI** (Time to Interactive) < 3.8s

### 3. Cache Strategy
- **Assets statiques** : 1 an
- **Service Worker** : No-cache
- **API responses** : No-cache
- **Images** : 1 an avec versioning

## 📱 Test PWA

### 1. Vérifications
- [ ] Manifest.json accessible
- [ ] Service Worker enregistré
- [ ] Installation possible
- [ ] Fonctionnement offline

### 2. Test d'Installation
```javascript
// Test dans la console du navigateur
navigator.serviceWorker.getRegistrations().then(registrations => {
  console.log('Service Workers:', registrations);
});
```

## 🔄 CI/CD avec GitHub Actions

Créer `.github/workflows/deploy.yml` :
```yaml
name: Deploy to Vercel

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run tests
        run: npm run test
      
      - name: Build
        run: npm run build:prod
      
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
          vercel-args: '--prod'
```

## 📈 Monitoring Post-Déploiement

### 1. Métriques Business
- Taux de conversion des leads
- Temps passé sur la page
- Taux de rebond
- Sources de trafic

### 2. Métriques Techniques
- Temps de chargement
- Erreurs JavaScript
- Disponibilité du service
- Performance API

### 3. Alertes
Configurer des alertes pour :
- Erreurs 5xx > 1%
- Temps de réponse > 3s
- Taux d'erreur JS > 0.1%

## 🎯 Checklist de Déploiement

### Pré-déploiement
- [ ] Tests locaux passent
- [ ] Build de production fonctionne
- [ ] Variables d'environnement configurées
- [ ] Domaine configuré (si applicable)

### Post-déploiement
- [ ] Site accessible
- [ ] Analytics fonctionnent
- [ ] Formulaires de contact fonctionnent
- [ ] PWA installable
- [ ] Performance satisfaisante (Lighthouse > 90)

### Monitoring
- [ ] Google Analytics configuré
- [ ] Search Console configuré
- [ ] Alertes configurées
- [ ] Backup automatique activé

## 🆘 Dépannage

### Problèmes Courants

**Build échoue**
```bash
# Nettoyer et réinstaller
rm -rf node_modules package-lock.json
npm install
npm run build:prod
```

**Service Worker ne s'enregistre pas**
- Vérifier HTTPS
- Vérifier les headers `Service-Worker-Allowed`
- Vider le cache du navigateur

**Analytics ne fonctionnent pas**
- Vérifier le Measurement ID
- Vérifier les variables d'environnement
- Tester en mode incognito

**Performance dégradée**
- Analyser avec Lighthouse
- Vérifier la compression gzip
- Optimiser les images

## 📞 Support

Pour toute question technique :
- 📧 Email : dev@ecomboost-dz.com
- 📱 WhatsApp : +213 XXX XXX XXX
- 🐛 Issues : GitHub Repository

---

**Dernière mise à jour :** $(date)
**Version :** 1.0.0