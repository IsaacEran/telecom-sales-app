// test-connection.js
require('dotenv').config({ path: '.env.local' }); // Load environment variables
const { Pool } = require('pg');

const config = {
  host: process.env.POSTGRES_HOST,
  port: process.env.POSTGRES_PORT,
  database: process.env.POSTGRES_DATABASE,
  user: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  ssl: process.env.POSTGRES_SSL === 'true' ? { rejectUnauthorized: false } : false,
};

console.log('Connection config (password hidden):', {
  ...config,
  password: '****'
});

const pool = new Pool(config);

async function runTests() {
  let client;
  
  try {
    console.log('Attempting to connect to PostgreSQL...');
    client = await pool.connect();
    console.log('✅ Successfully connected to PostgreSQL database!');
    
    // Test 1: Basic connectivity
    console.log('\nTest 1: Basic connectivity');
    const timeResult = await client.query('SELECT NOW() as current_time');
    console.log('✅ Database time:', timeResult.rows[0].current_time);
    
    // Test 2: Check database version
    console.log('\nTest 2: Database version');
    const versionResult = await client.query('SELECT version()');
    console.log('✅ PostgreSQL version:', versionResult.rows[0].version);
    
    // Test 3: List tables in database
    console.log('\nTest 3: Database tables');
    const tablesResult = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `);
    
    if (tablesResult.rows.length === 0) {
      console.log('ℹ️ No tables found in the database (this is expected if you haven\'t created any yet)');
    } else {
      console.log('✅ Tables in database:');
      tablesResult.rows.forEach(row => {
        console.log(`   - ${row.table_name}`);
      });
    }
    
    // Test 4: Check database size
    console.log('\nTest 4: Database size');
    const sizeResult = await client.query(`
      SELECT pg_size_pretty(pg_database_size(current_database())) as db_size
    `);
    console.log('✅ Database size:', sizeResult.rows[0].db_size);

    console.log('\n✅ All database connection tests passed successfully!');
    
  } catch (error) {
    console.error('\n❌ Error during database tests:', error);
    
    // Provide helpful troubleshooting tips based on common errors
    if (error.code === 'ENOTFOUND' || error.code === 'ETIMEDOUT') {
      console.error('\nTroubleshooting tips:');
      console.error('1. Check if the host name is correct');
      console.error('2. Verify that the database server is running');
      console.error('3. Check if your IP is allowed in the firewall rules');
    } else if (error.code === 'ECONNREFUSED') {
      console.error('\nTroubleshooting tips:');
      console.error('1. Verify the port number');
      console.error('2. Check if the database server is accepting connections');
    } else if (error.code === '28P01') {
      console.error('\nTroubleshooting tips:');
      console.error('1. Username or password is incorrect');
      console.error('2. Verify your credentials in .env.local');
    } else if (error.code === '3D000') {
      console.error('\nTroubleshooting tips:');
      console.error('1. The database does not exist');
      console.error('2. Check the database name in .env.local');
    }
  } finally {
    if (client) {
      client.release();
      console.log('Database client released');
    }
    await pool.end();
    console.log('Connection pool closed');
  }
}

// Run the tests
runTests();