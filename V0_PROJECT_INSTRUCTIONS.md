# V0 by Vercel - UI Development Instructions
## HOT Business Telecom Sales Management System

This document provides comprehensive instructions for continuing UI development using V0 by Vercel for the HOT Business telecom sales management system.

## Project Overview

**System Type:** Next.js 14 telecom sales management system with Hebrew RTL support
**Target Users:** HOT Business salespeople in Israel
**Language:** Hebrew interface with right-to-left (RTL) layout

## Technology Stack

- **Framework:** Next.js 14 with App Router + TypeScript
- **UI Library:** Tailwind CSS + shadcn/ui (Radix UI components)
- **Database:** Dual system - JSON files (dev) + Supabase (production)
- **Styling:** Tailwind CSS with RTL support
- **Components:** shadcn/ui component library

## Design Requirements

### Language & Localization
- **Primary Language:** Hebrew (עברית)
- **Layout Direction:** RTL (right-to-left)
- **Font:** Use Hebrew-compatible fonts
- **Text Alignment:** Right-aligned for Hebrew text
- **Currency:** Israeli Shekel (₪)
- **Date Format:** Hebrew locale conventions

### Visual Design Principles
- **Modern Clean Interface:** Professional business application
- **Card-based Layout:** Use shadcn/ui Card components extensively
- **Responsive Design:** Mobile-first approach
- **Color Scheme:** Professional blues/grays with accent colors
- **Typography:** Clear, readable Hebrew fonts
- **Spacing:** Generous whitespace for Hebrew text readability

## Core UI Components Available

### shadcn/ui Components Already Implemented
```typescript
// Available in /components/ui/
- Button
- Card (CardContent, CardDescription, CardHeader, CardTitle)
- Input
- Dialog (DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger)
- Select (SelectContent, SelectItem, SelectTrigger, SelectValue)
- Table (TableBody, TableCell, TableHead, TableHeader, TableRow)
- Badge
- Alert (AlertDescription, AlertTitle)
```

### Custom Components Available
```typescript
// Available in /components/
- customer-select.tsx - Customer and branch selection
- contract-tables.tsx - Order summary tables
```

## Data Models & Interfaces

### Product Interface
```typescript
interface Product {
  id?: string; // UUID
  "Name": string;
  "Price"?: number;
  "Price36"?: number; // 36-month payment plan
  "Price48"?: number; // 48-month payment plan
  "Description"?: string;
  "Product Type"?: string;
  "Product Category"?: string; // OTC, Service, One time
  "HOT Price base"?: number;
  "Product pic"?: string; // Image URL
  created_at?: string;
}
```

### Company Interface
```typescript
interface Company {
  id?: string; // UUID
  "שם העסק": string; // Business name
  "ח.פ. או ע.מ": string; // Tax ID
  "טלפון"?: string; // Phone
  "כתובת מלאה"?: string; // Full address
  "ספק אינטרנט"?: string; // Internet provider
  "מייל בית העסק"?: string; // Business email
  "סוג עסק"?: string; // Business type
  "שם מורשה חתימה"?: string; // Authorized signatory name
  "נייד מורשה חתימה"?: string; // Authorized signatory mobile
  "מייל מורשה חתימה"?: string; // Authorized signatory email
  "שם איש קשר"?: string; // Contact person name
  "נייד איש קשר"?: string; // Contact person mobile
  "מייל איש קשר"?: string; // Contact person email
  "הערות"?: string; // Notes
  "מרובה סניפים"?: boolean; // Multiple branches
  created_at?: string;
}
```

### Order Interface
```typescript
interface Order {
  id?: string; // UUID
  company_id: string;
  branch_id?: string;
  payment_terms: string; // 'one-time', '36', '48'
  total_amount?: number;
  notes?: string;
  status?: string; // 'new', 'processing', 'completed', 'cancelled'
  created_at?: string;
  updated_at?: string;
}
```

## Key Business Logic Patterns

### Multi-step Order Creation Workflow
1. **Customer Selection** - Choose company and branch
2. **Branch Management** - Handle single/multi-branch companies
3. **Product Selection** - Add products with payment terms
4. **Order Summary** - Review and confirm

### Payment Plans System
- **One-time Payment:** Full price upfront
- **36-month Plan:** Monthly installments over 36 months
- **48-month Plan:** Monthly installments over 48 months

### Product Categories
- **OTC** (Over The Counter)
- **Service** 
- **One time**

## Existing Pages Structure

```
/app/
├── page.tsx - Dashboard/Home page
├── new-order/page.tsx - Multi-step order creation
├── products/page.tsx - Product catalog with images
├── database/page.tsx - Database management
└── layout.tsx - Root layout with RTL support
```

## UI Development Guidelines for V0

### 1. Component Creation Prompts
When creating new components with V0, use these prompt patterns:

