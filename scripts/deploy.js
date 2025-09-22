#!/usr/bin/env node

import { execSync } from 'child_process';
import { readFileSync, writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = join(__dirname, '..');

// Configuration
const config = {
  platform: process.env.DEPLOY_PLATFORM || 'vercel', // vercel | netlify
  environment: process.env.NODE_ENV || 'production',
  skipTests: process.env.SKIP_TESTS === 'true',
  skipBuild: process.env.SKIP_BUILD === 'true',
  domain: process.env.CUSTOM_DOMAIN || null,
  verbose: process.env.VERBOSE === 'true'
};

// Couleurs pour les logs
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function logStep(step, message) {
  log(`\n🚀 [${step}] ${message}`, 'cyan');
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

function execCommand(command, options = {}) {
  try {
    if (config.verbose) {
      log(`Executing: ${command}`, 'blue');
    }
    
    const result = execSync(command, {
      cwd: projectRoot,
      stdio: config.verbose ? 'inherit' : 'pipe',
      encoding: 'utf8',
      ...options
    });
    
    return result;
  } catch (error) {
    logError(`Command failed: ${command}`);
    logError(error.message);
    process.exit(1);
  }
}

function checkPrerequisites() {
  logStep('1', 'Vérification des prérequis');
  
  // Vérifier Node.js version
  const nodeVersion = process.version;
  const majorVersion = parseInt(nodeVersion.slice(1).split('.')[0]);
  
  if (majorVersion < 16) {
    logError(`Node.js version ${nodeVersion} non supportée. Minimum requis: v16`);
    process.exit(1);
  }
  logSuccess(`Node.js ${nodeVersion} ✓`);
  
  // Vérifier npm
  try {
    execCommand('npm --version');
    logSuccess('npm installé ✓');
  } catch {
    logError('npm non trouvé');
    process.exit(1);
  }
  
  // Vérifier la plateforme de déploiement
  if (config.platform === 'vercel') {
    try {
      execCommand('vercel --version');
      logSuccess('Vercel CLI installé ✓');
    } catch {
      logError('Vercel CLI non trouvé. Installez avec: npm install -g vercel');
      process.exit(1);
    }
  } else if (config.platform === 'netlify') {
    try {
      execCommand('netlify --version');
      logSuccess('Netlify CLI installé ✓');
    } catch {
      logError('Netlify CLI non trouvé. Installez avec: npm install -g netlify-cli');
      process.exit(1);
    }
  }
  
  // Vérifier package.json
  try {
    const packageJson = JSON.parse(readFileSync(join(projectRoot, 'package.json'), 'utf8'));
    logSuccess(`Projet: ${packageJson.name} v${packageJson.version} ✓`);
  } catch {
    logError('package.json non trouvé ou invalide');
    process.exit(1);
  }
}

function checkEnvironmentVariables() {
  logStep('2', 'Vérification des variables d\'environnement');
  
  const requiredVars = [
    'VITE_GA_MEASUREMENT_ID',
    'VITE_WHATSAPP_NUMBER',
    'VITE_CONTACT_EMAIL'
  ];
  
  const missingVars = [];
  
  requiredVars.forEach(varName => {
    if (!process.env[varName]) {
      missingVars.push(varName);
    } else {
      logSuccess(`${varName} ✓`);
    }
  });
  
  if (missingVars.length > 0) {
    logWarning(`Variables manquantes: ${missingVars.join(', ')}`);
    logWarning('Ces variables doivent être configurées sur la plateforme de déploiement');
  }
}

function runTests() {
  if (config.skipTests) {
    logWarning('Tests ignorés (SKIP_TESTS=true)');
    return;
  }
  
  logStep('3', 'Exécution des tests');
  
  try {
    execCommand('npm test -- --run');
    logSuccess('Tous les tests passent ✓');
  } catch {
    logError('Échec des tests');
    process.exit(1);
  }
}

function buildProject() {
  if (config.skipBuild) {
    logWarning('Build ignoré (SKIP_BUILD=true)');
    return;
  }
  
  logStep('4', 'Build du projet');
  
  // Nettoyer le dossier dist
  try {
    execCommand('npm run clean');
    logSuccess('Dossier dist nettoyé ✓');
  } catch {
    logWarning('Impossible de nettoyer le dossier dist');
  }
  
  // Build de production
  execCommand('npm run build:prod');
  logSuccess('Build de production terminé ✓');
  
  // Analyser la taille du bundle
  try {
    execCommand('npm run analyze:bundle');
    logSuccess('Analyse du bundle terminée ✓');
  } catch {
    logWarning('Impossible d\'analyser le bundle');
  }
}

function deployToVercel() {
  logStep('5', 'Déploiement sur Vercel');
  
  // Vérifier la connexion
  try {
    execCommand('vercel whoami');
  } catch {
    logError('Non connecté à Vercel. Exécutez: vercel login');
    process.exit(1);
  }
  
  // Déploiement
  const deployCommand = config.environment === 'production' 
    ? 'vercel --prod' 
    : 'vercel';
  
  const result = execCommand(deployCommand);
  
  // Extraire l'URL de déploiement
  const lines = result.split('\n');
  const deploymentUrl = lines.find(line => line.includes('https://'));
  
  if (deploymentUrl) {
    logSuccess(`Déploiement réussi: ${deploymentUrl.trim()}`);
    
    // Configurer le domaine personnalisé si spécifié
    if (config.domain && config.environment === 'production') {
      try {
        execCommand(`vercel alias set ${deploymentUrl.trim()} ${config.domain}`);
        logSuccess(`Domaine personnalisé configuré: ${config.domain}`);
      } catch {
        logWarning(`Impossible de configurer le domaine: ${config.domain}`);
      }
    }
  }
}

function deployToNetlify() {
  logStep('5', 'Déploiement sur Netlify');
  
  // Vérifier la connexion
  try {
    execCommand('netlify status');
  } catch {
    logError('Non connecté à Netlify. Exécutez: netlify login');
    process.exit(1);
  }
  
  // Déploiement
  const deployCommand = config.environment === 'production'
    ? 'netlify deploy --prod --dir=dist'
    : 'netlify deploy --dir=dist';
  
  execCommand(deployCommand);
  logSuccess('Déploiement Netlify réussi ✓');
}

function runPostDeploymentTests(deploymentUrl) {
  logStep('6', 'Tests post-déploiement');
  
  if (!deploymentUrl) {
    logWarning('URL de déploiement non disponible, tests ignorés');
    return;
  }
  
  // Test de base - vérifier que le site répond
  try {
    execCommand(`curl -f -s -o /dev/null ${deploymentUrl}`);
    logSuccess('Site accessible ✓');
  } catch {
    logError('Site non accessible');
  }
  
  // Test du sitemap
  try {
    execCommand(`curl -f -s -o /dev/null ${deploymentUrl}/sitemap.xml`);
    logSuccess('Sitemap accessible ✓');
  } catch {
    logWarning('Sitemap non accessible');
  }
  
  // Test du robots.txt
  try {
    execCommand(`curl -f -s -o /dev/null ${deploymentUrl}/robots.txt`);
    logSuccess('Robots.txt accessible ✓');
  } catch {
    logWarning('Robots.txt non accessible');
  }
  
  // Test du manifest PWA
  try {
    execCommand(`curl -f -s -o /dev/null ${deploymentUrl}/manifest.webmanifest`);
    logSuccess('Manifest PWA accessible ✓');
  } catch {
    logWarning('Manifest PWA non accessible');
  }
}

function generateDeploymentReport() {
  logStep('7', 'Génération du rapport de déploiement');
  
  const report = {
    timestamp: new Date().toISOString(),
    platform: config.platform,
    environment: config.environment,
    nodeVersion: process.version,
    gitCommit: null,
    buildSize: null,
    deploymentUrl: null
  };
  
  // Récupérer le commit Git
  try {
    report.gitCommit = execCommand('git rev-parse HEAD').trim();
  } catch {
    logWarning('Impossible de récupérer le commit Git');
  }
  
  // Analyser la taille du build
  try {
    const distStats = execCommand('du -sh dist').trim();
    report.buildSize = distStats.split('\t')[0];
  } catch {
    logWarning('Impossible d\'analyser la taille du build');
  }
  
  // Sauvegarder le rapport
  const reportPath = join(projectRoot, 'deployment-report.json');
  writeFileSync(reportPath, JSON.stringify(report, null, 2));
  
  logSuccess(`Rapport sauvegardé: ${reportPath}`);
  
  // Afficher le résumé
  log('\n📊 RÉSUMÉ DU DÉPLOIEMENT', 'bright');
  log(`Platform: ${report.platform}`, 'cyan');
  log(`Environment: ${report.environment}`, 'cyan');
  log(`Build Size: ${report.buildSize || 'N/A'}`, 'cyan');
  log(`Git Commit: ${report.gitCommit || 'N/A'}`, 'cyan');
  log(`Timestamp: ${report.timestamp}`, 'cyan');
}

// Script principal
async function main() {
  log('🚀 DÉPLOIEMENT ECOMBOOST DZ', 'bright');
  log(`Platform: ${config.platform} | Environment: ${config.environment}\n`, 'yellow');
  
  try {
    checkPrerequisites();
    checkEnvironmentVariables();
    runTests();
    buildProject();
    
    if (config.platform === 'vercel') {
      deployToVercel();
    } else if (config.platform === 'netlify') {
      deployToNetlify();
    } else {
      logError(`Plateforme non supportée: ${config.platform}`);
      process.exit(1);
    }
    
    generateDeploymentReport();
    
    log('\n🎉 DÉPLOIEMENT TERMINÉ AVEC SUCCÈS!', 'green');
    log('Votre landing page est maintenant en ligne! 🌟', 'bright');
    
  } catch (error) {
    logError(`Erreur lors du déploiement: ${error.message}`);
    process.exit(1);
  }
}

// Gestion des arguments de ligne de commande
if (process.argv.includes('--help') || process.argv.includes('-h')) {
  console.log(`
🚀 Script de Déploiement EcomBoost DZ

Usage: node scripts/deploy.js [options]

Options:
  --platform=vercel|netlify    Plateforme de déploiement (défaut: vercel)
  --skip-tests                 Ignorer les tests
  --skip-build                 Ignorer le build
  --domain=example.com         Domaine personnalisé (Vercel uniquement)
  --verbose                    Mode verbeux
  --help, -h                   Afficher cette aide

Variables d'environnement:
  DEPLOY_PLATFORM             Plateforme de déploiement
  NODE_ENV                    Environnement (production|staging)
  SKIP_TESTS                  Ignorer les tests (true|false)
  SKIP_BUILD                  Ignorer le build (true|false)
  CUSTOM_DOMAIN               Domaine personnalisé
  VERBOSE                     Mode verbeux (true|false)

Exemples:
  node scripts/deploy.js
  node scripts/deploy.js --platform=netlify
  node scripts/deploy.js --skip-tests --verbose
  DEPLOY_PLATFORM=vercel CUSTOM_DOMAIN=ecomboost-dz.com node scripts/deploy.js
  `);
  process.exit(0);
}

// Traiter les arguments
process.argv.forEach(arg => {
  if (arg.startsWith('--platform=')) {
    config.platform = arg.split('=')[1];
  } else if (arg.startsWith('--domain=')) {
    config.domain = arg.split('=')[1];
  } else if (arg === '--skip-tests') {
    config.skipTests = true;
  } else if (arg === '--skip-build') {
    config.skipBuild = true;
  } else if (arg === '--verbose') {
    config.verbose = true;
  }
});

// Exécuter le script
main().catch(error => {
  logError(`Erreur fatale: ${error.message}`);
  process.exit(1);
});