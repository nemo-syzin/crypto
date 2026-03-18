import type { Metadata } from "next";
import ExchangePageClient from "./ExchangePageClient";

export const metadata: Metadata = {
  title: "Купить и продать USDT и криптовалюту в Калининграде | KenigSwap",
  description:
    "Покупка и продажа USDT, BTC, ETH, SOL и другой криптовалюты в Калининграде. Оставьте заявку на обмен, получите актуальный курс и проведите сделку в удобном формате.",
};

export default function ExchangePage() {
  return <ExchangePageClient />;
}
