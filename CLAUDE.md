# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

---

## Project: Sai Sana Cakes & Bakes

**Type:** Showcase website for a bakery business with real-time chat and admin panel.

**Tech Stack:**
- React 18 + Vite + Tailwind CSS
- Firebase (Auth, Realtime Database, Hosting)
- Supabase (PostgreSQL + Storage for images)
- Framer Motion (animations)

**Node.js >= 18.0.0 required.**

---

## Key Requirements (REMEMBER THESE)

### Design Priorities
1. **Mobile-First** - Design for mobile first, scale up to tablet/desktop
2. **Smooth Animations** - Page transitions, scroll reveals, micro-interactions
3. **User-Friendly UX** - Easy navigation, clear CTAs, fast loading
4. **Public Pages Priority** - Focus on public-facing pages first

### Design System (IMPORTANT)
- **Very smooth, soft design** - Clean, minimal, elegant
- **3 colors only** - Thin, subtle, soft palette
- **Color Palette:**
  - Primary: Soft rose/pink (bakery warmth)
  - Secondary: Cream/warm white (elegance)
  - Accent: Soft brown/chocolate (contrast)
- **Tailwind handles all styling** - No custom CSS needed
- **Toast notifications:** Use react-toastify (not react-hot-toast)

### Content Strategy
- **ALL content is dynamic** - fetched from Firebase/Supabase
- **NO hardcoded text** - bakery name, logo, social links, hours all from database
- **Admin panel controls everything** - full CMS capability

### Database Architecture
| Content | Storage |
|---------|---------|
| Site settings (name, logo, tagline) | Firebase `/settings` |
| Social media links | Firebase `/settings` |
| Business info, hours | Firebase `/settings` |
| Hero text, about content | Firebase `/content` |
| Testimonials | Firebase `/testimonials` |
| Chat messages | Firebase `/chats`, `/messages` |
| Contact inquiries | Firebase `/inquiries` |
| Products/Menu items | Supabase `products` table |
| Gallery images | Supabase `gallery_items` table + Storage |
| Categories | Supabase `categories` table |

### Authentication Rules
- **Guest browsing** - All public pages accessible without login
- **Chat requires login** - Firebase Auth (Google + Email)
- **Admin strictly protected** - Role-based access, admin-only routes

### Public Pages (Showcase Only)
- Home (Hero, Featured, Testimonials, Why Choose Us, CTA)
- Gallery (Filterable grid, lightbox, categories)
- About (Story, Team, Bakery info)
- Contact (Form, Map, Hours, Social links)

### Admin Panel Features
- Dashboard with analytics
- Products/Menu management
- Gallery management with image upload
- Chat replies to customers
- Contact inquiries management
- Content management (edit all public page content)
- Customer list

---

## Commands

```bash
npm run dev      # Development server on http://localhost:3000
npm run build    # Production build to dist/
npm run preview  # Preview production build
npm run lint     # ESLint for .js and .jsx files
npm run format   # Prettier auto-format
```

## Architecture

**Path Aliases** (configured in vite.config.js and jsconfig.json):
- `@/` → `src/`
- `@components/*`, `@utils/*`, `@contexts/*`, `@routes/*`, `@layout/*`, `@styles/*`, `@assets/*`, `@constants/*`, `@reducers/*`, `@hooks/*` → corresponding `src/` subdirectories

**Key Directories:**
- `src/components/` - Reusable UI components
- `src/hooks/` - Custom React hooks (useFetch, useLocalStorage, useToggle)
- `src/utils/` - Pure JS utility functions (cn.js for classnames, formatters.js, storage.js)
- `src/layout/` - Layout components (MainLayout with header/footer/outlet)
- `src/routes/` - React Router v6 configuration using createBrowserRouter
- `src/styles/` - CSS with reset, global styles, and CSS variables design system
- `src/contexts/` - React Context providers
- `src/reducers/` - State management reducers

