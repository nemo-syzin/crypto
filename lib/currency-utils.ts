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
  const fromUpper = from.toUpperCase();
  const toUpper = to.toUpperCase();

  const fromIsFiat = isFiat(fromUpper);
  const toIsFiat = isFiat(toUpper);

  let baseSymbol = fromUpper;
  let quoteSymbol = toUpper;
  let displayRate = rate;

  if (toUpper === "RUB" && !fromIsFiat) {
    baseSymbol = fromUpper;
    quoteSymbol = toUpper;
    displayRate = rate;
  } else if (fromUpper === "RUB" && !toIsFiat) {
    baseSymbol = toUpper;
    quoteSymbol = fromUpper;
    displayRate = 1 / rate;
  } else {
    if (fromIsFiat && !toIsFiat) {
      baseSymbol = toUpper;
      quoteSymbol = fromUpper;
      displayRate = 1 / rate;
    } else {
      baseSymbol = fromUpper;
      quoteSymbol = toUpper;
      displayRate = rate;
    }
  }

  const formattedRate =
    displayRate < 1
      ? displayRate.toFixed(6).replace(/\.?0+$/, "")
      : displayRate.toLocaleString("ru-RU", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        });

  const description = `1 ${baseSymbol} = ${formattedRate} ${quoteSymbol}`;

  return {
    baseSymbol,
    quoteSymbol,
    displayRate,
    formattedRate,
    description,
  };
}
