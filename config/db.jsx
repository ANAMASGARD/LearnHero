import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';

// Lazy initialization to avoid build-time errors
let cachedDb = null;

function getDb() {
  if (cachedDb) {
    return cachedDb;
  }
  
  const databaseUrl = process.env.DATABASE_URL;
  
  if (!databaseUrl) {
    throw new Error('DATABASE_URL environment variable is not set. Please configure it in your environment variables.');
  }
  
  const pg = neon(databaseUrl);
  cachedDb = drizzle({ client: pg });
  return cachedDb;
}

// Export db as a proxy that initializes lazily only when accessed at runtime
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