**Entry Points:**
- `index.html` → `src/main.jsx` → `src/App.jsx`

## Code Patterns

**Utilities:** Pure functions with JSDoc comments. Storage utilities include try-catch error handling.

**Custom Hooks:** Named with `use` prefix, include JSDoc documentation. useFetch returns `{data, loading, error, refetch}`, useLocalStorage provides useState-like interface with persistence, useToggle returns `[value, toggle, setTrue, setFalse]`.

**CSS:** Global variables in `:root` for colors, spacing, typography. Dark mode via `prefers-color-scheme: dark`. Spacing scale from xs (0.25rem) to 2xl (3rem).

**Routing:** React Router v6 with createBrowserRouter API in `src/routes/index.jsx`.

## Code Quality

- ESLint with React and React Hooks plugins
- Prettier: 2-space indent, single quotes, trailing commas (es5), 80 char width, LF endings
- EditorConfig for cross-editor consistency

## Git Commit Rules

- **NO Claude signatures** in commits (no "Generated with Claude Code", no "Co-Authored-By")
- Clean, simple commit messages only

---

## Implementation Phases

1. **Phase 1:** Setup - Tailwind, Firebase config, Supabase config, environment variables
2. **Phase 2:** Infrastructure - Contexts (Auth, Theme, Chat, Toast), hooks, services, common components
3. **Phase 3:** Public Pages - Home, Gallery, About, Contact (mobile-first, animated)
4. **Phase 4:** Chat System - Widget, Firebase Realtime, auth flow for chat
5. **Phase 5:** Admin Panel - Login, Dashboard, Products, Gallery, Chat, Inquiries, Content, Customers
6. **Phase 6:** Routing - Public routes, protected admin routes, ProtectedRoute component
7. **Phase 7:** Animations - Framer Motion page transitions, scroll reveals, micro-interactions
8. **Phase 8:** Deployment - Firebase Hosting

---

## File Structure (Target)

```
src/
├── services/
│   ├── firebase/    # config, auth, chat, inquiries, content
│   └── supabase/    # config, storage, gallery, products
├── contexts/        # AuthContext, ThemeContext, ChatContext, ToastContext
├── hooks/           # useAuth, useChat, useTheme, useGallery, useProducts
├── components/
│   ├── common/      # Button, Card, Input, Modal, Spinner
│   ├── layout/      # Header, Footer, Navbar, MobileMenu
│   ├── home/        # Hero, FeaturedCakes, Testimonials, WhyChooseUs, CTA
│   ├── gallery/     # GalleryGrid, GalleryItem, CategoryFilter, ImageModal
│   ├── about/       # StorySection, TeamSection, BakeryInfo
│   ├── contact/     # ContactForm, LocationMap, BusinessHours, SocialLinks
│   ├── chat/        # ChatWidget, ChatWindow, ChatMessage, LoginPrompt
│   ├── auth/        # LoginModal, GoogleSignIn, EmailSignIn
│   └── admin/       # AdminLayout, Dashboard, Products, Gallery, Chat, etc.
├── pages/
│   ├── public/      # HomePage, GalleryPage, AboutPage, ContactPage
│   └── admin/       # AdminLoginPage, DashboardPage, etc.
├── routes/          # index.jsx, publicRoutes, adminRoutes, ProtectedRoute
├── animations/      # Framer Motion variants and transitions
└── constants/       # navigation, categories, etc.
```

---

## AI Collaboration Notes

This project may be worked on by multiple AI assistants (Claude, Gemini, Copilot).

**For all AIs:**
- Code is well-commented and self-documenting
- Follow existing patterns in the codebase
- Mobile-first approach for all components
- All content fetched from database (no hardcoded text)
- Use Tailwind CSS for styling
- Use Framer Motion for animations
- Follow the file structure above

**No direct AI-to-AI communication** - the codebase is the shared context.

---

## Environment Variables Required

```env
# Firebase
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_DATABASE_URL=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=

# Supabase
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
```
