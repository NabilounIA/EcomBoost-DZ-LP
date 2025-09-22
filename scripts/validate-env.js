#!/usr/bin/env node

import { readFileSync, existsSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = join(__dirname, '..');

// Fonction pour charger les variables d'environnement depuis les fichiers
function loadEnvironmentFiles() {
  const envFiles = [
    '.env',
    '.env.local',
    '.env.production',
    '.env.production.local'
  ];

  envFiles.forEach(filename => {
    const filePath = join(projectRoot, filename);
    if (existsSync(filePath)) {
      try {
        const content = readFileSync(filePath, 'utf8');
        content.split('\n').forEach(line => {
          line = line.trim();
          if (line && !line.startsWith('#') && line.includes('=')) {
            const [key, ...valueParts] = line.split('=');
            const value = valueParts.join('=').trim();
            // Ne pas écraser les variables déjà définies
            if (!process.env[key.trim()]) {
              process.env[key.trim()] = value;
            }
          }
        });
      } catch (error) {
        // Ignorer les erreurs de lecture silencieusement
      }
    }
  });
}

// Configuration des variables requises
const envConfig = {
  // Variables critiques (obligatoires)
  critical: [
    'NODE_ENV',
    'VITE_GA_MEASUREMENT_ID',
    'VITE_WHATSAPP_NUMBER',
    'VITE_CONTACT_EMAIL'
  ],
  
  // Variables importantes (recommandées)
  important: [
    'VITE_SITE_URL',
    'VITE_API_BASE_URL',
    'GA4_API_SECRET'
  ],
  
  // Variables optionnelles
  optional: [
    'VITE_ENABLE_ANALYTICS',
    'VITE_ENABLE_AB_TESTING',
    'VITE_ENABLE_PERFORMANCE_MONITORING',
    'VITE_ENABLE_ERROR_TRACKING',
    'VITE_ENABLE_LEAD_CAPTURE',
    'VITE_SENTRY_DSN',
    'SENDGRID_API_KEY',
    'MONGODB_URI'
  ]
};

// Patterns de validation
const validationPatterns = {
  'VITE_GA_MEASUREMENT_ID': /^G-[A-Z0-9]{10}$/,
  'VITE_WHATSAPP_NUMBER': /^\+[1-9]\d{1,14}$/,
  'VITE_CONTACT_EMAIL': /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  'VITE_SITE_URL': /^https?:\/\/.+/,
  'VITE_API_BASE_URL': /^https?:\/\/.+/
};

// Couleurs pour les logs
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function logSuccess(message) {
  log(`✅ ${message}`, 'green');
}

function logError(message) {
  log(`❌ ${message}`, 'red');
}

function logWarning(message) {
  log(`⚠️  ${message}`, 'yellow');
}

function logInfo(message) {
  log(`ℹ️  ${message}`, 'blue');
}

function validateEnvironment() {
  log('🔍 VALIDATION DES VARIABLES D\'ENVIRONNEMENT', 'bright');
  log('================================================\n', 'cyan');
  
  const results = {
    critical: { passed: [], failed: [] },
    important: { passed: [], failed: [] },
    optional: { passed: [], failed: [] },
    validation: { passed: [], failed: [] }
  };
  
  // Vérifier les variables critiques
  log('🚨 Variables Critiques:', 'red');
  envConfig.critical.forEach(varName => {
    const value = process.env[varName];
    if (value && value.trim() !== '') {
      logSuccess(`${varName}: ${maskSensitiveValue(varName, value)}`);
      results.critical.passed.push(varName);
    } else {
      logError(`${varName}: MANQUANT`);
      results.critical.failed.push(varName);
    }
  });
  
  // Vérifier les variables importantes
  log('\n⚠️  Variables Importantes:', 'yellow');
  envConfig.important.forEach(varName => {
    const value = process.env[varName];
    if (value && value.trim() !== '') {
      logSuccess(`${varName}: ${maskSensitiveValue(varName, value)}`);
      results.important.passed.push(varName);
    } else {
      logWarning(`${varName}: MANQUANT (recommandé)`);
      results.important.failed.push(varName);
    }
  });
  
  // Vérifier les variables optionnelles
  log('\nℹ️  Variables Optionnelles:', 'blue');
  envConfig.optional.forEach(varName => {
    const value = process.env[varName];
    if (value && value.trim() !== '') {
      logInfo(`${varName}: ${maskSensitiveValue(varName, value)}`);
      results.optional.passed.push(varName);
    } else {
      logInfo(`${varName}: Non configuré`);
      results.optional.failed.push(varName);
    }
  });
  
  // Validation des formats
  log('\n🔍 Validation des Formats:', 'cyan');
  Object.entries(validationPatterns).forEach(([varName, pattern]) => {
    const value = process.env[varName];
    if (value) {
      if (pattern.test(value)) {
        logSuccess(`${varName}: Format valide`);
        results.validation.passed.push(varName);
      } else {
        logError(`${varName}: Format invalide`);
        results.validation.failed.push(varName);
      }
    }
  });
  
  return results;
}

function maskSensitiveValue(varName, value) {
  // Masquer les valeurs sensibles
  const sensitiveVars = ['API_KEY', 'SECRET', 'TOKEN', 'PASSWORD'];
  
  if (sensitiveVars.some(sensitive => varName.includes(sensitive))) {
    return '***MASQUÉ***';
  }
  
  // Masquer partiellement les emails
  if (varName.includes('EMAIL')) {
    const [local, domain] = value.split('@');
    return `${local.slice(0, 2)}***@${domain}`;
  }
  
  // Masquer partiellement les numéros de téléphone
  if (varName.includes('PHONE') || varName.includes('WHATSAPP')) {
    return `${value.slice(0, 4)}***${value.slice(-3)}`;
  }
  
  // Masquer partiellement les URLs
  if (varName.includes('URL')) {
    try {
      const url = new URL(value);
      return `${url.protocol}//${url.hostname}***`;
    } catch {
      return value.slice(0, 20) + '***';
    }
  }
  
  // Limiter la longueur pour les autres valeurs
  return value.length > 20 ? value.slice(0, 20) + '...' : value;
}

function checkEnvironmentFile() {
  log('\n📁 Vérification des Fichiers d\'Environnement:', 'cyan');
  
  const envFiles = [
    '.env',
    '.env.local',
    '.env.production',
    '.env.production.local'
  ];
  
  envFiles.forEach(filename => {
    try {
      const filePath = join(projectRoot, filename);
      readFileSync(filePath, 'utf8');
      logSuccess(`${filename}: Trouvé`);
    } catch {
      logInfo(`${filename}: Non trouvé`);
    }
  });
  
  // Vérifier le template
  try {
    const templatePath = join(projectRoot, '.env.production.template');
    readFileSync(templatePath, 'utf8');
    logSuccess('.env.production.template: Disponible');
  } catch {
    logWarning('.env.production.template: Non trouvé');
  }
}

function generateReport(results) {
  log('\n📊 RAPPORT DE VALIDATION', 'bright');
  log('========================\n', 'cyan');
  
  const totalCritical = envConfig.critical.length;
  const totalImportant = envConfig.important.length;
  const totalOptional = envConfig.optional.length;
  
  log(`Variables Critiques: ${results.critical.passed.length}/${totalCritical}`, 
      results.critical.failed.length === 0 ? 'green' : 'red');
  
  log(`Variables Importantes: ${results.important.passed.length}/${totalImportant}`, 
      results.important.failed.length === 0 ? 'green' : 'yellow');
  
  log(`Variables Optionnelles: ${results.optional.passed.length}/${totalOptional}`, 'blue');
  
  log(`Validation des Formats: ${results.validation.passed.length}/${results.validation.passed.length + results.validation.failed.length}`, 
      results.validation.failed.length === 0 ? 'green' : 'red');
  
  // Score global
  const criticalScore = (results.critical.passed.length / totalCritical) * 100;
  const importantScore = (results.important.passed.length / totalImportant) * 100;
  const validationScore = results.validation.failed.length === 0 ? 100 : 0;
  
  const globalScore = (criticalScore * 0.6) + (importantScore * 0.3) + (validationScore * 0.1);
  
  log(`\nScore Global: ${Math.round(globalScore)}%`, 
      globalScore >= 80 ? 'green' : globalScore >= 60 ? 'yellow' : 'red');
  
  return {
    score: globalScore,
    ready: results.critical.failed.length === 0 && results.validation.failed.length === 0
  };
}

function showRecommendations(results) {
  log('\n💡 RECOMMANDATIONS', 'bright');
  log('==================\n', 'cyan');
  
  if (results.critical.failed.length > 0) {
    logError('Variables critiques manquantes:');
    results.critical.failed.forEach(varName => {
      log(`   - ${varName}`, 'red');
    });
    log('   → Ces variables sont OBLIGATOIRES pour le déploiement\n');
  }
  
  if (results.validation.failed.length > 0) {
    logError('Formats invalides:');
    results.validation.failed.forEach(varName => {
      log(`   - ${varName}`, 'red');
      
      // Suggestions spécifiques
      if (varName === 'VITE_GA_MEASUREMENT_ID') {
        log('     Format attendu: G-XXXXXXXXXX', 'yellow');
      } else if (varName === 'VITE_WHATSAPP_NUMBER') {
        log('     Format attendu: +213XXXXXXXXX', 'yellow');
      } else if (varName === 'VITE_CONTACT_EMAIL') {
        log('     Format attendu: contact@example.com', 'yellow');
      }
    });
    log('   → Corrigez ces formats avant le déploiement\n');
  }
  
  if (results.important.failed.length > 0) {
    logWarning('Variables importantes manquantes:');
    results.important.failed.forEach(varName => {
      log(`   - ${varName}`, 'yellow');
    });
    log('   → Ces variables améliorent les fonctionnalités\n');
  }
  
  // Conseils généraux
  log('📋 Conseils:', 'blue');
  log('   1. Utilisez .env.production.template comme référence');
  log('   2. Configurez les variables sur votre plateforme de déploiement');
  log('   3. Ne commitez jamais de vraies valeurs dans Git');
  log('   4. Testez en staging avant la production');
  log('   5. Utilisez des valeurs différentes pour staging/production');
}

function main() {
  try {
    // Charger les variables d'environnement depuis les fichiers
    loadEnvironmentFiles();
    
    checkEnvironmentFile();
    const results = validateEnvironment();
    const report = generateReport(results);
    showRecommendations(results);
    
    if (report.ready) {
      log('\n🎉 VALIDATION RÉUSSIE!', 'green');
      log('Votre configuration est prête pour le déploiement.', 'bright');
      process.exit(0);
    } else {
      log('\n❌ VALIDATION ÉCHOUÉE!', 'red');
      log('Corrigez les erreurs avant de déployer.', 'bright');
      process.exit(1);
    }
    
  } catch (error) {
    logError(`Erreur lors de la validation: ${error.message}`);
    process.exit(1);
  }
}

// Aide
if (process.argv.includes('--help') || process.argv.includes('-h')) {
  console.log(`
🔍 Validation des Variables d'Environnement

Usage: node scripts/validate-env.js

Ce script vérifie que toutes les variables d'environnement nécessaires
sont configurées et ont des formats valides.

Variables vérifiées:
  - Variables critiques (obligatoires)
  - Variables importantes (recommandées)  
  - Variables optionnelles (améliorations)
  - Validation des formats

Codes de sortie:
  0 - Validation réussie
  1 - Erreurs trouvées

Exemples:
  npm run validate:env
  node scripts/validate-env.js
  `);
  process.exit(0);
}

main();