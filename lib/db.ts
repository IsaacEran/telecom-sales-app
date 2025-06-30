import { supabase } from './supabase'

// Map Hebrew field names to database columns for companies
const companyFieldMapping: Record<string, string> = {
  "שם העסק": "business_name",
  "ח.פ. או ע.מ": "tax_id",
  "טלפון": "phone",
  "כתובת מלאה": "address",
  "ספק אינטרנט": "internet_provider",
  "מייל בית העסק": "email",
  "סוג עסק": "business_type",
  "שם איש קשר": "contact_name",
  "נייד איש קשר": "contact_phone",
  "הערות": "notes"
}


// Your database uses Hebrew column names, so no mapping needed
export interface Company {
  id?: number;
  "שם העסק": string;
  "ח.פ. או ע.מ": string;
  "טלפון"?: string;
  "כתובת מלאה"?: string;
  "ספק אינטרנט"?: string;
  "מייל בית העסק"?: string;
  "סוג עסק"?: string;
  "שם מורשה חתימה"?: string;
  "נייד מורשה חתימה"?: string;
  "מייל מורשה חתימה"?: string;
  "שם איש קשר"?: string;
  "נייד איש קשר"?: string;
  "מייל איש קשר"?: string;
  "הערות"?: string;
  "מרובה סניפים"?: boolean;
  "סניפים"?: any[];
  created_at?: string;
}

export interface Product {
  id?: number;
  "Name": string;
  "Price"?: number;
  "Price36"?: number;
  "Price48"?: number;
  "Description"?: string;
  "Product Type"?: string;
  "Product Category"?: string;
  "HOT Price base"?: number;
  created_at?: string;
}

export interface User {
  id?: number;
  name: string;
  email: string;
  role: string;
  phone?: string;
  created_at?: string;
}

export interface Order {
  id?: number;
  company_id: string;
  // customer_name removed; use company table for name lookup
  branch_id?: number;
  payment_terms: string;
  total_amount?: number;
  notes?: string;
  status?: string;
  // items and totals moved to order_items and orders tables separately
  created_at?: string;
  updated_at?: string;
}

// Map order field names to database columns
const orderFieldMapping: Record<string, string> = {
  customer_id: "company_id",
  branch_index: "branch_id", 
  payment_plan: "payment_terms",
  total_amount: "total_amount",
  notes: "notes",
  status: "status"
}

// Company functions
export async function getCompanies(): Promise<Company[]> {
  const { data, error } = await supabase
    .from('companies')
    .select('*')
    .order('created_at', { ascending: false })
  
  if (error) {
    console.error('Error fetching companies:', error)
    return []
  }
  return data || []
}

export async function getCompany(id: string): Promise<Company | null> {
  const { data, error } = await supabase
    .from('companies')
    .select('*')
    .eq('"ח.פ. או ע.מ"', id)
    .single()
  
  if (error) {
    console.error('Error fetching company:', error)
    return null
  }
  return data
}

export async function createCompany(company: Omit<Company, 'id' | 'created_at'>): Promise<Company | null> {
  // No field mapping needed - database uses Hebrew column names
  const { data, error } = await supabase
    .from('companies')
    .insert(company)
    .select()
    .single()
  
  if (error) {
    console.error('Error creating company:', error)
    return null
  }
  return data
}

export async function updateCompany(id: string, updates: Partial<Company>): Promise<Company | null> {
  const { data, error } = await supabase
    .from('companies')
    .update(updates)
    .eq('"ח.פ. או ע.מ"', id)
    .select()
    .single()
  
  if (error) {
    console.error('Error updating company:', error)
    return null
  }
  return data
}

export async function searchCompanies(query: string = ''): Promise<Company[]> {
  let supabaseQuery = supabase.from('companies').select('*')
  
  if (query) {
    supabaseQuery = supabaseQuery.or(`"שם העסק".ilike.%${query}%,"ח.פ. או ע.מ".ilike.%${query}%`)
  }
  
  const { data, error } = await supabaseQuery.order('created_at', { ascending: false })
  
  if (error) {
    console.error('Error searching companies:', error)
    return []
  }
  return data || []
}

// Product functions
export async function getProducts(): Promise<Product[]> {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .order('created_at', { ascending: false })
  
  if (error) {
    console.error('Error fetching products:', error)
    return []
  }
  return data || []
}

export async function searchProducts(query: string = ''): Promise<Product[]> {
  let supabaseQuery = supabase.from('products').select('*')
  
  if (query) {
    supabaseQuery = supabaseQuery.or(`"Name".ilike.%${query}%,"Product Type".ilike.%${query}%,"Product Category".ilike.%${query}%`)
  }
  
  const { data, error } = await supabaseQuery.order('created_at', { ascending: false })
  
  if (error) {
    console.error('Error searching products:', error)
    return []
  }
  return data || []
}

export async function filterProductsByCategory(category: string): Promise<Product[]> {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('"Product Category"', category)
    .order('created_at', { ascending: false })
  
  if (error) {
    console.error('Error filtering products by category:', error)
    return []
  }
  return data || []
}

// Order functions
export async function createOrder(orderData: NewOrderData): Promise<Order | null> {
  console.log('Starting createOrder with data:', orderData)
  
  // For now, let's write to the JSON file instead of Supabase
  try {
    const orders = await import('@/data/orders.json')
    const newOrder = {
      id: Date.now(),
      customer_id: orderData.customer_id,
      branch_index: orderData.branch_index,
      payment_plan: orderData.payment_plan,
      total_amount: orderData.total_amount,
      notes: orderData.notes,
      status: orderData.status || 'pending',
      created_at: new Date().toISOString()
    }
    
    console.log('Creating order in JSON:', newOrder)
    
    // For now, just return the order without actually saving
    // This will test if the order creation logic works
    return newOrder as any
    
  } catch (error) {
    console.error('Error in createOrder:', error)
    return null
  }
}

export async function getOrders(): Promise<Order[]> {
  const { data, error } = await supabase
    .from('orders')
    .select('*')
    .order('created_at', { ascending: false })
  
  if (error) {
    console.error('Error fetching orders:', error)
    return []
  }
  return data || []
}

export async function getOrder(id: number): Promise<Order | null> {
  const { data, error } = await supabase
    .from('orders')
    .select('*')
    .eq('id', id)
    .single()
  
  if (error) {
    console.error('Error fetching order:', error)
    return null
  }
  return data
}

// Utility functions
export async function testConnection(): Promise<boolean> {
  try {
    const { data, error } = await supabase.from('companies').select('count')
    return !error
  } catch (error) {
    console.error('Database connection test failed:', error)
    return false
  }
}