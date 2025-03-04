// test-connection.js
const { Client } = require('pg');
require('dotenv').config({ path: '.env.local' }); // Add this to load .env.local

async function testConnection() {
  // Configuration
  const config = {
    host: process.env.POSTGRES_HOST,
    port: parseInt(process.env.POSTGRES_PORT || '5432'),
    database: process.env.POSTGRES_DATABASE,
    user: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    ssl: process.env.POSTGRES_SSL === 'true' ? {
      rejectUnauthorized: false
    } : false,
    connectionTimeoutMillis: 15000
  };
  
  // Hide password in logs
  console.log('Attempting connection with:', {
    ...config,
    password: '****'
  });
  
  
  // Hide password in logs
  console.log('Attempting connection with:', {
    ...config,
    password: '****'
  });
  
  const client = new Client(config);
  
  try {
    console.log('Connecting to PostgreSQL...');
    await client.connect();
    console.log('Connected successfully!');
    
    // Test a simple query
    const res = await client.query('SELECT current_database() as db_name, current_user as user_name, inet_server_addr() as server_ip');
    console.log('Connection info:', res.rows[0]);
    
    // Close the connection
    await client.end();
    console.log('Connection closed');
  } catch (err) {
    console.error('Error connecting to database:');
    console.error('  Message:', err.message);
    console.error('  Code:', err.code);
    console.error('  Detail:', err.detail);
    console.error('  File:', err.file);
    console.error('  Line:', err.line);
    console.error('  Routine:', err.routine);
    
    // Try to close the client even if connection failed
    try {
      await client.end();
    } catch (e) {
      // Ignore errors when closing failed connection
    }
  }
}

testConnection();