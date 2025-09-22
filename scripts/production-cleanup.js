#!/usr/bin/env node

/**
 * Script de nettoyage pour la production
 * Ce script aide à identifier et remplacer les données de démo
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Couleurs pour la console
const colors = {
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  reset: '\x1b[0m',
  bold: '\x1b[1m'
};

// Patterns à vérifier
const demoPatterns = [
  {
    pattern: /G-DEMO123456/g,
    description: 'ID Google Analytics de démo',
    replacement: 'G-XXXXXXXXXX (remplacez par votre vrai ID)',
    critical: true
  },
  {
    pattern: /213770123456/g,
    description: 'Numéro WhatsApp de démo',
    replacement: '213XXXXXXXXX (remplacez par votre vrai numéro)',
    critical: true
  },
  {
    pattern: /\/api\/placeholder/g,
    description: 'Images placeholder',
    replacement: 'Remplacez par de vraies images',
    critical: false
  },
  {
    pattern: /console\.(log|warn|error|debug|info)/g,
    description: 'Console logs (seront supprimés automatiquement en production)',
    replacement: 'Automatiquement supprimés par Terser',
    critical: false
  }
];

// Fichiers à ignorer
const ignorePatterns = [
  'node_modules',
  '.git',
  'dist',
  'build',
  '.env.example',
  'production-cleanup.js'
];

function shouldIgnoreFile(filePath) {
  return ignorePatterns.some(pattern => filePath.includes(pattern));
}

function scanFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const issues = [];

    demoPatterns.forEach(({ pattern, description, replacement, critical }) => {
      const matches = content.match(pattern);
      if (matches) {
        issues.push({
          pattern: pattern.source,
          description,
          replacement,
          critical,
          count: matches.length,
          lines: getLineNumbers(content, pattern)
        });
      }
    });

    return issues;
  } catch (error) {
    return [];
  }
}

function getLineNumbers(content, pattern) {
  const lines = content.split('\n');
  const lineNumbers = [];
  
  lines.forEach((line, index) => {
    if (pattern.test(line)) {
      lineNumbers.push(index + 1);
    }
  });
  
  return lineNumbers;
}

function scanDirectory(dirPath) {
  const results = {};
  
  function scanRecursive(currentPath) {
    const items = fs.readdirSync(currentPath);
    
    items.forEach(item => {
      const itemPath = path.join(currentPath, item);
      
      if (shouldIgnoreFile(itemPath)) {
        return;
      }
      
      const stat = fs.statSync(itemPath);
      
      if (stat.isDirectory()) {
        scanRecursive(itemPath);
      } else if (stat.isFile() && (item.endsWith('.ts') || item.endsWith('.tsx') || item.endsWith('.js') || item.endsWith('.jsx') || item.endsWith('.env'))) {
        const issues = scanFile(itemPath);
        if (issues.length > 0) {
          results[itemPath] = issues;
        }
      }
    });
  }
  
  scanRecursive(dirPath);
  return results;
}

function generateReport(results) {
  console.log(`${colors.bold}${colors.cyan}🔍 RAPPORT DE NETTOYAGE PRODUCTION${colors.reset}\n`);
  
  let criticalIssues = 0;
  let totalIssues = 0;
  
  Object.entries(results).forEach(([filePath, issues]) => {
    const relativePath = path.relative(process.cwd(), filePath);
    console.log(`${colors.bold}📄 ${relativePath}${colors.reset}`);
    
    issues.forEach(issue => {
      totalIssues++;
      if (issue.critical) criticalIssues++;
      
      const icon = issue.critical ? '🚨' : '⚠️';
      const color = issue.critical ? colors.red : colors.yellow;
      
      console.log(`  ${icon} ${color}${issue.description}${colors.reset}`);
      console.log(`     Pattern: ${issue.pattern}`);
      console.log(`     Occurrences: ${issue.count} (lignes: ${issue.lines.join(', ')})`);
      console.log(`     ${colors.green}Solution: ${issue.replacement}${colors.reset}`);
      console.log('');
    });
    
    console.log('');
  });
  
  // Résumé
  console.log(`${colors.bold}📊 RÉSUMÉ${colors.reset}`);
  console.log(`Total des problèmes: ${totalIssues}`);
  console.log(`${colors.red}Critiques: ${criticalIssues}${colors.reset}`);
  console.log(`${colors.yellow}Non-critiques: ${totalIssues - criticalIssues}${colors.reset}\n`);
  
  // Instructions
  console.log(`${colors.bold}${colors.blue}📋 INSTRUCTIONS POUR LA PRODUCTION${colors.reset}`);
  console.log(`1. ${colors.green}Copiez .env.production et remplacez les valeurs XXXXXXXXXX${colors.reset}`);
  console.log(`2. ${colors.green}Remplacez les numéros WhatsApp de démo par vos vrais numéros${colors.reset}`);
  console.log(`3. ${colors.green}Remplacez l'ID Google Analytics par votre vrai ID${colors.reset}`);
  console.log(`4. ${colors.green}Remplacez les images placeholder par de vraies images${colors.reset}`);
  console.log(`5. ${colors.green}Les console.log seront automatiquement supprimés lors du build${colors.reset}\n`);
  
  if (criticalIssues > 0) {
    console.log(`${colors.red}${colors.bold}⚠️  ATTENTION: ${criticalIssues} problèmes critiques doivent être résolus avant la production!${colors.reset}\n`);
    process.exit(1);
  } else {
    console.log(`${colors.green}${colors.bold}✅ Aucun problème critique détecté!${colors.reset}\n`);
  }
}

// Exécution du script
console.log(`${colors.bold}${colors.magenta}🚀 Démarrage du scan de nettoyage production...${colors.reset}\n`);

const projectRoot = process.cwd();
const results = scanDirectory(projectRoot);

if (Object.keys(results).length === 0) {
  console.log(`${colors.green}${colors.bold}✅ Aucun problème détecté! Votre code est prêt pour la production.${colors.reset}\n`);
} else {
  generateReport(results);
}