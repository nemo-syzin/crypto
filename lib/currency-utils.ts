export const isFiat = (symbol: string): boolean => {
  return ["RUB", "USD", "EUR"].includes(symbol.toUpperCase());
};

export interface ReadableRateResult {
  baseSymbol: string;
  quoteSymbol: string;
  displayRate: number;
  formattedRate: string;
  description: string;
}

export function getReadableRate(
  from: string,
  to: string,
  rate: number
): ReadableRateResult {
  const f = from.toUpperCase();
  const t = to.toUpperCase();
  const fiat = ["RUB", "USD", "EUR"];

  let baseSymbol = f;
  let quoteSymbol = t;
  let displayRate = rate;

  if (fiat.includes(f) && !fiat.includes(t)) {
    baseSymbol = t;
    quoteSymbol = f;
    displayRate = 1 / rate;
  }

  if (!fiat.includes(f) && fiat.includes(t)) {
    baseSymbol = f;
    quoteSymbol = t;
    displayRate = rate;
  }

  const formattedRate = displayRate.toLocaleString("ru-RU", {
    minimumFractionDigits: displayRate < 1 ? 6 : 2,
    maximumFractionDigits: displayRate < 1 ? 8 : 2,
  });

  const description = `1 ${baseSymbol} = ${formattedRate} ${quoteSymbol}`;

  console.log("💱 getReadableRate ->", from, to, "=>", description);

  return {
    baseSymbol,
    quoteSymbol,
    displayRate,
    formattedRate,
    description,
  };
}
