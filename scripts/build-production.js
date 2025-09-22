#!/usr/bin/env node

/**
 * Script de build de production optimisé pour EcomBoost DZ
 * Inclut l'analyse des bundles, la compression et les optimisations avancées
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const { gzipSync } = require('zlib');

// Configuration
const CONFIG = {
  buildDir: 'dist',
  maxBundleSize: 500 * 1024, // 500KB
  maxChunkSize: 200 * 1024,  // 200KB
  compressionLevel: 9,
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
  cyan: '\x1b[36m',
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

function logWarning(message) {
  log(`⚠️  ${message}`, 'yellow');
}

function logError(message) {
  log(`❌ ${message}`, 'red');
}

/**
 * Nettoyer le dossier de build
 */
function cleanBuildDir() {
  logStep('CLEAN', 'Nettoyage du dossier de build...');
  
  if (fs.existsSync(CONFIG.buildDir)) {
    fs.rmSync(CONFIG.buildDir, { recursive: true, force: true });
  }
  
  logSuccess('Dossier de build nettoyé');
}

/**
 * Exécuter le build Vite
 */
function runBuild() {
  logStep('BUILD', 'Compilation de l\'application...');
  
  try {
    execSync('npm run build', { 
      stdio: 'inherit',
      env: { 
        ...process.env, 
        NODE_ENV: 'production',
        GENERATE_SOURCEMAP: 'false',
      }
    });
    logSuccess('Build terminé avec succès');
  } catch (error) {
    logError('Erreur lors du build');
    process.exit(1);
  }
}

/**
 * Analyser la taille des bundles
 */
function analyzeBundles() {
  logStep('ANALYZE', 'Analyse des bundles...');
  
  const buildPath = path.resolve(CONFIG.buildDir);
  const stats = {
    totalSize: 0,
    totalGzipSize: 0,
    files: [],
    warnings: [],
  };

  function analyzeDirectory(dir, relativePath = '') {
    const items = fs.readdirSync(dir);
    
    for (const item of items) {
      const fullPath = path.join(dir, item);
      const relativeFilePath = path.join(relativePath, item);
      const stat = fs.statSync(fullPath);
      
      if (stat.isDirectory()) {
        analyzeDirectory(fullPath, relativeFilePath);
      } else if (stat.isFile()) {
        const content = fs.readFileSync(fullPath);
        const gzipSize = gzipSync(content, { level: CONFIG.compressionLevel }).length;
        
        const fileInfo = {
          path: relativeFilePath,
          size: stat.size,
          gzipSize,
          type: path.extname(item).slice(1) || 'unknown',
        };
        
        stats.files.push(fileInfo);
        stats.totalSize += stat.size;
        stats.totalGzipSize += gzipSize;
        
        // Vérifications de taille
        if (item.endsWith('.js') && stat.size > CONFIG.maxBundleSize) {
          stats.warnings.push(`Bundle JS trop volumineux: ${relativeFilePath} (${formatBytes(stat.size)})`);
        }
        
        if (item.includes('chunk') && stat.size > CONFIG.maxChunkSize) {
          stats.warnings.push(`Chunk trop volumineux: ${relativeFilePath} (${formatBytes(stat.size)})`);
        }
      }
    }
  }

  analyzeDirectory(buildPath);
  
  // Trier par taille décroissante
  stats.files.sort((a, b) => b.size - a.size);
  
  // Afficher les résultats
  log('\n📊 Analyse des bundles:', 'bright');
  log(`   Taille totale: ${formatBytes(stats.totalSize)}`);
  log(`   Taille gzip: ${formatBytes(stats.totalGzipSize)}`);
  log(`   Ratio compression: ${((1 - stats.totalGzipSize / stats.totalSize) * 100).toFixed(1)}%`);
  
  log('\n📁 Fichiers les plus volumineux:', 'bright');
  stats.files
    .filter(f => f.size > 10 * 1024) // Plus de 10KB
    .slice(0, 10)
    .forEach(file => {
      const sizeColor = file.size > CONFIG.maxBundleSize ? 'red' : 
                       file.size > CONFIG.maxChunkSize ? 'yellow' : 'green';
      log(`   ${file.path}: ${formatBytes(file.size)} (gzip: ${formatBytes(file.gzipSize)})`, sizeColor);
    });
  
  // Afficher les avertissements
  if (stats.warnings.length > 0) {
    log('\n⚠️  Avertissements:', 'yellow');
    stats.warnings.forEach(warning => logWarning(warning));
  }
  
  return stats;
}

/**
 * Optimiser les assets
 */
