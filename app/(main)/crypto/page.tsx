import { Metadata } from 'next';
import CryptoMarketOverview from '@/components/CryptoMarketOverview';

export const metadata: Metadata = {
  title: 'Cryptocurrency Market – KenigSwap',
  description: 'Real-time cryptocurrency market data, prices, and trends. Track top cryptocurrencies and market movements.',
  keywords: ['cryptocurrency', 'crypto market', 'bitcoin', 'ethereum', 'market data', 'coingecko', 'live prices'],
  openGraph: {
    title: 'Cryptocurrency Market – KenigSwap',
    description: 'Real-time cryptocurrency market data and analysis powered by CoinGecko',
    type: 'website',
    locale: 'en_US',
  },
};

export default function CryptoPage() {
  return (
    <div className="min-h-screen bg-white relative overflow-hidden">
      <section className="relative py-20 bg-gradient-to-b from-white via-blue-50/10 to-blue-100/20 overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-white to-transparent z-5" />
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-b from-transparent to-blue-100/20 z-5" />

        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold text-[#001D8D] mb-4">
              Cryptocurrency Market
            </h1>
            <p className="text-xl text-[#001D8D]/80 max-w-4xl mx-auto mb-8 leading-relaxed">
              Track real-time cryptocurrency prices, market caps, and trading volumes. 
              Stay informed with the latest market data powered by CoinGecko.
            </p>
          </div>

          <div className="max-w-7xl mx-auto">
            <CryptoMarketOverview />
          </div>
        </div>
      </section>
    </div>
  );
}