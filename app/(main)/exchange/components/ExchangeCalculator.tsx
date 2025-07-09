@@ .. @@
-  const calculateResult = useMemo((): number => {
-    const numericAmount = parseAmount(amount);
-    if (!rate || numericAmount <= 0) return 0;
-    
-    // Check if rates are valid numbers
-    const sellRate = typeof rate.sell === 'number' && !isNaN(rate.sell) ? rate.sell : null;
-    const buyRate  = typeof rate.buy  === 'number' && !isNaN(rate.buy)  ? rate.buy  : null;
-    
-    if (direction === 'sell') {
-      return sellRate ? numericAmount * sellRate : 0;
-    } else {
-      return buyRate ? numericAmount / buyRate : 0;
-    }
-  }, [amount, rate, direction, parseAmount]);
+  const calculateResult = useMemo((): number => {
+    const numericAmount = parseAmount(amount);
+    if (!rate || numericAmount <= 0) return 0;
+    return numericAmount * rate.rate;     // «сколько получу»
+  }, [amount, rate, parseAmount]);
@@ .. @@
-  const result = calculateResult;
+  const result = calculateResult;
@@ .. @@
-  const hasValidRate = useMemo(() => rate && 
-    typeof rate.sell === 'number' && !isNaN(rate.sell) && rate.sell > 0, [rate]);
+  const hasValidRate = useMemo(() => rate && 
+    typeof rate.rate === 'number' && !isNaN(rate.rate) && rate.rate > 0, [rate]);
@@ .. @@
-      const formattedRate = formatRate(rate.sell, toCurrency);
+      const formattedRate = formatRate(rate.rate, toCurrency);
@@ .. @@
-              <div className="rate-value">{formatRate(rate.sell, toCurrency)}</div>
+              <div className="rate-value">{formatRate(rate.rate, toCurrency)}</div>