# Mabel - E-commerce Platform

## Language Switching and API Locale Support

This application supports dynamic language switching with automatic API locale parameter injection.

### How it works:

1. **Language Store**: The application uses Zustand store to persist language selection (`uz` or `ru`)
2. **API Interceptor**: All API requests automatically include `locale=uz` or `locale=ru` parameter
3. **Page Reload**: When language is changed, the page reloads to ensure all API calls use the new locale
4. **i18n Integration**: UI translations are handled by react-i18next

### Key Components:

- **LanguageChanger**: Component for switching between Uzbek and Russian
- **API Interceptor**: Automatically adds locale parameters to all requests
- **Language Store**: Persists language selection in localStorage

### Strapi API Integration:

The application uses Strapi as the backend CMS. All API calls are configured to work with Strapi's query parameter format:

#### Populate Parameters:
- **Correct**: `populate[0]=img&populate[1]=detail_img`
- **Incorrect**: `populate=img,detail_img`

#### Utility Functions:
```typescript
import { buildStrapiQuery, buildPopulateParams } from '@/utils/formatPrice';

// Build query with populate parameters
const query = buildStrapiQuery(['img', 'detail_img'], { 
  'pagination[page]': 1,
  'pagination[pageSize]': 10 
});

// Build populate parameters object
const populateParams = buildPopulateParams(['img', 'detail_img']);
```

### Usage:

```typescript
// API requests automatically include locale parameter
API.get('/api/products') // Adds ?locale=uz or ?locale=ru

// Manual locale parameter addition (if needed)
import { addLocaleToParams } from '@/utils/formatPrice';
const params = addLocaleToParams({ page: 1, limit: 10 });

// Proper Strapi populate parameters
API.get('/api/products?populate[0]=img&populate[1]=detail_img')
```

### Files Modified:

- `src/API/index.tsx` - Added locale interceptor
- `src/app/theme/store.ts` - Added language state management
- `src/components/ui/LanguageChanger.tsx` - Updated with store integration
- `src/i18n.ts` - Sync with language store
- `src/utils/formatPrice.ts` - Added locale and Strapi utility functions
- `src/hooks/getProducts.tsx` - Fixed populate parameters
- `src/hooks/getCategories.tsx` - Fixed populate parameters

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
