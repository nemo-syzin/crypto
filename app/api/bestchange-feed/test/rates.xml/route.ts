export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { getServerSupabaseClient, isServerSupabaseConfigured } from "@/lib/supabase/server";

// Таймаут (5 секунд)
const SUPABASE_TIMEOUT = 5000;

// Экранирование XML
const escapeXml = (text: string | number | null | undefined): string => {
  if (text === null || text === undefined) return "";
  return String(text)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
};

// Форматирование чисел
const formatNumber = (value: number | null | undefined): string => {
  if (value === null || value === undefined || isNaN(Number(value))) return "0";
  const num = Number(value);
  return num.toFixed(8).replace(/\.?0+$/, "");
};

// Определение кодов валют Exnode
const getCurrencyCode = (currency: string, conditions: string): string => {
  const cur = currency?.toUpperCase() || "";
  const cond = (conditions || "").toLowerCase();

  if (cur === "RUB") return "CASHRUB";

  if (cur === "USDT") {
    if (cond.includes("trc") || cond.includes("tron")) return "USDTTRC";
    if (cond.includes("bep") || cond.includes("bsc")) return "USDTBEP20";
    if (cond.includes("erc") || cond.includes("eth")) return "USDTERC";
    return "USDT"; // базовый
  }

  if (cur === "USDC") {
    if (cond.includes("trc") || cond.includes("tron")) return "USDCTRC";
    if (cond.includes("bep") || cond.includes("bsc")) return "USDCBEP20";
    if (cond.includes("erc") || cond.includes("eth")) return "USDCERC";
    return "USDC";
  }

  if (cur === "ETH") return cond.includes("bep") ? "ETHBEP20" : "ETH";
  if (cur === "BTC") return cond.includes("bep") ? "BTCBEP20" : "BTC";
  if (cur === "BNB") return "BNB";
  if (cur === "SOL") return "SOL";
  return cur;
};

// Генерация XML
async function generateXML(): Promise<string> {
  if (!isServerSupabaseConfigured()) {
    console.error("❌ Supabase не настроен");
    return '<?xml version="1.0" encoding="UTF-8"?><error>Supabase not configured</error>';
  }

  const supabase = getServerSupabaseClient();
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), SUPABASE_TIMEOUT);

  try {
    console.log("🔗 Подключение к Supabase...");
    const { data, error } = await supabase
      .from("kenig_rates")
      .select("*")
      .eq("is_active", true)
      .abortSignal(controller.signal);

    clearTimeout(timeout);

    if (error) {
      console.error("Ошибка Supabase:", error);
      return `<?xml version="1.0" encoding="UTF-8"?><error>${escapeXml(error.message)}</error>`;
    }

    if (!data || data.length === 0) {
      return '<?xml version="1.0" encoding="UTF-8"?><rates></rates>';
    }

    console.log(`✅ Получено ${data.length} строк из kenig_rates`);
    const timestamp = new Date().toISOString();

    let xml = `<?xml version="1.0" encoding="UTF-8"?>\n<!-- Generated: ${timestamp} -->\n<rates>\n`;

    for (const r of data) {
      const base = r.base?.toUpperCase() || "";
      const quote = r.quote?.toUpperCase() || "";
      const conditions = r.conditions || "";
      const city = "klng";

      // список направлений (включая авто-сети)
      const networks: string[] = [];

      // если крипта и сеть не указана → добавить все варианты
      const isCrypto = ["USDT", "USDC", "BTC", "ETH", "BNB", "SOL", "TRX", "TON", "AVAX"].includes(base) || 
                       ["USDT", "USDC", "BTC", "ETH", "BNB", "SOL", "TRX", "TON", "AVAX"].includes(quote);

      if (isCrypto && !conditions) {
        if (base === "USDT" || quote === "USDT") {
          networks.push("USDTTRC", "USDTBEP20", "USDTERC");
        } else if (base === "USDC" || quote === "USDC") {
          networks.push("USDCTRC", "USDCBEP20", "USDCERC");
        } else {
          networks.push(getCurrencyCode(base, conditions));
        }
      } else {
        networks.push(getCurrencyCode(base, conditions));
      }

      for (const net of networks) {
        xml += `  <item>\n`;
        xml += `    <from>${escapeXml(net === base ? net : getCurrencyCode(base, conditions))}</from>\n`;
        xml += `    <to>${escapeXml(net === quote ? net : getCurrencyCode(quote, conditions))}</to>\n`;
        xml += `    <in>1</in>\n`;
        xml += `    <out>${formatNumber(r.sell)}</out>\n`;
        xml += `    <amount>${formatNumber(r.reserve)}</amount>\n`;
        xml += `    <minamount>${formatNumber(r.min_amount)}</minamount>\n`;
        xml += `    <maxamount>${formatNumber(r.max_amount)}</maxamount>\n`;
        xml += `    <param>manual</param>\n`;
        xml += `    <city>${escapeXml(city)}</city>\n`;
        xml += `  </item>\n`;
      }
    }

    xml += "</rates>";
    console.log("📦 XML сгенерирован успешно");
    return xml;
  } catch (err: any) {
    clearTimeout(timeout);
    if (err.name === "AbortError") {
      console.error("⏰ Supabase запрос превысил лимит времени");
      return '<?xml version="1.0" encoding="UTF-8"?><error>Supabase timeout (AbortError)</error>';
    }
    console.error("Ошибка генерации XML:", err);
    return `<?xml version="1.0" encoding="UTF-8"?><error>${escapeXml(String(err))}</error>`;
  }
}

// Обработчик Next.js API маршрута
export async function GET() {
  const xml = await generateXML();

  return new NextResponse(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=5, must-revalidate",
    },
  });
}