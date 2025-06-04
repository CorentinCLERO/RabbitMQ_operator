const fs = require("fs");
const path = require("path");

const envPath = path.join(__dirname, "..", ".env");
const envExamplePath = path.join(__dirname, "..", ".env.example");

// Vérifie si le fichier .env existe déjà
if (!fs.existsSync(envPath)) {
  // Vérifie si le fichier .env.example existe
  if (fs.existsSync(envExamplePath)) {
    // Copie le fichier .env.example vers .env
    fs.copyFileSync(envExamplePath, envPath);
    console.log(
      "✅ Le fichier .env a été créé avec succès à partir de .env.example"
    );
  } else {
    console.error("❌ Le fichier .env.example n'existe pas");
    process.exit(1);
  }
} else {
  console.log("ℹ️ Le fichier .env existe déjà");
}
