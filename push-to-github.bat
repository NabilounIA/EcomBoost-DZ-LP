@echo off
echo 🚀 Script de déploiement vers GitHub
echo.
echo ⚠️  IMPORTANT: Assurez-vous d'avoir créé le repository sur GitHub d'abord !
echo.
echo 📝 Remplacez VOTRE_USERNAME par votre nom d'utilisateur GitHub dans la commande ci-dessous:
echo.
echo git remote add origin https://github.com/VOTRE_USERNAME/ecomboost-dz-landing-page.git
echo.
pause
echo.
echo 🔗 Ajout du remote GitHub...
git remote add origin https://github.com/VOTRE_USERNAME/ecomboost-dz-landing-page.git
echo.
echo 📤 Push vers GitHub...
git branch -M main
git push -u origin main
echo.
echo ✅ Déploiement terminé !
echo 🌐 Votre code est maintenant disponible sur GitHub
pause