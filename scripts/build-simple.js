#!/usr/bin/env node

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🚀 Build de production simplifié...\n');

try {
  // 1. Nettoyer le dossier dist
  console.log('🧹 Nettoyage du dossier dist...');
  if (fs.existsSync('dist')) {
    fs.rmSync('dist', { recursive: true, force: true });
  }

  // 2. Build Vite
  console.log('⚡ Build Vite en cours...');
  execSync('npm run build', { stdio: 'inherit' });

  // 3. Analyser la taille des bundles
  console.log('\n📊 Analyse des bundles:');
  const distPath = path.join(process.cwd(), 'dist');
  
  if (fs.existsSync(distPath)) {
    const files = fs.readdirSync(distPath, { recursive: true });
    const jsFiles = files.filter(file => file.endsWith('.js'));
    const cssFiles = files.filter(file => file.endsWith('.css'));
    
    console.log(`✅ ${jsFiles.length} fichiers JS générés`);
    console.log(`✅ ${cssFiles.length} fichiers CSS générés`);
    
    // Calculer la taille totale
    let totalSize = 0;
    files.forEach(file => {
      const filePath = path.join(distPath, file);
      if (fs.statSync(filePath).isFile()) {
        totalSize += fs.statSync(filePath).size;
      }
    });
    
    console.log(`📦 Taille totale: ${(totalSize / 1024 / 1024).toFixed(2)} MB`);
  }

  console.log('\n✅ Build de production terminé avec succès!');
  console.log('📁 Les fichiers sont dans le dossier ./dist');

} catch (error) {
  console.error('❌ Erreur lors du build:', error.message);
  process.exit(1);
}