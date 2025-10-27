# Frontend Configuration Guide

## Backend Configuration

The frontend is configured to use the **production backend** by default.

### Production Backend (Default)
- URL: `https://srmap.onrender.com`
- Used automatically when running `npm run dev` or `npm run build`

### Local Backend
To use a local backend during development:

1. Create a `.env.local` file in the `frontend` directory:
   ```bash
   cp .env.local.example .env.local
   ```

2. The `.env.local` file should contain:
   ```env
   NEXT_PUBLIC_API_URL=local
   ```

3. Restart your development server:
   ```bash
   npm run dev
   ```

### Custom Backend URL
To use a different backend URL:

```env
NEXT_PUBLIC_API_URL=https://your-custom-backend.com
```

## Environment Files

- `.env.development` - Used in development mode (`npm run dev`)
- `.env.production` - Used in production builds (`npm run build`)
- `.env.local` - Local overrides (not tracked in Git)
- `.env.local.example` - Example local configuration

## How It Works

The API client (`src/lib/api.ts`) checks the environment variable in this order:

1. If `NEXT_PUBLIC_API_URL=local` → Uses `http://localhost:8000`
2. If `NEXT_PUBLIC_API_URL` is set → Uses that URL
3. Otherwise → Uses `https://srmap.onrender.com` (production)

## Quick Commands

```bash
# Use production backend (default)
npm run dev

# Use local backend
# 1. Create .env.local with NEXT_PUBLIC_API_URL=local
# 2. Then run:
npm run dev

# Build for production
npm run build
npm start
```

## Checking Current Backend

When the app starts, check the console for:
```
🔗 API Base URL: https://srmap.onrender.com
```

This confirms which backend the frontend is connecting to.
