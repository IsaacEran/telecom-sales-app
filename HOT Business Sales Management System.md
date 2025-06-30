HOT Business Sales Management System - Full Specification
1. Application Overview
1.1 Purpose
A comprehensive sales management system for HOT Business salespeople to manage customers, orders, products, and sales operations in Hebrew (RTL layout).

1.2 Target Users
Sales Agents
Sales Managers
Marketing Managers
Super Administrators
1.3 Core Features
Customer relationship management
Order creation and tracking
Product catalog management
Sales analytics and reporting
User and permission management
Multi-branch order support
2. Data Model & Entities
2.1 User Entity
{
  "name": "User",
  "properties": {
    "full_name": "string (required)",
    "email": "string (required, unique)",
    "phone": "string",
    "position": "string",
    "user_type": "enum: [super_admin, sales_manager, marketing_manager, sales_agent]",
    "manager_id": "string (reference to User)",
    "team_id": "string",
    "permissions": {
      "pages": "array of strings",
      "features": "array of strings", 
      "data_access": "enum: [own, team, all]"
    },
    "active": "boolean (default: true)"
  }
}
2.2 Company Entity
{
  "name": "Company",
  "properties": {
    "businessName": "string (required)",
    "businessType": "string (required)",
    "businessId": "string (required, unique)",
    "businessAddress": "string (required)",
    "businessPhone": "string (required)",
    "businessEmail": "string",
    "signatoryName": "string (required)",
    "signatoryEmail": "string (required)",
    "signatoryMobile": "string (required)",
    "signatoryId": "string (required)",
    "contactName": "string",
    "contactEmail": "string", 
    "contactMobile": "string",
    "contactId": "string",
    "internetProvider": "string",
    "customerDevices": "string",
    "customerNotes": "string",
    "assignedAgent": "string (User email)",
    "agentSignatureDate": "datetime",
    "lastOrderDate": "datetime",
    "attachments": "array of file URLs",
    "deviceImageUrl": "string"
  }
}
2.3 Branch Entity
{
  "name": "Branch",
  "properties": {
    "companyId": "string (required, FK to Company)",
    "name": "string (required)",
    "address": "string (required)",
    "contactName": "string",
    "contactPhone": "string",
    "notes": "string"
  }
}
2.4 Category Entity
{
  "name": "Category", 
  "properties": {
    "name": "string (required)",
    "parentId": "string (FK to Category, nullable)",
    "slug": "string (required, unique)",
    "description": "string",
    "order": "number (default: 0)"
  }
}
2.5 Product Entity
{
  "name": "Product",
  "properties": {
    "name": "string (required)",
    "category": "string (required)",
    "price": "number (required)",
    "price36": "number",
    "price48": "number", 
    "description": "string",
    "image": "string (URL)",
    "paymentType": "enum: [one_time, monthly, yearly]"
  }
}
2.6 Order Entity
{
  "name": "Order",
  "properties": {
    "companyId": "string (required, FK to Company)",
    "customerType": "enum: [existing, new]",
    "paymentTerm": "enum: [1, 36, 48]",
    "secureRouter": "boolean (default: false)",
    "totalAmount": "number (required)",
    "status": "enum: [draft, pending, approved, cancelled]",
    "agentId": "string (User email)",
    "agentName": "string",
    "orderDate": "datetime",
    "notes": "string"
  }
}
2.7 OrderItem Entity
{
  "name": "OrderItem",
  "properties": {
    "orderId": "string (required, FK to Order)",
    "branchId": "string (required, FK to Branch)", 
    "productId": "string (required, FK to Product)",
    "quantity": "number (required)",
    "unitPrice": "number (required)"
  }
}
3. User Roles & Permissions
3.1 User Types
Super Admin
Data Access: All data across all teams
Pages: All pages and features
Permissions:
Full CRUD on all entities
User management
System configuration
Analytics and reporting
Sales Manager
Data Access: Team data (agents under their management)
Pages: Dashboard, Orders, Companies, Products, Sales Analytics, User Management (limited)
Permissions:
View/edit team performance
Approve/reject orders
Manage team agents
Product catalog management
Company assignment oversight
Marketing Manager
Data Access: All data (read-only for most)
Pages: Dashboard, Products, Catalog Management, Sales Analytics
Permissions:
Product catalog management
Pricing and promotions
Marketing analytics
Campaign management
Sales Agent
Data Access: Own data only
Pages: Dashboard, New Order, Products, Companies (assigned), Orders (own)
Permissions:
Create/edit own orders
View assigned companies
Create new companies (auto-assigned)
View product catalog
3.2 Permission Matrix
Feature	Super Admin	Sales Manager	Marketing Manager	Sales Agent
User Management	Full	Limited	None	None
Company Management	Full	Team	Read-only	Assigned only
Order Management	Full	Team	Read-only	Own only
Product Management	Full	Limited	Full	Read-only
Analytics	Full	Team	Full	Basic
System Settings	Full	None	None	None
4. Application Screens
4.1 Authentication
Login Page: Google OAuth integration (handled by base44)
Access Control: Role-based page access
4.2 Dashboard (Index)
Route: / Access: All authenticated users Components:

