import { SSMClient, GetParametersCommand } from "@aws-sdk/client-ssm";

let cachedSecrets = null;
let cacheTime = 0;
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

const SECRET_NAMES = [
  'CLERK_SECRET_KEY',
  'DATABASE_URL', 
  'GEMINI_API_KEY',
  'STRIPE_SECRET_KEY',
  'STRIPE_WEBHOOK_SECRET',
  'STRIPE_PRO_PRICE_ID',
  'UNSPLASH_ACCESS_KEY',
  'YOUTUBE_API_KEY',
  'VAPI_PRIVATE_KEY',
];

async function loadSecretsFromSSM() {
  try {
    const client = new SSMClient({ region: process.env.AWS_REGION || 'ap-south-1' });
    const prefix = process.env.SSM_PREFIX || '/learnhero/prod';
    
    const paramNames = SECRET_NAMES.map(name => `${prefix}/${name}`);
    
    const command = new GetParametersCommand({
      Names: paramNames,
      WithDecryption: true,
    });
    
    const response = await client.send(command);
    const secrets = {};
    
    for (const param of response.Parameters || []) {
      const name = param.Name.split('/').pop();
      secrets[name] = param.Value;
    }
    
    console.log('[secrets] Loaded from SSM:', Object.keys(secrets).length, 'parameters');
    return secrets;
  } catch (error) {
    console.error('[secrets] SSM error:', error.message);
    return null;
  }
}

async function loadSecrets() {
  // Return cache if valid
  if (cachedSecrets && (Date.now() - cacheTime) < CACHE_TTL) {
    return cachedSecrets;
  }

  // Try SSM first (production)
  const ssmSecrets = await loadSecretsFromSSM();
  if (ssmSecrets && Object.keys(ssmSecrets).length > 0) {
    cachedSecrets = ssmSecrets;
    cacheTime = Date.now();
    return cachedSecrets;
  }

  // Fallback to process.env (local dev)
  console.log('[secrets] Using process.env fallback');
  cachedSecrets = {};
  cacheTime = Date.now();
  return cachedSecrets;
}

export async function getEnvAsync(name) {
  const secrets = await loadSecrets();
  return secrets[name] || process.env[name] || null;
}

// Sync version - uses cache or env
export function getEnv(name) {
  if (cachedSecrets) {
    return cachedSecrets[name] || process.env[name] || null;
  }
  return process.env[name] || null;
}

// Pre-load secrets at startup
export async function initSecrets() {
  await loadSecrets();
}
