# React Starter Template

A minimal React + Vite starter template with organized folder structure and essential packages.

## Features

- ⚡️ Vite for fast development and optimized builds
- ⚛️ React 18
- 🎨 Pre-configured folder structure
- 🔧 Path aliases configured
- 📝 ESLint + Prettier
- 🎯 React Router DOM
- 🎭 React Icons

## Folder Structure

```
src/
├── components/     # Reusable UI components
├── utils/          # Utility functions
├── contexts/       # React Context providers
├── routes/         # Route components and configuration
├── layout/         # Layout components
├── styles/         # Global styles and CSS files
├── assets/         # Static assets (images, fonts, etc.)
├── constants/      # Constants and configuration
├── reducers/       # Reducers for state management
├── hooks/          # Custom React hooks
├── App.jsx         # Main App component
└── main.jsx        # Entry point
```

## Getting Started

### Prerequisites

- Node.js >= 18.0.0

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

### Development

```bash
npm run dev
```

Runs the app in development mode at [http://localhost:3000](http://localhost:3000)

### Build

```bash
npm run build
```

Builds the app for production to the `dist` folder.

### Preview

```bash
npm run preview
```

Preview the production build locally.

### Linting

```bash
npm run lint
```

### Formatting

```bash
npm run format
```

## Path Aliases

The following path aliases are configured:

- `@/` → `src/`
- `@components/` → `src/components/`
- `@utils/` → `src/utils/`
- `@contexts/` → `src/contexts/`
- `@routes/` → `src/routes/`
- `@layout/` → `src/layout/`
- `@styles/` → `src/styles/`
- `@assets/` → `src/assets/`
- `@constants/` → `src/constants/`
- `@reducers/` → `src/reducers/`
- `@hooks/` → `src/hooks/`

## License

See [LICENSE](LICENSE) file for details.