Welcome header with HOT Business branding
Quick action cards:
Create New Order
Product Catalog
Catalog Management (if permitted)
Recent Companies widget (last 5, clickable to orders)
Recent Orders widget (last 10, clickable to details)
Performance metrics (role-dependent)
4.3 New Order Workflow
Route: /new-order Access: Sales Agents, Sales Managers, Super Admins Steps:

Step 1: Customer Type Selection
Existing Customer
New Customer
Step 2: Customer Information
Existing Customer:

Search and select from assigned companies
Show assignment status (assigned to current user/other agent/unassigned)
Prevent access to other agents' customers
New Customer (Multi-tab form):

Business Details Tab:
Business name, type, ID, address, phone, email
Signatory Details Tab:
Full name, ID, email, mobile
Technical Details Tab:
Internet provider, device images, attachments, notes
Step 3: Branch Configuration
Single branch vs. Multi-branch selection
Branch details form (name, address, contact info)
Add/remove branches dynamically
Step 4: Payment Terms
Payment options: Single payment, 36 installments, 48 installments
Secure router add-on option
Step 5: Product Selection
Browse product catalog by category
Search products
Add/remove products per branch
Quantity adjustment
Real-time price calculation
Step 6: Order Summary
Review all order details
Customer information display
Itemized pricing breakdown
Final actions:
Send for customer signature
Download PDF
Save as draft
4.4 Product Management
Route: /products Access: All users (permissions vary) Features:

Category-based navigation tree
Product search and filtering
Product cards with images and pricing
CRUD operations (role-dependent)
Bulk import from CSV/Excel
Product form with multiple pricing tiers
4.5 Catalog Management
Route: /catalog-management Access: Marketing Managers, Super Admins Tabs:

Products Tab
Advanced product management table
Bulk operations (price updates, category changes)
Advanced filtering and sorting
Export capabilities
Promotions Tab
Create/edit promotional campaigns
Discount types (percentage, fixed amount)
Category-based promotions
Date-based activation/deactivation
Categories Tab
Hierarchical category management
Drag-and-drop reordering
Category creation/editing
Product count per category
4.6 Companies Management
Route: /companies Access: Role-based data filtering Features:

Company listing with search/filter
Company details view
Assignment management
Order history per company
Contact management
4.7 Orders Management
Route: /orders Access: Role-based data filtering Features:

Order listing with status filtering
Order details view
Status management
Order approval workflow
PDF generation
Order analytics
4.8 Sales Dashboard
Route: /sales-dashboard Access: Sales Managers, Super Admins Components:

