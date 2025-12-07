import fs from 'fs';
import path from 'path';

let cachedSecrets = null;

function loadSecrets() {
  if (cachedSecrets) return cachedSecrets;
  
  // Try to load from runtime-config.json (for Amplify deployment)
  try {
    const configPath = path.join(process.cwd(), 'runtime-config.json');
    if (fs.existsSync(configPath)) {
      const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
      cachedSecrets = config;
      return cachedSecrets;
    }
  } catch (e) {
    // Ignore errors, fall back to env vars
  }
  
  // Try .next folder (Amplify SSR)
  try {
    const configPath = path.join(process.cwd(), '.next', 'runtime-config.json');
    if (fs.existsSync(configPath)) {
      const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
      cachedSecrets = config;
      return cachedSecrets;
    }
  } catch (e) {
    // Ignore errors
  }
  
  // Fall back to environment variables
  cachedSecrets = {};
  return cachedSecrets;
}

export function getSecret(name) {
  const secrets = loadSecrets();
  return secrets[name] || process.env[name] || null;
}

export function getEnv(name) {
  return getSecret(name);
}
