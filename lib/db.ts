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
  id?: string; // UUID (matching existing database)
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
  created_at?: string;
}

export interface CompanyBranch {
  id?: string; // UUID
  company_id: string;
  branch_name: string;
  address: string;
  phone?: string;
  contact_name?: string;
  contact_phone?: string;
  created_at?: string;
}

export interface Product {
  id?: string; // UUID (matching existing database)
  "Name": string;
  "Price"?: number;
  "Price36"?: number;
  "Price48"?: number;
  "Description"?: string;
  "Product Type"?: string;
  "Product Category"?: string;
  "HOT Price base"?: number;
  "Product pic"?: string;
  created_at?: string;
}

export interface User {
  id?: string; // UUID 
  name: string;
  email: string;
  role: string;
  phone?: string;
  created_at?: string;
}

export interface Order {
  id?: string; // UUID
  company_id: string; // UUID references companies(id)
  branch_id?: string; // UUID references company_branches(id)
  payment_terms: string;
  total_amount?: number;
  notes?: string;
  status?: string;
  created_at?: string;
  updated_at?: string;
}

// Payload type for creating orders using client keys
export interface NewOrderData {
  customer_id: string;
  branch_id?: string; // UUID of branch, null for single-branch companies
  payment_plan: string;
  total_amount?: number;
  notes?: string;
  status?: string;
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

  // Note: Branches are now created separately using createCompanyBranch function
  
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

// Get company branches
export async function getCompanyBranches(companyId: string): Promise<CompanyBranch[]> {
  const { data, error } = await supabase
    .from('company_branches')
    .select('*')
    .eq('company_id', companyId)
    .order('created_at', { ascending: true })
  
  if (error) {
    console.error('Error fetching company branches:', error)
    return []
  }
  return data || []
}

// Create a company branch
export async function createCompanyBranch(branch: Omit<CompanyBranch, 'id' | 'created_at'>): Promise<CompanyBranch | null> {
  const { data, error } = await supabase
    .from('company_branches')
    .insert(branch)
    .select()
    .single()
  
  if (error) {
    console.error('Error creating company branch:', error)
    return null
  }
  return data
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
  
  try {
    // First, find the company UUID by tax_id (using Hebrew column name)
    const { data: companies, error: companyError } = await supabase
      .from('companies')
      .select('id')
      .eq('"ח.פ. או ע.מ"', orderData.customer_id)
      
    if (companyError) {
      console.error('Error finding company:', companyError)
      return null
    }
    
    if (!companies || companies.length === 0) {
      console.error('No company found with tax_id:', orderData.customer_id)
      
      // List all companies to debug
      const { data: allCompanies } = await supabase
        .from('companies')
        .select('id, "ח.פ. או ע.מ", "שם העסק"')
      console.log('Available companies:', allCompanies)
      
      return null
    }
    
    const company = companies[0]

    // Create the order payload
    const payload = {
      company_id: company.id, // UUID
      branch_id: orderData.branch_id || null, // UUID or null
      payment_terms: orderData.payment_plan,
      total_amount: orderData.total_amount,
      notes: orderData.notes,
      status: orderData.status || 'new'
    }
    
    console.log('Order payload for Supabase:', payload)
    
    // Insert into orders table
    const { data, error } = await supabase
      .from('orders')
      .insert(payload)
      .select()
      .single()

    if (error) {
      console.error('Error creating order in Supabase:', error)
      return null
    }
    
    console.log('Order successfully created in Supabase:', data)
    return data
    
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

export async function getOrder(id: string): Promise<Order | null> {
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
// Order Item types and functions
export interface OrderItemDB {
  id?: string;
  order_id: string;
  product_id: string;
  quantity: number;
  unit_price: number;
  created_at?: string;
}

export interface NewOrderItemData {
  order_id: string;
  product_id: string;
  quantity: number;
  unit_price: number;
}

export async function createOrderItem(item: NewOrderItemData): Promise<OrderItemDB | null> {
  console.log('Creating order item:', item);
  
  const { data, error } = await supabase
    .from('order_items')
    .insert(item)
    .select()
    .single();

  if (error) {
    console.error('Error creating order item:', error);
    return null;
  }
  
  console.log('Order item created successfully:', data);
  return data;
}

export async function testConnection(): Promise<boolean> {
  try {
    const { data, error } = await supabase.from('companies').select('count')
    return !error
  } catch (error) {
    console.error('Database connection test failed:', error)
    return false
  }
}