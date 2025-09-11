import { Pool } from 'pg';

let pool;

if (process.env.NODE_ENV === 'production') {
  pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false
    }
  });
} else {
  // Use a global object in development to avoid multiple connections on hot reload
  if (!global.pgPool) {
    global.pgPool = new Pool({
      connectionString: process.env.DATABASE_URL,
    });
  }
  pool = global.pgPool;
}

export default pool;
