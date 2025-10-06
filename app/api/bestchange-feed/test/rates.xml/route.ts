export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { getServerSupabaseClient, isServerSupabaseConfigured } from '@/lib/supabase/server';

let xmlCache: { xml: string; lastUpdate: Date; isUpdating: boolean } = {
  xml: '',
  lastUpdate: new Date(0),
  isUpdating: false,
};

const UPDATE_INTERVAL = 5000;

// 🔧 Экранирование XML
const escapeXml = (text: string | number | null | undefined): string =>
  text == null
    ? ''
    : String(text)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&apos;');

// 🔁 Форматирование чисел
const formatNumber = (value: number | null | undefined): string =>
  value == null || isNaN(Number(value)) ? '0' : Number(value).toFixed(8).replace(/\.?0+$/, '');

// 🧩 Получение кодов сетей для крипты
const getCryptoNetworks = (symbol: string): string[] => {
  const map: Record<string, string[]> = {
    USDT: ['USDTTRC', 'USDTBEP20', 'USDTERC'],
    USDC: ['USDCTRC', 'USDCBEP20', 'USDCERC'],
    ETH: ['ETH', 'ETHARBTM', 'ETHOPTM'],
    BTC: ['BTC', 'BTCBEP20'],
    BNB: ['BNB', 'BNBBEP20'],
    TRX: ['TRX'],
    TON: ['USDTTON'],
    SOL: ['USDTSOL'],
  };
  return map[symbol.toUpperCase()] || [symbol.toUpperCase()];
};

// 🏙️ Город всегда "klng"
const CITY = 'klng';

// 💰 Если RUB → наличные
const normalizeFiat = (symbol: string): string =>
  symbol.toUpperCase() === 'RUB' ? 'CASHRUB' : symbol.toUpperCase();

// 🚀 Генерация XML-фида
async function generateXML(): Promise<string> {
  try {
    if (!isServerSupabaseConfigured()) {
      return '<?xml version="1.0" encoding="UTF-8"?><error>Supabase не настроен</error>';
    }

    const supabase = getServerSupabaseClient();
    const { data: rates, error } = await supabase
      .from('kenig_rates')
      .select('*')
      .eq('is_active', true)
      .order('updated_at', { ascending: false });

    if (error || !rates) throw error || new Error('Нет данных из Supabase');

    let xml = `<?xml version="1.0" encoding="UTF-8"?>\n<!-- Generated: ${new Date().toISOString()} -->\n<rates>\n`;

    for (const rate of rates) {
      const base = rate.base?.toUpperCase();
      const quote = rate.quote?.toUpperCase();
      const sell = Number(rate.sell);
      const reserve = Number(rate.reserve || 0);
      const min = Number(rate.min_amount || 0);
      const max = Number(rate.max_amount || 0);

      if (!base || !quote || !sell || !reserve) continue;

      const bases =
        base === 'RUB' ? [normalizeFiat(base)] : base.match(/USDT|USDC|ETH|BTC|BNB|TRX|TON|SOL/)
        ? getCryptoNetworks(base)
        : [base];
      const quotes =
        quote === 'RUB' ? [normalizeFiat(quote)] : quote.match(/USDT|USDC|ETH|BTC|BNB|TRX|TON|SOL/)
        ? getCryptoNetworks(quote)
        : [quote];

      for (const b of bases) {
        for (const q of quotes) {
          xml += `  <item>\n`;
          xml += `    <from>${escapeXml(b)}</from>\n`;
          xml += `    <to>${escapeXml(q)}</to>\n`;
          xml += `    <in>1</in>\n`;
          xml += `    <out>${formatNumber(sell)}</out>\n`;
          xml += `    <amount>${formatNumber(reserve)}</amount>\n`;
          if (min > 0) xml += `    <minamount>${formatNumber(min)}</minamount>\n`;
          if (max > 0) xml += `    <maxamount>${formatNumber(max)}</maxamount>\n`;
          xml += `    <param>manual</param>\n`;
          xml += `    <city>${CITY}</city>\n`;
          xml += `  </item>\n`;
        }
      }
    }

    xml += '</rates>';
    return xml;
  } catch (e: any) {
    console.error('❌ Ошибка генерации XML:', e);
    return `<?xml version="1.0" encoding="UTF-8"?><error>${escapeXml(e.message || e.toString())}</error>`;
  }
}

// 🕒 Обновление кэша
async function updateCache() {
  if (xmlCache.isUpdating) return;
  xmlCache.isUpdating = true;
  xmlCache.xml = await generateXML();
  xmlCache.lastUpdate = new Date();
  xmlCache.isUpdating = false;
}

setInterval(updateCache, UPDATE_INTERVAL);
updateCache();

export async function GET() {
  if (!xmlCache.xml) await updateCache();

  return new NextResponse(xmlCache.xml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=5, must-revalidate',
      'Last-Modified': xmlCache.lastUpdate.toUTCString(),
    },
  });
}