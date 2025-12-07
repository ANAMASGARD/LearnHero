import fs from 'fs';
import path from 'path';

let cachedSecrets = null;

function loadSecrets() {
  if (cachedSecrets) return cachedSecrets;
  
  const possiblePaths = [
    path.join(process.cwd(), 'runtime-config.json'),
    path.join(process.cwd(), '.next', 'runtime-config.json'),
    '/var/task/runtime-config.json',  // Amplify Lambda path
    '/var/task/.next/runtime-config.json',
    path.join(__dirname, '..', 'runtime-config.json'),
    path.join(__dirname, '..', '.next', 'runtime-config.json'),
  ];
  
  for (const configPath of possiblePaths) {
    try {
      if (fs.existsSync(configPath)) {
        const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
        console.log(`[secrets] Loaded from: ${configPath}`);
        cachedSecrets = config;
        return cachedSecrets;
      }
    } catch (e) {
      console.log(`[secrets] Failed to load from ${configPath}:`, e.message);
    }
  }
  
  console.log('[secrets] No runtime-config.json found, using process.env');
  cachedSecrets = {};
  return cachedSecrets;
}

export function getEnv(name) {
  const secrets = loadSecrets();
  const value = secrets[name] || process.env[name] || null;
  
  if (!value) {
    console.warn(`[secrets] ${name} not found in secrets or env`);
  }
  
  return value;
}

export function getSecret(name) {
  return getEnv(name);
}
