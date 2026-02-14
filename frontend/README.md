# SSL Certificate Management - Frontend

Vue 3 + TypeScript + Ant Design Vue frontend for SSL certificate management.

## Development Setup

1. Install dependencies: `npm install`
2. Copy `.env.example` to `.env.local` if needed
3. Start dev server: `npm run dev`

## Build for Production

```bash
npm run build
npm run preview
```

## Available Scripts

- `npm run dev` - Start dev server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run type-check` - Type check with TypeScript
- `npm run lint` - Lint with ESLint

## Technology Stack

- Vue 3 with Composition API
- TypeScript for type safety
- Ant Design Vue for UI components
- Pinia for state management
- Axios for HTTP requests
- Vue Router for navigation

## Project Structure

```
src/
├── assets/          - Static assets
├── components/      - Vue components
├── router/          - Vue Router configuration
├── services/        - API services
├── stores/          - Pinia stores
├── types/           - TypeScript type definitions
├── views/           - Page components
├── App.vue          - Root component
└── main.ts          - Entry point
```
