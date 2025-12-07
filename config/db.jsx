import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import { getEnv } from '@/lib/secrets';

let cachedDb = null;

function getDb() {
  if (cachedDb) {
    return cachedDb;
  }
  
  const databaseUrl = getEnv('DATABASE_URL');
  
  if (!databaseUrl) {
    throw new Error('DATABASE_URL is not set');
  }
  
  const pg = neon(databaseUrl);
  cachedDb = drizzle({ client: pg });
  return cachedDb;
}

export const db = new Proxy({}, {
  get(target, prop) {
    const dbInstance = getDb();
    const value = dbInstance[prop];
    if (typeof value === 'function') {
      return value.bind(dbInstance);
    }
    return value;
  }
});
