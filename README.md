# Veez Apparels - Premium African Fashion E-Commerce Platform

A production-ready, full-stack e-commerce platform for Veez Apparels featuring a Django REST API backend and React frontend with WhatsApp-integrated payment flow.

## 🎯 Project Overview

Veez Apparels is a luxury fashion brand specializing in contemporary African clothing. This platform enables:
- Professional product catalog with variants (size, color)
- Seamless shopping experience with secure backend price verification
- WhatsApp-integrated payment and order confirmation
- Custom bespoke outfit requests
- Appointment booking system
- Complete admin dashboard

## 🏗️ Architecture

```
VEEZ APPARELS
├── BACKEND (Django REST API)
│   ├── Products (Catalog, Variants, Images)
│   ├── Orders (Secure checkout, WhatsApp integration)
│   ├── Customers (Profiles, Order history)
│   ├── Bespoke (Custom request tracking)
│   ├── Appointments (Booking system)
│   └── Admin Dashboard
│
└── FRONTEND (React + TypeScript + Tailwind)
    ├── Pages (Home, Shop, Product, Cart, Checkout, etc.)
    ├── Components (UI kit, Product cards, Layouts)
    ├── State Management (Zustand - Cart, Settings, Toast)
    ├── API Client (Axios with full types)
    └── Utilities (Formatting, Validation, WhatsApp)
```

## ⚡ Quick Start

### Backend Setup

```bash
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Setup environment
cp .env.example .env
# Edit .env with your database and configuration

# Run migrations
python manage.py migrate

# Create superuser (admin)
python manage.py createsuperuser

# Collect static files
python manage.py collectstatic

# Start server
python manage.py runserver
```

Backend runs at: http://localhost:8000
Admin dashboard: http://localhost:8000/admin

### Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Setup environment
cp .env.example .env
# Edit .env - ensure VITE_API_BASE_URL=http://localhost:8000

# Start dev server
npm run dev
```

Frontend runs at: http://localhost:5173

## 📁 Project Structure

```
veez-apparels/
├── backend/
│   ├── veez_store/
│   │   ├── settings/          # Django configuration
│   │   ├── apps/
│   │   │   ├── products/      # Product catalog
│   │   │   ├── orders/        # Order management
│   │   │   ├── bespoke/       # Custom requests
│   │   │   ├── appointments/  # Booking system
│   │   │   └── core/          # Settings, lookbook, testimonials
│   │   ├── urls.py
│   │   └── wsgi.py
│   ├── manage.py
│   ├── requirements.txt
│   └── README.md
│
├── frontend/
│   ├── src/
│   │   ├── components/        # React components
│   │   ├── pages/             # Page components
│   │   ├── services/          # API client
│   │   ├── store/             # Zustand state
│   │   ├── types/             # TypeScript definitions
│   │   ├── utils/             # Utilities
│   │   ├── App.tsx
│   │   ├── index.css
│   │   └── main.tsx
│   ├── package.json
│   ├── vite.config.ts
│   ├── tsconfig.json
│   ├── tailwind.config.js
│   └── README.md
│
├── docs/
│   ├── API.md                 # API documentation
│   ├── DATABASE.md            # Database schema
│   ├── DEPLOYMENT.md          # Deployment guide
│   └── WHATSAPP.md            # WhatsApp integration
│
└── README.md                  # This file
```

## 🔑 Key Features

### Backend
- ✅ Secure backend price calculation (never trust frontend prices)
- ✅ Inventory management with stock validation
- ✅ Order snapshots for historical accuracy
- ✅ WhatsApp-only payment flow (no Paystack)
- ✅ Complete order status tracking
- ✅ Bespoke request system with image uploads
- ✅ Appointment booking
- ✅ Django admin for business management

### Frontend
- ✅ Responsive design (mobile-first)
- ✅ Product catalog with filtering and search
- ✅ Product detail pages with image gallery
- ✅ Shopping cart with persistent storage
- ✅ Secure checkout flow
- ✅ Order tracking
- ✅ WhatsApp message generation
- ✅ Bespoke request form
- ✅ Appointment booking interface

## 🔐 Security Features

1. **Price Verification**: Backend calculates all prices, frontend sends only product IDs and quantities
2. **Stock Management**: Inventory validated before order creation
3. **Order Snapshots**: Historical product data preserved in OrderItem model
4. **CSRF Protection**: Django CSRF tokens on all forms
5. **Secure Authentication**: JWT tokens with refresh capability
6. **CORS Configuration**: Frontend origin validation
7. **Environment Variables**: Secrets never committed to git
8. **SSL/TLS Ready**: Production settings with secure cookies

## 📱 Mobile Experience

- Responsive Tailwind CSS design
- Touch-friendly buttons and inputs
- Optimized images for mobile
- Mobile navigation drawer
- Safe area support for notched devices
- Fast loading on 3G/4G networks

## 🎨 Design System

### Colors
- **Primary Black**: `#000000` (brand primary)
- **White**: `#FFFFFF` (backgrounds)
- **Gold Accent**: `#D4AF37` (luxury highlight)
- **Gray Scale**: 50-900 for UI elements

