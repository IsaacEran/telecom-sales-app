import companies from '@/data/companies.json'
import products from '@/data/products.json'
import users from '@/data/users.json'

export interface Company {
  "שם העסק": string;
  "ח.פ. או ע.מ": string;
  "ע.מ. או חברה בעמ": string;
  "כתובת מלאה": string;
  "טלפון": string;
  "מייל בית העסק לחשבוניות": string;
  "שם מורשה": string;
  "נייד מורשה": string;
  "ספק אינטרנט": string;
  // Add other fields as needed
}

export interface Product {
  Name: string;
  Price: string;    // One-time payment price
  price36: string;  // 36 payments price
  price48: string;  // 48 payments price
  Description: string;
  "Product Type": string;
  "Product Category": string;
  "HOT Price base": string;
}

export interface User {
  Name: string;
  Email: string;
  Role: string;
  "Type of Contact": string;
  "Team Manager": string;
  Phone: string;
  // Add other fields as needed
}

// Helper functions to fetch data
export const getCompanies = (): Company[] => companies
export const getProducts = (): Product[] => products
export const getUsers = (): User[] => users

// Helper functions to fetch single items
export const getCompany = (id: string): Company | undefined => 
  companies.find(company => company["ח.פ. או ע.מ"] === id)

export const getProduct = (name: string): Product | undefined => 
  products.find(product => product.Name === name)

export const getUser = (email: string): User | undefined => 
  users.find(user => user.Email === email)

// Helper functions to search/filter
export const searchCompanies = (query: string): Company[] => 
  companies.filter(company => 
    company["שם העסק"].toLowerCase().includes(query.toLowerCase()))

export const searchProducts = (query: string): Product[] => 
  products.filter(product => 
    product.Name.toLowerCase().includes(query.toLowerCase()))

export const filterProductsByCategory = (category: string): Product[] => 
  products.filter(product => product["Product Category"] === category) 