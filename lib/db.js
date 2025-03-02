import pool from './db-client';

export async function getCompanies() {
  try {
    const result = await pool.query('SELECT * FROM companies');
    return result.rows;
  } catch (error) {
    console.error('Error fetching companies:', error);
    return [];
  }
}

export async function getCompany(id) {
  try {
    const result = await pool.query('SELECT * FROM companies WHERE "ח.פ. או ע.מ" = $1', [id]);
    return result.rows[0];
  } catch (error) {
    console.error('Error fetching company:', error);
    return null;
  }
}

export async function searchProducts(searchQuery) {
  try {
    if (!searchQuery) {
      const result = await pool.query('SELECT * FROM products');
      return result.rows;
    }
    
    const result = await pool.query(
      'SELECT * FROM products WHERE "Name" ILIKE $1 OR "Product Type" ILIKE $1',
      [`%${searchQuery}%`]
    );
    return result.rows;
  } catch (error) {
    console.error('Error searching products:', error);
    return [];
  }
}