### Typography
- **Font**: Inter (sans-serif)
- **Bold**: 700 weight for headlines
- **Regular**: 400 weight for body
- **Semibold**: 600 weight for emphasis

### Component Library
- Button (4 variants)
- Input (text, email, password, textarea)
- ProductCard (with hover effects)
- Modal
- Toast notifications
- Loading spinners
- Skeleton loaders

## 🔄 Order Flow

```
1. Customer Browses
   → Selects product
   → Chooses variant (size, color)
   → Sets quantity
   
2. Shopping Cart
   → Reviews items
   → Proceeds to checkout
   
3. Checkout
   → Enters delivery details
   → Backend calculates total
   → Creates order with status: "pending"
   
4. WhatsApp Confirmation
   → Frontend generates pre-filled message
   → Customer opens WhatsApp chat
   → Sends order details to business
   → Team confirms via WhatsApp
   → Updates order status via admin
   
5. Fulfillment
   → Order processing
   → Shipping preparation
   → Delivery
```

## 📊 Database Schema

### Core Tables
- **Product**: Catalog items with pricing
- **ProductVariant**: Size/color combinations with stock
- **ProductImage**: Gallery images with ordering
- **Category**: Product organization
- **Collection**: Featured groups

### Orders
- **Order**: Customer orders with addresses
- **OrderItem**: Order line items with snapshots
- **OrderStatusHistory**: Complete audit trail
- **Customer**: Customer profiles

### Custom Features
- **BespokeRequest**: Custom outfit requests
- **Appointment**: Booking requests
- **Lookbook**: Editorial content
- **Testimonial**: Customer testimonials

## 🚀 Deployment

### Backend (Django)
Recommended platforms:
- Render
- Railway
- Heroku
- AWS Elastic Beanstalk

Requirements:
- PostgreSQL database
- Environment variables for secrets
- Static file storage (WhiteNoise or S3)
- Media file storage (S3 or similar)

### Frontend (React)
Recommended platforms:
- Vercel (recommended)
- Netlify
- AWS Amplify
- GitHub Pages

Build command: `npm run build`
Output directory: `dist/`

## 📖 Documentation

- **[Backend README](./backend/README.md)** - Setup, models, API endpoints
- **[Frontend README](./frontend/README.md)** - Components, pages, utilities
- See `docs/` folder for additional documentation

## 🧪 Testing

### Backend
```bash
cd backend
python manage.py test
```

### Frontend
```bash
cd frontend
npm run lint
npm run type-check
```

## 📝 Environment Variables

### Backend (.env)
```
DJANGO_SECRET_KEY=your-secret-key
DEBUG=False
ALLOWED_HOSTS=yourdomain.com
DB_NAME=veez_apparels
DB_USER=postgres
DB_PASSWORD=secure-password
WHATSAPP_BUSINESS_NUMBER=+234xxxxxxxxxx
BUSINESS_EMAIL=info@veezapparels.com
```

### Frontend (.env)
```
VITE_API_BASE_URL=https://api.veezapparels.com
VITE_APP_NAME=Veez Apparels
```

## 🤝 Contributing

1. Create feature branch: `git checkout -b feature/feature-name`
2. Make changes and test locally
3. Commit with clear messages: `git commit -m "Add feature description"`
4. Push: `git push origin feature/feature-name`
5. Create Pull Request

## 📞 Support

For questions or issues:
1. Check the README files in each directory
2. Review documentation in `docs/` folder
3. Check GitHub issues
4. Contact development team

## 📄 License

All rights reserved. Veez Apparels © 2024.

## 🎯 Roadmap

- [ ] Wishlist functionality
- [ ] Product reviews and ratings
- [ ] Customer accounts dashboard
- [ ] Advanced order tracking
- [ ] Email notifications
- [ ] SMS notifications
- [ ] Loyalty program
- [ ] Product comparison
- [ ] Newsletter subscription
- [ ] AI fashion assistant
- [ ] Augmented reality try-on (future)

## 🎉 Getting Started

1. **Clone or download** this repository
2. **Follow setup instructions** above for backend and frontend
3. **Create sample data** in Django admin
4. **Test checkout flow** with WhatsApp
5. **Deploy** to production when ready

---

**Built with ❤️ for Veez Apparels - Premium African Fashion**

Backend: Django 4.2 + PostgreSQL + Django REST Framework
Frontend: React 18 + TypeScript + Tailwind CSS + Vite
