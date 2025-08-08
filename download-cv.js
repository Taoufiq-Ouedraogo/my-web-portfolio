// node download-cv.js
const fs = require('fs');
const https = require('https');

const filePath = "assets/pdf/Taoufiq_OUEDRAOGO_cv_en.pdf";
const url = "https://github.com/Taoufiq-Ouedraogo/Taoufiq-Ouedraogo/raw/main/Taoufiq_OUEDRAOGO_cv_en.pdf";

// Fonction qui télécharge en suivant les redirections
function downloadFile(url, dest, cb) {
  https.get(url, (res) => {
    // Si redirection (301, 302, 303, 307, 308)
    if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
      console.log("🔄 Redirection vers:", res.headers.location);
      downloadFile(res.headers.location, dest, cb);
    } else if (res.statusCode === 200) {
      const file = fs.createWriteStream(dest);
      res.pipe(file);
      file.on("finish", () => {
        file.close();
        cb();
      });
    } else {
      console.error(`❌ Erreur: ${res.statusCode}`);
    }
  });
}

// Supprime l’ancien fichier si existant
if (fs.existsSync(filePath)) {
  console.log("🗑️ Suppression de l'ancien CV...");
  fs.unlinkSync(filePath);
}

console.log("📥 Téléchargement du CV...");
downloadFile(url, filePath, () => {
  console.log(`✅ CV téléchargé avec succès dans ${filePath}`);
});