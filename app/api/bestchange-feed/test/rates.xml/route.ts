export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { getServerSupabaseClient, isServerSupabaseConfigured } from '@/lib/supabase/server';

let xmlCache = {
  xml: '',
  lastUpdate: new Date(0),
  isUpdating: false,
  lastError: null as Error | null,
};

const UPDATE_INTERVAL = 5000;

// Экранирование XML
const escapeXml = (text: string | number | null | undefined): string => {
  if (text === null || text === undefined) return '';
  return String(text)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
};

// Форматирование чисел
const formatNumber = (value: number | null | undefined): string => {
  if (!value || isNaN(value)) return '0';
  return Number(value).toFixed(8).replace(/\.?0+$/, '');
};

// Определение кода валюты (Exnode)
const getExnodeCurrencyCode = (currency: string, conditions: string): string => {
  const c = currency.toUpperCase();
  const cond = conditions.toLowerCase();

  // Всегда наличные рубли
  if (c === 'RUB') return 'CASHRUB';

  // USDT
  if (c === 'USDT') {
    if (cond.includes('bep20')) return 'USDTBEP20';
    if (cond.includes('erc20')) return 'USDTERC';
    if (cond.includes('trc20')) return 'USDTTRC';
    if (cond.includes('polygon')) return 'USDTPOLYGON';
    if (cond.includes('arbitrum')) return 'USDTARBTM';
    if (cond.includes('optimism')) return 'USDTOPTM';
    if (cond.includes('solana')) return 'USDTSOL';
    if (cond.includes('avax') || cond.includes('avalanche')) return 'USDTAVAXC';
    if (cond.includes('ton')) return 'USDTTON';
    if (cond.includes('algorand')) return 'USDTALGO';
    return 'USDTTRC';
  }

  // USDC
  if (c === 'USDC') {
    if (cond.includes('bep20')) return 'USDCBEP20';
    if (cond.includes('erc20')) return 'USDCERC20';
    if (cond.includes('trc20')) return 'USDCTRC20';
    if (cond.includes('polygon')) return 'USDCPOLYGON';
    if (cond.includes('arbitrum')) return 'USDCARBTM';
    if (cond.includes('optimism')) return 'USDCOPTM';
    if (cond.includes('solana')) return 'USDCSOL';
    return 'USDCERC20';
  }

  // ETH
  if (c === 'ETH') {
    if (cond.includes('bep20')) return 'ETHBEP20';
    if (cond.includes('arbitrum')) return 'ETHARBTM';
    if (cond.includes('optimism')) return 'ETHOPTM';
    return 'ETH';
  }

  // BNB
  if (c === 'BNB') {
    if (cond.includes('bep20')) return 'BNBBEP20';
    if (cond.includes('bep2')) return 'BNBBEP2';
    return 'BNB';
  }

  // SHIB
  if (c === 'SHIB') {
    if (cond.includes('bep20')) return 'SHIBBEP20';
    return 'SHIBERC20';
  }

  // AVAX
  if (c === 'AVAX') {
    if (cond.includes('bep20')) return 'AVAXBEP20';
    return 'AVAXC';
  }

  // Остальные — возвращаем просто как есть
  return c;
};

// Город всегда Калининград
const getExnodeCity = () => 'klng';

// Метки (param)
const getExnodeParams = (mode: string, conditions: string): string => {
  const params: string[] = [];
  const cond = conditions.toLowerCase();
  if (mode === 'manual' || mode === 'semi-auto') params.push('manual');
  if (cond.includes('верификация') || cond.includes('kyc')) params.push('veryfying');
  if (cond.includes('аноним')) params.push('anonim');
  return params.join(',');
};

// Генерация XML
async function generateXML(): Promise<string> {
  if (!isServerSupabaseConfigured()) {
    return '<?xml version="1.0" encoding="UTF-8"?><error>Supabase не настроен</error>';
  }

  const supabase = getServerSupabaseClient();
  const { data, error } = await supabase
    .from('kenig_rates')
    .select('*')
    .eq('is_active', true)
    .not('base', 'is', null)
    .not('quote', 'is', null);

  if (error) {
    console.error('Ошибка Supabase:', error);
    return `<?xml version="1.0" encoding="UTF-8"?><error>${escapeXml(error.message)}</error>`;
  }

  const timestamp = new Date().toISOString();
  let xml = `<?xml version="1.0" encoding="UTF-8"?>\n<!-- Generated: ${timestamp} -->\n<rates>\n`;

  for (const r of data || []) {
    const from = getExnodeCurrencyCode(r.base, r.conditions || '');
    const to = getExnodeCurrencyCode(r.quote, r.conditions || '');
    const params = getExnodeParams(r.operational_mode || '', r.conditions || '');
    const city = getExnodeCity();

    xml += `  <item>\n`;
    xml += `    <from>${escapeXml(from)}</from>\n`;
    xml += `    <to>${escapeXml(to)}</to>\n`;
    xml += `    <in>1</in>\n`;
    xml += `    <out>${formatNumber(r.sell)}</out>\n`;
    xml += `    <amount>${formatNumber(r.reserve)}</amount>\n`;
    xml += `    <minamount>${formatNumber(r.min_amount)}</minamount>\n`;
    xml += `    <maxamount>${formatNumber(r.max_amount)}</maxamount>\n`;
    if (params) xml += `    <param>${escapeXml(params)}</param>\n`;
    xml += `    <city>${escapeXml(city)}</city>\n`;
    xml += `  </item>\n`;
  }

  xml += '</rates>';
  return xml;
}

// Кэширование
async function updateCache() {
  if (xmlCache.isUpdating) return;
  try {
    xmlCache.isUpdating = true;
    const xml = await generateXML();
    xmlCache.xml = xml;
    xmlCache.lastUpdate = new Date();
  } finally {
    xmlCache.isUpdating = false;
  }
}

setInterval(updateCache, UPDATE_INTERVAL);
updateCache();

export async function GET() {
  if (!xmlCache.xml) await updateCache();
  return new NextResponse(xmlCache.xml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=5',
      'Last-Modified': xmlCache.lastUpdate.toUTCString(),
    },
  });
}