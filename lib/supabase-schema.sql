-- Optimized Telecom Sales Management System Schema
-- Combines best practices from both schemas

-- Companies Table (Hebrew column names for business compatibility)
CREATE TABLE IF NOT EXISTS public.companies (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  "שם העסק" VARCHAR NOT NULL,
  "ח.פ. או ע.מ" VARCHAR UNIQUE NOT NULL,
  "טלפון" VARCHAR,
  "כתובת מלאה" TEXT,
  "ספק אינטרנט" VARCHAR,
  "מייל בית העסק" VARCHAR,
  "סוג עסק" VARCHAR,
  "שם מורשה חתימה" VARCHAR,
  "נייד מורשה חתימה" VARCHAR,
  "מייל מורשה חתימה" VARCHAR,
  "שם איש קשר" VARCHAR,
  "נייד איש קשר" VARCHAR,
  "מייל איש קשר" VARCHAR,
  "הערות" TEXT,
  "מרובה סניפים" BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Company Branches Table
CREATE TABLE IF NOT EXISTS public.company_branches (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  company_id UUID NOT NULL,
  branch_name VARCHAR NOT NULL,
  address TEXT NOT NULL,
  phone VARCHAR,
  contact_name VARCHAR,
  contact_phone VARCHAR,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  CONSTRAINT company_branches_company_id_fkey 
    FOREIGN KEY (company_id) REFERENCES public.companies(id) ON DELETE CASCADE
);

-- Products Table (matching existing JSON structure)
CREATE TABLE IF NOT EXISTS public.products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  "Name" VARCHAR NOT NULL,
  "Price" NUMERIC(10,2),
  "Price36" NUMERIC(10,2),
  "Price48" NUMERIC(10,2),
  "Description" TEXT,
  "Product Type" VARCHAR,
  "Product Category" VARCHAR,
  "HOT Price base" NUMERIC(10,2),
  "Product Pic" TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Orders Table  
CREATE TABLE IF NOT EXISTS public.orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  company_id UUID NOT NULL,
  branch_id UUID, -- Optional for single-branch companies
  payment_terms VARCHAR NOT NULL DEFAULT 'one-time',
  total_amount NUMERIC(10,2),
  notes TEXT,
  status VARCHAR DEFAULT 'new',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  CONSTRAINT orders_company_id_fkey 
    FOREIGN KEY (company_id) REFERENCES public.companies(id) ON DELETE CASCADE,
  CONSTRAINT orders_branch_id_fkey 
    FOREIGN KEY (branch_id) REFERENCES public.company_branches(id) ON DELETE SET NULL,
  CONSTRAINT orders_payment_terms_check 
    CHECK (payment_terms IN ('one-time', '36', '48')),
  CONSTRAINT orders_status_check 
    CHECK (status IN ('new', 'processing', 'completed', 'cancelled'))
);

-- Order Items Table
CREATE TABLE IF NOT EXISTS public.order_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id UUID NOT NULL,
  product_id UUID NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 1,
  unit_price NUMERIC(10,2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  CONSTRAINT order_items_order_id_fkey 
    FOREIGN KEY (order_id) REFERENCES public.orders(id) ON DELETE CASCADE,
  CONSTRAINT order_items_product_id_fkey 
    FOREIGN KEY (product_id) REFERENCES public.products(id) ON DELETE RESTRICT,
  CONSTRAINT order_items_quantity_check 
    CHECK (quantity > 0),
  CONSTRAINT order_items_unit_price_check 
    CHECK (unit_price >= 0)
);

-- Installations Table
CREATE TABLE IF NOT EXISTS public.installations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id UUID NOT NULL,
  status VARCHAR NOT NULL DEFAULT 'scheduled',
  scheduled_date TIMESTAMP WITH TIME ZONE,
  completed_date TIMESTAMP WITH TIME ZONE,
  technician_name VARCHAR,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  CONSTRAINT installations_order_id_fkey 
    FOREIGN KEY (order_id) REFERENCES public.orders(id) ON DELETE CASCADE,
  CONSTRAINT installations_status_check 
    CHECK (status IN ('scheduled', 'in_progress', 'completed', 'cancelled', 'rescheduled')),
  CONSTRAINT installations_dates_check 
    CHECK (completed_date IS NULL OR completed_date >= scheduled_date)
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_companies_business_id ON public.companies("ח.פ. או ע.מ");
CREATE INDEX IF NOT EXISTS idx_company_branches_company_id ON public.company_branches(company_id);
CREATE INDEX IF NOT EXISTS idx_orders_company_id ON public.orders(company_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON public.orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON public.orders(created_at);
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON public.order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_order_items_product_id ON public.order_items(product_id);
CREATE INDEX IF NOT EXISTS idx_installations_order_id ON public.installations(order_id);
CREATE INDEX IF NOT EXISTS idx_installations_status ON public.installations(status);
CREATE INDEX IF NOT EXISTS idx_installations_scheduled_date ON public.installations(scheduled_date);

-- Enable Row Level Security (RLS) for multi-tenant access
ALTER TABLE public.companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.installations ENABLE ROW LEVEL SECURITY;

-- Create permissive policies for development (replace with proper policies in production)
CREATE POLICY "Allow all operations for anon users on companies" ON public.companies FOR ALL TO anon USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations for anon users on orders" ON public.orders FOR ALL TO anon USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations for anon users on order_items" ON public.order_items FOR ALL TO anon USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations for anon users on installations" ON public.installations FOR ALL TO anon USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations for anon users on company_branches" ON public.company_branches FOR ALL TO anon USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations for anon users on products" ON public.products FOR ALL TO anon USING (true) WITH CHECK (true);