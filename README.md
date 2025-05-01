This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

### 3. Core Features - Customer Side [ ]
- [X] Home Layout:
  - Create `(home)` folder in `app` directory
  - Header with logo, search bar, and navigation
  - Footer with links and social media
- [X] Homepage:
  - banner
  - latest products
- [X] Products Catalog:
  - Product listing page
  - Category filtering
  - Search functionality
- [X] Product pages:
  - [X] Product details page
  - [X] Image gallery
  - [X] Add to cart functionality
  - [X] Related products
  - [X] Reviews section
- [X] Shopping cart:
  - [X] Cart State Management:
    - Set up Zustand store for cart
    - Implement add/remove/update quantity actions
    - Persist cart data in localStorage
  - [X] Cart Components:
    - Create CartItem component
    - Create CartSummary component
    - Implement quantity controls
    - Add remove item functionality
  - [X] Cart Page Layout:
    - Create responsive grid layout
    - Show product images and details
    - Display subtotal and total
    - Add checkout button
  - [X] Cart API:
    - Create cart API endpoints
    - Implement price calculations
    - Handle stock validation
    - Sync with user's saved cart (if logged in)
- [ ] Checkout process:
  - [X] Checkout Flow:
    - Payment method integration (Stripe)
    - Order summary review
  - [X] Payment Integration:
    - Set up Stripe Elements
    - Implement payment processing
    - Handle success/failure scenarios
  - [X] Order Creation:
    - Create order in database
    - Send confirmation email
    - Update inventory
- [ ] User dashboard:
  - [ ] Profile Management:
    - Edit personal information
    - Change password
    - Profile picture upload
  - [ ] Order History:
    - List all orders
    - Order details view
    - Order status tracking

