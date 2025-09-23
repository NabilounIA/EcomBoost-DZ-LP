# Guide de Configuration des Variables d'Environnement sur Vercel

Ce guide explique comment configurer les variables d'environnement sensibles sur Vercel pour sécuriser vos clés API et identifiants.

## Variables à Configurer

Voici les variables d'environnement à configurer dans votre projet Vercel :

| Nom de la Variable | Description | Exemple (NE PAS UTILISER EN PRODUCTION) |
|-------------------|-------------|----------------------------------------|
| `GA4_API_SECRET` | Clé API secrète pour Google Analytics 4 | `ABcDeFgH123456_abcdefghijklm` |
| `SENDGRID_API_KEY` | Clé API pour SendGrid | `SG.aBcDeFgHiJkLmNoPqRsTuVwXyZ.123456789abcdefghijklmnopqrstuvwxyz` |
| `SENDGRID_FROM_EMAIL` | Email d'expédition par défaut | `noreply@ecomboost-dz.com` |
| `MONGODB_URI` | URI de connexion à MongoDB | `mongodb+srv://username:password@cluster.mongodb.net/database` |
| `JWT_SECRET` | Clé secrète pour signer les JWT | `votre_jwt_secret_complexe_et_unique` |
| `VITE_API_KEY` | Clé API pour les services externes | `api_key_12345` |
| `VITE_SENTRY_DSN` | DSN pour Sentry | `https://abcdef@sentry.io/123456` |
| `VITE_LOGROCKET_APP_ID` | ID d'application LogRocket | `company/project` |
| `MAILGUN_API_KEY` | Clé API pour Mailgun | `key-abcdef123456789` |
| `MAILGUN_DOMAIN` | Domaine Mailgun | `mg.ecomboost-dz.com` |
| `GEMINI_API_KEY` | Clé API pour Google Gemini AI | `AIzaSyABC123DEF456GHI789JKL012MNO345PQR` |

## Comment Configurer sur Vercel

1. **Connectez-vous à votre tableau de bord Vercel** et sélectionnez votre projet

2. **Accédez à la section "Settings"** de votre projet

3. **Cliquez sur "Environment Variables"** dans le menu latéral

4. **Ajoutez chaque variable** une par une :
   - Nom de la variable (ex: `GA4_API_SECRET`)
   - Valeur de la variable (votre clé API réelle)
   - Sélectionnez les environnements où cette variable doit être disponible (Production, Preview, Development)

5. **Cliquez sur "Save"** pour enregistrer chaque variable

## Utilisation avec la CLI Vercel

Vous pouvez également configurer ces variables via la CLI Vercel :

```bash
# Installer la CLI Vercel
npm i -g vercel

# Se connecter à Vercel
vercel login

# Ajouter des secrets
vercel secrets add GA4_API_SECRET "votre_ga4_api_secret"
vercel secrets add SENDGRID_API_KEY "votre_sendgrid_api_key"
vercel secrets add GEMINI_API_KEY "votre_gemini_api_key"
# etc.

# Lier les secrets à votre projet dans vercel.json
# {
#   "env": {
#     "GA4_API_SECRET": "@ga4_api_secret",
#     "SENDGRID_API_KEY": "@sendgrid_api_key"
#   }
# }
```

## Avantages de cette Approche

1. **Sécurité renforcée** : Les clés API ne sont jamais exposées dans votre code source
2. **Gestion centralisée** : Toutes vos variables sont gérées à un seul endroit
3. **Environnements multiples** : Vous pouvez avoir des valeurs différentes pour chaque environnement
4. **Rotation facile** : Vous pouvez facilement mettre à jour une clé en cas de compromission

## Développement Local

Pour le développement local, vous pouvez créer un fichier `.env.local` qui ne sera pas commité dans Git :

```
GA4_API_SECRET=votre_ga4_api_secret
SENDGRID_API_KEY=votre_sendgrid_api_key
GEMINI_API_KEY=votre_gemini_api_key
# etc.
```

## Sécurité Importante

- **Ne commettez jamais** de vraies clés API dans votre code source
- **Utilisez toujours** des placeholders dans les fichiers de template
- **Limitez l'accès** aux variables d'environnement dans votre équipe
- **Faites une rotation** régulière de vos clés API sensibles