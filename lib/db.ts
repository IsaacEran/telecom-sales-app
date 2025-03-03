import { getConnectionPool } from './db-client';
import companies from '@/data/companies.json'
import products from '@/data/products.json'
import users from '@/data/users.json'

export interface Company {
  id?: number;
  "שם העסק": string;
  "ח.פ. או ע.מ": string;
  "ע.מ. או חברה בעמ": string;
  "כתובת מלאה": string;
  "טלפון": string;
  "מייל בית העסק לחשבוניות": string;
  "שם מורשה": string;
  "נייד מורשה": string;
  "ספק אינטרנט": string;
}

export interface Product {
  id?: number;
  Name: string;
  Price: string;
  price36: string;
  price48: string;
  Description: string;
  "Product Type": string;
  "Product Category": string;
  "HOT Price base": string;
}

export interface User {
  id?: number;
  Name: string;
  Email: string;
  Role: string;
  "Type of Contact": string;
  "Team Manager": string;
  Phone: string;
}

export interface Order {
  id?: number;
  customer_id: number;
  agent_id: number;
  order_date: string;
  status: string;
  total_amount: number;
  notes?: string;
}

export interface OrderItem {
  id?: number;
  order_id: number;
  product_id: number;
  quantity: number;
  price_at_time: number;
}

