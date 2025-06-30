
-- Companies Table
CREATE TABLE IF NOT EXISTS companies (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  business_name VARCHAR NOT NULL,
  tax_id VARCHAR UNIQUE NOT NULL,
  business_type VARCHAR,
  email VARCHAR,
  phone VARCHAR,
  contact_name VARCHAR,
  contact_phone VARCHAR,
  internet_provider VARCHAR,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Company Branches Table
CREATE TABLE IF NOT EXISTS company_branches (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  company_id UUID REFERENCES companies(id),
  branch_name VARCHAR NOT NULL,
  address TEXT NOT NULL,
  phone VARCHAR,
  contact_name VARCHAR,
  contact_phone VARCHAR,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Products Table
CREATE TABLE IF NOT EXISTS products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR NOT NULL,
  description TEXT,
  base_price DECIMAL(10,2),
  price_36_months DECIMAL(10,2),
  price_48_months DECIMAL(10,2),
  product_type VARCHAR,
  product_category VARCHAR,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Orders Table
CREATE TABLE IF NOT EXISTS orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  company_id UUID REFERENCES companies(id),
  branch_id UUID REFERENCES company_branches(id),
  status VARCHAR NOT NULL,
  total_amount DECIMAL(10,2),
  payment_terms VARCHAR,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Order Items Table
CREATE TABLE IF NOT EXISTS order_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id UUID REFERENCES orders(id),
  product_id UUID REFERENCES products(id),
  quantity INTEGER,
  unit_price DECIMAL(10,2),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Installations Table
CREATE TABLE IF NOT EXISTS installations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id UUID REFERENCES orders(id),
  status VARCHAR NOT NULL,
  scheduled_date TIMESTAMP WITH TIME ZONE,
  completed_date TIMESTAMP WITH TIME ZONE,
  technician_name VARCHAR,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
