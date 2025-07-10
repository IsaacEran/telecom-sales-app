# CLAUDE.md - Unified Business Management Platform

This file provides comprehensive guidance to Claude Code (claude.ai/code) when working with the unified business management platform.

## Platform Overview

This is a **comprehensive business management platform** that unifies sales, scheduling, field operations, and back-office functions into a single system with role-based access control (RBAC). The platform transforms disparate business processes into a seamless, integrated workflow serving teams from field sales to finance.

### Core Business Domains
- **Sales Management**: Lead-to-order process with digital contracts
- **Scheduling & Dispatch**: Installation scheduling and technician management
- **Field Operations**: Mobile app for technicians with job management
- **Finance & Billing**: Automated invoicing and commission calculations
- **Product Catalog**: Dynamic pricing with multiple payment terms
- **Analytics & Reporting**: Real-time business intelligence across all domains

## Technology Stack

### Frontend Architecture
- **Framework**: Next.js 14 with App Router + TypeScript
- **UI Library**: Tailwind CSS + shadcn/ui (Radix UI components)
- **State Management**: React hooks with context for complex flows
- **Language**: Hebrew RTL interface as primary, English support
- **Mobile**: Progressive Web App (PWA) for field technicians

### Backend Architecture
- **Platform**: Base44 unified entity management
- **Database**: 
  - Development: JSON files in `/data/` directory
  - Production: Supabase PostgreSQL
- **Authentication**: Single sign-on with role-based permissions
- **API**: RESTful API with microservices architecture

### Integration Layer
- **External Systems**: CRM (Fireberry), Accounting, Digital Signatures
- **Communication**: Email/SMS gateways for notifications
- **Mapping**: Google Maps API for route optimization
- **Real-time**: WebSocket for live updates

## User Roles & Permissions Matrix

