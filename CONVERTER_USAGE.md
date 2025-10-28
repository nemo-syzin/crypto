# Professional Converter Component - Usage Guide

## Overview

The `ProfessionalConverter` component is a production-ready, fully-featured cryptocurrency converter for KenigSwap. It includes animations, dark mode support, and responsive design.

## Features

✅ **Smooth Animations** - Framer Motion powered micro-interactions
✅ **Dark Mode Support** - Automatic theme detection and transitions
✅ **Responsive Design** - Mobile-first approach with breakpoints
✅ **Real-time Conversion** - Live currency calculation
✅ **Currency Swap** - Animated swap between currencies
✅ **Rate Refresh** - Manual rate update with rotation animation
✅ **Professional Styling** - Modern design with gradients and shadows
✅ **TypeScript** - Fully typed with interfaces

## Installation

The component is already integrated into your project. No additional dependencies needed beyond the existing ones:

- `framer-motion` - For animations
- `lucide-react` - For icons
- `@/components/ui/button` - UI button component

## Usage

### Basic Usage

```tsx
import ProfessionalConverter from "@/components/home/ProfessionalConverter";

export default function HomePage() {
  return (
    <main>
      <ProfessionalConverter />
    </main>
  );
}
```

### Demo Page

A demo page is available at `/converter-demo` to see the component in action.

Visit: `http://localhost:3000/converter-demo`

### Integration with Existing Pages

To add the converter to your homepage:

```tsx
// app/page.tsx
import ProfessionalConverter from "@/components/home/ProfessionalConverter";
import HeroSection from "@/components/home/hero-section";

export default function Home() {
  return (
    <main>
      <HeroSection />
      <ProfessionalConverter />
      {/* Other sections */}
    </main>
  );
}
```

## Component Structure

### State Management

The component manages the following state:

- `fromCurrency` - Source currency selection
- `toCurrency` - Target currency selection
- `fromAmount` - Input amount
- `toAmount` - Calculated output amount
- `rate` - Current exchange rate with timestamp
- `isSwapping` - Swap animation state
- `isRefreshing` - Refresh animation state
- `isDark` - Dark mode detection

### Key Functions

- `handleSwap()` - Swaps currencies with animation
- `handleRefresh()` - Refreshes exchange rate with mock data
- `calculateConversion()` - Calculates output amount
- `handleAmountChange()` - Validates and updates input
- `formatNumber()` - Formats numbers with localization

## Customization

### Colors

Modify the color scheme in the component:

```tsx
// Primary colors
text-[#0C1E5B] // Dark blue text
bg-[#2563EB]   // Accent blue

// Backgrounds
from-[#F8FBFF] via-[#EAF1FF] // Light mode gradient
dark:from-[#0F172A] dark:via-[#1E293B] // Dark mode gradient
```

### Supported Currencies

Add or modify currencies in the `currencies` array:

```tsx
const currencies: Currency[] = [
  { code: "USDT", name: "Tether", symbol: "₮" },
  { code: "BTC", name: "Bitcoin", symbol: "₿" },
  { code: "ETH", name: "Ethereum", symbol: "Ξ" },
  { code: "RUB", name: "Российский рубль", symbol: "₽" },
  { code: "USD", name: "US Dollar", symbol: "$" },
  // Add more currencies here
];
```

### API Integration

To connect to a real API, modify the `handleRefresh()` function:

```tsx
const handleRefresh = async () => {
  setIsRefreshing(true);
  try {
    const response = await fetch(`/api/rates?from=${fromCurrency.code}&to=${toCurrency.code}`);
    const data = await response.json();
    setRate({ rate: data.rate, lastUpdated: new Date() });
    calculateConversion(fromAmount, data.rate);
  } catch (error) {
    console.error("Failed to fetch rate:", error);
  } finally {
    setIsRefreshing(false);
  }
};
```

## Responsive Breakpoints

- **Mobile** (`< 768px`): Stacked layout, full-width inputs
- **Tablet** (`768px - 1024px`): Horizontal layout, reduced padding
- **Desktop** (`> 1024px`): Full layout with maximum spacing

## Animation Details

### Card Hover Effect
```tsx
whileHover={{ scale: 1.02 }}
```

### Swap Button
- Rotates 180° on click
- Scales up on hover (1.1x)
- Scales down on tap (0.9x)

### Refresh Icon
- Rotates 180° on hover
- Full 360° rotation when refreshing

### Initial Animations
- Header: Fade in + slide down
- Card: Fade in + slide up
- Inputs: Fade in + slide from sides
- Features: Sequential fade in

## Performance Considerations

- **Animations** - Hardware-accelerated transforms only
- **Dark Mode** - MutationObserver for theme changes
- **Number Formatting** - Cached with `Intl.NumberFormat`
- **Re-renders** - Optimized with proper state management

## Browser Support

✅ Chrome/Edge 90+
✅ Firefox 88+
✅ Safari 14+
✅ Mobile browsers (iOS Safari, Chrome Mobile)

## Accessibility

- Semantic HTML structure
- Keyboard navigation support
- Focus indicators on interactive elements
- ARIA labels can be added for screen readers

## Future Enhancements

Consider adding:
- [ ] Real-time WebSocket updates
- [ ] Historical rate charts
- [ ] Multiple currency conversion
- [ ] Favorites/recent currencies
- [ ] Conversion history
- [ ] Fee calculator
- [ ] Transaction limits display

## Support

For issues or questions, refer to the main project documentation or contact the development team.

---

**Created for KenigSwap** - Professional Cryptocurrency Exchange Platform
