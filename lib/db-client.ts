import { Pool } from 'pg';

let pool: Pool | null = null;

export function getConnectionPool() {
  if (!pool) {
    pool = new Pool({
      host: process.env.POSTGRES_HOST,
      database: process.env.POSTGRES_DATABASE,
      user: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASSWORD,
      port: parseInt(process.env.POSTGRES_PORT || '5432'),
      ssl: process.env.POSTGRES_SSL === 'true' ? {
        rejectUnauthorized: false // Consider changing this in production
      } : false,
      connectionTimeoutMillis: 10000,  // Increase timeout for Azure connections
      idleTimeoutMillis: 30000,
      max: 20 // Adjust connection pool size based on expected load
    });
    
    // Add event listeners for connection issues
    pool.on('error', (err) => {
      console.error('Unexpected error on idle client', err);
      pool = null; // Reset pool for future reconnection
    });
  }
  
  return pool;
}

// Test connection function
export async function testConnection() {
  const client = await getConnectionPool().connect();
  try {
    await client.query('SELECT NOW()');
    return { success: true };
  } catch (error) {
    console.error('Database connection test failed:', error);
    return { 
      success: false, 
      message: 'Database connection failed',
      error: (error as Error).message,
      stack: (error as Error).stack 
    };
  } finally {
    client.release();
  }
}