```
Create a Hebrew RTL [component type] for a telecom sales app using:
- Next.js 14 + TypeScript
- Tailwind CSS with RTL support
- shadcn/ui components
- Hebrew text content
- Professional business design
- Card-based layout
```

### 2. Layout Specifications
```css
/* RTL Layout Classes */
.rtl-container {
  direction: rtl;
  text-align: right;
}

/* Spacing for Hebrew text */
.hebrew-text {
  font-family: 'Segoe UI', 'Arial', sans-serif;
  line-height: 1.6;
}
```

### 3. Common Hebrew Text Patterns
```typescript
// Navigation & Actions
"דף הבית" // Home page
"הזמנה חדשה" // New order
"קטלוג מוצרים" // Product catalog
"ניהול לקוחות" // Customer management
"חיפוש" // Search
"שמירה" // Save
"ביטול" // Cancel
"עריכה" // Edit
"מחיקה" // Delete

// Product & Order Terms
"מוצרים" // Products
"הזמנות" // Orders
"לקוחות" // Customers
"מחיר" // Price
"תיאור" // Description
"כמות" // Quantity
"סה"כ" // Total
"תשלום חד פעמי" // One-time payment
"36 תשלומים" // 36 payments
"48 תשלומים" // 48 payments
```

### 4. Form Patterns
```typescript
// Form field patterns for Hebrew
<div className="space-y-4 text-right">
  <div>
    <label className="block text-sm font-medium mb-2">
      שם העסק *
    </label>
    <Input
      placeholder="הזן שם עסק..."
      className="text-right"
      dir="rtl"
    />
  </div>
</div>
```

### 5. Card Layout Patterns
```typescript
<Card className="hover:shadow-lg transition-shadow">
  <CardHeader>
    <CardTitle className="text-lg text-right">{title}</CardTitle>
    <CardDescription className="text-right">
      {description}
    </CardDescription>
  </CardHeader>
  <CardContent>
    {/* Content with RTL support */}
  </CardContent>
</Card>
```

## Specific V0 Development Tasks

### High Priority UI Components Needed

1. **Customer Management Interface**
   - Customer list with search and filters
   - Customer detail/edit forms
   - Branch management for multi-location customers

2. **Enhanced Product Catalog**
   - Product grid with images
   - Product detail modals
   - Category filtering
   - Price comparison tables

3. **Order Management Dashboard**
   - Order status tracking
   - Order history tables
   - Bulk operations interface

4. **Reporting & Analytics**
   - Sales performance charts
   - Revenue dashboards
   - Customer analytics

5. **User Management**
   - User roles and permissions
   - Sales team management
   - Activity tracking

### V0 Prompt Templates

#### For New Page Components:
```
Create a Hebrew RTL [page name] page for a telecom sales management system:
- Use Next.js 14 App Router structure
- Include TypeScript interfaces for [data type]
- Use shadcn/ui components (Card, Table, Button, Input)
- Implement search and filtering
- Support responsive design
- Include loading and error states
- Hebrew text content throughout
- Professional business styling
```

#### For Form Components:
```
Create a Hebrew RTL form component for [purpose]:
- Multi-step form with validation
- Uses shadcn/ui form components
- Hebrew labels and placeholders
- Right-aligned inputs
- Error messages in Hebrew
- Professional styling
- TypeScript with proper interfaces
```

#### For Data Display Components:
```
Create a Hebrew RTL data table/grid for [data type]:
- Uses shadcn/ui Table components
- Sortable columns
- Pagination
- Search functionality
- Actions menu (edit/delete)
- Hebrew column headers
- Responsive design
- Loading states
```

## File Organization for V0 Integration

### New Components Location
```
/components/
├── ui/ - shadcn/ui base components (don't modify)
├── forms/ - Form-specific components
├── tables/ - Data display components
├── charts/ - Analytics components
└── modals/ - Dialog/modal components
```

### Page Components
```
/app/
├── customers/ - Customer management pages
├── orders/ - Order management pages
├── reports/ - Analytics and reporting
└── settings/ - System configuration
```

## Development Workflow with V0

1. **Design in V0:** Create component mockups with Hebrew content
2. **Export Code:** Get Next.js + shadcn/ui code from V0
3. **Integration:** Adapt exported code to existing interfaces
4. **Data Binding:** Connect to existing database functions
5. **Testing:** Verify RTL layout and Hebrew display
6. **Refinement:** Adjust styling and functionality

## Important Notes for V0 Usage

- Always specify **Hebrew RTL** in prompts
- Request **shadcn/ui components** specifically
- Mention **Next.js 14** and **TypeScript**
- Include **business/professional** styling requirements
- Ask for **responsive design**
- Request **loading states** and **error handling**
- Specify **card-based layouts** when appropriate

This system is designed for Hebrew-speaking HOT Business salespeople, so all UI text, form labels, and user-facing content must be in Hebrew with proper RTL layout support.