### 1. Super Administrator
- **Access**: Full system access across all modules
- **Capabilities**: System configuration, user management, global analytics
- **UI Theme**: Red (#DC2626) - Power and control

### 2. Sales Manager
- **Access**: Sales team data, order approvals, performance metrics
- **Capabilities**: Team management, territory assignment, commission oversight
- **UI Theme**: Purple (#7C3AED) - Leadership and strategy

### 3. Sales Agent
- **Access**: Own customers and orders only
- **Capabilities**: Create orders, send contracts, track pipeline
- **UI Theme**: Blue (#2563EB) - Trust and professionalism

### 4. Marketing Manager
- **Access**: Product catalog, pricing, campaign management
- **Capabilities**: Product management, pricing strategies, sales analytics
- **UI Theme**: Pink (#EC4899) - Creativity and engagement

### 5. Back Office Manager
- **Access**: All scheduling and operational data
- **Capabilities**: Resource allocation, SLA monitoring, operational analytics
- **UI Theme**: Orange (#EA580C) - Coordination and energy

### 6. Dispatcher
- **Access**: Daily scheduling and technician assignments
- **Capabilities**: Schedule management, customer communication, route optimization
- **UI Theme**: Teal (#0D9488) - Communication and coordination

### 7. Technician
- **Access**: Own job assignments via mobile app
- **Capabilities**: Job completion, signature capture, status updates
- **UI Theme**: Green (#059669) - Action and completion

### 8. Finance Manager
- **Access**: Financial data, billing, and reporting
- **Capabilities**: Invoice generation, payment tracking, financial analytics
- **UI Theme**: Indigo (#4F46E5) - Trust and financial stability

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

# Run tests
npm test

# Run linting
npm run lint
```

## Architecture Patterns

### Microservices Architecture
Each user role operates as a semi-independent microservice with:
- Dedicated UI/UX tailored to role-specific needs
- Shared data layer with appropriate access controls
- Role-specific API endpoints
- Independent deployment capability

### Order Lifecycle Management
```
Draft → Pending Approval → Approved → Contract Sent → Contract Signed 
→ Scheduled → In Progress → Completed → Billed → Paid
```

### Data Flow Architecture
```
User Interface → API Gateway → Business Logic Layer → Data Access Layer 
→ Database → Event Bus → Integration Layer → External Systems
```

## Key Data Models

### Enhanced Company Entity
```typescript
interface Company {
  id: string;
  businessName: string;
  businessType: string;
  businessId: string;
  taxId?: string;
  businessAddress: string;
  businessPhone: string;
  businessEmail?: string;
  signatoryName: string;
  signatoryEmail: string;
  signatoryMobile: string;
  signatoryId: string;
  contactPerson?: ContactInfo;
  technicalContact?: ContactInfo;
  internetProvider?: string;
  customerDevices?: string;
  customerNotes?: string;
  assignedAgent?: string;
  creditLimit?: number;
  paymentTerms?: string;
  territory?: string;
  branches?: CompanyBranch[];
  status: 'active' | 'inactive' | 'suspended';
  attachments?: string[];
  createdAt: string;
  updatedAt: string;
}
```

### Enhanced Order Entity
```typescript
interface Order {
  id: string;
  orderNumber: string;
  companyId: string;
  customerType: 'existing' | 'new';
  paymentTerm: '1' | '36' | '48';
  secureRouter?: boolean;
  totalAmount: number;
  totalOneTime?: number;
  totalService?: number;
  totalMRC?: number;
  status: OrderStatus;
  agentId: string;
  installationId?: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  slaDeadline?: string;
  commission?: number;
  notes?: string;
  contractUrl?: string;
  signatureUrl?: string;
  orderItems: OrderItem[];
  statusHistory: StatusChange[];
  createdAt: string;
  updatedAt: string;
}

type OrderStatus = 'draft' | 'pending_approval' | 'approved' | 
  'contract_sent' | 'contract_signed' | 'scheduled' | 
  'in_progress' | 'completed' | 'cancelled' | 'billed';
```

### Installation Entity
```typescript
interface Installation {
  id: string;
  orderId: string;
  customerId: string;
  technicianId: string;
  scheduledDate: string;
  timeSlot: '09:00-12:00' | '12:00-15:00' | '15:00-18:00';
  estimatedDuration: number;
  actualStartTime?: string;
  actualEndTime?: string;
  status: InstallationStatus;
  installationAddress: string;
  contactPerson: string;
  contactPhone: string;
  accessInstructions?: string;
  equipmentRequired?: string[];
  preInstallationNotes?: string;
  completionNotes?: string;
  customerSignature?: string;
  customerSatisfaction?: number;
  photos?: string[];
  gpsLocation?: { lat: number; lng: number };
  priority: 'low' | 'medium' | 'high' | 'urgent';
  createdAt: string;
  updatedAt: string;
}

type InstallationStatus = 'scheduled' | 'in_progress' | 
  'completed' | 'cancelled' | 'rescheduled';
```

## UI/UX Guidelines

### Hebrew RTL Implementation
- All layouts use `dir="rtl"` at root level
- Text alignment defaults to right
- Form inputs right-aligned with Hebrew placeholders
- Navigation flows from right to left
- Icons mirrored where culturally appropriate

### Role-Based UI Themes
Each role has distinct visual identity:
- Color coding for quick role identification
- Tailored layouts optimizing role-specific workflows
- Customized dashboards with relevant KPIs
- Mobile-first design for field roles

### Component Architecture
```
/components/
├── ui/           # Base shadcn/ui components
├── forms/        # Role-specific form components
├── tables/       # Data display components
├── charts/       # Analytics visualizations
├── modals/       # Dialog components
├── layouts/      # Role-specific layouts
└── mobile/       # PWA-specific components
```

## Business Workflow Implementation

### Sales Workflow
1. Lead qualification and customer creation
2. Product selection with dynamic pricing
3. Order creation with approval routing
4. Digital contract generation and sending
5. Customer signature collection
6. Order status tracking

### Scheduling Workflow
1. Signed orders enter scheduling queue
2. Dispatcher assigns based on technician availability
3. Customer notification with appointment details
4. Technician receives job assignment
5. Route optimization for daily schedules

### Field Operations Workflow
1. Technician check-in at customer location
2. Installation task execution
3. Photo documentation
4. Customer signature capture
5. Completion report submission
6. Real-time status updates

### Billing Workflow
1. Completed installations trigger billing
2. Automatic invoice generation
3. Payment tracking and follow-up
4. Commission calculation
5. Financial reporting

## Integration Specifications

### External System Integrations
- **CRM Integration**: Bidirectional customer data sync
- **Accounting Systems**: Invoice and payment data flow
- **Digital Signatures**: Contract signing workflow
- **Communication Platforms**: SMS/Email notifications
- **Mapping Services**: Route optimization and navigation

### API Endpoints Structure
```
/api/v1/
├── /auth           # Authentication endpoints
├── /customers      # Customer management
├── /orders         # Order lifecycle
├── /products       # Product catalog
├── /installations  # Scheduling and field ops
├── /billing        # Financial operations
├── /analytics      # Reporting endpoints
└── /admin          # System administration
```

## Security & Compliance

### Security Measures
- JWT-based authentication with refresh tokens
- Role-based access control (RBAC)
- Field-level permissions
- API rate limiting
- Data encryption at rest and in transit

### Compliance Requirements
- GDPR compliance for data protection
- Audit logging for all critical operations
- Data retention policies
- User consent management
- Right to erasure implementation

## Performance Optimization

### Frontend Optimization
- Code splitting by route and role
- Lazy loading for heavy components
- Image optimization with next/image
- PWA caching strategies for offline support
- Bundle size optimization

### Backend Optimization
- Database query optimization
- Caching layer (Redis)
- Connection pooling
- Background job processing
- Horizontal scaling capability

## Development Best Practices

### Code Organization
- Feature-based folder structure
- Shared utilities and helpers
- Type-safe API contracts
- Comprehensive error handling
- Consistent naming conventions

### Testing Strategy
- Unit tests for business logic
- Integration tests for API endpoints
- E2E tests for critical workflows
- Performance testing for scalability
- Security testing for vulnerabilities

### Documentation
- API documentation with OpenAPI/Swagger
- Component documentation with Storybook
- User role documentation
- Deployment guides
- Troubleshooting guides

## Deployment & DevOps

### Environment Setup
```bash
# Development
DATABASE_URL=postgresql://...
NEXT_PUBLIC_API_URL=http://localhost:3000/api
NODE_ENV=development

# Production
DATABASE_URL=postgresql://...
NEXT_PUBLIC_API_URL=https://api.platform.com
NODE_ENV=production
```

### CI/CD Pipeline
1. Automated testing on PR
2. Code quality checks
3. Security scanning
4. Staging deployment
5. Production deployment with rollback capability

## Monitoring & Analytics

### System Monitoring
- Application performance monitoring (APM)
- Error tracking and alerting
- Database performance metrics
- API endpoint monitoring
- User activity tracking

### Business Analytics
- Real-time dashboards per role
- KPI tracking and alerts
- Custom report generation
- Data export capabilities
- Predictive analytics

## Future Enhancements

### Planned Features
- AI-powered scheduling optimization
- Mobile native apps (iOS/Android)
- Advanced analytics with ML insights
- Voice-enabled field operations
- IoT device integration
- Multi-language support
- Advanced workflow automation

### Scalability Roadmap
- Microservices decomposition
- Event-driven architecture
- GraphQL API layer
- Real-time collaboration features
- Multi-tenant architecture

---

This unified platform specification provides a comprehensive blueprint for integrating sales, scheduling, and field operations into a single, powerful business management system that scales with your organization's growth.