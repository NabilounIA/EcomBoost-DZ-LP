#!/usr/bin/env node

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

console.log('🚀 Déploiement Vercel - EcomBoost DZ\n');

try {
  // 1. Vérifier la configuration vercel.json
  console.log('🔍 Vérification de la configuration Vercel...');
  if (!fs.existsSync('vercel.json')) {
    console.error('❌ Fichier vercel.json manquant!');
    process.exit(1);
  }

  const vercelConfig = JSON.parse(fs.readFileSync('vercel.json', 'utf8'));
  
  // Vérifier que la réécriture SPA est présente
  const hasRewrite = vercelConfig.rewrites && 
    vercelConfig.rewrites.some(r => r.source === '/((?!api|_next|_static|_vercel|[\\w-]+\\.\\w+).*)'  && r.destination === '/index.html');
  
  if (!hasRewrite) {
    console.error('❌ Configuration de routage SPA manquante dans vercel.json!');
    process.exit(1);
  }
  
  console.log('✅ Configuration Vercel OK');

  // 2. Build de production
  console.log('\n⚡ Build de production...');
  execSync('npm run build:prod', { stdio: 'inherit' });

  // 3. Vérifier que les fichiers de build existent
  console.log('\n🔍 Vérification des fichiers de build...');
  if (!fs.existsSync('dist/index.html')) {
    console.error('❌ Fichier dist/index.html manquant!');
    process.exit(1);
  }
  
  console.log('✅ Fichiers de build OK');

  // 4. Déploiement Vercel
  console.log('\n🌐 Déploiement sur Vercel...');
  
  // Vérifier si Vercel CLI est installé
  try {
    execSync('vercel --version', { stdio: 'pipe' });
  } catch (error) {
    console.log('📦 Installation de Vercel CLI...');
    execSync('npm install -g vercel', { stdio: 'inherit' });
  }

  // Déployer
  execSync('vercel --prod', { stdio: 'inherit' });

  console.log('\n✅ Déploiement terminé avec succès!');
  console.log('🎉 Votre application est maintenant en ligne sur Vercel');
  
} catch (error) {
  console.error('\n❌ Erreur lors du déploiement:', error.message);
  process.exit(1);
}