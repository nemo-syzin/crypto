@@ .. @@
  const calculateResult = useMemo((): number => {
    const numericAmount = parseAmount(amount);
    if (!rate || numericAmount <= 0) return 0;
    return numericAmount * rate.sell;     // «сколько получу»
  }, [amount, rate, parseAmount]);
@@ .. @@
  const result = calculateResult;
@@ .. @@
  const hasValidRate = useMemo(() => rate && 
    typeof rate.sell === 'number' && !isNaN(rate.sell) && rate.sell > 0, [rate]);
@@ .. @@
      const formattedRate = formatRate(rate.sell, toCurrency);
@@ .. @@
              <div className="rate-value">{formatRate(rate.sell, toCurrency)}</div>