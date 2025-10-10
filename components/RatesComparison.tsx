"use client";

import { useState, useEffect, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { TinySparkline } from "@/components/ui/tiny-sparkline";
import {
  TrendingUp,
  RefreshCw,
  AlertTriangle,
  Settings,
  ArrowRightLeft,
  ChevronDown,
  Info,
} from "lucide-react";

// ================== TYPES ==================
interface RateData {
  sell: number | null;
  buy: number | null;
  updated_at?: string;
}

interface AllRates {
  kenig: RateData | null;
  bestchange: RateData | null;
  timestamp: string;
  isFromDatabase: boolean;
  error?: string;
  meta?: {
    lastUpdated: string;
  };
}

// ================== HELPERS ==================
function normalizeDateString(dateString?: string | null): string | null {
  if (!dateString) return null;
  let s = dateString.trim().replace(" ", "T");
  s = s.replace(/\+00$/, "+00:00");
  if (isNaN(Date.parse(s))) {
    s = s.replace(/\.\d+/, ""); // убираем микросекунды
  }
  return s;
}

function formatRate(rate: number | null): string {
  if (rate === null || rate === undefined || isNaN(rate)) return "—";
  return new Intl.NumberFormat("ru-RU", {
    style: "currency",
    currency: "RUB",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(rate);
}

function calculateDelta(
  rate: number | null,
  kenigRate: number | null
): { delta: number; isPositive: boolean; color: string } {
  if (rate === null || kenigRate === null || isNaN(rate) || isNaN(kenigRate)) {
    return { delta: 0, isPositive: false, color: "text-gray-400" };
  }
  const delta = ((rate - kenigRate) / kenigRate) * 100;
  const isPositive = delta > 0;
  const color = isPositive ? "text-green-600" : "text-red-600";
  return { delta: Math.abs(delta), isPositive, color };
}

function generateSparklineData(baseRate: number | null): number[] {
  if (!baseRate) return [];
  const data = [];
  for (let i = 0; i < 6; i++) {
    const variation = (Math.random() - 0.5) * 0.015;
    data.push(baseRate * (1 + variation));
  }
  return data;
}

// ================== MAIN COMPONENT ==================
export default function RatesComparison() {
  const [rates, setRates] = useState<AllRates | null>(() => {
    // Попытка загрузить из localStorage при инициализации
    if (typeof window !== 'undefined') {
      try {
        const cached = localStorage.getItem('kenigswap_rates_cache');
        if (cached) {
          const parsed = JSON.parse(cached);
          // Проверяем, не старые ли данные (не более 5 минут)
          const cacheAge = Date.now() - new Date(parsed.timestamp).getTime();
          if (cacheAge < 5 * 60 * 1000) {
            console.log('[RatesComparison] Loaded rates from cache');
            return parsed.data;
          }
        }
      } catch (err) {
        console.error('[RatesComparison] Error loading cache:', err);
      }
    }
    return null;
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [countdown, setCountdown] = useState<string>("");

  // --- Fetch rates from API with retry logic ---
  const fetchRates = async (retryCount = 0) => {
    try {
      setError(null);
      const response = await fetch("/api/rates-comparison", {
        cache: "no-cache",
        headers: {
          "Cache-Control": "no-cache",
          Pragma: "no-cache",
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log("💾 /api/rates-comparison response:", data);
      console.log("kenig.updated_at =", data?.kenig?.updated_at);
      console.log("bestchange.updated_at =", data?.bestchange?.updated_at);

      setRates(data);
      setLastUpdated(new Date());
      if (data.error) setError(data.error);

      // Сохраняем в localStorage для кэширования
      if (typeof window !== 'undefined') {
        try {
          localStorage.setItem('kenigswap_rates_cache', JSON.stringify({
            data,
            timestamp: new Date().toISOString()
          }));
        } catch (err) {
          console.error('[RatesComparison] Error saving cache:', err);
        }
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to fetch rates";
      console.error(`[RatesComparison] Error fetching rates (attempt ${retryCount + 1}):`, err);

      // Повторная попытка загрузки (до 3 раз)
      if (retryCount < 3) {
        console.log(`[RatesComparison] Retrying... (${retryCount + 1}/3)`);
        setTimeout(() => {
          fetchRates(retryCount + 1);
        }, 3000 * (retryCount + 1)); // Увеличиваем задержку с каждой попыткой
      } else {
        setError(errorMessage);
      }
    } finally {
      if (retryCount === 0) {
        setLoading(false);
      }
    }
  };

  // --- Initial load and periodic refresh ---
  useEffect(() => {
    fetchRates();
    const interval = setInterval(fetchRates, 60000);
    return () => clearInterval(interval);
  }, []);

  // --- Countdown timer ---
  useEffect(() => {
    if (!lastUpdated) return;
    const updateCountdown = () => {
      const now = new Date();
      const diff = Math.floor((now.getTime() - lastUpdated.getTime()) / 1000);
      if (diff < 60) setCountdown(`${diff}с`);
      else if (diff < 3600) setCountdown(`${Math.floor(diff / 60)}м`);
      else setCountdown(`${Math.floor(diff / 3600)}ч`);
    };
    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, [lastUpdated]);

  // --- Prepare exchange data ---
  const exchangeData = useMemo(() => {
    if (!rates) return [];
    return [
      {
        name: "KenigSwap",
        sellRate: rates.kenig?.sell ?? null,
        buyRate: rates.kenig?.buy ?? null,
        updatedAt:
          normalizeDateString(rates.kenig?.updated_at) ||
          new Date().toISOString(),
        available: rates.kenig?.sell != null && rates.kenig?.buy != null,
        description: "Основной",
        priority: 1,
      },
      {
        name: "BestChange",
        sellRate: rates.bestchange?.sell ?? null,
        buyRate: rates.bestchange?.buy ?? null,
        updatedAt:
          normalizeDateString(rates.bestchange?.updated_at) ||
          new Date().toISOString(),
        available:
          rates.bestchange?.sell != null && rates.bestchange?.buy != null,
        description: "Агрегатор",
        priority: 2,
      },
    ];
  }, [rates]);

  // --- Find best buy/sell offers ---
  const bestRates = useMemo(() => {
    const sellCandidates = exchangeData
      .filter((x) => x.available && x.buyRate != null)
      .map((x) => ({ source: x.name, rate: Number(x.buyRate) }));
    const buyCandidates = exchangeData
      .filter((x) => x.available && x.sellRate != null)
      .map((x) => ({ source: x.name, rate: Number(x.sellRate) }));

    const bestSell = sellCandidates.length
      ? sellCandidates.reduce((a, b) => (b.rate > a.rate ? b : a))
      : null;
    const bestBuy = buyCandidates.length
      ? buyCandidates.reduce((a, b) => (b.rate < a.rate ? b : a))
      : null;
    return { bestSell, bestBuy };
  }, [exchangeData]);

  const isConfigurationError =
    error &&
    (error.includes("not configured") ||
      error.includes("Invalid API key") ||
      error.includes("environment variables"));

  const mobileLeader = useMemo(() => {
    return (
      exchangeData.find(
        (ex) =>
          (bestRates.bestSell?.source === ex.name ||
            bestRates.bestBuy?.source === ex.name) &&
          ex.available
      ) || exchangeData[0]
    );
  }, [exchangeData, bestRates]);

  // --- Compact card ---
  const renderCompactRateCard = useMemo(
    () => (exchange: any, type: "sell" | "buy", isBest: boolean) => {
      const rate = type === "sell" ? exchange.buyRate : exchange.sellRate;
      const kenigReference =
        type === "sell" ? rates?.kenig?.buy : rates?.kenig?.sell;

      const delta = calculateDelta(rate, kenigReference);
      const sparklineData = generateSparklineData(rate);
      const sparklineColor = delta.isPositive ? "#10b981" : "#6b7280";

      return (
        <div
          key={`${type}-${exchange.name}`}
          className={`glass-tile p-4 transition-all duration-200 ${
            !exchange.available
              ? "opacity-60"
              : isBest
              ? "ring-2 ring-green-500"
              : ""
          }`}
        >
          <div className="flex items-center justify-between mb-3">
            <div>
              <h4 className="text-base font-semibold text-[#001D8D]">
                {exchange.name}
              </h4>
              <p className="text-xs text-[#001D8D]/60">
                {exchange.description}
              </p>
            </div>
            <div className="flex items-center gap-2">
              {isBest && (
                <Badge className="bg-green-100 text-green-800 text-xs">
                  Лучший
                </Badge>
              )}
              {sparklineData.length > 0 && (
                <TinySparkline
                  data={sparklineData}
                  color={sparklineColor}
                  width={24}
                  height={6}
                />
              )}
            </div>
          </div>

          <div className="flex items-baseline justify-between">
            <div className="text-2xl font-bold text-[#001D8D]">
              {formatRate(rate)}
            </div>
            <div className="text-right">
              {exchange.name !== "KenigSwap" ? (
                <div className={`text-xs ${delta.color}`}>
                  {delta.isPositive ? "+" : "−"}
                  {delta.delta.toFixed(2)}%
                </div>
              ) : (
                <div className="text-xs text-gray-400">базовый</div>
              )}
            </div>
          </div>
        </div>
      );
    },
    [rates]
  );

  // ================== RENDER ==================
  return (
    <div className="space-y-4">
      {isConfigurationError && (
        <Alert className="bg-orange-50 border-orange-200">
          <Settings className="h-4 w-4 text-orange-600" />
          <AlertDescription className="text-orange-800">
            <strong>Требуется настройка:</strong> {error}
          </AlertDescription>
        </Alert>
      )}

      {error && !isConfigurationError && (
        <Alert className="bg-red-50 border-red-200">
          <AlertTriangle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-800 flex items-center justify-between">
            <div>
              <strong>Ошибка загрузки курсов:</strong> {error}
            </div>
            <button
              onClick={() => fetchRates()}
              disabled={loading}
              className="ml-4 px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm hover:bg-red-200 transition-colors disabled:opacity-50 flex items-center gap-1"
            >
              <RefreshCw className={`h-3 w-3 ${loading ? 'animate-spin' : ''}`} />
              Повторить
            </button>
          </AlertDescription>
        </Alert>
      )}

      <Card className="glass-tile border-none shadow-lg">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-[#001D8D] flex items-center gap-2 text-lg">
              <TrendingUp className="h-4 w-4" />
              Сравнение курсов USDT/RUB
            </CardTitle>
            <div className="flex items-center gap-2">
              <div className="countdown-timer text-xs">{countdown}</div>
              <button
                onClick={fetchRates}
                disabled={loading}
                className="w-7 h-7 flex items-center justify-center rounded-full bg-[#001D8D]/10 hover:bg-[#001D8D]/20 transition-colors"
              >
                <RefreshCw
                  className={`h-3 w-3 text-[#001D8D] ${
                    loading ? "animate-spin" : ""
                  }`}
                />
              </button>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {loading && !rates ? (
            <div className="flex items-center justify-center py-8">
              <div className="flex items-center gap-2 text-[#001D8D]">
                <RefreshCw className="h-4 w-4 animate-spin" />
                <span className="text-sm">Загрузка актуальных курсов...</span>
              </div>
            </div>
          ) : rates ? (
            <div className="space-y-6">
              {/* SELL (USDT → RUB) */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <ArrowRightLeft className="h-4 w-4 text-red-500" />
                  <h3 className="text-base font-semibold">
                    Продажа USDT → RUB
                  </h3>
                  <span className="text-xs text-[#001D8D]/60">
                    (лучший = высокий)
                  </span>
                </div>

                <div className="hidden sm:grid grid-cols-2 gap-4">
                  {exchangeData.map((exchange) =>
                    renderCompactRateCard(
                      exchange,
                      "sell",
                      bestRates.bestSell?.source === exchange.name
                    )
                  )}
                </div>

                <div className="sm:hidden">
                  {mobileLeader &&
                    renderCompactRateCard(
                      mobileLeader,
                      "sell",
                      bestRates.bestSell?.source === mobileLeader.name
                    )}
                </div>
              </div>

              {/* BUY (USDT ← RUB) */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <ArrowRightLeft className="h-4 w-4 text-blue-500" />
                  <h3 className="text-base font-semibold">
                    Покупка USDT ← RUB
                  </h3>
                  <span className="text-xs text-[#001D8D]/60">
                    (лучший = низкий)
                  </span>
                </div>

                <div className="hidden sm:grid grid-cols-2 gap-4">
                  {exchangeData.map((exchange) =>
                    renderCompactRateCard(
                      exchange,
                      "buy",
                      bestRates.bestBuy?.source === exchange.name
                    )
                  )}
                </div>

                <div className="sm:hidden">
                  {mobileLeader &&
                    renderCompactRateCard(
                      mobileLeader,
                      "buy",
                      bestRates.bestBuy?.source === mobileLeader.name
                    )}
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-8 text-[#001D8D]/70">
              <div className="text-2xl mb-2">📊</div>
              <p className="text-sm">Нет данных о курсах</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}