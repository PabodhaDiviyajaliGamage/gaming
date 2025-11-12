# SL Gaming Hub - Next.js

A gaming top-up platform built with Next.js, React, and Tailwind CSS.

## 🚀 Migration Complete

This project has been migrated from **Vite + React Router** to **Next.js 14** with the following changes:

### ✅ What's Changed:
- ✅ Migrated from Vite to Next.js 14 with App Router
- ✅ Removed all API dependencies (axios, API services)
- ✅ Removed React Router (replaced with Next.js routing)
- ✅ Updated project structure to Next.js conventions
- ✅ Configured Tailwind CSS for Next.js
- ✅ Created base layouts and pages

### 🗑️ Removed:
- `axios` - HTTP client
- `react-router-dom` - Client-side routing
- `src/config/apiConfig.js` - API configuration
- `src/services/` - All API service files
- `src/utils/apiUtils.js` - API utilities
- `vite.config.js` - Vite configuration
- `index.html` - Entry HTML file

### 📁 New Structure:
```
app/
├── layout.jsx          # Root layout
├── page.jsx            # Home page
├── globals.css         # Global styles
├── admin/
│   ├── layout.jsx     # Admin layout with sidebar
│   ├── orders/page.jsx
│   └── games/page.jsx
└── topup/
    └── freefire-sg/page.jsx
```

## 🛠️ Tech Stack

- **Framework**: Next.js 14 (App Router)
- **UI Library**: React 18
- **Styling**: Tailwind CSS 3
- **Icons**: React Icons
- **Language**: JavaScript (JSX)

## 📦 Installation

1. Install dependencies:
```bash
npm install
```

2. Run the development server:
```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser

## 🏗️ Build for Production

```bash
npm run build
npm start
```

## 🔧 Next Steps

Since APIs have been removed, you'll need to:

1. **Choose a data source**: 
   - Use Next.js API Routes (`app/api/`)
   - Connect to a backend service
   - Use static data or local state
   - Implement serverless functions

2. **Add authentication**:
   - Use NextAuth.js for authentication
   - Implement middleware for protected routes

3. **Migrate components**:
   - Convert old components from `src/Components/` to work with Next.js
   - Update imports and routing logic
   - Use `'use client'` directive for client components

4. **Handle images**:
   - Move images from `src/assets/` to `public/`
   - Use Next.js `<Image>` component for optimization

## 📝 Available Routes

- `/` - Home page
- `/admin/orders` - Admin orders management
- `/admin/games` - Admin games management
- `/topup/freefire-sg` - Free Fire SG top-up

## 🆘 Support

For issues or questions, contact:
- WhatsApp: +94 77 304 3667

---

**Note**: This is a migrated project. Old `src/` files remain for reference but are not used by Next.js.