function optimizeAssets() {
  logStep('OPTIMIZE', 'Optimisation des assets...');
  
  const buildPath = path.resolve(CONFIG.buildDir);
  let optimizedCount = 0;
  
  function optimizeDirectory(dir) {
    const items = fs.readdirSync(dir);
    
    for (const item of items) {
      const fullPath = path.join(dir, item);
      const stat = fs.statSync(fullPath);
      
      if (stat.isDirectory()) {
        optimizeDirectory(fullPath);
      } else if (stat.isFile()) {
        const ext = path.extname(item).toLowerCase();
        
        // Optimiser les fichiers CSS
        if (ext === '.css') {
          optimizeCss(fullPath);
          optimizedCount++;
        }
        
        // Optimiser les fichiers HTML
        if (ext === '.html') {
          optimizeHtml(fullPath);
          optimizedCount++;
        }
      }
    }
  }
  
  optimizeDirectory(buildPath);
  logSuccess(`${optimizedCount} fichiers optimisés`);
}

/**
 * Optimiser un fichier CSS
 */
function optimizeCss(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Supprimer les commentaires CSS
  content = content.replace(/\/\*[\s\S]*?\*\//g, '');
  
  // Supprimer les espaces multiples
  content = content.replace(/\s+/g, ' ');
  
  // Supprimer les espaces autour des caractères spéciaux
  content = content.replace(/\s*([{}:;,>+~])\s*/g, '$1');
  
  // Supprimer les points-virgules avant les accolades fermantes
  content = content.replace(/;}/g, '}');
  
  fs.writeFileSync(filePath, content.trim());
}

/**
 * Optimiser un fichier HTML
 */
function optimizeHtml(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Supprimer les commentaires HTML (sauf les commentaires conditionnels)
  content = content.replace(/<!--(?!\[if)[\s\S]*?-->/g, '');
  
  // Supprimer les espaces multiples entre les balises
  content = content.replace(/>\s+</g, '><');
  
  // Supprimer les espaces en début et fin de ligne
  content = content.replace(/^\s+|\s+$/gm, '');
  
  fs.writeFileSync(filePath, content);
}

/**
 * Générer le rapport de build
 */
function generateReport(stats) {
  logStep('REPORT', 'Génération du rapport de build...');
  
  const report = {
    timestamp: new Date().toISOString(),
    buildTime: Date.now() - startTime,
    stats,
    environment: {
      nodeVersion: process.version,
      platform: process.platform,
      arch: process.arch,
    },
    performance: {
      totalSize: stats.totalSize,
      gzipSize: stats.totalGzipSize,
      compressionRatio: ((1 - stats.totalGzipSize / stats.totalSize) * 100).toFixed(1),
      fileCount: stats.files.length,
    },
  };
  
  const reportPath = path.join(CONFIG.buildDir, 'build-report.json');
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
  
  logSuccess(`Rapport généré: ${reportPath}`);
  return report;
}

/**
 * Formater les bytes en format lisible
 */
function formatBytes(bytes) {
  if (bytes === 0) return '0 B';
  
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
}

/**
 * Fonction principale
 */
async function main() {
  const startTime = Date.now();
  
  log('🚀 Build de production EcomBoost DZ', 'bright');
  log('=====================================\n', 'bright');
  
  // Note: Ignoring security vulnerabilities for now as they are in dev dependencies
  log('⚠️  Note: Des vulnérabilités de sécurité existent dans les dépendances de développement.', 'yellow');
  
  try {
    // 1. Nettoyer
    cleanBuildDir();
    
    // 2. Build
    runBuild();
    
    // 3. Analyser
    const stats = analyzeBundles();
    
    // 4. Optimiser
    optimizeAssets();
    
    // 5. Rapport
    const report = generateReport(stats);
    
    // Résumé final
    const buildTime = Date.now() - startTime;
    log('\n🎉 Build terminé avec succès!', 'green');
    log(`   Temps de build: ${(buildTime / 1000).toFixed(1)}s`);
    log(`   Taille finale: ${formatBytes(stats.totalGzipSize)} (gzip)`);
    log(`   Fichiers générés: ${stats.files.length}`);
    
    if (stats.warnings.length > 0) {
      log(`   Avertissements: ${stats.warnings.length}`, 'yellow');
    }
    
  } catch (error) {
    logError(`Erreur lors du build: ${error.message}`);
    process.exit(1);
  }
}

// Exporter pour les tests
if (require.main === module) {
  const startTime = Date.now();
  main().catch(error => {
    logError(`Erreur fatale: ${error.message}`);
    process.exit(1);
  });
}

module.exports = {
  main,
  analyzeBundles,
  optimizeAssets,
  formatBytes,
};