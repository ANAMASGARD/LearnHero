import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import { getEnvAsync } from '@/lib/secrets';

let cachedDb = null;

export async function getDb() {
  if (cachedDb) return cachedDb;
  
  const databaseUrl = await getEnvAsync('DATABASE_URL');
  if (!databaseUrl) throw new Error('DATABASE_URL is not set');
  
  const pg = neon(databaseUrl);
  cachedDb = drizzle({ client: pg });
  return cachedDb;
}

// For backward compatibility - sync version using env directly
const databaseUrl = process.env.DATABASE_URL;
export const db = databaseUrl ? drizzle({ client: neon(databaseUrl) }) : null;
