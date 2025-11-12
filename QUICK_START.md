# Quick Start Guide - Next.js Development

## 🚀 Getting Started

Your project is now running on Next.js! Here's everything you need to know:

## Current Status
✅ Next.js 14 installed and configured
✅ Development server running at http://localhost:3000
✅ All API dependencies removed
✅ Basic pages created

## File Structure

```
SlGamingHub-frontend/
├── app/                    # Next.js app directory (NEW - THIS IS USED)
│   ├── layout.jsx         # Root layout
│   ├── page.jsx           # Home page (/)
│   ├── globals.css        # Global styles
│   ├── admin/             # Admin routes
│   │   ├── layout.jsx     # Admin layout with sidebar
│   │   ├── orders/page.jsx  # /admin/orders
│   │   └── games/page.jsx   # /admin/games
│   └── topup/
│       └── freefire-sg/page.jsx  # /topup/freefire-sg
│
├── src/                    # OLD Vite files (kept for reference)
│   └── [old files...]     # ⚠️ NOT USED BY NEXT.JS
│
├── public/                 # Static assets (images, etc.)
├── next.config.js         # Next.js configuration
├── tailwind.config.js     # Tailwind CSS config
└── package.json           # Dependencies
```

## 📝 Creating New Pages

### Simple Page
Create a file: `app/about/page.jsx`
```jsx
export default function AboutPage() {
  return (
    <div>
      <h1>About Us</h1>
      <p>This is the about page</p>
    </div>
  )
}
```
Access at: `http://localhost:3000/about`

### Dynamic Route
Create: `app/games/[id]/page.jsx`
```jsx
export default function GamePage({ params }) {
  return <div>Game ID: {params.id}</div>
}
```
Access: `/games/123`, `/games/456`, etc.

### Client Component (with interactivity)
```jsx
'use client'  // ⚠️ Add this for useState, onClick, etc.

import { useState } from 'react'

export default function Counter() {
  const [count, setCount] = useState(0)
  
  return (
    <button onClick={() => setCount(count + 1)}>
      Count: {count}
    </button>
  )
}
```

## 🔗 Navigation

### Using Link Component
```jsx
import Link from 'next/link'

<Link href="/about">About</Link>
<Link href="/games/123">Game 123</Link>
```

### Programmatic Navigation
```jsx
'use client'

import { useRouter } from 'next/navigation'

export default function MyComponent() {
  const router = useRouter()
  
  const handleClick = () => {
    router.push('/dashboard')
  }
  
  return <button onClick={handleClick}>Go to Dashboard</button>
}
```

## 🎨 Styling with Tailwind

Tailwind CSS is already configured! Just use classes:

```jsx
export default function StyledPage() {
  return (
    <div className="bg-blue-500 text-white p-4 rounded-lg">
      <h1 className="text-2xl font-bold">Hello World</h1>
      <p className="mt-2">Tailwind is ready to use!</p>
    </div>
  )
}
```

## 📦 Data Fetching

### Option 1: Server Component (Recommended)
```jsx
// No 'use client' needed!
async function getData() {
  const res = await fetch('https://api.example.com/data')
  return res.json()
}

export default async function Page() {
  const data = await getData()
  return <div>{JSON.stringify(data)}</div>
}
```

### Option 2: Client Component
```jsx
'use client'

import { useState, useEffect } from 'react'

export default function Page() {
  const [data, setData] = useState(null)
  
  useEffect(() => {
    fetch('/api/data')
      .then(res => res.json())
      .then(setData)
  }, [])
  
  if (!data) return <div>Loading...</div>
  return <div>{JSON.stringify(data)}</div>
}
```

### Option 3: Next.js API Routes
Create: `app/api/hello/route.js`
```jsx
export async function GET() {
  return Response.json({ message: 'Hello World' })
}
```
Access: `http://localhost:3000/api/hello`

## 🖼️ Using Images

1. Put images in `public/` folder
2. Use Next.js Image component:

```jsx
import Image from 'next/image'

export default function MyPage() {
  return (
    <Image 
      src="/logo.png" 
      width={200} 
      height={200} 
      alt="Logo"
    />
  )
}
```

## 🛠️ Common Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linter
npm run lint
```

## ⚠️ Important Reminders

1. **Server Components by default** - Add `'use client'` only when needed
2. **File-based routing** - File structure = URL structure
3. **No React Router** - Use Next.js Link and useRouter
4. **No axios** - Use native `fetch()` or Next.js features
5. **Old src/ folder not used** - Use app/ directory

## 🐛 Troubleshooting

### "Cannot use useState"
➡️ Add `'use client'` at the top of the file

### "Cannot use onClick"
➡️ Add `'use client'` at the top of the file

### Page not found
➡️ Check file is named `page.jsx` inside `app/` directory

### Styles not working
➡️ Make sure Tailwind classes are correct and dev server is running

## 📚 Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [App Router Guide](https://nextjs.org/docs/app)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)

## 🎯 Next Steps

1. Visit http://localhost:3000 to see your site
2. Edit `app/page.jsx` to customize the home page
3. Create new pages by adding files in `app/`
4. Add your own components
5. Implement data fetching for your needs

---

Happy coding! 🚀
