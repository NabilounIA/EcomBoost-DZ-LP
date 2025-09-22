# 🔍 Guide de Monitoring et Maintenance - EcomBoost DZ

## Vue d'ensemble

Ce guide détaille le système de monitoring avancé mis en place pour surveiller les performances, détecter les erreurs et optimiser l'expérience utilisateur de la landing page EcomBoost DZ.

## 🚀 Composants du Système de Monitoring

### 1. Sentry - Tracking d'erreurs et performances
- **Localisation**: `services/monitoring.ts`
- **Fonctionnalités**:
  - Tracking automatique des erreurs JavaScript
  - Monitoring des performances (Core Web Vitals)
  - Session replay pour debug
  - Métriques personnalisées

### 2. Monitoring Avancé
- **Localisation**: `services/advancedMonitoring.ts`
- **Fonctionnalités**:
  - Surveillance des Core Web Vitals en temps réel
  - Tracking des conversions business
  - Monitoring de l'utilisation mémoire
  - Métriques de profondeur de scroll

### 3. Système d'Alertes
- **Localisation**: `services/alerting.ts`
- **Fonctionnalités**:
  - Alertes automatiques basées sur des seuils
  - Classification par sévérité
  - Notifications en temps réel
  - Historique des alertes

### 4. Dashboard de Monitoring
- **Localisation**: `components/MonitoringDashboard.tsx`
- **Fonctionnalités**:
  - Visualisation en temps réel des métriques
  - État de santé du système
  - Métriques de performance et business

## 📊 Métriques Surveillées

### Performances Web
| Métrique | Seuil Optimal | Seuil d'Alerte | Description |
|----------|---------------|----------------|-------------|
| **LCP** (Largest Contentful Paint) | < 2.5s | > 2.5s | Temps de chargement du contenu principal |
| **FID** (First Input Delay) | < 100ms | > 100ms | Délai de première interaction |
| **CLS** (Cumulative Layout Shift) | < 0.1 | > 0.1 | Stabilité visuelle de la page |
| **FCP** (First Contentful Paint) | < 1.8s | > 2.0s | Premier contenu visible |

### Métriques Business
| Métrique | Description | Tracking |
|----------|-------------|----------|
| **Conversions Leads** | Formulaires de contact soumis | `trackLeadConversion()` |
| **Clics WhatsApp** | Interactions avec le widget WhatsApp | `trackWhatsAppClick()` |
| **Demandes de Démo** | Requêtes de démonstration | `trackDemoRequest()` |
| **Profondeur de Scroll** | Engagement utilisateur | Automatique |
| **Durée de Session** | Temps passé sur le site | Automatique |

### Métriques Système
| Métrique | Seuil d'Alerte | Description |
|----------|----------------|-------------|
| **Utilisation Mémoire** | > 100MB | Consommation mémoire JavaScript |
| **Taux d'Erreur** | > 5 erreurs/min | Erreurs JavaScript détectées |
| **Erreurs Consécutives** | > 3 | Erreurs répétées |

## 🔧 Configuration

### Variables d'Environnement
```bash
# Sentry Configuration
VITE_SENTRY_DSN=https://your-sentry-dsn@sentry.io/project-id

# Feature Flags
VITE_ENABLE_PERFORMANCE_MONITORING=true
VITE_ENABLE_ERROR_TRACKING=true
VITE_ENABLE_MONITORING_DASHBOARD=true
```

### Activation du Dashboard de Monitoring
Le dashboard est visible dans les cas suivants :
- Mode développement (`import.meta.env.DEV`)
- Mode admin activé (`localStorage.setItem('admin_mode', 'true')`)

```javascript
// Activer le mode admin dans la console
localStorage.setItem('admin_mode', 'true');
// Recharger la page pour voir le dashboard
```

## 🚨 Système d'Alertes

### Niveaux de Sévérité
1. **🔴 Critical** - Problèmes critiques nécessitant une action immédiate
2. **🟠 High** - Problèmes importants à traiter rapidement
3. **🟡 Medium** - Problèmes modérés à surveiller
4. **🔵 Low** - Informations ou problèmes mineurs

### Types d'Alertes
- **Performance** : Métriques de performance dégradées
- **Error** : Erreurs JavaScript ou promesses rejetées
- **Business** : Métriques business anormales
- **Security** : Problèmes de sécurité détectés

### Configuration des Seuils
```typescript
// Modifier les seuils dans services/alerting.ts
alertingService.updateThresholds({
  performance: {
    lcp: 3000, // 3s au lieu de 2.5s
    fid: 150,  // 150ms au lieu de 100ms
    cls: 0.15, // 0.15 au lieu de 0.1
    memoryUsage: 150, // 150MB au lieu de 100MB
  }
});
```

## 🔍 Troubleshooting

### Problèmes Courants

