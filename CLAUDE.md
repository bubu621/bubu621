# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Structure

This workspace contains:
- `my-app-mui/` - React + Vite + TypeScript + Material-UI application (primary project)
- `my-app/` - Original React template (may be deprecated)

All development commands should be run from within `my-app-mui/`.

## Development Commands

Navigate to `my-app-mui/` directory first, then run:

```bash
cd my-app-mui

# Development server with HMR
npm run dev

# Production build (TypeScript check + Vite build)
npm run build

# Lint code
npm run lint

# Preview production build
npm run preview
```

## Architecture

### Material-UI Integration
- Roboto font is imported in `src/main.tsx` (weights: 300, 400, 500, 700)
- Use MUI components instead of native HTML elements for consistent design
- Use MUI's `sx` prop for inline styling (preferred over separate CSS files)
- Import components from `@mui/material` and icons from `@mui/icons-material`

### Entry Points
- `index.html` - HTML entry with root div
- `src/main.tsx` - React entry using createRoot API, Roboto font imports
- `src/App.tsx` - Main application component

## Code Style

- **TypeScript**: Strict mode enabled
- **Styling**: Use MUI's `sx` prop and theme system
- **Components**: Prefer functional components with hooks
- **Component Organization**: Always split code into modular components
  - Keep components small and focused on a single responsibility
  - Extract reusable UI into separate component files
  - Use custom hooks for complex logic and state management
  - Place components in `src/components/` directory
  - Place custom hooks in `src/hooks/` directory
  - Place types and constants in `src/types.ts`

## File Structure

```
src/
├── components/          # Reusable UI components
│   ├── ComponentName.tsx
│   └── ...
├── hooks/              # Custom React hooks
│   ├── useHookName.ts
│   └── ...
├── types.ts            # TypeScript interfaces and constants
├── App.tsx             # Main app component
└── main.tsx            # Entry point
```

## Technology Stack

- **React 18+** with TypeScript 5+
- **Vite 6+** for build tooling
- **Material-UI (MUI) v6** - Component library
  - @mui/material - Core components
  - @emotion/react & @emotion/styled - CSS-in-JS styling
  - @mui/icons-material - Material icons
  - @fontsource/roboto - Roboto font
- **ESLint** with React hooks rules

## MUI Common Patterns

### Layout Components
- `Container` - Centers content with max-width
- `Box` - Flexbox utility component
- `Stack` - Vertical/horizontal stacking with spacing
- `Grid` - Responsive grid layout

### Common Props
- `sx` - Inline styling using theme values
- `variant` - Component style variant (e.g., "contained", "outlined")
- `color` - Theme color (e.g., "primary", "secondary")
- `spacing` - Theme spacing units (e.g., `sx={{ mt: 2 }}` = margin-top: 16px)
