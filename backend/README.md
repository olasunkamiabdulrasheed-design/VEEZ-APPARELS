# Veez Apparels Backend

Django REST API for the Veez Apparels e-commerce platform.

## Architecture

### Database Models

**Products**
- `Category`: Clothing categories (Agbada, Kaftan, etc.)
- `Collection`: Product collections (New Arrivals, Signature, etc.)
- `Product`: Individual products
- `ProductImage`: Product gallery images
- `ProductVariant`: Size/color combinations with stock management

**Orders & Customers**
- `Customer`: Customer profiles
- `Order`: Customer orders
- `OrderItem`: Items within an order (with price snapshots)
- `OrderStatusHistory`: Audit trail of order status changes

**Custom & Requests**
- `BespokeRequest`: Custom outfit requests
- `Appointment`: Appointment booking requests

**Core**
- `Lookbook`: Editorial lookbook items
- `LookbookProduct`: Products linked to lookbook items
- `Testimonial`: Customer testimonials
- `SiteSettings`: Global site configuration

### Key Security Features

1. **Price Calculation**: All prices calculated on backend, never trust frontend prices
2. **Stock Management**: Inventory validated before order creation
3. **Order Snapshots**: Historical accuracy maintained via OrderItem snapshots
4. **Status Tracking**: Complete audit trail of order changes

## Setup

### Prerequisites

- Python 3.9+
- PostgreSQL 12+ (or SQLite for development)
- pip

### Installation

1. **Clone repository and navigate to backend**
```bash
cd backend
```

2. **Create virtual environment**
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. **Install dependencies**
```bash
pip install -r requirements.txt
```

4. **Setup environment variables**
```bash
cp .env.example .env
# Edit .env with your configuration
```

5. **Create database (PostgreSQL)**
```bash
# Create database
createdb veez_apparels

# Or use the connection string in .env
```

6. **Run migrations**
```bash
python manage.py migrate
```

7. **Create superuser (admin)**
```bash
python manage.py createsuperuser
```

8. **Load demo data (optional)**
```bash
python manage.py seed_demo_data  # Not yet implemented, will add
```

9. **Collect static files**
```bash
python manage.py collectstatic --noinput
```

10. **Run development server**
```bash
python manage.py runserver
```

Server runs at: http://localhost:8000

Admin dashboard: http://localhost:8000/admin

## API Endpoints

### Products
- `GET /api/products/` - List products
- `GET /api/products/{slug}/` - Product detail
- `GET /api/products/featured/` - Featured products
- `GET /api/products/new_arrivals/` - New arrivals
- `POST /api/products/{slug}/check_availability/` - Check variant stock

### Categories & Collections
- `GET /api/products/categories/` - List categories
- `GET /api/products/collections/` - List collections
- `GET /api/products/collections/featured/` - Featured collections

### Orders
- `POST /api/orders/create_from_cart/` - Create order from cart
- `GET /api/orders/{reference}/` - Get order details
- `POST /api/orders/{reference}/confirm_payment/` - Confirm WhatsApp payment
- `POST /api/orders/{reference}/update_status/` - Update order status
- `POST /api/orders/{reference}/cancel/` - Cancel order
- `GET /api/orders/{reference}/status_history/` - Order status history

### Customers
- `POST /api/orders/customers/get_or_create/` - Get or create customer

### Bespoke Requests
- `POST /api/bespoke/submit_request/` - Submit custom outfit request
- `GET /api/bespoke/{reference}/` - Get request details

### Appointments
- `POST /api/appointments/request_appointment/` - Request appointment
- `GET /api/appointments/{id}/` - Get appointment details

### Core (Settings, Lookbook, Testimonials)
- `GET /api/core/settings/retrieve/` - Site settings
- `GET /api/core/lookbook/` - Editorial lookbook
- `GET /api/core/testimonials/` - Approved testimonials

## Database Schema

### Order Flow (Security Critical)

```
Frontend → Backend
  Cart Items: [
    { product_id, variant_id, quantity }
  ]
           ↓
Backend Processes:
  1. Fetch product from DB
  2. Validate availability
  3. Get current price from DB (NEVER trust frontend)
  4. Validate stock
  5. Calculate totals
           ↓
Creates Order with:
  - Order reference UUID
  - Order number
  - Customer info
  - Delivery address
  - Price snapshots
  - Status: 'pending'
           ↓
Frontend displays:
  - Order confirmation
  - WhatsApp integration
```

### WhatsApp Integration

Orders are confirmed via WhatsApp messages containing:
- Order number
- Items with prices
- Delivery address
- Total amount
- Customer contact

Backend generates message content dynamically from database.

## Admin Dashboard

Access at `/admin/` after creating superuser.

**Available sections:**
- Products (with inline images & variants)
- Categories
- Collections
- Orders (with inline items & status history)
- Customers
- Bespoke Requests
- Appointments
- Lookbook
- Testimonials
- Site Settings

## Testing

```bash
# Run all tests
python manage.py test

# Run specific app tests
python manage.py test veez_store.apps.products

# Run with coverage
pip install coverage
coverage run --source='.' manage.py test
coverage report
```

## Deployment

### Environment: Render, Railway, Heroku

1. **Set environment variables** in deployment platform
2. **Run migrations** during build
3. **Collect static files** during build
4. **Use production settings**

```bash
DJANGO_SETTINGS_MODULE=veez_store.settings.production
```

### Static Files & Media

- Static files served via WhiteNoise
- Media files: Configure cloud storage (AWS S3, etc.) for production

### Database

- Use managed PostgreSQL service
- Never commit `.env` files
- Use separate DB for development/production

## Development Commands

```bash
# Create superuser
python manage.py createsuperuser

# Run specific migration
python manage.py migrate products 0001

# Rollback migration
python manage.py migrate products zero

# Check database
python manage.py dbshell

# Django shell (interactive)
python manage.py shell

# Create app
python manage.py startapp appname

# Makemigrations
python manage.py makemigrations
```

## Important Notes

1. **Never expose secrets** in code or GitHub
2. **Always validate** on backend before creating orders
3. **Store price snapshots** in OrderItem for historical accuracy
4. **Use PostgreSQL** in production
5. **Enable CSRF protection** in production
6. **Use HTTPS only** in production
7. **Monitor inventory** for overselling
8. **Test WhatsApp messages** thoroughly before launching

## Troubleshooting

### Database connection error
```bash
# Check PostgreSQL is running
pg_isready

# Or use SQLite for development
USE_SQLITE=true python manage.py migrate
```

### Migration issues
```bash
# Show migrations
python manage.py showmigrations

# Create new migration
python manage.py makemigrations
```

### Static files not loading
```bash
python manage.py collectstatic --clear --noinput
```

## Next Steps

1. Implement seed/demo data command
2. Add email notifications
3. Implement SMS notifications (optional)
4. Add WhatsApp Business API integration (future)
5. Implement order tracking email
6. Add customer review functionality
7. Implement coupon/discount system
8. Add inventory alerts