Performance metrics
Team comparisons
Revenue analytics
Goal tracking
Interactive charts and graphs
4.9 User Management
Route: /user-management
Access: Sales Managers (limited), Super Admins (full) Features:

User listing and search
User creation/editing
Role assignment
Permission management
Team assignment
User activation/deactivation
4.10 Settings
Route: /settings Access: Super Admins Features:

System configuration
Integration settings
Backup/restore options
Audit logs
5. Business Rules
5.1 Customer Assignment Rules
New customers are automatically assigned to the creating agent
Existing customers can only be accessed by their assigned agent
Unassigned customers can be claimed by any agent (first-come, first-served)
Managers can reassign customers between team members
Super admins can reassign any customer
5.2 Order Creation Rules
Orders can only be created for assigned/owned customers
Draft orders can be edited by their creator
Submitted orders require manager approval for changes
Orders automatically update customer's "last order date"
Order totals are calculated based on selected payment terms
5.3 Product Pricing Rules
Base price is for single payment
Installment prices (36/48) are optional and can be higher
Promotions override base pricing when active
Price changes require appropriate permissions
5.4 Data Access Rules
Own: User sees only their created records
Team: User sees records from their team members
All: User sees all records across organization
Managers see their team's data by default
Super admins see all data by default
6. Technical Requirements
6.1 Frontend Framework
React with TypeScript/JavaScript
Right-to-left (RTL) support for Hebrew
Responsive design (mobile-first)
Component library: shadcn/ui
Icons: Lucide React
Styling: Tailwind CSS
6.2 State Management
React hooks for local state
Context API for global state where needed
Entity SDK for data management
6.3 Routing
React Router for navigation
Protected routes based on permissions
URL parameter handling for filters/IDs
6.4 Data Management
base44 Entity SDK for CRUD operations
Optimistic updates where appropriate
Error handling and loading states
Data validation on frontend and backend
6.5 File Management
Image upload for products and customer devices
Document attachment support
PDF generation for orders
File preview capabilities
6.6 Internationalization
Hebrew as primary language
RTL layout support
Date/time formatting for Hebrew locale
Currency formatting (ILS)
7. Integration Requirements
7.1 Authentication
Google OAuth (handled by base44)
Role-based access control
Session management
7.2 Email Integration
Order confirmation emails
Customer signature requests
Notification system for approvals
7.3 File Processing
CSV/Excel import for products
Image processing and optimization
PDF generation for orders
7.4 External APIs
Potential integration with CRM systems
Accounting system integration
Email marketing platforms
8. Performance Requirements
8.1 Loading Times
Initial page load: < 3 seconds
Navigation between pages: < 1 second
Search results: < 2 seconds
Form submissions: < 3 seconds
8.2 Data Handling
Support for 10,000+ products
1,000+ companies
10,000+ orders
Pagination for large datasets
Efficient search and filtering
9. Security Requirements
9.1 Data Protection
Role-based access control
Data isolation between teams
Audit logging for sensitive operations
Secure file upload handling
9.2 Input Validation
Frontend form validation
Backend data validation
SQL injection prevention
XSS protection
10. Testing Requirements
10.1 Unit Testing
Component testing
Utility function testing
Entity operation testing
10.2 Integration Testing
API integration testing
User workflow testing
Permission testing
10.3 User Acceptance Testing
Role-based testing scenarios
Workflow validation
Performance testing
11. Deployment & Monitoring
11.1 Environment Setup
Development environment
Staging environment
Production environment
11.2 Monitoring
Error tracking
Performance monitoring
User analytics
System health checks
12. Documentation Requirements
12.1 User Documentation
User manual for each role
Video tutorials for key workflows
FAQ section
Troubleshooting guide
12.2 Technical Documentation
API documentation
Component documentation
Deployment guide
Maintenance procedures
This specification provides a comprehensive guide for building the HOT Business Sales Management System, covering all aspects from data models to user interfaces, business rules, and technical requirements