// Helper functions to fetch data
export const getCompanies = async (): Promise<Company[]> => {
  try {
    const client = await getConnectionPool().connect();
    try {
      const result = await client.query('SELECT * FROM companies');
      return result.rows;
    } catch (error) {
      console.error('Database error:', error);
      return companies;
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Error connecting to database:', error);
    return companies;
  }
}

export const getProducts = async (): Promise<Product[]> => {
  try {
    const client = await getConnectionPool().connect();
    try {
      const result = await client.query('SELECT * FROM products');
      return result.rows;
    } catch (error) {
      console.error('Database error:', error);
      return products;
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Error connecting to database:', error);
    return products;
  }
}

export const getUsers = async (): Promise<User[]> => {
  try {
    const client = await getConnectionPool().connect();
    try {
      const result = await client.query('SELECT * FROM users');
      return result.rows;
    } catch (error) {
      console.error('Database error:', error);
      return users;
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Error connecting to database:', error);
    return users;
  }
}

// Helper functions to fetch single items
export const getCompany = async (id: string): Promise<Company | null> => {
  try {
    const client = await getConnectionPool().connect();
    try {
      const result = await client.query('SELECT * FROM companies WHERE "ח.פ. או ע.מ" = $1', [id]);
      if (result.rows.length === 0) {
        return companies.find(company => company["ח.פ. או ע.מ"] === id) || null;
      }
      return result.rows[0];
    } catch (error) {
      console.error('Database error:', error);
      return companies.find(company => company["ח.פ. או ע.מ"] === id) || null;
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Error connecting to database:', error);
    return companies.find(company => company["ח.פ. או ע.מ"] === id) || null;
  }
}

export const getProduct = async (id: string): Promise<Product | null> => {
  try {
    const client = await getConnectionPool().connect();
    try {
      const result = await client.query('SELECT * FROM products WHERE "Name" = $1', [id]);
      if (result.rows.length === 0) {
        return products.find(product => product.Name === id) || null;
      }
      return result.rows[0];
    } catch (error) {
      console.error('Database error:', error);
      return products.find(product => product.Name === id) || null;
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Error connecting to database:', error);
    return products.find(product => product.Name === id) || null;
  }
}

export const getUser = async (email: string): Promise<User | null> => {
  try {
    const client = await getConnectionPool().connect();
    try {
      const result = await client.query('SELECT * FROM users WHERE "Email" = $1', [email]);
      if (result.rows.length === 0) {
        return users.find(user => user.Email === email) || null;
      }
      return result.rows[0];
    } catch (error) {
      console.error('Database error:', error);
      return users.find(user => user.Email === email) || null;
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Error connecting to database:', error);
    return users.find(user => user.Email === email) || null;
  }
}

// Helper functions to search/filter
export const searchCompanies = async (query: string): Promise<Company[]> => {
  try {
    const client = await getConnectionPool().connect();
    try {
      const result = await client.query('SELECT * FROM companies WHERE "שם העסק" ILIKE $1', [`%${query}%`]);
      return result.rows;
    } catch (error) {
      console.error('Database error:', error);
      return companies.filter(company => 
        company["שם העסק"].toLowerCase().includes(query.toLowerCase()));
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Error connecting to database:', error);
    return companies.filter(company => 
      company["שם העסק"].toLowerCase().includes(query.toLowerCase()));
  }
}

export const searchProducts = async (query: string): Promise<Product[]> => {
  try {
    const client = await getConnectionPool().connect();
    try {
      const result = await client.query('SELECT * FROM products WHERE "Name" ILIKE $1', [`%${query}%`]);
      return result.rows;
    } catch (error) {
      console.error('Database error:', error);
      return products.filter(product => 
        product.Name.toLowerCase().includes(query.toLowerCase()));
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Error connecting to database:', error);
    return products.filter(product => 
      product.Name.toLowerCase().includes(query.toLowerCase()));
  }
}

export const filterProductsByCategory = async (category: string): Promise<Product[]> => {
  console.log('Filtering products by category:', category);
  try {
    const client = await getConnectionPool().connect();
    try {
      const result = await client.query('SELECT * FROM products WHERE "Product Category" = $1', [category]);
      console.log('Filtered products:', result.rows);
      return result.rows;
    } catch (error) {
      console.error('Database error:', error);
      throw error; // This will be caught in the component
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Error connecting to database:', error);
    throw error;
  }
}

export const createOrder = async (orderData: Order, orderItems: OrderItem[]): Promise<Order | null> => {
  const client = await getConnectionPool().connect();
  try {
    // Start transaction
    await client.query('BEGIN');
    
    // Insert order and get the generated ID
    const orderResult = await client.query(
      'INSERT INTO orders (customer_id, agent_id, order_date, status, total_amount, notes) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [orderData.customer_id, orderData.agent_id, orderData.order_date, orderData.status, orderData.total_amount, orderData.notes]
    );
    
    const newOrder = orderResult.rows[0];
    
    // Insert order items
    for (const item of orderItems) {
      await client.query(
        'INSERT INTO order_items (order_id, product_id, quantity, price_at_time) VALUES ($1, $2, $3, $4)',
        [newOrder.id, item.product_id, item.quantity, item.price_at_time]
      );
    }
    
    // Commit transaction
    await client.query('COMMIT');
    
    return newOrder;
  } catch (error) {
    // Rollback transaction on error
    await client.query('ROLLBACK');
    console.error('Error creating order:', error);
    return null;
  } finally {
    client.release();
  }
}

export const getOrders = async (): Promise<Order[]> => {
  try {
      const client = await getConnectionPool().connect();
    try {
      // Use a JOIN query instead of Supabase's nested queries
      const result = await client.query(`
        SELECT o.*, 
               c.* AS customer,
               u.* AS agent
        FROM orders o
        LEFT JOIN companies c ON o.customer_id = c.id
        LEFT JOIN users u ON o.agent_id = u.id
        ORDER BY o.order_date DESC
      `);
      
      // Fetch order items for each order
      const orders = result.rows;
      for (const order of orders) {
        const itemsResult = await client.query(`
          SELECT oi.*, p.* AS product
          FROM order_items oi
          LEFT JOIN products p ON oi.product_id = p.id
          WHERE oi.order_id = $1
        `, [order.id]);
        
        order.items = itemsResult.rows;
      }
      
      return orders;
    } catch (error) {
      console.error('Database error:', error);
      return [];
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Error connecting to database:', error);
    return [];
  }
}

export const getOrderById = async (id: string): Promise<Order | null> => {
  try {
    const client = await getConnectionPool().connect();
    try {
      // Use a JOIN query instead of Supabase's nested queries
      const result = await client.query(`
        SELECT o.*, 
               c.* AS customer,
               u.* AS agent
        FROM orders o
        LEFT JOIN companies c ON o.customer_id = c.id
        LEFT JOIN users u ON o.agent_id = u.id
        WHERE o.id = $1
      `, [id]);
      
      if (result.rows.length === 0) {
        return null;
      }
      
      const order = result.rows[0];
      
      // Fetch order items
      const itemsResult = await client.query(`
        SELECT oi.*, p.* AS product
        FROM order_items oi
        LEFT JOIN products p ON oi.product_id = p.id
        WHERE oi.order_id = $1
      `, [id]);
      
      order.items = itemsResult.rows;
      
      return order;
    } catch (error) {
      console.error('Database error:', error);
      return null;
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Error connecting to database:', error);
    return null;
  }
}

export const updateOrder = async (id: string, orderData: Partial<Order>): Promise<Order | null> => {
  try {
    const client = await getConnectionPool().connect();
    try {
      // Create SET clause dynamically based on provided fields
      const fields = Object.keys(orderData);
      if (fields.length === 0) return null;
      
      const setClause = fields.map((field, i) => `"${field}" = $${i + 1}`).join(', ');
      const values = Object.values(orderData);
      
      const query = `UPDATE orders SET ${setClause} WHERE id = $${values.length + 1} RETURNING *`;
      const result = await client.query(query, [...values, id]);
      
      if (result.rows.length === 0) {
        return null;
      }
      
      return result.rows[0];
    } catch (error) {
      console.error('Database error:', error);
      return null;
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Error connecting to database:', error);
    return null;
  }
}

export const deleteOrder = async (id: string): Promise<boolean> => {
  try {
      const client = await getConnectionPool().connect();
    try {
      // Start transaction
      await client.query('BEGIN');
      
      // Delete order items first (foreign key constraint)
      await client.query('DELETE FROM order_items WHERE order_id = $1', [id]);
      
      // Delete the order
      await client.query('DELETE FROM orders WHERE id = $1', [id]);
      
      // Commit transaction
      await client.query('COMMIT');
      
      return true;
    } catch (error) {
      // Rollback transaction on error
      await client.query('ROLLBACK');
      console.error('Database error:', error);
      return false;
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Error connecting to database:', error);
    return false;
  }
}