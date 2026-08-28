# Veez Apparels Frontend

React + TypeScript + Tailwind CSS e-commerce frontend for Veez Apparels.

## Quick Start

### Prerequisites
- Node.js 16+ and npm

### Installation

```bash
cd frontend
npm install
```

### Environment Setup

```bash
cp .env.example .env
```

Edit `.env` to match your backend URL:
```
VITE_API_BASE_URL=http://localhost:8000
```

### Development Server

```bash
npm run dev
```

Visit: http://localhost:5173

### Build for Production

```bash
npm run build
npm run preview
```

## Project Structure

```
frontend/src/
├── App.tsx              # Root component with routing
├── index.css           # Global styles with Tailwind
├── main.tsx            # Entry point

├── components/
│   ├── layout/         # Navbar, Footer
│   ├── ui/             # Button, Input, Loading, Toast, Modal
│   └── products/       # ProductCard

├── pages/              # Page components
│   ├── HomePage
│   ├── ShopPage
│   ├── ProductDetailPage
│   ├── CartPage
│   ├── CheckoutPage
│   ├── BespokePage
│   ├── AppointmentsPage
│   └── ...

├── services/
│   └── api.ts          # Axios client with all endpoints

├── store/
│   └── index.ts        # Zustand stores (cart, settings, toast)

├── types/
│   └── index.ts        # TypeScript definitions

└── utils/
    └── index.ts        # Helpers (formatting, validation, WhatsApp)
```

## Key Features

### State Management
- **Cart Store**: Add/remove items, update quantity, persist to localStorage
- **Settings Store**: App-wide settings
- **Loading State**: Global loading indicator
- **Toast Store**: Notifications with auto-dismiss

### Styling
- Tailwind CSS with custom theme
- Black/white/gold color palette
- Responsive mobile-first design
- Loading animations and transitions

### API Integration
- Axios client with error handling
- Full TypeScript types for all API responses
- Automatic CORS handling
- Request/response interceptors

### Components

#### Button
```tsx
<Button variant="primary" size="md" onClick={handleClick}>
  Click Me
</Button>
```

Variants: `primary`, `secondary`, `ghost`, `danger`
Sizes: `sm`, `md`, `lg`

#### Input
```tsx
<Input
  label="Email"
  type="email"
  placeholder="Enter email"
  value={email}
  onChange={(e) => setEmail(e.target.value)}
  error={error}
  required
/>
```

#### ProductCard
```tsx
<ProductCard product={product} onAddToCart={handleAdd} />
```

#### Toast Notifications
```tsx
import { useToast } from '@/store'

const { addToast } = useToast()

addToast('Success!', 'success')
addToast('Error occurred', 'error')
addToast('Info message', 'info')
```

### Utilities

#### Currency Formatting
```tsx
import { formatCurrency } from '@/utils'

formatCurrency(50000, 'NGN') // ₦50,000
```

#### WhatsApp Integration
```tsx
import { 
  generateOrderWhatsAppMessage,
  generateProductInquiryMessage,
  openWhatsAppChat 
} from '@/utils'

const message = generateOrderWhatsAppMessage(order)
openWhatsAppChat('+234xxxxxxxxxx', message)
```

#### Validation
```tsx
import { isValidEmail, isValidPhone, formatPhoneNumber } from '@/utils'

isValidEmail('user@example.com') // true
isValidPhone('+2348100000000')    // true
formatPhoneNumber('08100000000')  // +2348100000000
```

## Pages

### HomePage
- Hero section with CTA buttons
- Featured collections carousel
- Featured products grid
- Brand story section
- Bespoke service CTA

### ShopPage
- Product grid with responsive layout
- Filtering by category (ready to implement)
- Search functionality (ready to implement)
- Sorting options (ready to implement)

### ProductDetailPage
- Large product image gallery
- Variant selection (size, color)
- Quantity selector
- Add to cart button
- WhatsApp inquiry button
- Related products (ready to implement)

