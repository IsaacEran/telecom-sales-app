const { Pool } = require('pg');
require('dotenv').config({ path: '.env.local' });

const config = {
  host: process.env.POSTGRES_HOST,
  port: parseInt(process.env.POSTGRES_PORT || '5432'),
  database: process.env.POSTGRES_DATABASE,
  user: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  ssl: process.env.POSTGRES_SSL === 'true' ? { rejectUnauthorized: false } : false,
};

console.log('Config (password hidden):', {
  ...config,
  password: '****'
});

const pool = new Pool(config);

async function testConnection() {
  let client;
  try {
    console.log('Connecting to PostgreSQL...');
    client = await pool.connect();
    console.log('Connected successfully!');
    
    const result = await client.query('SELECT NOW() as current_time');
    console.log('Current database time:', result.rows[0].current_time);
    
    const tablesResult = await client.query(`
      SELECT table_name FROM information_schema.tables 
      WHERE table_schema = 'public'
    `);
    
    console.log('Tables in database:');
    tablesResult.rows.forEach(row => {
      console.log(`- ${row.table_name}`);
    });
  } catch (error) {
    console.error('Error connecting to database:', error);
  } finally {
    if (client) {
      client.release();
      console.log('Client released');
    }
    await pool.end();
    console.log('Pool ended');
  }
}

testConnection();