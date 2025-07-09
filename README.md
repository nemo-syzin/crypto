# KenigSwap

A modern cryptocurrency exchange platform specializing in USDT to RUB exchanges with competitive rates.

## Features

- Real-time exchange rates
- Secure transactions
- Multi-currency support
- Market analysis and trends
- User-friendly interface

## Getting Started

### Prerequisites

- Node.js 18.0.0 or higher
- npm 8.0.0 or higher

### Installation

1. Clone the repository
   ```bash
   git clone https://github.com/yourusername/kenigswap.git
   cd kenigswap
   ```

2. Install dependencies
   ```bash
   npm install
   ```

### Environment Variables

For the application to work properly, you need to set up environment variables:

1. Copy the example environment file to create your local configuration:
   ```bash
   cp .env.example .env.local
   ```

2. Fill in the required values in `.env.local`:
   - `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Get these from Supabase → Project Settings → API
   - `COINGECKO_API_KEY`: Get this from CoinGecko API pricing page

**Note:** Without proper Supabase configuration, the application will run in fallback mode with mock exchange rates. This is useful for development but not recommended for production.

### Development

Start the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

### Build

Build the application for production:

```bash
npm run build
```

### Deployment

The application can be deployed to Netlify or other hosting platforms.

## Project Structure

- `app/` - Next.js application routes and pages
- `components/` - Reusable UI components
- `lib/` - Utility functions and API clients
- `public/` - Static assets
- `supabase/` - Supabase migrations and configuration

## Technologies

- Next.js
- React
- Tailwind CSS
- Supabase
- shadcn/ui
- Framer Motion
- Three.js (for 3D visualizations)

## License

This project is licensed under the MIT License - see the LICENSE file for details.