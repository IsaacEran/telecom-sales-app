import { supabase } from './supabase'
import companies from '@/data/companies.json'
import products from '@/data/products.json'
import users from '@/data/users.json'

export interface Company {
  id?: string;
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
  id?: string;
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
  id?: string;
  Name: string;
  Email: string;
  Role: string;
  "Type of Contact": string;
  "Team Manager": string;
  Phone: string;
}

export interface Order {
  id?: string;
  customer_id: string;
  agent_id: string;
  order_date: string;
  status: string;
  total_amount: number;
  notes?: string;
}

export interface OrderItem {
  id?: string;
  order_id: string;
  product_id: string;
  quantity: number;
  price_at_time: number;
}

// Helper functions to fetch data
export const getCompanies = async (): Promise<Company[]> => {
  try {
    const { data, error } = await supabase
      .from('companies')
      .select('*')
    
    if (error) {
      console.error('Supabase error:', error)
      return companies
    }
    
    return data || companies
  } catch (error) {
    console.error('Error fetching companies:', error)
    return companies
  }
}

export const getProducts = async (): Promise<Product[]> => {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
    
    if (error) {
      console.error('Supabase error:', error)
      return products
    }
    
    return data || products
  } catch (error) {
    console.error('Error fetching products:', error)
    return products
  }
}

export const getUsers = async (): Promise<User[]> => {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('*')
    
    if (error) {
      console.error('Supabase error:', error)
      return users
    }
    
    return data || users
  } catch (error) {
    console.error('Error fetching users:', error)
    return users
  }
}

// Helper functions to fetch single items
export const getCompany = async (id: string): Promise<Company | null> => {
  const { data, error } = await supabase
    .from('companies')
    .select('*')
    .eq('ח.פ. או ע.מ', id)
    .single()
  
  if (error) {
    console.error('Supabase error:', error)
    return companies.find(company => company["ח.פ. או ע.מ"] === id) || null
  }
  
  return data
}

export const getProduct = async (id: string): Promise<Product | null> => {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('id', id)
    .single()
  
  if (error) {
    console.error('Supabase error:', error)
    return products.find(product => product.Name === id) || null
  }
  
  return data
}

export const getUser = async (email: string): Promise<User | null> => {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('Email', email)
    .single()
  
  if (error) {
    console.error('Supabase error:', error)
    return users.find(user => user.Email === email) || null
  }
  
  return data
}

// Helper functions to search/filter
export const searchCompanies = async (query: string): Promise<Company[]> => {
  const { data, error } = await supabase
    .from('companies')
    .select('*')
    .ilike('שם העסק', `%${query}%`)
  
  if (error) {
    console.error('Supabase error:', error)
    return companies.filter(company => 
      company["שם העסק"].toLowerCase().includes(query.toLowerCase()))
  }
  
  return data || []
}

export const searchProducts = async (query: string): Promise<Product[]> => {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .ilike('Name', `%${query}%`)
  
  if (error) {
    console.error('Supabase error:', error)
    return products.filter(product => 
      product.Name.toLowerCase().includes(query.toLowerCase()))
  }
  
  return data || []
}

export const filterProductsByCategory = async (category: string): Promise<Product[]> => {
  console.log('Filtering products by category:', category)
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('Product Category', category)
  
  if (error) {
    console.error('Supabase error:', error)
    throw error // This will be caught in the component
  }
  
  console.log('Filtered products:', data)
  return data || []
}
export const createOrder = async (orderData: Order, orderItems: OrderItem[]): Promise<Order | null> => {
  const { data, error } = await supabase
    .from('orders')
    .insert(orderData)
    .select()
    .single()
  
  if (error) {
    console.error('Error creating order:', error)
    return null
  }

  if (data) {
    const { error: itemsError } = await supabase
      .from('order_items')
      .insert(orderItems.map(item => ({ ...item, order_id: data.id })))
    
    if (itemsError) {
      console.error('Error creating order items:', itemsError)
      return null
    }
  }

  return data
}

export const getOrders = async (): Promise<Order[]> => {
  const { data, error } = await supabase
    .from('orders')
    .select(`
      *,
      customer:companies!customer_id(*),
      agent:users!agent_id(*),
      items:order_items(
        *,
        product:products(*)
      )
    `)
    .order('order_date', { ascending: false })
  
  if (error) {
    console.error('Error fetching orders:', error)
    return []
  }
  
  return data || []
}

export const getOrderById = async (id: string): Promise<Order | null> => {
  const { data, error } = await supabase
    .from('orders')
    .select(`
      *,
      customer:companies!customer_id(*),
      agent:users!agent_id(*),
      items:order_items(
        *,
        product:products(*)
      )
    `)
    .eq('id', id)
    .single()
  
  if (error) {
    console.error('Error fetching order:', error)
    return null
  }
  
  return data
}

export const updateOrder = async (id: string, orderData: Partial<Order>): Promise<Order | null> => {
  const { data, error } = await supabase
    .from('orders')
    .update(orderData)
    .eq('id', id)
    .select()
    .single()
  
  if (error) {
    console.error('Error updating order:', error)
    return null
  }
  
  return data
}

export const deleteOrder = async (id: string): Promise<boolean> => {
  const { error } = await supabase
    .from('orders')
    .delete()
    .eq('id', id)
  
  if (error) {
    console.error('Error deleting order:', error)
    return false
  }
  
  return true
}