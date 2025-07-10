# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Create sample data (populates JSON files)
npm run create-data

# Migrate data from JSON to Supabase
npm run migrate
```

## Development Setup

1. Copy `.env.local.example` to `.env.local` and configure Supabase credentials
2. Run `npm install` to install dependencies
3. Use `npm run create-data` to generate sample data for development
4. Start development server with `npm run dev`

## Architecture Overview

This is a **Next.js 14 telecom sales management system** with Hebrew RTL support built for HOT Business salespeople.

### Technology Stack
- **Framework**: Next.js 14 with App Router + TypeScript
- **UI**: Tailwind CSS + shadcn/ui (Radix UI components)
- **Database**: Dual approach - JSON files (dev) + Supabase (production)
- **Language**: Hebrew interface with RTL layout support

### Key Architecture Patterns

**Dual Database System**:
- Development: JSON files in `/data/` directory (`companies.json`, `products.json`, `users.json`)
- Production: Supabase PostgreSQL with schema in `lib/supabase-schema.sql`
- Data access layer: `lib/db.ts` handles JSON operations, `lib/supabase.ts` for Supabase client

**Multi-step Order Creation Workflow**:
- Complex 3-step wizard in `/app/new-order/page.tsx`
- Customer selection → Branch management → Product selection → Order summary
- State management through React hooks (no global state)

**Customer Branch System**:
- Companies can have multiple branches
- Each order item is associated with a specific branch
- Branch selection component: `components/customer-select.tsx`

**Payment Plans Architecture**:
- Products support 3 pricing tiers: one-time, 36-month, 48-month payments
- Price calculation based on selected payment term
- Secure router as optional add-on

### Critical File Relationships

**Data Flow**:
```
/data/*.json → lib/db.ts → app/*/page.tsx → components/
```

**Order Creation Dependencies**:
- `app/new-order/page.tsx` depends on `components/customer-select.tsx`
- Customer selection requires both `data/companies.json` and branch management
- Product selection pulls from `data/products.json` with category filtering

**Component Dependencies**:
- `components/customer-select.tsx` manages customer and branch selection logic
- `components/contract-tables.tsx` displays order summaries
- All UI components extend shadcn/ui base components in `components/ui/`

### Hebrew RTL Implementation

- `app/layout.tsx` sets `dir="rtl"` and Hebrew fonts
- All forms and layouts designed RTL-first
- Text alignment and spacing optimized for Hebrew content
- Date/currency formatting follows Hebrew locale conventions

### Business Logic Patterns

**User Role System** (as defined in specification):
- Sales agents: own data access only
- Sales managers: team data access
- Marketing managers: product catalog management
- Super admins: full system access

**Order Status Workflow**:
- Draft → Pending → Approved/Cancelled
- Multi-branch orders with individual line items
- Installation scheduling integration

**File I/O Operations**:
- `lib/csvHandler.ts` handles CSV import/export
- Image upload support for customer devices
- PDF generation for orders

## Development Notes

**State Management**: Uses React's built-in hooks only - no Redux/Zustand
**Form Validation**: Comprehensive error handling in multi-step forms
**Responsive Design**: Mobile-first Tailwind approach with Hebrew text considerations
**Type Safety**: Full TypeScript implementation with proper type definitions

**Database Schema** (production):
- Tables: companies, company_branches, products, orders, order_items, installations
- Schema definition: `lib/supabase-schema.sql`
- Migration between JSON and Supabase handled in data access layer

**Environment Variables Required**:
- `NEXT_PUBLIC_SUPABASE_URL`: Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Supabase anon key for client operations

**Database Connection**:
- Supabase client configured in `lib/supabase.ts`
- Connection test available via `testConnection()` function in `lib/db.ts`
- Companies table uses Hebrew column names for business compatibility

## Technical Configuration

**TypeScript Configuration**:
- Uses `@/*` path mapping for imports
- Strict mode enabled with bundler module resolution
- Next.js plugin configured for app directory

**Styling Configuration**:
- Tailwind CSS with custom theme extending shadcn/ui colors
- CSS variables for theming support (`--primary`, `--secondary`, etc.)
- Dark mode support with class-based toggle
- RTL-optimized layout patterns

**Next.js Configuration**:
- Custom webpack config disables `fs` and `path` modules for client-side
- ES modules configured via `"type": "module"` in package.json
- App Router architecture with TypeScript support