### CartPage
- List of cart items
- Quantity controls (increase/decrease)
- Remove item button
- Order summary
- Checkout button
- Clear cart option

### CheckoutPage
- Customer information form
- Delivery address form
- Order review
- Payment method selection
- Order confirmation with WhatsApp integration

## API Endpoints Used

### Products
- `GET /api/products/` - List products
- `GET /api/products/{slug}/` - Get product details
- `GET /api/products/featured/` - Featured products
- `GET /api/products/new_arrivals/` - New arrivals
- `GET /api/products/categories/` - List categories
- `GET /api/products/collections/` - List collections

### Orders
- `POST /api/orders/create_from_cart/` - Create order
- `GET /api/orders/{reference}/` - Get order details
- `POST /api/orders/{reference}/confirm_payment/` - Confirm payment

### Other
- `POST /api/bespoke/submit_request/` - Submit bespoke request
- `POST /api/appointments/request_appointment/` - Book appointment
- `GET /api/core/settings/retrieve/` - Get site settings

## Development Tips

### Running Type Checks
```bash
npm run type-check
```

### Linting
```bash
npm run lint
```

### Mobile Development
- Use Chrome DevTools device emulation
- Test on actual mobile device via network
- Check safe areas for notch devices

### Performance Optimization
- Images are lazy loaded
- Components use React.memo for products
- Zustand for efficient state management
- Route-based code splitting via React Router

### Debugging
- React DevTools extension
- Redux DevTools for Zustand (available)
- Network tab for API calls
- Console for errors

## Common Tasks

### Add New Page
1. Create file in `src/pages/NewPage.tsx`
2. Add route in `App.tsx`
3. Add navigation link in `Navbar.tsx` if needed

### Add New Component
1. Create file in appropriate `src/components/` subdirectory
2. Export from component file
3. Import in pages that need it

### Add API Endpoint
1. Add method to `src/services/api.ts`
2. Add TypeScript types to `src/types/index.ts`
3. Use in components via `const { data } = await api.methodName()`

### Add Utility Function
1. Add to `src/utils/index.ts`
2. Export function
3. Import where needed

## Environment Variables

```
VITE_API_BASE_URL=http://localhost:8000  # Backend API URL
VITE_APP_NAME=Veez Apparels              # App name for branding
```

## Deployment

### Vercel (Recommended)
1. Connect GitHub repository to Vercel
2. Set environment variables
3. Deploy on push to main/master

### Other Platforms
- Build: `npm run build`
- Output: `dist/` directory
- Use any static hosting (Netlify, AWS S3, etc.)

## Browser Support
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Performance Metrics
- First Contentful Paint (FCP): < 1.5s
- Largest Contentful Paint (LCP): < 2.5s
- Cumulative Layout Shift (CLS): < 0.1

## Troubleshooting

### Port 5173 already in use
```bash
PORT=3001 npm run dev
```

### CORS errors
- Check `VITE_API_BASE_URL` is correct
- Ensure backend has CORS enabled
- Check browser console for exact error

### Tailwind styles not loading
```bash
npm run build  # Rebuild assets
```

### Hot reload not working
- Restart dev server
- Clear browser cache
- Check `.env` file syntax

## Contributing

1. Create feature branch: `git checkout -b feature/feature-name`
2. Make changes and commit: `git commit -m "Add feature"`
3. Push: `git push origin feature/feature-name`
4. Create Pull Request

## Next Steps

- [ ] Complete CheckoutPage with secure order submission
- [ ] Build BespokePage with form and image upload
- [ ] Build AppointmentsPage with date/time picker
- [ ] Implement product search and filtering
- [ ] Add product reviews and ratings
- [ ] Build customer account dashboard
- [ ] Add order tracking page
- [ ] Implement wishlist functionality
- [ ] Add product comparison
- [ ] Build admin dashboard frontend

## Support

For issues or questions, check the backend README and documentation.
