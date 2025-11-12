# Migration Guide: Vite + React Router → Next.js

## Overview
This document explains the migration from Vite + React Router to Next.js 14 with App Router.

## What Was Changed

### 1. Project Structure
**Before (Vite):**
```
src/
├── Components/
├── Pages/
├── Routes/
├── services/
├── config/
└── utils/
```

**After (Next.js):**
```
app/
├── layout.jsx
├── page.jsx
├── admin/
│   ├── layout.jsx
│   └── [pages]/
└── topup/
    └── [games]/
```

### 2. Routing

**Before (React Router):**
```jsx
<BrowserRouter>
  <Routes>
    <Route path="/" element={<Home />} />
    <Route path="/admin" element={<Admin />} />
  </Routes>
</BrowserRouter>
```

**After (Next.js App Router):**
- File-based routing
- `app/page.jsx` = `/`
- `app/admin/page.jsx` = `/admin`
- `app/topup/freefire-sg/page.jsx` = `/topup/freefire-sg`

### 3. Navigation

**Before:**
```jsx
import { Link, useNavigate } from 'react-router-dom';

<Link to="/about">About</Link>
const navigate = useNavigate();
navigate('/home');
```

**After:**
```jsx
import Link from 'next/link';
import { useRouter } from 'next/navigation';

<Link href="/about">About</Link>
const router = useRouter();
router.push('/home');
```

### 4. API Calls - REMOVED

All API-related code has been removed:
- ❌ `axios` package
- ❌ `src/config/apiConfig.js`
- ❌ `src/services/` (aiService, bankService)
- ❌ `src/utils/apiUtils.js`

**Replacement Options:**

**Option 1: Next.js API Routes**
```jsx
// app/api/games/route.js
export async function GET() {
  const data = { games: [...] };
  return Response.json(data);
}

// In component
const response = await fetch('/api/games');
const data = await response.json();
```

**Option 2: Server Components (Recommended)**
```jsx
// app/games/page.jsx
async function getGames() {
  const res = await fetch('https://api.example.com/games');
  return res.json();
}

export default async function GamesPage() {
  const games = await getGames();
  return <div>{/* Render games */}</div>;
}
```

**Option 3: Client Components with fetch**
```jsx
'use client'

export default function GamesPage() {
  const [games, setGames] = useState([]);
  
  useEffect(() => {
    fetch('/api/games')
      .then(res => res.json())
      .then(setGames);
  }, []);
  
  return <div>{/* Render games */}</div>;
}
```

### 5. Static Assets

**Before:**
```jsx
import logo from './assets/logo.jpg';
<img src={logo} />
```

**After:**
```jsx
// Move to public/ folder
import Image from 'next/image';
<Image src="/logo.jpg" width={100} height={100} alt="Logo" />
```

### 6. Client vs Server Components

In Next.js 14, components are Server Components by default.

**Use 'use client' directive for:**
- `useState`, `useEffect`, hooks
- Event handlers (`onClick`, etc.)
- Browser APIs
- Context providers

```jsx
'use client'

import { useState } from 'react';

export default function Counter() {
  const [count, setCount] = useState(0);
  return <button onClick={() => setCount(count + 1)}>{count}</button>;
}
```

### 7. Layouts

**Before:** Manual layout components
```jsx
function DefaultLayout({ children }) {
  return <div><Header />{children}<Footer /></div>;
}
```

**After:** Built-in layouts
```jsx
// app/layout.jsx
export default function RootLayout({ children }) {
  return (
    <html>
      <body>{children}</body>
    </html>
  );
}

// app/admin/layout.jsx
export default function AdminLayout({ children }) {
  return <div><Sidebar />{children}</div>;
}
```

## Migration Checklist

- [x] Install Next.js dependencies
- [x] Create `app/` directory structure
- [x] Create `layout.jsx` and `page.jsx` files
- [x] Remove Vite config files
- [x] Remove React Router
- [x] Remove axios and API services
- [x] Update Tailwind config for Next.js
- [x] Create basic pages
- [ ] Migrate all components
- [ ] Move assets to `public/`
- [ ] Implement new data fetching strategy
- [ ] Add authentication (NextAuth.js)
- [ ] Test all routes
- [ ] Update environment variables

## Commands

```bash
# Install dependencies
npm install

# Development
npm run dev

# Production build
npm run build
npm start

# Lint
npm run lint
```

## Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [App Router Guide](https://nextjs.org/docs/app)
- [Data Fetching](https://nextjs.org/docs/app/building-your-application/data-fetching)
- [NextAuth.js](https://next-auth.js.org/)

## Support

For questions about this migration, contact the development team.
