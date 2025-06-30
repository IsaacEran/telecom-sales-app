# 🚀 HOT Telecom System - Complete Setup Guide

## Prerequisites
- Node.js 18+ installed
- Supabase account
- Git (optional)

## Step 1: Install Dependencies

```bash
npm install
```

## Step 2: Set Up Supabase Project

### 2.1 Create New Supabase Project
1. Go to [supabase.com](https://supabase.com)
2. Click "Start your project"
3. Create a new project
4. Wait for project to be ready

### 2.2 Get Your Credentials
1. Go to Project Settings → API
2. Copy your **Project URL** and **anon public key**

### 2.3 Configure Environment Variables
1. Copy the environment template:
   ```bash
   cp .env.local.example .env.local
   ```

2. Edit `.env.local` with your Supabase credentials:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
   ```

## Step 3: Set Up Database Schema

### 3.1 Create Tables
Go to your Supabase project → SQL Editor and run this SQL:

```sql
-- Companies Table
CREATE TABLE companies (
    id SERIAL PRIMARY KEY,
    "שם העסק" TEXT NOT NULL,
    "ח.פ. או ע.מ" TEXT UNIQUE NOT NULL,
    "טלפון" TEXT,
    "כתובת מלאה" TEXT,
    "ספק אינטרנט" TEXT,
    "מייל בית העסק" TEXT,
    "סוג עסק" TEXT,
    "שם מורשה חתימה" TEXT,
    "נייד מורשה חתימה" TEXT,
    "מייל מורשה חתימה" TEXT,
    "שם איש קשר" TEXT,
    "נייד איש קשר" TEXT,
    "מייל איש קשר" TEXT,
    "הערות" TEXT,
    "מרובה סניפים" BOOLEAN DEFAULT FALSE,
    "סניפים" JSONB DEFAULT '[]',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Products Table
CREATE TABLE products (
    id SERIAL PRIMARY KEY,
    "Name" TEXT NOT NULL,
    "Price" NUMERIC,
    "Price36" NUMERIC,
    "Price48" NUMERIC,
    "Description" TEXT,
    "Product Type" TEXT,
    "Product Category" TEXT,
    "HOT Price base" NUMERIC,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Orders Table
CREATE TABLE orders (
    id SERIAL PRIMARY KEY,
    customer_id TEXT REFERENCES companies("ח.פ. או ע.מ"),
    customer_name TEXT,
    branch_index INTEGER,
    payment_plan TEXT,
    items JSONB NOT NULL,
    totals JSONB NOT NULL,
    notes TEXT,
    status TEXT DEFAULT 'new',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### 3.2 Set Up Row Level Security (RLS)

```sql
-- Enable RLS on all tables
ALTER TABLE companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- Create policies for public access (adjust based on your security needs)
-- Companies policies
CREATE POLICY "Enable read access for all users" ON companies FOR SELECT USING (true);
CREATE POLICY "Enable insert for all users" ON companies FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update for all users" ON companies FOR UPDATE USING (true);

-- Products policies  
CREATE POLICY "Enable read access for all users" ON products FOR SELECT USING (true);
CREATE POLICY "Enable insert for all users" ON products FOR INSERT WITH CHECK (true);

-- Orders policies
CREATE POLICY "Enable read access for all users" ON orders FOR SELECT USING (true);
CREATE POLICY "Enable insert for all users" ON orders FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update for all users" ON orders FOR UPDATE USING (true);
```

## Step 4: Import Sample Data

Run the migration script to import existing JSON data:

```bash
npm run migrate
```

This will:
- Import all companies from `data/companies.json`
- Import all products from `data/products.json`
- Transform the data to match Supabase schema

## Step 5: Test the Setup

1. Start the development server:
   ```bash
   npm run dev
   ```

2. Open [http://localhost:3000](http://localhost:3000)

3. Navigate to `/database` page to test:
   - Database connection
   - View statistics
   - Create test company
   - Verify data import

## Step 6: Verify All Features

Test each page:
- **Dashboard** (`/`) - Should load without errors
- **Companies** (`/companies`) - Should display imported companies
- **Products** (`/products`) - Should show product catalog with search
- **New Order** (`/new-order`) - Should load customer selection
- **Database** (`/database`) - Should show connection status

## Troubleshooting

### Connection Issues
- Verify Supabase URL and API key in `.env.local`
- Check Supabase project is active
- Ensure RLS policies are set correctly

### Import Issues
- Check that JSON files exist in `data/` directory
- Verify migration script permissions
- Look at console logs for specific errors

### Component Errors
- Ensure all async functions are properly awaited
- Check browser console for JavaScript errors
- Verify component imports are correct

## Development Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Run production server
npm start

# Import data to Supabase
npm run migrate

# Generate sample data (JSON files)
npm run create-data
```

## Project Structure

```
├── app/                 # Next.js app router pages
├── components/          # React components
├── lib/                 # Database and utility functions
├── data/               # JSON data files (development)
├── scripts/            # Migration and utility scripts
├── public/             # Static assets
└── .env.local          # Environment variables
```

## Security Notes

- The current RLS policies allow public access - adjust these based on your security requirements
- Consider implementing authentication for production use
- Monitor your database usage in the Supabase dashboard
- Never commit `.env.local` to version control

## Next Steps

After successful setup:
1. Implement user authentication
2. Set up proper RLS policies based on user roles
3. Add file upload functionality for attachments
4. Implement PDF generation for orders
5. Set up email notifications

---

🎉 **Your HOT Telecom System is now ready!**