#### 1. Dashboard de Monitoring Non Visible
**Symptômes** : Le dashboard n'apparaît pas en bas à droite
**Solutions** :
```javascript
// Vérifier le mode développement
console.log('DEV mode:', import.meta.env.DEV);

// Activer le mode admin
localStorage.setItem('admin_mode', 'true');
window.location.reload();

// Vérifier les feature flags
console.log('Monitoring enabled:', import.meta.env.VITE_ENABLE_MONITORING_DASHBOARD);
```

#### 2. Sentry Non Configuré
**Symptômes** : Pas de tracking d'erreurs dans Sentry
**Solutions** :
1. Vérifier la variable `VITE_SENTRY_DSN`
2. Créer un projet Sentry et obtenir le DSN
3. Redémarrer l'application

#### 3. Métriques de Performance Manquantes
**Symptômes** : Valeurs "N/A" dans le dashboard
**Solutions** :
```javascript
// Vérifier le support des Performance APIs
console.log('Performance API:', !!window.performance);
console.log('PerformanceObserver:', !!window.PerformanceObserver);

// Forcer une mesure manuelle
performance.mark('test-mark');
console.log('Marks:', performance.getEntriesByType('mark'));
```

#### 4. Alertes Trop Fréquentes
**Symptômes** : Spam d'alertes identiques
**Solutions** :
```typescript
// Les alertes sont automatiquement dédupliquées sur 5 minutes
// Pour ajuster, modifier dans services/alerting.ts :
const recentDuplicate = this.alerts.find(a => 
  // Changer 5 * 60 * 1000 pour ajuster la période
  (Date.now() - a.timestamp.getTime()) < 10 * 60 * 1000 // 10 minutes
);
```

### Commandes de Debug

#### Vérifier l'État du Monitoring
```javascript
// Dans la console du navigateur
import { advancedMonitoring } from './services/advancedMonitoring';
import { alertingService } from './services/alerting';

// État de santé
const health = await advancedMonitoring.runHealthCheck();
console.log('Health:', health);

// Rapport complet
const report = advancedMonitoring.generateReport();
console.log('Report:', report);

// Résumé des alertes
const summary = alertingService.getAlertSummary();
console.log('Alerts:', summary);
```

#### Simuler des Alertes (Mode Dev)
```javascript
// Simuler différents types d'alertes
alertingService.simulateAlert('performance', 'critical');
alertingService.simulateAlert('error', 'high');
alertingService.simulateAlert('business', 'medium');
```

#### Exporter les Données
```javascript
// Exporter toutes les métriques
const data = {
  health: await advancedMonitoring.runHealthCheck(),
  report: advancedMonitoring.generateReport(),
  alerts: alertingService.getAlerts(),
  summary: alertingService.getAlertSummary()
};

// Copier dans le presse-papier
navigator.clipboard.writeText(JSON.stringify(data, null, 2));
```

## 📈 Optimisation des Performances

### Actions Recommandées par Métrique

#### LCP > 2.5s
1. Optimiser les images (WebP, lazy loading)
2. Réduire le JavaScript bloquant
3. Utiliser un CDN
4. Optimiser les fonts

#### FID > 100ms
1. Réduire le JavaScript principal
2. Code splitting
3. Utiliser `requestIdleCallback`
4. Optimiser les event listeners

#### CLS > 0.1
1. Définir les dimensions des images
2. Éviter l'injection de contenu dynamique
3. Utiliser `transform` au lieu de changer les propriétés de layout
4. Précharger les fonts

#### Utilisation Mémoire > 100MB
1. Nettoyer les event listeners
2. Éviter les fuites mémoire
3. Optimiser les images en mémoire
4. Utiliser `WeakMap` et `WeakSet`

## 🔄 Maintenance Régulière

### Quotidienne
- [ ] Vérifier le dashboard de monitoring
- [ ] Examiner les alertes critiques
- [ ] Contrôler les métriques de conversion

### Hebdomadaire
- [ ] Analyser les tendances de performance
- [ ] Réviser les seuils d'alerte
- [ ] Nettoyer l'historique des alertes résolues
- [ ] Vérifier les logs Sentry

### Mensuelle
- [ ] Audit complet des performances
- [ ] Mise à jour des dépendances de monitoring
- [ ] Révision de la documentation
- [ ] Formation de l'équipe sur les nouveaux outils

## 📞 Support et Escalade

### Niveaux d'Escalade
1. **Niveau 1** : Alertes automatiques et dashboard
2. **Niveau 2** : Analyse manuelle et optimisations
3. **Niveau 3** : Intervention technique approfondie

### Contacts d'Urgence
- **Développeur Principal** : [contact@ecomboost-dz.com]
- **Sentry Dashboard** : [lien vers votre projet Sentry]
- **Documentation Technique** : Ce fichier

## 🔗 Ressources Utiles

- [Core Web Vitals - Google](https://web.dev/vitals/)
- [Sentry Documentation](https://docs.sentry.io/)
- [Performance API - MDN](https://developer.mozilla.org/en-US/docs/Web/API/Performance)
- [Web Performance Best Practices](https://web.dev/fast/)

---

**Dernière mise à jour** : ${new Date().toLocaleDateString('fr-FR')}
**Version** : 1.0.0