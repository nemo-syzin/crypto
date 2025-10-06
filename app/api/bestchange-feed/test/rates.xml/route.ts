export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { getServerSupabaseClient, isServerSupabaseConfigured } from '@/lib/supabase/server';

let xmlCache = {
  xml: '',
  lastUpdate: new Date(0),
  isUpdating: false,
  lastError: null as Error | null
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

// Формат чисел
const formatNumber = (value: number | null | undefined): string => {
  if (!value || isNaN(Number(value))) return '0';
  const num = Number(value);
  return num.toFixed(8).replace(/\.?0+$/, '');
};

// Получение кода валюты Exnode
const getExnodeCurrencyCode = (base: string, quote: string, conditions: string): string => {
  const c = (base || '').toUpperCase();
  const cond = (conditions || '').toLowerCase();

  if (c === 'USDT') {
    if (cond.includes('trc20') || cond.includes('tron')) return 'USDTTRC';
    if (cond.includes('erc20') || cond.includes('ethereum')) return 'USDTERC';
    if (cond.includes('bep20') || cond.includes('bsc')) return 'USDTBEP20';
    if (cond.includes('polygon')) return 'USDTPOLYGON';
    if (cond.includes('arbitrum')) return 'USDTARBTM';
    if (cond.includes('optimism')) return 'USDTOPTM';
    if (cond.includes('solana')) return 'USDTSOL';
    return 'USDTTRC';
  }

  if (c === 'RUB') {
    if (cond.includes('cash') || cond.includes('налич')) return 'CASHRUB';
    if (cond.includes('сбер') || cond.includes('sber')) return 'SBERRUB';
    if (cond.includes('тинь') || cond.includes('tcs')) return 'TCSBRUB';
    if (cond.includes('альфа')) return 'ACRUB';
    if (cond.includes('втб')) return 'TBRUB';
    if (cond.includes('сбп')) return 'SBPRUB';
    return 'CARDRUB';
  }

  if (c === 'USD') {
    if (cond.includes('cash')) return 'CASHUSD';
    if (cond.includes('paypal')) return 'PPUSD';
    if (cond.includes('wire')) return 'WIREUSD';
    return 'CARDUSD';
  }

  if (c === 'EUR') {
    if (cond.includes('cash')) return 'CASHEUR';
    return 'CARDEUR';
  }

  return c;
};

// Метки (param)
const getExnodeParams = (mode: string, conditions: string): string => {
  const params: string[] = [];
  const cond = conditions.toLowerCase();

  if (mode === 'manual' || mode === 'semi-auto') params.push('manual');
  if (cond.includes('верификация') || cond.includes('kyc')) params.push('veryfying');
  if (cond.includes('карта')) params.push('cardverify');
  if (cond.includes('регистрация')) params.push('reg');
  if (cond.includes('аноним')) params.push('anonim');
  return params.join(',');
};

// Город
const getExnodeCity = (fromCode: string, toCode: string, conditions: string): string => {
  const cond = (conditions || '').toLowerCase();

  const cityMap: Record<string, string> = {
    'москва': 'msk',
    'спб': 'spb',
    'петербург': 'spb',
    'санкт-петербург': 'spb',
    'калининград': 'klng'
  };

  for (const [name, code] of Object.entries(cityMap)) {
    if (cond.includes(name)) return code;
  }

  const isFiatOrCash =
    fromCode.startsWith('CASH') ||
    toCode.startsWith('CASH') ||
    fromCode.endsWith('RUB') ||
    toCode.endsWith('RUB') ||
    fromCode.startsWith('CARD') ||
    toCode.startsWith('CARD') ||
    fromCode.startsWith('WIRE') ||
    toCode.startsWith('WIRE') ||
    fromCode.startsWith('SBP') ||
    toCode.startsWith('SBP');

  if (isFiatOrCash) return 'klng';
  return '';
};

// Генерация XML
async function generateXML(): Promise<string> {
  if (!isServerSupabaseConfigured()) {
    return '<?xml version="1.0" encoding="UTF-8"?><error>Supabase not configured</error>';
  }

  const supabase = getServerSupabaseClient();

  const { data, error } = await supabase
    .from('kenig_rates')
    .select('*')
    .eq('is_active', true)
    .not('base', 'is', null)
    .not('quote', 'is', null);

  if (error) {
    console.error('Supabase error:', error);
    return `<?xml version="1.0" encoding="UTF-8"?><error>${escapeXml(error.message)}</error>`;
  }

  if (!data || data.length === 0) {
    return '<?xml version="1.0" encoding="UTF-8"?><rates></rates>';
  }

  let xml = '<?xml version="1.0" encoding="UTF-8"?>\n<rates>\n';

  for (const rate of data) {
    const fromCode = getExnodeCurrencyCode(rate.base, '', rate.conditions || '');
    const toCode = getExnodeCurrencyCode(rate.quote, '', rate.conditions || '');
    const city = getExnodeCity(fromCode, toCode, rate.conditions || '');

    xml += `  <item>\n`;
    xml += `    <from>${escapeXml(fromCode)}</from>\n`;
    xml += `    <to>${escapeXml(toCode)}</to>\n`;
    xml += `    <in>1</in>\n`;
    xml += `    <out>${formatNumber(rate.sell)}</out>\n`;
    xml += `    <amount>${formatNumber(rate.reserve)}</amount>\n`;
    if (rate.min_amount) xml += `    <minamount>${formatNumber(rate.min_amount)}</minamount>\n`;
    if (rate.max_amount) xml += `    <maxamount>${formatNumber(rate.max_amount)}</maxamount>\n`;
    const params = getExnodeParams(rate.operational_mode || '', rate.conditions || '');
    if (params) xml += `    <param>${escapeXml(params)}</param>\n`;
    if (city) xml += `    <city>${escapeXml(city)}</city>\n`;
    xml += `  </item>\n`;
  }

  xml += '</rates>';
  return xml;
}

// Обновление кэша
async function updateCache() {
  if (xmlCache.isUpdating) return;
  xmlCache.isUpdating = true;
  try {
    const xml = await generateXML();
    xmlCache.xml = xml;
    xmlCache.lastUpdate = new Date();
    xmlCache.lastError = null;
  } catch (e) {
    xmlCache.lastError = e as Error;
  } finally {
    xmlCache.isUpdating = false;
  }
}

let updateInterval: NodeJS.Timeout | null = null;
function initAutoUpdate() {
  if (updateInterval) return;
  updateCache();
  updateInterval = setInterval(updateCache, UPDATE_INTERVAL);
}
initAutoUpdate();

export async function GET() {
  if (!xmlCache.xml) await updateCache();

  if (!xmlCache.xml) {
    return new NextResponse('<?xml version="1.0"?><error>Feed not ready</error>', {
      status: 503,
      headers: { 'Content-Type': 'application/xml' }
    });
  }

  return new NextResponse(xmlCache.xml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=5',
      'Last-Modified': xmlCache.lastUpdate.toUTCString()
    }
  });
}